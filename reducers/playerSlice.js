const _ = require('lodash')
const utils = require('../utils/utils')


const initialPlayerState = {
    playerList: [null,null,null,null,null,null],
    turn_stack: [], 
    available_colors: ["blue", "red", "orange", "yellow", "green", "black"]
}//6 players,
    


const playerChangeReducer = function(state=initialPlayerState, action){
    const playerList = _.cloneDeep(state.playerList)
    const turn_stack = _.cloneDeep(state.turn_stack)
    const available_colors = _.cloneDeep(state.available_colors)
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
            available_colors.splice(available_colors.indexOf(player.color), 1)
            return {playerList: playerList, turn_stack: utils.insertTurn(turn_stack, assignedSeat), available_colors: available_colors}
        case 'PLAYER_CHANGE/REMOVE':
            const pos = action.player.table_position
            playerList[pos-1] = null
            available_colors.push(action.player.color)
            return {playerList: playerList, turn_stack: utils.deleteTurn(turn_stack, pos), available_colors: available_colors}
        case 'PLAYER_CHANGE/INITIALIZE':
            const numInfantry = 40 - (action.table_size - 2)*5
            player = {...action.player, army: {INFANTRY: numInfantry, CAVALRY: 0, ARTILLERY: 0}}
            playerList[player.table_position-1] = player
            return {...state, playerList: playerList}
        case 'TURN_CHANGE':
            return {...state, turn_stack: action.turn_stack}
        case 'NOOP':
            return state
        default:
            return state
    }
}


module.exports = playerChangeReducer