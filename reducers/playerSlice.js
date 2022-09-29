const _ = require('lodash')


const initialPlayerState = function(){

    return {
        playerList: [null,null,null,null,null,null],
        turn_stack: []
    }//6 players,
    
}

const playerChangeReducer = function(state=initialPlayerState(), action){
    const playerList = _.cloneDeep(state.players.playerList)
    const turn_stack = _.cloneDeep(state.players.turn_stack)
    switch(action.type){
        case 'PLAYER_CHANGE/ADD':
            playerList.splice(action.player.table_position, 0, action.player)
            return {playerList: playerList, turn_stack: turn_stack}
        case 'PLAYER_CHANGE/REMOVE':
            playerList.splice(action.player.table_position, 1)
            return {playerList: playerList, turn_stack: turn_stack}
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