const express = require('express')
const router = express.Router()

const db = require('../db')
const {userSet} = require('../sessioncache')

router.post('/', async (req, res) => {
    const {username, password} = req.body
    //need to add input sanitization/validation here
    const { rows } = await db.query(`select * from users where username='${username}' and password='${password}';`)
    if(rows.length == 1){
        userSet.add(username)
        console.log(rows[0].imageb)
        //let resp = JSON.stringify({success: true, user_id: rows[0].id, imageBinary: rows[0].imageb})
        //console.log(resp);
        res.send(JSON.stringify({success: true, user_id: rows[0].id, imageBinary: rows[0].imageb}))
    }else{
        res.send(JSON.stringify({success: false}))
    }
    
})

module.exports = router