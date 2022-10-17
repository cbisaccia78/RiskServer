const _ = require('lodash')
const utils = require('../utils/utils')


const initialPlayerState = {
    playerList: [null,null,null,null,null,null],
    turn_stack: []
}//6 players,
    


const statusReducer = function(state="UNINITIALIZED", action){
    switch(action.type){
        case 'STATUS/SET':
            return action.status
        default:
            return state
    }
}


module.exports = statusReducer