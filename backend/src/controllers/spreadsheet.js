const Spreadsheet = require('../models/Spreadsheet')
const mongoose = require('mongoose')
const Workspace = require('../models/Workspace')
const csv = require('csvtojson')
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
    try {
        const id = req.params.id
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

        res.status(200).json({ message: 'Csv imported successfully' })

    } catch (error) {
        console.log(error.message)
        res.sendStatus(500)
    }
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