const WebSocket = require("ws")
const WebSocketServer = WebSocket.WebSocketServer

const GameManager = function(id){
    this._init(id)
}

GameManager.prototype = {
    
    /*
        ************
        *  PRIVATE  *
        ************
    */
    _state: "PENDING_START",
    _wss : null,
    _init : async function(id){
        this.id = id
        this._wss = new WebSocketServer({noServer: true})
        this._wss.on('connection', function connection(ws){
            //console.log('connected')
            ws.send("connected")
            ws.on('message', function message(data){
                msg = JSON.parse(data)
                console.log(`recieved message`)
                switch(msg.type){
                    case 'GET_INITIAL_STATE':
                        ws.send(" Here's your initial state")
                        break
                    case '2':
                        ws.send(" I got your 2")
                        break
                    default:
                        ws.send(" Not sure how to respond")
                }
            })
        })
        this._wss.handleUpgrade(request, socket, head, function done(ws){
            wss.emit('connection', ws, request)
        })
    },
    _cleanup : async function(){},

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
        this.wss.send(data)
    },
    message : function(user_id, data){

    },
    start : async function(){},
}

module.exports = GameManager