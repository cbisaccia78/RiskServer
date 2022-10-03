const {WebSocketServer} = require("ws")
const Game = require("./game")


const GameServer = function(id, connectionObject, game=null){
    this.id = id
    this.conn = connectionObject
    this._init(game)
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
    _init : function(game){
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
                            by the client as they are first joining
                        */
                        console.log('init state')
                        this.game.addPlayer({
                            name: 'testplayer',
                            color: 'blue', //hardcoded for now
                            secretMission: 'kill yellow', //hardcoded for now 
                            icon: "binaryImageData"
                        })//hardcoded for now, should eventually be contained in msg.player
                        ws.send(JSON.stringify({type: "INITIALIZE_GAME", state: this.game.getState()}))
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
            
        }.bind(this))
        
        this._wss.handleUpgrade(this.conn.request, this.conn.socket, this.conn.head, function done(ws){
            this._wss.emit('connection', ws, this.conn.request)
        }.bind(this))
        
    },
    _cleanup : async function(){},
    _notifyAll : async function(payload, exclude=[]){
        this._wss.clients.forEach(function(ws){
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
        this.game.addPlayer(user)
    },
    removePlayer : function(user){
        //do something
        this.player.removePlayer(user)
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