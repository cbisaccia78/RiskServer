const WebSocket = require("ws")
const WebSocketServer = WebSocket.WebSocketServer

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
        this._wss = new WebSocketServer({noServer: true})
        this._wss.on('connection', function connection(ws){
            ws.send("connected")
            ws.on('message', function message(data){
                msg = JSON.parse(data)
                console.log(`recieved message`)
                switch(msg.type){
                    case 'GET_STATE':
                        /*
                            This should only be sent once
                            by the player who creates the game 
                        */
                        ws.send(" Here's your initial state")
                        break
                    case 'ACTION':
                        ws.send(" I got your action")
                        break
                    default:
                        ws.send(" Not sure how to respond")
                }
            })
            this._notifyAll(JSON.stringify({type: "NEW_PLAYER"}))
        }.bind(this))
        
        this._wss.handleUpgrade(request, socket, head, function done(ws){
            wss.emit('connection', ws, request)
        })
    },
    _initState : function(){

    },
    _cleanup : async function(){},
    _notifyAll : async function(payload){
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
    addPlayer : function(user){
        //do some stuff to register user
        if(this._state == "PENDING_START"){//good to go!
            this.start()
        }
    },
    end : function(){},
    getState : function(){
        return this._state
    },
    isFull : function(){
        return false
    },
    messageAll : function(data){
        
    },
    message : function(user_id, data){

    },
    startGame : function(){},
}

module.exports = GameServer