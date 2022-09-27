import { configureStore } from "@reduxjs/toolkit"
import { playerChangeReducer, turnChangeReducer} from "./reducers/gameReducers"
import DoublyLL from "./utils/datastructures"

const initialState = function(){
    return {
        players: new DoublyLL()//position 0
    }
}


const Game = function(){
    this._init()
}

Game.prototype = {
    /*
        ************
        *  PRIVATE  *
        ************
    */
    _store : null,
    _init : function(){
        this._store = configureStore({
            reducer: {
                players : playerChangeReducer,
                turnChangeReducer
            }
        })
    },
    /*
        ************
        *  PUBLIC  *
        ************
    */
}