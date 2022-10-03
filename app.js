

const gameURLParse = require("./utils/utils").gameURLParse
const url = require('url')
const parse = url.parse

const express = require('express')
const https = require('https')
const http = require('http')
const cors = require('cors')
const fs = require('fs')
const app = express()
app.use(cors())
const mountRoutes = require('./routes')
const GameServer = require("./gameserver")
const {idGameMap, userSet, availableGameIDs} = require("./sessioncache")
const db = require("./db")

mountRoutes(app)

/*const options = {
    key: fs.readFileSync('keys/genericprivate.pem'),
    cert: fs.readFileSync('keys/generic-cert.pem')
}
const server = https.createServer(options, app)*/
const server = http.createServer(app);

/*get active games when server restarts to resume (implement this properly eventually)
(async function(){
    const { rows } = await db.query(`select * from games where active=true;`)
    rows.forEach(function(game){
        idGameMap.set(game.id, new GameServer(game.id, game))
    })
    console.log(idGameMap)
})()
*/
   

//userSet.add(1) // for testing purposes

server.on('upgrade', function upgrade(request, socket, head){ //client wants a websocket protocol (how we communicate)
    /*
        (all this logic needs to be handled in a seperate worker thread eventually)

        authenticate user, then send them a JWT which 
        the user should include in every subsequent ws message

    */
    console.log('detected upgrade')
    const {pathname} = parse(request.url)
    //console.log(pathname)
    gameValues = gameURLParse(pathname)
    //console.log(gameValues)
    if(gameValues === null){//this needs more security
        console.log('could not parse url')
        socket.destroy()
        return
    }
    var {game_id, user_id} = gameValues
    if(game_id in idGameMap.keys()){
        console.log('game_id in cache')
        gameServer = idGameMap[game_id]
        if(gameServer.isFull()){ //to handle race conditions? (two people click on game at same time?)
            socket.destroy()
        }else{
            if(userSet.has(user_id)){ //user has already logged in
                gameServer.addPlayer(user_id) //NEED AUTHENTICATION!!!!!!!!
                if(gameServer.isFull()){ 
                    gameServer.startGame()
                }
            }else{//not logged in.
                console.log('user not logged in')
                socket.destroy()
            }
        }
        //add player to game
        
    }else{
        if(user_id > 0){
            console.log('creating new game')
            game_id = availableGameIDs.pop()
            gameServer = new GameServer(game_id, {request: request, socket: socket, head: head})
            gameServer.addPlayer(user_id)
            idGameMap[game_id] = gameServer
        }
        
    }
})

server.listen(3001, ()=>{
    console.log('listening on port 3001...')
})