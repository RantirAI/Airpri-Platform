const connectToDB = require('./src/utils/connectToDB')
require('dotenv').config()
const express = require('express')
const authRouter = require('./src/routes/auth')
const cors = require('cors')
const notFound = require('./src/middlewares/notFound')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/api/v1', authRouter)

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