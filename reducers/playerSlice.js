const _ = require('lodash')
const utils = require('../utils/utils')


const initialPlayerState = {
    playerList: [null,null,null,null,null,null],
    turn_stack: []
}//6 players,
    


const playerChangeReducer = function(state=initialPlayerState, action){
    const playerList = _.cloneDeep(state.playerList)
    const turn_stack = _.cloneDeep(state.turn_stack)
    let player;
    switch(action.type){
        case 'PLAYER_CHANGE/ADD':
            player = _.cloneDeep(action.player)
            //console.log('player' + JSON.stringify(player));
            var assignedSeat = player.table_position
            if(turn_stack.includes(assignedSeat)){
                const open = utils.openSeats(turn_stack)
                assignedSeat = open[Math.floor(Math.random()*open.length)]
                player.table_position = assignedSeat
            }
            playerList[assignedSeat-1] = player
            return {playerList: playerList, turn_stack: utils.insertTurn(turn_stack, assignedSeat)}
        case 'PLAYER_CHANGE/REMOVE':
            const pos = action.player.table_position
            playerList.splice(pos-1, 1, null)
            return {playerList: playerList, turn_stack: utils.deleteTurn(turn_stack, pos)}
        case 'PLAYER_CHANGE/INITIALIZE':
            const numInfantry = 40 - (action.table_size - 2)*5
            player = {...action.player, army: {INFANTRY: numInfantry, CAVALRY: 0, ARTILLERY: 0}}
            playerList[player.table_position-1] = player
            return {...state, playerList: playerList}
        case 'TURN_CHANGE':
            return {...state, turn_stack: action.turn_stack}
        default:
            return state
    }
}


module.exports = playerChangeReducer