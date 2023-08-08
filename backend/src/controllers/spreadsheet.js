const Spreadsheet = require('../models/Spreadsheet')
const mongoose = require('mongoose')
const Workspace = require('../models/Workspace')
const csv=require('csvtojson')
const fs = require('fs');


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
    const results = [];
    const buffer = req.file.buffer.toString(); // Convert buffer to string
    fs.writeFile('data.csv', buffer, (err) => {
        if (err) {
          return res.status(500).send('Error while saving the CSV file.');
        }
    });

    let headersData = [];
    let rowData = []
    let jsonData = null;
    csv()
    .fromFile("data.csv")
    .then(async (jsonObj)=>{
        jsonData = jsonObj;
        console.log("data csv");
        let column = Object.keys(jsonData[0]);
    for(let i = 0;i<column.length;i++) {
        let columnText = column[i].replace(/\s/g, '-').toLowerCase()
        headersData.push({ editable: true, icon: "headerString", id: columnText, title: column[i], type:'text'});
    }

    for(let j = 1;j<jsonData.length;j++) {
        let objData = {}
        for(let k = 0;k<column.length;k++) {
            let columnText = column[k].replace(/\s/g, '-').toLowerCase()
            objData[columnText] = jsonData[j][column[k]];
        }
        rowData.push(objData);
        objData = {}
    }
    
        try {
            const id = "64d1d1dbf5586f3cb111b15f"

            const spreadsheet = await Spreadsheet.findById(id)

            if (!spreadsheet) {
                return res.status(404).json({ message: 'Spreadsheet not found' })
            }

            spreadsheet.name = "Test";

            spreadsheet.description = "test";

            spreadsheet.columns = headersData;

            spreadsheet.rows = rowData;

            await spreadsheet.save()

        } catch (error) {
            console.log(error.message)
            res.sendStatus(500)
        }
    })

      res.status(201).json({ message: 'Import CSV Successfully' });

}

const getSpreadsheet = async (req, res) => {
    try {
        const id = req.params.id
        const spreadsheet = await Spreadsheet.findById(id).populate('workspace')

        if (!spreadsheet) {
            return res.status(404).json({ message: 'Spreadsheet not found' })
        }

        return res.status(200).json({ spreadsheet })
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


module.exports = {
    createSpreadsheet,
    getSpreadsheet,
    updateSpreadsheet,
    deleteSpreadsheet,
    archiveSpreadsheet,
    importCsv
}