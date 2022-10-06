const express = require('express')
const router = express.Router()
const {idGameMap, availableGameIDs} = require('../sessioncache')
const GameServer = require('../gameserver')


const db = require('../db')

router.get('/active', function(req, res){
    //console.log(`active games: `, idGameMap)
    const ret = []
    idGameMap.forEach((g, _id, m) => {
        //console.log('we in it', g)
        ret.push({game_id: _id, num_players: g.game.getNumPlayers()})
    })
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

router.post('/create', async (req, res)=>{
    /*
    const {name, password} = req.body
    console.log('creating new game')
    game_id = availableGameIDs.pop()
    gameServer = new GameServer(game_id, {request: request, socket: socket, head: head})
    idGameMap[game_id] = gameServer
    //const response = await db.query(`insert into games (name, user_ids, password) values('${name}', [], ${password}) `)
    */
})




module.exports = router