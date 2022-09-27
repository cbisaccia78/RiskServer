const express = require('express')
const router = express.Router()

const db = require('../db')

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
    //const { rows } = await db.query(`select * from users where id=${id};`)
    console.log("recieved login request")
    res.send({success: true})
})

module.exports = router