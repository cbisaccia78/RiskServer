const { configureStore, combineReducers} = require("@reduxjs/toolkit")
const deckReducer = require("./reducers/deckSlice")
const playerChangeReducer = require("./reducers/playerSlice")


const rootReducer = combineReducers({
    players: playerChangeReducer,
    deck: deckReducer
})


const Game = function(){
    this._init()
}

Game.prototype = {
    /*
        ************
        *  PRIVATE  *
        ************
    */
    _store : null, //redux store
    _init : function(){
        this._store = configureStore({
            reducer: rootReducer
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
    }
}

module.exports = Game