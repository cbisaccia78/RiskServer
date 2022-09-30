const { assign } = require('lodash')
const _ = require('lodash')
const openSeats = require('../utils/utils').openSeats

const initialPlayerState = function(){

    return {
        playerList: [null,null,null,null,null,null],
        turn_stack: []
    }//6 players,
    
}

const insertTurn = function(turn_stack, assignedSeat){
    
    

    let l = turn_stack.length
    const turnstack = _.cloneDeep(turn_stack)
    
    if(l == 0 || l == 1){
        turnstack.push(assignedSeat)
        return turnstack
    }

    var last = turnstack[0]
    
    var curr = turnstack[1]

    //3->[2,4]
    //1->[2,4]
    //5->[2,4]
    //3->[4,2]
    //1->[4,2]
    //5->[4,2]
    if(l == 2){
        if(last < curr){
            if(assignedSeat > last && assignedSeat < curr){ 
                turnstack.splice(1, 0, assignedSeat)
            }else{
                turnstack.push(assignedSeat)
            }
        }else{
            if(assignedSeat < last && assignedSeat > curr){
                turnstack.push(assignedSeat)
            }else{
                turnstack.splice(1, 0, assignedSeat)
            }
        }
        return turnstack
    }

    var i = 1
    last = turnstack[0]

    //[2,3,1] insert 6
    //[5,6,2,4] insert 3
    //[4,1,2] insert 3
    //[4,5,6] insert 1
    //[4,5,6,1] insert 2'
    //debugger
    var modulated = false //did we go backwards in order ie) 6->1
    while(i < l){ //l is at least 3
        curr = turnstack[i]
        modulated = curr < last
        if(!modulated){//still going up
            if(assignedSeat > last){
                if(assignedSeat < curr){//in between
                    turnstack.splice(i, 0, assignedSeat)
                    return turnstack
                }//else its greater than both, in which case need to increment
            }//else we havent found the right position because we haven't modulated
        }else{ //went backwards
            if(assignedSeat < curr || assignedSeat > last){
                turnstack.splice(i, 0, assignedSeat)
                return turnstack
            }
        }
        last = curr
        i++
    }

    turnstack.push(assignedSeat)
    return turnstack

}

const deleteTurn = function(turn_stack, assignedSeat){
    const turnstack = _.cloneDeep(turn_stack)
    return turnstack.filter((position) => assignedSeat != position)
}

const playerChangeReducer = function(state=initialPlayerState(), action){
    const playerList = _.cloneDeep(state.players.playerList)
    const turn_stack = _.cloneDeep(state.players.turn_stack)
    switch(action.type){
        case 'PLAYER_CHANGE/ADD':
            const player = _.cloneDeep(action.player)
            const openSeats = openSeats(turn_stack)
            const assignedSeat = openSeats[Math.floor(Math.random()*openSeats.length)]
            player.table_position = assignedSeat
            playerList.splice(assignedSeat, 0, player)
            return {playerList: playerList, turn_stack: insertTurn(turn_stack, assignedSeat)}
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