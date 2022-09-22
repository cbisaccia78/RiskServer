

const GameManager = require("./gameserver")
const {RangeList, gameURLParse} = require("./utils/utils")
const url = require('url')
const parse = url.parse

const express = require('express')
const http = require('http')
const cors = require('cors')
const app = express()
app.use(cors())
const mountRoutes = require('./routes')

mountRoutes(app)
const server = http.createServer(app)

const availableGameIDs = RangeList(1, 1000) 
const idGameMap = new Map()

server.on('upgrade', function upgrade(request, socket, head){ //client wants a websocket protocol (how we communicate)
    console.log('detected upgrade')
    /*
    if request.game_id
        gamemanager = idgamemap[id]
        if gamemanager.isFull
            socket.message(error, full)
    else
        id = availableGameIDs.pop()
        gm = new GameManager(id)
        gm.addplayer
        idgamemap[id] = gm
        socket.message(your in!)

    */
    const {pathname} = parse(request.url)
    gameValues = gameURLParse(pathname)
    if(gameValues === null){//this needs more security
        return
    }
    if(gameValues.game_id in idGameMap.keys()){
        game = idGameMap[game_id]
        if(game.isFull()){
            //create a web socket
            //just for the sake of notifying user
            //that the game is full ?? 
            return 
        }
        //add player to game
    }else{
        new_id = availableGameIDs.pop()
        gm = new GameManager(new_id)
        //add player to game
        idGameMap[new_id] = gm
        gm.message(gameValues.user_id, "You're in!")//need more here
    }
    
    gameSocketMap
})

server.listen(3001, ()=>{
    console.log('listening on port 3001...')
})