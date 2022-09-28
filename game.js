import { configureStore, combineReducers} from "@reduxjs/toolkit"
import { playerChangeReducer} from "./reducers/playerSlice"


const rootReducer = combineReducers({
    players: playerChangeReducer,
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
            console.log('done listening')
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
    start : function(){
        this._store.dispatch({
            type: "INITIALIZE_GAME"
        })
    }
}