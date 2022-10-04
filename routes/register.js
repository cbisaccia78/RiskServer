const express = require('express')
const router = express.Router()

const db = require('../db')



router.post('/', async (req, res) => {
    //console.log(req.body)
    const {name, username, password, email, imageB} = req.body
    //need to add input sanitization/validation here
    const existsQuery = `select * from users where username='${username}' and email='${email}';`
    console.log(existsQuery);
    const { rows } = await db.query(existsQuery)
    if(rows.length == 1){
        res.send(JSON.stringify({success: false}))
    }else{
        //need to add input sanitization/validation here
        try{
            const insertQuery = `insert into users (name, username, password, email, imageb) values( '${name}', '${username}', '${password}', '${email}', '${imageB}');`
            console.log(insertQuery);
            const response = await db.query(insertQuery)
            console.log(response);
            res.send(JSON.stringify({success: true}))
        } catch (error) {
            res.send(JSON.stringify({success:false, reason: error}))
        }
        
    }
    
})

module.exports = router