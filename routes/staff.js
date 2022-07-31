const express = require('express');
const router = express.Router();
const db = require('../config/dbconfig');
const { v4: uuid } = require('uuid');
const moment = require('moment');

router.get('/', (req, res) => {
    res.status(200).send({
        status: 200,
        success: true,
        message: "Welcome to the teachers API"
    })
})

router.get('/getAttendance', async (req, res) => {
    try {
        let userID = req.query.userid;
        let userAttendance = await db.getDb().collection('attendance').find({ userID: userID }).toArray()
        res.status(200).send({
            status: 200,
            success: true,
            message: "Attendance found",
            data: userAttendance
        })
    } catch(err) {
        console.log(err)
        res.status(500).send(err)
    }
})

router.get('/addAttendance', async (req, res) => {
    try {
        let data = {
            _id: uuid(),
            userID: req.query.userid,
            date: moment().format('DD-MM-YYYY'),
            time: moment().format('HH:mm:ss'),
            timestamp: new Date().toString()
        }
        console.log("Data to insert to the queue: ", data)

        let insertedData = await db.getDb().collection('attendance').insertOne(data)
        console.log(insertedData)
        res.status(200).send({
            status: 200,
            success: true,
            message: "Attendance registered Successfully",
            id: insertedData.insertedId
        })
    } catch(err) {
        console.log(err)
        res.status(500).send(err)
    }
})

router.get('/regularize', async (req, res) => {
    try {
        let userID = req.query.userid;
        let data = {
            _id: uuid(),
            user: userID,
            date: moment().format('DD-MM-YYYY'),
            time: moment().format('HH:mm:ss'),
            timestamp: new Date().toString()
        }
        console.log("Data to insert to the queue: ", data)
        let insertedData = await db.getDb().collection('regularize').insertOne(data)
        console.log(insertedData)
        res.status(200).send({
            status: 200,
            success: true,
            message: "Regularization registered Successfully",
            id: insertedData.insertedId
        })

    } catch(err) {
        console.log(err)
        res.status(500).send(err)
    }
})

router.get('/getAllReg', async (req, res) => {
    try {
        let regularization = await db.getDb().collection('regularize').find().toArray()
        res.status(200).send({
            status: 200,
            success: true,
            message: "Regularization found",
            data: regularization
        })
    } catch(err) {
        console.log(err)
        res.status(500).send(err)
    }
})

router.get('/getReport', async (req, res) => {
    let startDate = req.query.startDate;
    let endDate = req.query.endDate;
    let userID = req.query.userid;

    startDate = moment(startDate, 'DD-MM-YYYY')
    endDate = moment(endDate, 'DD-MM-YYYY')
    console.log({ startDate })
    console.log({ endDate })

    let result = await db.getDb().collection('attendance').aggregate(
        [
            {
              '$addFields': {
                'convertedDate': {
                  '$dateFromString': {
                    'dateString': '$date', 
                    'format': '%d-%m-%Y'
                  }
                }
              }
            }, 
            {
              '$match': {
                'convertedDate': {
                  '$gte': new Date(startDate), 
                  '$lt': new Date(endDate)
                },
                'userID': userID
              }
            }
          ]
    ).toArray()
    
    res.status(200).send({
        status: 200,
        success: true,
        message: "Report found",
        data: result
    })
})

module.exports = { staffRoutes: router }