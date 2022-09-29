const express = require('express')
const router = express.Router()
const idGameMap = require('../app').idGameMap

const db = require('../db')

router.get('/active', (req, res) => {
    res.send(JSON.stringify(idGameMap.values()))
})

router.get('/all', async (req, res) => {
    const { rows } = await db.query(`select * from games;`)
    if(rows.length > 0){
        res.send(JSON.stringify({games: rows}))
    }else{
        res.send('no games found')
    }
    
})

router.get('/:id', async (req, res) => {
    const { id } = req.params
    if(idGameMap.has(id)){
        res.send(idGameMap.get(id))
        return
    }
    const { rows } = await db.query(`select * from games where id=${id};`)
    if(rows.length == 1){
        res.send(rows[0])
    }else{
        res.send('no games found')
    }
    
})



module.exports = router