const {WebSocketServer} = require("ws")
const {userIdJWTMap, idGameMap, availableGameIDs} = require("./sessioncache")
const Game = require("./game")
const { DEVELOPMENT } = require("./config")
const {sleep} = require("./utils/utils")

const GameServer = function(id, connectionObject, game=null){
    this.id = id
    this._init(connectionObject, game)
}

GameServer.prototype = {
    
    /*
        ************
        *  PRIVATE  *
        ************
    */
    _state: "PENDING_START",
    _wss : null,
    _userIds : new Set(),
    _uidWsMap : new Map(),
    _init : function(conn, game){
        this.game = game ? game : new Game(this.id)
        this._wss = new WebSocketServer({noServer: true})
        this._wss.on('connection', function connection(ws){
            ws.on('message', function message(data){
                msg = JSON.parse(data)
                const loggedInAndAuthorized = this._userIds.has(msg.user_id) && userIdJWTMap.get(msg.user_id) ==  msg.JWT
                
                console.log(`recieved message: ${data}`)
                switch(msg.type){
                    case 'GET_INITIAL_STATE':
                        /*
                            This should only be sent once
                            by the client as they are first connecting
                        */
                        console.log('init state')
                        
                        ws.send(JSON.stringify({type: "INITIALIZE_GAME", state: this.game.getState()}))                        
                        break
                    case 'SOCKET_CLOSE':
                        let _player = JSON.parse(data)
                        this.game.removePlayer(_player)
                        this._notifyAll(JSON.stringify({
                            type: "PLAYER_CHANGE/REMOVE", 
                            player: _player
                        }))
                    case 'JOIN': //if a logged in user is originally spectating but then wishes to join
                        if(!this.game.isFull() ){ //to handle race conditions? (two people click on game at same time?)
                             //NEED AUTHENTICATION!!!!!!!!
                            let player = msg.player
                            if(loggedInAndAuthorized){
                                player.id = msg.user_id
                                this.game.addPlayer(
                                    player
                                )//hardcoded for now, should eventually be contained in msg.player
                                
                                this._notifyAll(JSON.stringify({
                                    type: "PLAYER_CHANGE/ADD", 
                                    player: this.game.getPlayer(player.id)
                                }))
                                ws.send(JSON.stringify({
                                    type: "INFO/GAMEID",
                                    gameId: this.game.getId()
                                }))
                                if(this.game.isFull()){ 
                                    this.startGame()
                                }
                            }
                            
                        }
                        break
                    case 'START':
                        if(this._userIds.has(msg.user_id) && loggedInAndAuthorized){
                            console.log('starting');
                            this.startGame()
                        }
                        break
                    case 'ACTION':
                        console.log('action')
                        if(this._userIds.has(msg.user_id) && loggedInAndAuthorized && this.game.peekFront().id == msg.user_id){
                            this.game.handleAction(msg.action)
                            if(!(msg.server_action))this._notifyAll(JSON.stringify(msg)) //make sure clients update their state
                            if(this.game.queuedMessages){
                                this.game.queuedMessages.forEach(message=>{this._notifyAll(JSON.stringify(message))})
                            }
                            this.game.queuedMessages = []
                        }
                        break
                    default:
                        console.log('default')
                        ws.send("Not sure how to respond")
                }
            }.bind(this))

            ws.on('close', function close(){
                if(this.game.isEmpty()){
                    const gid = this.game.id
                    idGameMap.delete(gid) 
                    availableGameIDs.push(gid)
                    this.game = null
                    this._wss.close()
                }
                console.log('closed');
            }.bind(this))
            
        }.bind(this))
        
        this.handleUpgrade(conn.request, conn.socket, conn.head)
        
        
    },
    _cleanup : async function(){},
    _notifyAll : async function(payload, exclude=[]){
        this._wss.clients.forEach(function(ws){
            if(!exclude.includes(ws)){
                //console.log(ws);
                ws.send(payload)
            } 
        })
    },
    /*
        ************
        *  PUBLIC  *
        ************
    */
    id: null,
    game : null,
    addUser : function(userid){//this should be renamed 
        //do some stuff to assign user JWT
        this._userIds.add(userid)
    },
    removeUser : function(userid){
        //do something
        this._userIds.delete(userid)
    },
    handleUpgrade(request, socket, head){
        this._wss.handleUpgrade(request, socket, head, function done(ws){
            this._wss.emit('connection', ws, request)
        }.bind(this))
    },
    end : function(){},
    getState : function(){
        return this._state
    },
    isFull : function(){
        return false
    },
    messageAll : function(payload){
        this._notifyAll(payload)
    },
    message : function(user_id, payload={}){
        this._uidWsMap.get(user_id).send(JSON.stringify(payload))
    },
    startGame : async function(){
        this._state = "Running"
        this.game.initialize()
        this.messageAll(JSON.stringify({type: "STATUS/SET", status: "INITIAL_ARMY_PLACEMENT"}))
        this.messageAll(JSON.stringify({type: "PLAYER_CHANGE/INITIALIZE_ALL"}))
        if(DEVELOPMENT){
            let available_territories = this.game.getState().players.available_territories
            available_territories.forEach(async function(territory){
                this.game.handleAction({type: 'PLAYER_CHANGE/SELECT_TERRITORY', territory: territory})
                this._notifyAll(JSON.stringify({type: "ACTION", action: {type: 'PLAYER_CHANGE/SELECT_TERRITORY', territory: territory}})) //make sure clients update their state
                if(this.game.queuedMessages){
                    this.game.queuedMessages.forEach(message=>{this._notifyAll(JSON.stringify(message))})
                }
                this.game.queuedMessages = []
                await sleep(200)
            }.bind(this))
            var status = this.game.getStatus()
            while(status == "INITIAL_ARMY_PLACEMENT"){
                let controlledTerritories = Object.keys(this.game.peekFront().territories) 
                let randomTerritory = controlledTerritories[Math.floor(Math.random()*controlledTerritories.length)]
                this.game.handleAction({type: 'PLAYER_CHANGE/PLACE_ARMIES', territory: randomTerritory, count: 1})
                this._notifyAll(JSON.stringify({type: "ACTION", action: {type: 'PLAYER_CHANGE/PLACE_ARMIES', territory: randomTerritory, count: 1}})) //make sure clients update their state
                if(this.game.queuedMessages){
                    this.game.queuedMessages.forEach(message=>{this._notifyAll(JSON.stringify(message))})
                }
                this.game.queuedMessages = []
                status = this.game.getStatus()
                await sleep(100)
            }
        }
    },
}

module.exports = GameServer