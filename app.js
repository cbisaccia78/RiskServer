

const gameURLParse = require("./utils/utils").gameURLParse
const url = require('url')
const bodyParser = require('body-parser')
const parse = url.parse

const express = require('express')
const https = require('https')
const http = require('http')
const cors = require('cors')
const fs = require('fs')
const app = express()
app.use(express.json())
app.use(bodyParser.json({limit: `500kb`}))
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

    const proto = request.headers["sec-websocket-protocol"] //connection cases (could also store initial JWT in this field?) 
    console.log(proto);

    const {pathname} = parse(request.url)
    //console.log(pathname)

    gameValues = gameURLParse(pathname)
    console.log(gameValues)

    if(gameValues === null){//this needs more security
        console.log('could not parse url')
        socket.destroy()
        return
    }
    
    var {game_id, user_id} = gameValues
    //console.log(user_id);
    game_id = parseInt(game_id)
    user_id = parseInt(user_id)
    var userIsWhoTheySayTheyAre = true // need logic here

    if(idGameMap.has(game_id)){
        console.log('game_id in cache')
        const gameServer = idGameMap.get(game_id)
        gameServer.handleUpgrade(request, socket, head)

        if(proto && proto.includes("JOIN") && userIsWhoTheySayTheyAre){
            if(!gameServer.isFull() ){ //to handle race conditions? (two people click on game at same time?)
                gameServer.addPlayer(user_id) //NEED AUTHENTICATION!!!!!!!!
                if(gameServer.isFull()){ 
                    gameServer.startGame()
                }
            }
        }
        
    }else{
        if(!userIsWhoTheySayTheyAre){
            socket.destroy()
            return
        }
        //by this point user is authenticated, can create and join game
        console.log('creating new game')
        game_id = availableGameIDs.shift()
        const gameServer = new GameServer(game_id, {request: request, socket: socket, head: head})
        idGameMap.set(game_id, gameServer)
        gameServer.addPlayer(user_id)
    }
})

server.listen(3001, ()=>{
    console.log('listening on port 3001...')
})