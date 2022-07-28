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

module.exports = { studentRoutes: router }