const _ = require('lodash')
const {v4: uuidv4} = require('uuid')

const RangeList = function(start, end){
    ret = []
    for(i = start; i <= end; i++){
        ret.push(i)
    }
    return ret
}

const sleep = function(ms){
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}

const gameURLParse = function(url){
    const broken = url.split("/")
    
    if(broken[1] != "gamesession" || broken.length != 4) return null
    return {
        game_id: broken[2],
        user_id: broken[3]
    }
}

const randomObjectValue= function(object){
    const vals = Object.values(object) 
    return vals[Math.floor(Math.random()*vals.length)]
}

const openSeats = function(turnStack){
    const openSeats = RangeList(1,6)
    if(turnStack === []){
        return openSeats
    }
    for(var i = 0; i < 6; i++){
        if(turnStack.includes(i+1)){
            openSeats.splice(i, 1)
        }
    }
    return openSeats

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
    return turn_stack.filter((position) => assignedSeat != position)
}

const FWT = function(){
    return uuidv4()
}

module.exports = { RangeList, gameURLParse, randomObjectValue, openSeats, insertTurn, deleteTurn, FWT, sleep}