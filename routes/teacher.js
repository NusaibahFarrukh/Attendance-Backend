const express = require('express');
const router = express.Router();
const db = require('../config/dbconfig');
const { v4: uuid } = require('uuid');

router.get("/", (req, res) => {
    res.status(200).send({
        status: 200,
        success: true,
        message: "Welcome to the teachers API"
    })
})

router.get('/addSubject', async (req, res) => {
    try {
        let data = {
            _id: uuid(),
            name: req.query.name,
            teacher: req.query.teacher,
            timestamp: new Date().toString()
        }
        console.log("Data to insert to the queue: ", data)

        let insertedData = await db.getDb().collection('subjects').insertOne(data)
        console.log(insertedData)
        res.status(200).send({
            status: 200,
            success: true,
            message: "Subject registered Successfully",
            id: insertedData.insertedId
        })
    } catch(err) {
        console.log(err)
        res.status(500).send(err)
    }
})

router.get('/getTeacherSubjects', async (req, res) => {
    try {
        let teacherId = req.query.teacherId;
        let teacherSubjects = await db.getDb().collection('subjects').find({teacher:teacherId}).toArray()

        res.status(200).send({
            status: 200,
            success: true,
            message: "Teacher Subjects found",
            data: teacherSubjects
        })
    } catch(err) {
        console.log(err)
        res.status(500).send(err)
    }
})

router.get('/addClass', async (req, res) => {
    try {
        let data = {
            _id: uuid(),
            name: req.query.name,
            teacher: req.query.teacher,
            timestamp: new Date().toString()
        }
        console.log("Data to insert to the DB: ", data)

        let insertedData = await db.getDb().collection('classes').insertOne(data)
        console.log(insertedData)
        res.status(200).send({
            status: 200,
            success: true,
            message: "Class Added Successfully",
            id: insertedData.insertedId
        })
    } catch(err) {
        console.log(err)
        res.status(500).send(err)
    }
})

router.get('/getTeachersClass', async (req, res) => {
    try {
        let teacherId = req.query.teacherId;
        let teacherClasses = await db.getDb().collection('classes').find({teacher:teacherId}).toArray()

        res.status(200).send({
            status: 200,
            success: true,
            message: "Teacher Classes found",
            data: teacherClasses
        })
    } catch(err) {
        console.log(err)
        res.status(500).send(err)
    }
})

router.get('/addStudent', async (req, res) => {
    try {
        let data = {
            _id: uuid(),
            name: req.query.name,
            email: req.query.email,
            role: "student",
            subrole: "student",
            class: req.query.class,
            timestamp: new Date().toString()
        }
        console.log("Data to insert to the DB: ", data)

        let insertedData = await db.getDb().collection('users').insertOne(data)
        console.log(insertedData)
        res.status(200).send({
            status: 200,
            success: true,
            message: "Student Added Successfully",
            id: insertedData.insertedId
        })
    } catch(err) {
        console.log(err)
        res.status(500).send(err)
    }
})

module.exports = { teacherRoutes: router }