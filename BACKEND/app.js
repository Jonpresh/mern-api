const fs = require('fs')
const path = require('path')
const express = require('express');
const bodyParser = require('body-parser')
const connectDB = require('./config/db');
const placesRoute = require('./routes/places')
const usersRoute = require('./routes/users')
const ErrorResponse = require('./utils/errorResponse')


connectDB()

const app = express()
   
app.use(bodyParser.json())

app.use('/uploads/images', express.static(path.join('uploads', 'images')));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
    next()
})

app.use('/api/places', placesRoute)
app.use('/api/users', usersRoute)

app.use((req, res, next) => {
    const error = new ErrorResponse('Could not find this route.', 404)
    throw error;
})

app.use((error, req, res, next) => {
    if (req.file) {
        fs.unlink(req.file.path, (error) => {
            console.log(error)
        })
    }
    if (res.headerSent) {
        return next(error)
    }
    res.status(error.code || 500)
    res.json({message:error.message || 'An unknown error occured'})
})


app.listen(5000, () => {
    console.log('server connected')
})