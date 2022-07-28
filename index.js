const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express();
const morgan = require('morgan')
const { v4: uuid } = require('uuid');

// Database configuration file
const db = require('./config/dbconfig')

// Check the environment where the project is running
const env = process.env.NODE_ENV || 'prod'

//Routes file configuration
const { userRoutes } = require('./routes/user');
const { teacherRoutes } = require('./routes/teacher');
const { studentRoutes } = require('./routes/student'); 

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(morgan('dev'))

app.get('/', (req, res) => {
    res.send("Hello World");
})

app.use('/user', userRoutes);
app.use('/teacher', teacherRoutes)
app.use('/student', studentRoutes)


app.get('/insertAdmin', async (req, res) => {
    try {
        let role = 'admin';
        let data = {
            _id: uuid(),
            name: req.query.name,
            email: req.query.email,
            role,
            subrole: req.query.subrole,
            timestamp: new Date().toString()
        }
        console.log("Data to insert to the queue: ", data)

        let insertedData = await db.getDb().collection('users').insertOne(data)
        console.log(insertedData)
        res.status(200).send({
            status: 200,
            success: true,
            message: "User registered Successfully",
            id: insertedData.insertedId
        })
    } catch(err) {
        res.status(500).send(err)
    }
})

app.get('/getAdmin', async (req, res) => {
    try {
        let adminFound = await db.getDb().collection('users').find({role:'admin'}, {$slice: 1}).toArray()
        console.log(adminFound)

        res.status(200).send({
            status: 200,
            success: true,
            message: "Admin found",
            data: adminFound[0]
        })
    } catch(err) {
        res.status(500).send(err)
    }
})

app.get('/addIncharge', async (req, res) => {
    try {
        let role = 'incharge';
        let subrole = req.query.subrole;
        let data = {
            _id: uuid(),
            name: req.query.name,
            email: req.query.email,
            role,
            subrole,   
            timestamp: new Date().toString()
        }

        console.log("Incharge to Add: ", data)
        let insertedData = await db.getDb().collection('users').insertOne(data)

        res.status(200).send({
            status: 200,
            success: true,
            message: "Incharge added Successfully",
            id: insertedData.insertedId
        })
    } catch(err) {
        res.status(500).send(err)
    }
})

app.get('/getIncharge', async (req, res) => {
    try {
        let inchargeFound = await db.getDb().collection('users').find({role:'incharge'}).toArray()
        console.log(inchargeFound)

        res.status(200).send({
            status: 200,
            success: true,
            message: "Incharge found",
            data: inchargeFound
        })
    } catch(err) {
        res.status(500).send(err)
    }
})

app.get('/changeIncharge', async (req, res ) => {
    try {
        console.log(req.query.name, req.query.subrole)
        let data = await db.getDb().collection('users').updateOne({subrole: req.query.subrole}, {$set: {name: req.query.name}})
        console.log(data)
        res.status(200).send({
            status: 200,
            success: true,
            message: "Incharge updated Successfully"
        })
    } catch(err) {
        res.status(500).send(err)
    }
})

app.get('/getTeaching', async (req, res) => {
    try {
        let teachersFound = await db.getDb().collection('users').find({role:'teacher', subrole: 'teacher'}).toArray()
        console.log(teachersFound)

        res.status(200).send({
            status: 200,
            success: true,
            message: "Teachers found",
            data: teachersFound
        })
    } catch(err) {
        res.status(500).send(err)
    }
})

app.get('/addTeacher', async (req, res) => {
    try {
        let role = 'teacher';
        let data = {
            _id: uuid(),
            name: req.query.name,
            email: req.query.email,
            role,
            subrole: req.query.subrole,
            timestamp: new Date().toString()
        }

        console.log("Teacher to Add: ", data)
        let insertedData = await db.getDb().collection('users').insertOne(data)

        res.status(200).send({
            status: 200,
            success: true,
            message: "Teacher added Successfully",
            id: insertedData.insertedId
        })
    } catch(err) {
        res.status(500).send(err)
    }
})

app.get('/getNonTeaching', async (req, res) => {
    try {
        let teachersFound = await db.getDb().collection('users').find({role:'nonTeacher', subrole: 'nonTeacher'}).toArray()
        console.log(teachersFound)

        res.status(200).send({
            status: 200,
            success: true,
            message: "Staffs found",
            data: teachersFound
        })
    } catch(err) {
        res.status(500).send(err)
    }
})

app.get('/addNonTeacher', async (req, res) => {
    try {
        let role = 'nonTeacher';
        let data = {
            _id: uuid(),
            name: req.query.name,
            email: req.query.email,
            role,
            subrole: req.query.subrole,
            timestamp: new Date().toString()
        }

        console.log("Teacher to Add: ", data)
        let insertedData = await db.getDb().collection('users').insertOne(data)

        res.status(200).send({
            status: 200,
            success: true,
            message: "Teacher added Successfully",
            id: insertedData.insertedId
        })
    } catch(err) {
        res.status(500).send(err)
    }
})

app.get('/deleteStaff', async (req, res) => {
    try {
        let data = await db.getDb().collection('users').deleteOne({_id: req.query.id})
        console.log(data)
        res.status(200).send({
            status: 200,
            success: true,
            message: "Staff deleted Successfully"
        })
    } catch(err) {
        res.status(500).send(err)
    }
})


// Database Connection
db.connect((err) => {
    if (err) {
        console.log('unable to connect to the database');
    } else {
        const port = process.env.PORT || 5000
        app.listen(port, () => console.log(`database connection established and server is running on ${port}`))
    }
})