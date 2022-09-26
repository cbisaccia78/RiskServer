

const {RangeList, gameURLParse} = require("./utils/utils")
const url = require('url')
const parse = url.parse

const express = require('express')
const http = require('http')
const cors = require('cors')
const app = express()
const { auth, requiredScopes } = require('express-oauth2-jwt-bearer');
app.use(cors())
const mountRoutes = require('./routes')
const GameServer = require("./gameserver")
/*




// This route doesn't need authentication
app.get('/api/public', function(req, res) {
  res.json({
    message: 'Hello from a public endpoint! You don\'t need to be authenticated to see this.'
  });
});

// This route needs authentication
app.get('/api/private', checkJwt, function(req, res) {
  res.json({
    message: 'Hello from a private endpoint! You need to be authenticated to see this.'
  });
});

const checkScopes = requiredScopes('read:messages');

app.get('/api/private-scoped', checkJwt, checkScopes, function(req, res) {
  res.json({
    message: 'Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this.'
  });
});

*/

mountRoutes(app)


// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.

const checkJwt = auth({
    audience: 'YOUR_API_IDENTIFIER',
    issuerBaseURL: `https://YOUR_DOMAIN/`,
  });

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