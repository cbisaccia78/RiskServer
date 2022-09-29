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
    const {username, password} = req.body.JSON()
    const { rows } = await db.query(`select * from users where username=${username} and password=${password};`)
    if(rows.length == 1){
        userSet.add(username)
        res.send({success: true})
    }else{
        res.send({success: false})
    }
    
    
})

module.exports = router