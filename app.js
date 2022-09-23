

const {RangeList, gameURLParse} = require("./utils/utils")
const url = require('url')
const parse = url.parse

const express = require('express')
const http = require('http')
const cors = require('cors')
const app = express()
app.use(cors())
const mountRoutes = require('./routes')
const GameServer = require("./gameserver")
const { response } = require("express")

mountRoutes(app)
const server = http.createServer(app)


const availableGameIDs = RangeList(1, 10) //10 concurrent games allowed ATM 
const idGameMap = new Map()

server.on('upgrade', function upgrade(request, socket, head){ //client wants a websocket protocol (how we communicate)
    /*
    all this logic needs to be handled in a seperate worker thread eventually
    */
    console.log('detected upgrade')
    const {pathname} = parse(request.url)
    gameValues = gameURLParse(pathname)
    if(gameValues === null){//this needs more security
        socket.destroy()
        return
    }
    const {game_id, user_id} = gameValues
    if(game_id in idGameMap.keys()){
        gameServer = idGameMap[game_id]
        if(gameServer.isFull()){ //to handle race conditions? (two people click on game at same time?)
            socket.destroy()
        }else{
            gameServer.addPlayer(user_id) //NEED AUTHENTICATION!!!!!!!!
            if(gameServer.isFull()){ 
                gameServer.startGame()
            }
        }
        //add player to game
        
    }else{
        game_id = availableGameIDs.pop()
        gameServer = new GameServer(game_id)
        gameServer.addPlayer(user_id)
        idGameMap[game_id] = gameServer
    }
})

server.listen(3001, ()=>{
    console.log('listening on port 3001...')
})