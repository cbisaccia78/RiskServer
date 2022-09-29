const express = require('express')
const router = express.Router()

const db = require('../db')

router.get('/all', async (req, res) => {
    const { rows } = await db.query(`select * from games where active=true;`)
    if(rows.length > 0){
        res.send(JSON.stringify({games: rows}))
    }else{
        res.send('no games found')
    }
    
})

router.get('/:id', async (req, res) => {
    const { id } = req.params
    const { rows } = await db.query(`select * from games where id=${id};`)
    if(rows.length == 1){
        res.send(rows[0])
    }else{
        res.send('no games found')
    }
    
})



module.exports = router