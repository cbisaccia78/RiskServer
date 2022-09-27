const express = require('express')
const router = express.Router()

const db = require('../db')
const {userSet} = require('../app')

router.get("/login/:username/:password", async (req, res) => {
    //const { username, password } = req.params
    //const { rows } = await db.query(`select * from users where username=${username} and password=${password};`)
    rows = [1]
    if(rows.length > 0){
        res.send(JSON.stringify({success: true}))
    }else{
        res.send({success: false})
    }
    console.log("recieved login request")
    
})
router.post('/login', async (req, res) => {
    //const { rows } = await db.query(`select * from users where username=${username} and password=${password};`)
    const creds = req.body.JSON()
    console.log(creds)
    var success = true
    if(success){
        //userSet.add(creds.username)
    }
    
    res.send({success: success})
})

module.exports = router