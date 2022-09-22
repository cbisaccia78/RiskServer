const WebSocket = require("ws")
const WebSocketServer = WebSocket.WebSocketServer

const GameManager = function(id){
    this._init(id)
}

GameManager.prototype = {
    
    _init : async function(id){
        this.id = id
        this.wss = new WebSocketServer({noServer: true})
        this.wss.on('connection', function connection(ws){
            //console.log('connected')
            ws.send("connected")
            ws.on('message', function message(data){
                msg = JSON.parse(data)
                console.log(`recieved message`)
                switch(msg.type){
                    case '1':
                        ws.send(" I got your 1")
                        break
                    case '2':
                        ws.send(" I got your 2")
                        break
                    default:
                        ws.send(" Not sure how to respond")
                }
            })
        })
        this.wss.handleUpgrade(request, socket, head, function done(ws){
            wss.emit('connection', ws, request)
        })
    },
    _cleanup : async function(){},
    state: "PENDING_START",
    wss : null,
    id: null,
    start : async function(){},
    end : function(){},
    addPlayer : function(user){
        //do some stuff to register user
        if(this.state == "PENDING_START"){//good to go!
            this.start()
        }
    }
}

module.exports = GameManager