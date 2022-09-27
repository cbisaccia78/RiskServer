import { configureStore } from "@reduxjs/toolkit"

const Game = function(gameServer){
    this._that = gameServer
    this._init(gameServer)
}

Game.prototype = {
    /*
        ************
        *  PRIVATE  *
        ************
    */
    _store : null,
    _that : null,
    _init : function(){
        this._store = configureStore({
            reducer: {}
        })
    },
    /*
        ************
        *  PUBLIC  *
        ************
    */
    addPlayer : function(player){

    },
    addPlayers : function(players){

    },
    start : async function(){

    }
}