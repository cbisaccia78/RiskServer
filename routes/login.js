const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()

const db = require('../db')
const {userSet, userIdJWTMap} = require('../sessioncache')
const { FWT } = require('../utils/utils')

router.post('/', async (req, res) => {
    const {username, password} = req.body
    //need to add input sanitization/validation here
    const { rows } = await db.query(`select * from users where username='${username}' and password='${password}';`)
    if(rows.length == 1 ){//&& !userSet.has(username)){           <--- need to uncomment this when done developing
        userSet.add(username)
        const tempWT = FWT()
        const userId = rows[0].id
        userIdJWTMap.set(userId, tempWT)
        //console.log(rows[0].imageb)
        //let resp = JSON.stringify({success: true, user_id: rows[0].id, imageBinary: rows[0].imageb})
        //console.log(resp);
        res.send(JSON.stringify({success: true, user_id: userId, imageBinary: rows[0].imageb, JWT: tempWT}))
    }else{
        res.send(JSON.stringify({success: false}))
    }
    
})

module.exports = router