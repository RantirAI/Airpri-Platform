const connectToDB = require('./src/utils/connectToDB')
require('dotenv').config()
const express = require('express')
const authRouter = require('./src/routes/auth')
const workspaceRouter = require('./src/routes/workspace')
const cors = require('cors')
const notFound = require('./src/middlewares/notFound')
const authenticate = require('./src/middlewares/authenticate')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/api/v1', authRouter)
app.use('/api/v1/workspace', authenticate, workspaceRouter)

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