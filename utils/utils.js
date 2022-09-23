
const RangeList = function(start, end){
    ret = []
    for(i = start; i <= end; i++){
        ret.push(i)
    }
    return ret
}

const gameURLParse = function(url){
    ret = 
    broken = url.split("/")
    
    if(broken[0] != "gamesession" || broken.length != 3) return null
    return {
        game_id: broken[1],
        user_id: broken[2]
    }
}
module.exports = { RangeList, gameURLParse }