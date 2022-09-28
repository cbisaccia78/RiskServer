const _ = require('lodash')

const playerChangeReducer = function(state, action){
    switch(action.type){
        case 'PLAYER_CHANGE/ADD':
            newplayers = _.cloneDeep(state.players)
            newplayers.splice(action.player.table_position, 0, action.player)
            return {...state, players: newplayers}
        case 'PLAYER_CHANGE/REMOVE':
            newplayers = _.cloneDeep(state.players)
            newplayers.splice(action.player.table_position, 1)
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