const express = require('express')
const router = express.Router()

const db = require('../db')
const {userSet} = require('../app')

router.post('/login', async (req, res) => {
    const {username, password} = req.body.JSON()
    //need to add input sanitization/validation here
    const { rows } = await db.query(`select * from users where username=${username} and password=${password};`)
    if(rows.length == 1){
        userSet.add(username)
        res.send(JSON.stringify({success: true, user_id: rows[0].id}))
    }else{
        res.send(JSON.stringify({success: false}))
    }
    
    
})

module.exports = router