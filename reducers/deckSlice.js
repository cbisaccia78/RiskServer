
const initialDeckState = function(){
    return {} //shuffled deck
}


const deckReducer = function(state=initialDeckState(), action){
    switch(action.type){
        case "DECK/SHUFFLE":
            return
        case "DECK/DEAL":
            return
        default:
            return state
    }
}

module.exports = {deckReducer}