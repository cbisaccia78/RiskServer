const {WebSocketServer} = require("ws")
const Game = require("./game")
const {idGameMap} = require("./sessioncache")

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
    _init : function(conn, game){
        this.game = game ? game : new Game(this.id)
        this._wss = new WebSocketServer({noServer: true})
        this._wss.on('connection', function connection(ws){
            ws.on('message', function message(data){
                msg = JSON.parse(data)
                console.log(`recieved message: ${data}`)
                switch(msg.type){
                    case 'GET_INITIAL_STATE':
                        /*
                            This should only be sent once
                            by the client as they are first connecting
                        */
                        console.log('init state')
                        
                        ws.send(JSON.stringify({type: "INITIALIZE_GAME", state: this.game.getState()}))

                        var userHasJoined = true; // need to determine the value of this boolean
                        if(userHasJoined){
                            this.game.addPlayer({
                                name: 'testplayer',
                                color: 'blue', //hardcoded for now
                                secretMission: 'kill yellow', //hardcoded for now 
                                icon: "binaryImageData"
                            })//hardcoded for now, should eventually be contained in msg.player
                            
                            this._notifyAll(JSON.stringify({
                                type: "PLAYER_CHANGE/ADD", 
                                player: {
                                    name: 'testplayer',
                                    color: 'blue', //hardcoded for now
                                    secretMission: 'kill yellow', //hardcoded for now 
                                    icon: "binaryImageData",
                                    globalPosition: this.game.getPlayerPosition('testplayer')//??????
                                }
                            }), [ws])
                        }
                        
                        break
                    case 'ACTION':
                        console.log('action')
                        this.game.handleAction(msg.action)
                        this._notifyAll(data, [ws]) //make sure clients update their state
                        ws.send(" I got your action")
                        break
                    default:
                        console.log('default')
                        ws.send(" Not sure how to respond")
                }
            }.bind(this))

            ws.on('close', function close(data){
                let _player = JSON.parse(data)
                this.game.removePlayer(_player)
                this._notifyAll(JSON.stringify({
                    type: "PLAYER_CHANGE/REMOVE", 
                    player: _player
                }), [ws])
                console.log('closed');
            }.bind(this))
            
        }.bind(this))
        
        this.handleUpgrade(conn.request, conn.socket, conn.head)
        
        
    },
    _cleanup : async function(){},
    _notifyAll : async function(payload, exclude=[]){
        this._wss.clients.forEach(function(ws){
            if(!exclude.includes(ws)){
                console.log(ws);
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
    addPlayer : function(userid){
        //do some stuff to register user
        this._userIds.add(userid)
    },
    removePlayer : function(userid){
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
    messageAll : function(data){},
    message : function(user_id, data){},
    startGame : function(){
        this._state = "Running"
        this.game.start()
    },
}

module.exports = GameServer