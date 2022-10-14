const { configureStore, combineReducers} = require("@reduxjs/toolkit")
const deckReducer = require("./reducers/deckSlice")
const playerChangeReducer = require("./reducers/playerSlice")


const reducer = combineReducers({
    players: playerChangeReducer,
    deck: deckReducer
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
    isFull : function(){
        return this.getNumPlayers() == 6
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
    start : function(){
        this._store.dispatch({
            type: "INITIALIZE_GAME"
        })
    },
    getState : function(){
        return this._store.getState()
    },
    getPlayer : function(id){
        console.log(JSON.stringify(this.getPlayers()));
        const players = this.getPlayers().filter((player)=>player && player.id==id)
        if(players.length == 1){
            return players[0]
        }
        return null
    },
    getPlayerPosition: function(id){
        const players = this.getPlayers().filter((player)=>player != null)
        console.log(players);
        const player = players.filter((player) => player.name == playerName)
        if(player.length != 1){
            throw new Error("No Player found")
        }
        return this.getPlayer(id)?.table_position
    }
}

module.exports = Game