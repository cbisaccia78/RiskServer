const _ = require('lodash')

const initialPlayerState = function(){
    return {
        players: {playerList: [0,0,0,0,0,0], turn_stack: []}//6 players,
    }
}

const playerChangeReducer = function(state=initialPlayerState(), action){
    switch(action.type){
        case 'PLAYER_CHANGE/ADD':
            var playerList = _.cloneDeep(state.players.playerList)
            playerList.splice(action.player.table_position, 0, action.player)
            return {...state, players: {playerList: playerList}}
        case 'PLAYER_CHANGE/REMOVE':
            var playerList = _.cloneDeep(state.players)
            playerList.splice(action.player.table_position, 1)
            return {...state, players: newplayers}
        default:
            return state
    }
}

const turnChangeReducer = function(state, action){
    switch(action.type){
        case 'TURN_CHANGE':
            return {...state, turn: (turn+1)%6}
        default:
            return state
    }
    
}

module.exports = {playerChangeReducer, turnChangeReducer}