const connectToDB = require('./src/utils/connectToDB')
require('dotenv').config()
const express = require('express')
const authRouter = require('./src/routes/auth')
const workspaceRouter = require('./src/routes/workspace')
const usersRouter = require('./src/routes/user')
const spreadsheetRouter = require('./src/routes/spreadsheet')
const shareRouter = require('./src/routes/share')
const cors = require('cors')
const notFound = require('./src/middlewares/notFound')
const authenticate = require('./src/middlewares/authenticate')

const app = express()

app.use(cors())
app.use(express.json({limit: '100mb'}));
app.use(express.urlencoded({ extended: true, limit: '100mb' }))
app.timeout = 1000000

app.use('/api/v1', authRouter)
app.use('/api/v1/share', shareRouter)
app.use(authenticate)
app.use('/api/v1/workspace' , workspaceRouter)
app.use('/api/v1', usersRouter)
app.use('/api/v1/spreadsheet', spreadsheetRouter)

app.use(notFound)

const PORT = process.env.PORT || 5000

const startServer = async () => {
    try {
        await connectToDB()
        app.listen(PORT, () => {
            console.log(`Server started at port ${PORT}`)
        })
    } catch (error) {
        console.log(error.message)
    }
}

startServer()