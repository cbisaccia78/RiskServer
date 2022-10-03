const express = require('express')
const router = express.Router()

const db = require('../db')

router.post('/register', async (req, res) => {
    const {username, password, email, imageB} = req.body.JSON()
    //need to add input sanitization/validation here
    const { rows } = await db.query(`select * from users where username=${username} and email=${email};`)
    if(rows.length == 1){
        res.send(JSON.stringify({success: false}))
    }else{
        //need to add input sanitization/validation here
        await db.query(`insert into users values()`)
        res.send(JSON.stringify({success: true}))
    }
    
    
})

module.exports = router