const _ = require('lodash')

const initialPlayerState = function(){
    return {
        players: {playerList: [0,0,0,0,0,0], turn_stack: []}//6 players,
    }
}

const playerChangeReducer = function(state=initialPlayerState(), action){
    const playerList = _.cloneDeep(state.players.playerList)
    const turn_stack = _.cloneDeep(state.players.turn_stack)
    switch(action.type){
        case 'PLAYER_CHANGE/ADD':
            playerList.splice(action.player.table_position, 0, action.player)
            return {...state, players: {playerList: playerList}}
        case 'PLAYER_CHANGE/REMOVE':
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