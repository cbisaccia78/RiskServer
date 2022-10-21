const { configureStore, combineReducers} = require("@reduxjs/toolkit")
const deckReducer = require("./reducers/deckSlice")
const playerChangeReducer = require("./reducers/playerSlice")
const statusReducer = require("./reducers/statusSlice")


const reducer = combineReducers({
    players: playerChangeReducer,
    deck: deckReducer,
    status: statusReducer,
})


const Game = function(id){
    this._init(id)
}

Game.prototype = {
    /*
        ************
        *  PRIVATE  *
        ************
    */
    _store : null, //redux store
    _init : function(id){
        this.id = id
        this._store = configureStore({
            reducer
        })
        this._unsubscribe = this._store.subscribe(()=>{
            console.log('State after dispatch: ', this._store.getState())
        })
    },
    _unsubscribe : null,
    /*
        ************
        *  PUBLIC  *
        ************
    */
    id: null,
    addPlayer : function(player){
        this._store.dispatch({
            type: "PLAYER_CHANGE/ADD",
            player: player
        })
    },
    removePlayer : function(player){
        this._store.dispatch({
            type: "PLAYER_CHANGE/REMOVE",
            player: player
        })
    },
    isEmpty : function(){
        return this.getNumPlayers() == 0
    },
    isFull : function(){
        return this.getNumPlayers() == 6
    },
    getTurnStack : function(){
        return this.getState().players.turn_stack
    },
    getPlayers : function(){
        return this.getState().players.playerList
    },
    getNumPlayers : function(){
        return this.getPlayers().filter(player=>player != null).length
    },
    handleAction : function(action){
        this._store.dispatch(action)
    },
    initialize : function(){
        console.log("started");
        let p = this.getPlayers();

        p.forEach(function(player){
            this._store.dispatch({//
                type: "PLAYER_CHANGE/INITIALIZE",
                player: player,
                table_size: p.length
            })
        }.bind(this))
        this._store.dispatch({type: "STATUS/SET", status: "INITIALIZED"})
    },
    getId : function(){
        return this.id
    },
    getState : function(){
        return this._store.getState()
    },
    getStatus : function(){
        return this._store.getState().status
    },
    getPlayer : function(id){
        //console.log(JSON.stringify(this.getPlayers()));
        const players = this.getPlayers().filter((player)=>player && player.id==id)
        if(players.length == 1){
            return players[0]
        }
        return null
    },
    getPlayerPosition: function(id){
        const players = this.getPlayers().filter((player)=>player != null)
        //console.log(players);
        const player = players.filter((player) => player.name == playerName)
        if(player.length != 1){
            throw new Error("No Player found")
        }
        return this.getPlayer(id)?.table_position
    },
    peekFront : function(){
        let ts = this.getTurnStack()
        return ts.length ? ts[0] : null
    },
    next : function(){
        let ts = _.cloneDeep(this.getTurnStack())
        let _next = ts.shift()
        ts.push(_next)
        this.dispatch({type: "TURN_CHANGE", turn_stack:ts})
    }
}

module.exports = Game