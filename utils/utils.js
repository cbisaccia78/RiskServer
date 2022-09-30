
const RangeList = function(start, end){
    ret = []
    for(i = start; i <= end; i++){
        ret.push(i)
    }
    return ret
}

const gameURLParse = function(url){
    broken = url.split("/")
    
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
    for(var i = 0; i < 6, i++){
        if(turnStack.includes(i+1)){
            openSeats.splice(i, 1)
        }
    }
    return openSeats

}

module.exports = { RangeList, gameURLParse, randomObjectValue, openSeats}