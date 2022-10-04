const express = require('express')
const router = express.Router()
const {idGameMap} = require('../sessioncache')


const db = require('../db')

router.get('/active', function(req, res){
    console.log(idGameMap)
    const ret = []
    const iter = idGameMap.entries()
    var n = iter.next()
    while(!n.done){
        ret.push(n.value[1])
        n = iter.next()
    }
    res.send(JSON.stringify(ret))
})

router.get('/active/deep', async function(req, res){
    const { rows } = await db.query(`select * from games where active=true;`)
    res.send(JSON.stringify(rows))
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