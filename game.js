const { configureStore, combineReducers} = require("@reduxjs/toolkit")
const deckReducer = require("./reducers/deckSlice")
const playerChangeReducer = require("./reducers/playerSlice")
const statusReducer = require("./reducers/statusSlice")
const _ = require("lodash")


const reducer = combineReducers({
    players: playerChangeReducer,
    deck: deckReducer,
    status: statusReducer
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
            let _state = this._store.getState()
            console.log('State after dispatch: ', _state)
            if(_state.status == "INITIAL_ARMY_PLACEMENT" && _state.players.available_territories.length == 0){
                //we done baby!!!!!
            }
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
        this._store.dispatch({...action, gameStatus: this.getStatus()})
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
        this._store.dispatch({type: "STATUS/SET", status: "INITIAL_ARMY_PLACEMENT"})
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
        return ts.length ? this.getPlayers().filter((player)=>player && player.table_position==ts[0])[0] : null
    },
}

module.exports = Game