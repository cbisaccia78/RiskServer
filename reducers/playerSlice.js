const { assign } = require('lodash')
const _ = require('lodash')
const utils = require('../utils/utils')

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
            const player = _.cloneDeep(action.player)
            const open = utils.openSeats(turn_stack)
            const assignedSeat = open[Math.floor(Math.random()*open.length)]
            player.table_position = assignedSeat
            playerList.splice(assignedSeat, 0, player)
            return {playerList: playerList, turn_stack: utils.insertTurn(turn_stack, assignedSeat)}
        case 'PLAYER_CHANGE/REMOVE':
            const pos = action.player.table_position
            playerList.splice(pos, 1)
            return {playerList: playerList, turn_stack: utils.deleteTurn(turn_stack, pos)}
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