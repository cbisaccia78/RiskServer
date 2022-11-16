const _ = require('lodash')
const utils = require('../utils/utils')


const initialPlayerState = {
    playerList: [null,null,null,null,null,null],
    turn_stack: [], 
    available_colors: ["blue", "red", "orange", "yellow", "green", "black"],
    available_territories: ['eastern_australia', 'indonesia', 'new_guinea', 'alaska', 'ontario', 'northwest_territory', 'venezuela', 'madagascar', 'north_africa', 'greenland', 'iceland', 'great_britain', 'scandinavia', 'japan', 'yakursk', 'kamchatka', 'siberia', 'ural', 'afghanistan', 'middle_east', 'india', 'siam', 'china', 'mongolia', 'irkutsk', 'ukraine', 'southern_europe', 'western_europe', 'northern_europe', 'egypt', 'east_africa', 'congo', 'south_africa', 'brazil', 'argentina', 'eastern_united_states', 'western_united_states', 'quebec', 'central_america', 'peru', 'western_australia', 'alberta']
}//6 players,
    


const playerChangeReducer = function(state=initialPlayerState, action){
    const playerList = _.cloneDeep(state.playerList)
    const turn_stack = _.cloneDeep(state.turn_stack)
    const available_colors = _.cloneDeep(state.available_colors)
    let player, _player;
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
            return {...state, playerList: playerList, turn_stack: utils.insertTurn(turn_stack, assignedSeat), available_colors: available_colors}
        case 'PLAYER_CHANGE/REMOVE':
            const pos = action.player.table_position
            playerList[pos-1] = null
            available_colors.push(action.player.color)
            return {...state, playerList: playerList, turn_stack: utils.deleteTurn(turn_stack, pos), available_colors: available_colors}
        case 'PLAYER_CHANGE/INITIALIZE':
            const numInfantry = 40 - (action.table_size - 2)*5
            player = {...action.player, army: numInfantry, territories: new Map()}
            playerList[player.table_position-1] = player
            return {...state, playerList: playerList}
        case 'PLAYER_CHANGE/FORTIFY':
            return {...state}
        case 'PLAYER_CHANGE/REDEEM':
            return {...state}
        case 'PLAYER_CHANGE/ATTACK':
            return {...state}
        case 'PLAYER_CHANGE/PLACE_ARMIES':{
            //gameState.status == "INITIAL_ARMY_PLACEMENT" && gameState.players.playerList[gameState.players.turn_stack[0]].territories.has(lastClicked)
            _player = playerList[turn_stack[0]-1]
            let territories = _.cloneDeep(_player.territories)
            let prev = territories.get(action.territory)
            territories.set(action.territory, prev ? prev + action.count : action.count)
            player = {..._player, army: _player.army - action.count, territories: territories}
            playerList[player.table_position-1] = player
            return {...state, playerList: playerList}}
        case 'PLAYER_CHANGE/ELIMINATED':
            return {...state}
        case 'PLAYER_CHANGE/ELIMINATOR':
            return {...state}
        case 'PLAYER_CHANGE/ADD_CARD':
            return {...state}
        case 'PLAYER_CHANGE/SELECT_TERRITORY':
            if(!(state.available_territories.includes(action.territory))){
                return {...state}
            }
            let available_territories = _.cloneDeep(state.available_territories)
            available_territories.splice(available_territories.indexOf(action.territory), 1)
            _player = playerList[turn_stack[0]-1]
            let territories = _.cloneDeep(_player.territories)
            let prev = territories.get(action.territory)
            territories.set(action.territory, prev ? prev + 1 : 1)
            player = {..._player, army: _player.army - 1, territories: territories}
            playerList[player.table_position-1] = player
            return {...state, playerList: playerList, available_territories: available_territories}
        case 'PLAYER_CHANGE/CONQUER_TERRITORY':
            _player = playerList[turn_stack[0]-1]
            player = {..._player, army: _player.army - action.count, territories: _player.territories.concat(action.territory)}
            playerList[player.table_position-1] = player
            return {...state, playerList: playerList}
        case 'NOOP':
        case 'TURN_CHANGE':
            let _next = turn_stack.shift()
            turn_stack.push(_next)
            return {...state, turn_stack: turn_stack}
        default:
            return state
    }
}


module.exports = playerChangeReducer