const _ = require('lodash')
const utils = require('../utils/utils')


const initialPlayerState = {
    playerList: [null,null,null,null,null,null],
    turn_stack: []
}//6 players,
    


const playerChangeReducer = function(state=initialPlayerState, action){
    const playerList = _.cloneDeep(state.playerList)
    const turn_stack = _.cloneDeep(state.turn_stack)
    switch(action.type){
        case 'PLAYER_CHANGE/ADD':
            const player = _.cloneDeep(action.player)
            console.log('player' + player);
            var assignedSeat = player.table_position
            if(turn_stack.includes(player.table_position)){
                const open = utils.openSeats(turn_stack)
                assignedSeat = open[Math.floor(Math.random()*open.length)]
                player.table_position = assignedSeat
            }
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


module.exports = playerChangeReducer