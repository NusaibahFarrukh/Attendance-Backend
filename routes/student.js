const express = require('express');
const router = express.Router();
const db = require('../config/dbconfig');
const { v4: uuid } = require('uuid');

router.get("/", (req, res) => {
    res.status(200).send({
        status: 200,
        success: true,
        message: "Welcome to the students API"
    })
})

router.get('/getStudentsClass', async (req, res) => {
    try {
        let userID = req.query.userid
        let user = await db.getDb().collection('users').findOne({ _id: userID })

        let userClass = user.class
        let studentClasses = userClass.map(async (cl) => {
            // find class by id
            let foundClass = await db.getDb().collection('classes').findOne({ _id: cl })
            return foundClass
        })
        let studentClassesArray = await Promise.all(studentClasses)
        console.log(studentClassesArray)

        res.status(200).send({
            status: 200,
            success: true,
            message: "Student Classes found",
            data: studentClassesArray
        })
    } catch(err) {
        console.log(err)
        res.status(500).send(err)
    }
})

module.exports = { studentRoutes: router }