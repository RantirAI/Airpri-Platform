const Spreadsheet = require('../models/Spreadsheet')
const mongoose = require('mongoose')
const Workspace = require('../models/Workspace')
const csv = require('csvtojson')
const fs = require('fs');
const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: "AKIAQMMHMEX35ZWOCP7C",
    secretAccessKey: "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",
    region: 'us-east-2',
});

const s3 = new AWS.S3();


const createSpreadsheet = async (req, res) => {
    try {
        const { name, description, workspaceId, columns, rows, orgName = req.user?.orgs[0] } = req.body

        if (!name?.trim()) {
            return res.status(400).json({ message: 'Name is required' })
        }
        if (!workspaceId) {
            return res.status(400).json({ message: 'Workspace id is required' })
        }
        if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
            return res.status(400).json({ message: 'Invalid workspace id' })
        }

        const nameExists = await Spreadsheet.findOne({ name, workspaceId })

        if (nameExists) {
            return res.status(400).json({ message: 'Name exists' })
        }

        const workspace = await Workspace.findOne({ _id: workspaceId, orgName, members: { $in: [req.user._id] }, archived: false })

        if (!workspace) {
            return res.status(404).json({ message: 'Workspace not found' })
        }

        const spreadsheet = await Spreadsheet.create({
            name,
            description,
            workspace: workspaceId,
            rows,
            columns
        })

        res.status(201).json({ message: 'Spreadsheet created', spreadsheet })

    } catch (error) {
        console.log(error.message)
        res.sendStatus(500)
    }
}

const importCsv = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(400).json({ message: 'Spreadsheet id is required' })
        }
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid spreadsheet id' })
        }

        const spreadsheet = await Spreadsheet.findById(id)

        if (!spreadsheet) {
            return res.status(404).json({ message: 'Spreadsheet not found' })
        }

        if (!req.file?.buffer || req.file?.mimetype != 'text/csv') {
            return res.status(400).json({ message: 'Invalid csv file' })
        }

        const buffer = req.file.buffer.toString();
        fs.writeFile('data.csv', buffer, (err) => {
            if (err) {
                return res.status(500).send('Error while saving the CSV file.');
            }
        });

        const columns = []
        const duplicateColumns = []
        const rows = []
        const jsonData = await csv().fromFile("data.csv")

        Object.keys(jsonData[0]).forEach((key) => {
            if (spreadsheet.columns.findIndex(({ id }) => (key.toLowerCase().split(' ').join('-') == id)) != -1) {
                duplicateColumns.push(key.toLowerCase().split(' ').join('-') == id)
                return
            }
            columns.push({
                title: key,
                id: key.toLowerCase().split(' ').join('-'),
                editable: true,
                icon: 'headerString',
                type: 'text',
            })
        })

        jsonData.forEach((obj) => {
            const row = {}
            Object.entries(obj).forEach(([key, value]) => {
                row[key.toLowerCase().split(' ').join('-')] = value
            })
            rows.push(row)
        })


        const oldRows = spreadsheet.rows.map((row) => {
            const newRow = row
            columns.forEach((col) => {
                newRow[col['id']] = ''
            })
            return newRow
        })

        const newRows = rows.map((row) => {
            const newRow = row
            spreadsheet.columns.forEach((col) => {
                if (duplicateColumns.findIndex((key) => (key == col['id'])) != -1) {
                    return
                }
                newRow[col['id']] = ''
            })
            return newRow
        })

        spreadsheet.columns = [...spreadsheet.columns, ...columns]
        spreadsheet.rows = [...oldRows, ...newRows]

        await spreadsheet.save()

        res.status(200).json({ message: 'Csv imported successfully', spreadsheet })

    } catch (error) {
        console.log(error.message)
        res.sendStatus(500)
    }
}

const getSpreadsheet = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ message: 'Spreadsheet id is required' })
        }
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid spreadsheet id' })
        }

        const page = req.query.page ? parseInt(req.query.page) : req.query.page

        if (page != undefined || page != null) {

            const pageSize = 500

            const pipeline = [
                { $match: { _id: new mongoose.Types.ObjectId(id) } },
                {
                    $addFields: {
                        totalRows: { $size: '$rows' }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        workspace: 1,
                        columns: 1,
                        access: 1,
                        archived: 1,
                        name: 1,
                        description: 1,
                        rows: { $slice: ['$rows', (page - 1) * pageSize, pageSize] },
                        totalRows: 1
                    }
                }
            ];

            const paginatedSpreadsheet = await Spreadsheet.aggregate(pipeline);

            if (!paginatedSpreadsheet || paginatedSpreadsheet.length === 0) {
                return res.status(404).json({ message: 'Spreadsheet not found' });
            }

            const totalRows = paginatedSpreadsheet[0].totalRows;
            const totalPages = Math.ceil(totalRows / pageSize);

            paginatedSpreadsheet[0].currentPage = page;
            paginatedSpreadsheet[0].pageSize = pageSize;
            paginatedSpreadsheet[0].totalRows = totalRows;
            paginatedSpreadsheet[0].totalPages = totalPages;

            return res.status(200).json({ spreadsheet: paginatedSpreadsheet[0] });

        } else {


            const spreadsheet = await Spreadsheet.findById(id).populate('workspace')

            if (!spreadsheet) {
                return res.status(404).json({ message: 'Spreadsheet not found' })
            }

            return res.status(200).json({ spreadsheet })
        }
    } catch (error) {
        console.log(error.message)
        res.sendStatus(500)
    }
}

const updateSpreadsheet = async (req, res) => {
    try {
        const id = req.params.id
        const { name, description, columns, rows } = req.body

        const spreadsheet = await Spreadsheet.findById(id)

        if (!spreadsheet) {
            return res.status(404).json({ message: 'Spreadsheet not found' })
        }

        if (name) {
            spreadsheet.name = name
        }
        if (description) {
            spreadsheet.description = description
        }
        if (columns) {
            spreadsheet.columns = columns
        }
        if (rows) {
            spreadsheet.rows = rows
        }

        await spreadsheet.save()

        res.status(200).json({ spreadsheet, message: 'Spreadsheet updated' })

    } catch (error) {
        console.log(error.message)
        res.sendStatus(500)
    }
}

const deleteSpreadsheet = async (req, res) => {
    try {
        const id = req.params.id
        const spreadsheet = await Spreadsheet.findById(id)

        if (!spreadsheet) {
            return res.status(404).json({ message: 'Spreadsheet not found' })
        }

        await spreadsheet.deleteOne()

        return res.status(200).json({ message: 'Spreadsheet deleted' })
    } catch (error) {
        console.log(error.message)
        res.sendStatus(500)
    }
}

const archiveSpreadsheet = async (req, res) => {
    try {
        const id = req.params.id
        const spreadsheet = await Spreadsheet.findById(id)

        if (!spreadsheet) {
            return res.status(404).json({ message: 'Spreadsheet not found' })
        }

        spreadsheet.archived = true

        await spreadsheet.save()

        return res.status(200).json({ message: 'Spreadsheet archived' })
    } catch (error) {
        console.log(error.message)
        res.sendStatus(500)
    }
}

const uploadS3File = async (req, res) => {
    const file = req.file;

    const currentUrl = req.get('host');

    const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    if (allowedMimeTypes.includes(file.mimetype)) {
        const uniqueFileName = Date.now() + '-' + file.originalname;
        
        const params = {
            Bucket: 'airpris3',
            Key: uniqueFileName,
            Body: file.buffer,
        };

        s3.upload(params, (err, data) => {
            if (err) {
                return res.status(500).send('Error uploading file to S3.');
            }
            
            res.status(200).send({message: "File Uploaded Successfully", location: currentUrl+"/api/v1/spreadsheet/pdf/"+data.Key});
        });
    } else {
        res.status(404).json({ message: 'Invalid file type. Only PDF, JPEG, PNG, and DOCX files are allowed'})
    }

}

const getPDFFile = async (req, res) => {
    const id = req.params.string;

    console.log("isi id ",id)

    try {
        const s3Params = {
          Bucket: 'airpris3',
          Key: id
        };
    
        const s3Response = await s3.getObject(s3Params).promise();
        res.set('Content-Type', 'application/pdf');
        res.send(s3Response.Body);
      } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching or serving PDF from S3.');
    }
}

const autosave = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ message: 'Spreadsheet id is required' })
        }
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid spreadsheet id' })
        }

        const { cell, insertNewRow } = req.body;
        const index = cell?.index;
        const data = cell?.data;

        const spreadsheet = await Spreadsheet.findById(id);

        if (!spreadsheet) {
            return res.status(404).json({ message: 'Spreadsheet not found' });
        }

        let rows = JSON.parse(JSON.stringify(spreadsheet.rows));
        let columns = [...spreadsheet.columns];

        if (index && data) {
            rows[index[1]][columns[index[0]]['id']] = data;
        }

        if (insertNewRow) {
            const newRow = {};
            columns.forEach((col) => {
                newRow[col['id']] = '';
            });
            rows.push(newRow);
        }

        spreadsheet.rows = rows;

        await spreadsheet.save();

        res.status(200).json({ spreadsheet, message: 'Spreadsheet updated' });
    } catch (error) {
        console.log(error.message);
        res.sendStatus(500);
    }
};

module.exports = {
    createSpreadsheet,
    getSpreadsheet,
    updateSpreadsheet,
    deleteSpreadsheet,
    archiveSpreadsheet,
    uploadS3File,
    importCsv,
    getPDFFile,
    autosave
}