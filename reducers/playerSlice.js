const _ = require('lodash')
const utils = require('../utils/utils')


const initialPlayerState = {
    playerList: [null,null,null,null,null,null],
    turn_stack: [], 
    available_colors: ["blue", "red", "orange", "yellow", "green", "black"],
    available_territories: ['eastern_australia', 'indonesia', 'new_guinea', 'alaska', 'ontario', 'northwest_territory', 'venezuela', 'madagascar', 'north_africa', 'greenland', 'iceland', 'great_britain', 'scandinavia', 'japan', 'yakursk', 'kamchatka', 'siberia', 'ural', 'afghanistan', 'middle_east', 'india', 'siam', 'china', 'mongolia', 'irkutsk', 'ukraine', 'southern_europe', 'western_europe', 'northern_europe', 'egypt', 'east_africa', 'congo', 'south_africa', 'brazil', 'argentina', 'eastern_united_states', 'western_united_states', 'quebec', 'central_america', 'peru', 'western_australia', 'alberta'],
    available_secrets: ["capture Europe, Australia and one other continent","capture Europe, South America and one other continent","capture North America and Africa","capture Asia and South America","capture North America and Australia","capture 24 territories","destroy all armies of a named opponent or, in the case of being the named player oneself, to capture 24 territories","capture 18 territories and occupy each with two troops"],
    available_territory_cards: ['eastern_australia', 'indonesia', 'new_guinea', 'alaska', 'ontario', 'northwest_territory', 'venezuela', 'madagascar', 'north_africa', 'greenland', 'iceland', 'great_britain', 'scandinavia', 'japan', 'yakursk', 'kamchatka', 'siberia', 'ural', 'afghanistan', 'middle_east', 'india', 'siam', 'china', 'mongolia', 'irkutsk', 'ukraine', 'southern_europe', 'western_europe', 'northern_europe', 'egypt', 'east_africa', 'congo', 'south_africa', 'brazil', 'argentina', 'eastern_united_states', 'western_united_states', 'quebec', 'central_america', 'peru', 'western_australia', 'alberta', 'wildcard1', 'wildcard2'], 
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
            const available_secrets = _.cloneDeep(state.available_secrets)
            const secretIndex = Math.floor(Math.random()*available_secrets.length)
            player = {...action.player, army: numInfantry, territories: {}, secretMission: available_secrets.splice(secretIndex, 1), territory_cards: new Set()}
            playerList[player.table_position-1] = player
            return {...state, playerList: playerList, available_secrets: available_secrets}
        case 'PLAYER_CHANGE/DRAFT_TROOPS':
            _player = playerList[turn_stack[0]-1]
            player = {..._player, army: _player.army + action.count}
            playerList[player.table_position-1] = player
            return {...state, playerList: playerList}
        case 'PLAYER_CHANGE/REDEEM':
            _player = playerList[turn_stack[0]-1]
            let diff = new Set(action.territory_cards)
            let territory_cards = new Set([..._player.territory_cards].filter(card=>!diff.has(card)))
            player = {..._player, army: _player.army + action.count, territory_cards: territory_cards}
            playerList[player.table_position-1] = player
            return {...state, playerList: playerList}
        case 'PLAYER_CHANGE/ATTACK':{
            _player = playerList[turn_stack[0]-1]
            let territories = _.cloneDeep(_player.territories)
            let prevPlayerCount = territories[action.fromTerritory]

            let _enemy = playerList[action.enemy.table_position-1]
            let enemyTerritories = _.cloneDeep(_enemy.territories)
            let prevEnemyCount = enemyTerritories[action.toTerritory]
            
            let playerRoll = [], enemyRoll = []
            var playerLost = 0, enemyLost = 0
            if(prevPlayerCount >= 3){
                playerRoll.push(Math.floor(Math.random()*6 + 1))
                playerRoll.push(Math.floor(Math.random()*6 + 1))
                playerRoll.push(Math.floor(Math.random()*6 + 1))
            }else if(prevPlayerCount == 2){
                playerRoll.push(Math.floor(Math.random()*6 + 1))
                playerRoll.push(Math.floor(Math.random()*6 + 1))
            }else{
                console.log("Cannot attack with less than 2 troops");
                return {...state}
            }

            if(prevEnemyCount >= 2){
                enemyRoll.push(Math.floor(Math.random()*6 + 1))
                enemyRoll.push(Math.floor(Math.random()*6 + 1))
            }else if(prevEnemyCount == 1){
                enemyRoll.push(Math.floor(Math.random()*6 + 1))
            }else {
                return {...state}
            }

            playerRoll.sort((a,b)=>b-a)
            enemyRoll.sort((a,b)=>b-a)
            
            if(enemyRoll[0] >= playerRoll[0]){
                playerLost++
            }else{
                enemyLost++
            }

            if(prevEnemyCount > 1){
                if(enemyRoll[1] >= playerRoll[1]){
                    playerLost++
                }else{
                    enemyLost++
                }
            }
            
            
            territories[action.fromTerritory] =  prevPlayerCount - playerLost ? prevPlayerCount - playerLost : 1
            player = {..._player, territories: territories}
            playerList[player.table_position-1] = player

            
            
            enemyTerritories[action.toTerritory] = prevEnemyCount - enemyLost
            let enemy = {..._enemy, territories: enemyTerritories}
            playerList[action.enemy.table_position-1] = enemy
            
            return {...state, playerList: playerList}}
        case 'PLAYER_CHANGE/PLACE_ARMIES':{
            //gameState.status == "INITIAL_ARMY_PLACEMENT" && gameState.players.playerList[gameState.players.turn_stack[0]].territories.has(lastClicked)
            _player = playerList[turn_stack[0]-1]
            let territories = _.cloneDeep(_player.territories)
            let prev = territories[action.territory]
            territories[action.territory] = prev ? prev + action.count : action.count
            player = {..._player, army: _player.army - action.count, territories: territories}
            playerList[player.table_position-1] = player
            return {...state, playerList: playerList}}
        case 'PLAYER_CHANGE/FORTIFY':{
            
        }
        case 'PLAYER_CHANGE/ELIMINATED':
            return {...state}
        case 'PLAYER_CHANGE/ELIMINATOR':
            return {...state}
        case 'PLAYER_CHANGE/SELECT_TERRITORY':
            if(!(state.available_territories.includes(action.territory))){
                return {...state}
            }
            let available_territories = _.cloneDeep(state.available_territories)
            available_territories.splice(available_territories.indexOf(action.territory), 1)
            _player = playerList[turn_stack[0]-1]
            let territories = _.cloneDeep(_player.territories)
            let prev = territories[action.territory]
            territories[action.territory] = prev ? prev + 1 : 1
            player = {..._player, army: _player.army - 1, territories: territories}
            playerList[player.table_position-1] = player
            return {...state, playerList: playerList, available_territories: available_territories}
        case 'PLAYER_CHANGE/CONQUER_TERRITORY':{
            _player = playerList[turn_stack[0]-1]
            
            let available_territory_cards = _.cloneDeep(state.available_territory_cards)
            let territory_cards = _.cloneDeep(_player.territory_cards)
            let randIndex = Math.floor(Math.random()*available_territory_cards.length)
            let randCard = available_territory_cards.splice(randIndex, 1)
            territory_cards.push(randCard)
            let territories = _.cloneDeep(_player.territories)
            
            let prevFrom = territories[action.fromTerritory]
            let prevTo = territories[action.toTerritory]
            territories[action.fromTerritory] =  prevFrom - action.count
            territories[action.toTerritory] = prevTo + action.count
            player = {..._player, territories: territories, territory_cards: territory_cards}
            playerList[player.table_position-1] = player

            let _enemy = playerList[action.enemy.table_position-1]
            let enemyTerritories = _.cloneDeep(_enemy.territories)
            delete enemyTerritories[action.toTerritory]
            let enemy = {..._enemy, territories: enemyTerritories}
            playerList[action.enemy.table_position-1] = enemy

            return {...state, playerList: playerList, available_territory_cards: available_territory_cards}}
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