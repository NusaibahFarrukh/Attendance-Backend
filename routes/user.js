const express = require('express');
const router = express.Router();
const db = require('../config/dbconfig');

router.get('/login', async (req, res) => {
    try {
        let user = await db.getDb().collection('users').findOne({email: req.query.email})
        console.log({user})
        if(!user) {
            res.status(404).send({
                status: 200,
                success: false,
                message: "User not found"
            })
        } else {
            res.status(200).send({
                status: 200,
                success: true,
                message: "User found",
                data: user
            })
        }

    } catch(err) {
        res.status(500).send(err)
    }
})





module.exports = { userRoutes: router }