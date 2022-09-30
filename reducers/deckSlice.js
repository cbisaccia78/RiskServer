const {TERRITORIES, UNITS, SECRET_MISSIONS} = require("../config")
const randomObjectValue = require("../utils/utils").randomObjectValue


const initialDeckState = function(){
    deck = {territories: [], secret_missions: []}
    /*
    TERRITORIES.foreach((territory)=>{
        deck.territories.push({territory: territory, unit: randomObjectValue(UNITS)})
    })
    deck.territories.push({territory: {WILDCARD: 'wildcard'}})
    deck.territories.push({territory: {WILDCARD: 'wildcard'}})
    SECRET_MISSIONS.foreach((secret_mission)=>{
        deck.secret_missions.push(secret_mission)
    })
    */
    return deck //shuffled deck
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

module.exports = deckReducer