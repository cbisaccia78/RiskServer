const playerChangeReducer = function(state, action){
    switch(action.type){
        case 'PLAYER_CHANGE/ADD':
            return {...state, players: }
        case 'PLAYER_CHANGE/REMOVE':
            return {...state, players: }
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