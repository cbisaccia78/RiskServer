const WebSocket = require("ws")
const WebSocketServer = WebSocket.WebSocketServer
const Game = require("./game")


const GameServer = function(id){
    this._init(id)
}

GameServer.prototype = {
    
    /*
        ************
        *  PRIVATE  *
        ************
    */
    _state: "PENDING_START",
    _wss : null,
    _userIds : [],
    _init : async function(id){
        this.id = id
        this.game = new Game(this)
        this._wss = new WebSocketServer({noServer: true})
        this._wss.on('connection', function connection(ws){
            ws.on('message', function message(data){
                msg = JSON.parse(data)
                console.log(`recieved message`)
                switch(msg.type){
                    case 'GET_INITIAL_STATE':
                        /*
                            This should only be sent once
                            by the client as they are first joining
                        */
                        this.game.addPlayer({
                            name: 'testplayer',
                            color: 'blue', //hardcoded for now
                            secretMission: 'kill yellow', //hardcoded for now 
                            icon: "binaryImageData",
                            globalPosition: this.game.freeSpots.pop()
                        })//hardcoded for now, should eventually be contained in msg.player
                        ws.send(JSON.stringify({type: "INITIALIZE_GAME", state: this.game.getState()}))
                        this._notifyAll(JSON.stringify({
                            type: "PLAYER_CHANGE/ADD", 
                            player: {
                                name: 'playername',
                                color: 'blue', //hardcoded for now
                                secretMission: 'kill yellow', //hardcoded for now 
                                icon: "binaryImageData",
                                globalPosition: this.game.getPlayerPos('playername')//??????
                            }
                        }), [ws])
                        break
                    case 'PLAYER_CHANGE/REMOVE':
                        this.game.removePlayer('playername')//?????????
                        this._notifyAll(JSON.stringify({
                            type: "PLAYER_CHANGE/REMOVE", 
                            player: {
                                name: 'playername'//is more information needed?
                            }
                        }), [ws])
                    case 'ACTION':
                        this.game.handleAction(msg.action)
                        this._notifyAll(data, [ws]) //make sure clients update their state
                        ws.send(" I got your action")
                        break
                    default:
                        ws.send(" Not sure how to respond")
                }
            })
            
        }.bind(this))
        
        this._wss.handleUpgrade(request, socket, head, function done(ws){
            wss.emit('connection', ws, request)
        })
    },
    _cleanup : async function(){},
    _notifyAll : async function(payload, exclude=[]){
        this._wss.forEach(function(ws){
            ws.send(payload)
        })
    },
    /*
        ************
        *  PUBLIC  *
        ************
    */
    id: null,
    game : null,
    addPlayer : function(user){
        //do some stuff to register user
        if(this._state == "PENDING_START"){//good to go!
            this.start()
        }
    },
    removePlayer : function(user){
        //do something
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