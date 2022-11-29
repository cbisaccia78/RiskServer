const { configureStore, combineReducers} = require("@reduxjs/toolkit")
const deckReducer = require("./reducers/deckSlice")
const playerChangeReducer = require("./reducers/playerSlice")
const statusReducer = require("./reducers/statusSlice")
const {Continents, ContinentCount} = require("./utils/Continents")
const _ = require("lodash")


const reducer = combineReducers({
    players: playerChangeReducer,
    deck: deckReducer,
    status: statusReducer
})


const Game = function(id){
    this._init(id)
}

Game.prototype = {
    /*
        ************
        *  PRIVATE  *
        ************
    */
    _store : null, //redux store
    _init : function(id){
        this.id = id
        this._store = configureStore({
            reducer
        })
        this._unsubscribe = this._store.subscribe(()=>{
            let _state = this._store.getState()
            //console.log('State after dispatch: ', _state)
            let players = this.getPlayers()
            /*if(_state.status == "INITIAL_ARMY_PLACEMENT" && _state.players.available_territories.length == 0 && players.every(player=>player.army == 0)){
                this.queuedMessages.push({type: 'STATUS/SET', status: 'POST_SETUP'})
                this._store.dispatch({type: 'STATUS/SET', status: 'POST_SETUP'})
                let newCount = this.getFortifyCount(this.peekFront())
                this.queuedMessages.push({type: "ACTION", action:{type:"PLAYER_CHANGE/DRAFT_TROOPS", count: newCount}})
                this._store.dispatch({type:"PLAYER_CHANGE/DRAFT_TROOPS", count: newCount})
            }else */if(_state.status == 'POST_SETUP'){
                //check win con
                var winner = false, playerWinner = null
                this.getPlayers().forEach(player=>{
                    if(this.winCon(player)){
                        winner = true
                        playerWinner = player
                    }
                })
                if(winner){
                    this.queuedMessages.push({type: "STATUS/SET", status: "GAME_OVER", winner: playerWinner})
                    this._store.dispatch({type: "STATUS/SET", status: "GAME_OVER", winner: playerWinner})
                }
            }
        })
    },
    _unsubscribe : null,
    /*
        ************
        *  PUBLIC  *
        ************
    */
    id: null,
    queuedMessages: [],
    addPlayer : function(player){
        this._store.dispatch({
            type: "PLAYER_CHANGE/ADD",
            player: player
        })
    },
    removePlayer : function(player){
        this._store.dispatch({
            type: "PLAYER_CHANGE/REMOVE",
            player: player
        })
    },
    winCon : function(player){
        let restOfWorld = _.cloneDeep(Continents)
        switch(player.secretMission){
            case "capture Europe, Australia and one other continent":
                return Continents.Europe.reduce((prev, curr)=>prev && player.territories[curr] != undefined, true) &&
                        Continents.Australia.reduce((prev, curr)=>prev && player.territories[curr] != undefined, true) &&
                        Object.values(restOfWorld).some(continent=>continent.reduce((prev, curr)=>prev && player.territories[curr] != undefined, true))
            case "capture Europe, South America and one other continent":
                return Continents.Europe.reduce((prev, curr)=>prev && player.territories[curr] != undefined, true) &&
                        Continents.SouthAmerica.reduce((prev, curr)=>prev && player.territories[curr] != undefined, true) &&
                        Object.values(restOfWorld).some(continent=>continent.reduce((prev, curr)=>prev && player.territories[curr] != undefined, true))
            case "capture North America and Africa":
                return Continents.NorthAmerica.reduce((prev, curr)=>prev && player.territories[curr] != undefined, true) &&
                Continents.Africa.reduce((prev, curr)=>prev && player.territories[curr] != undefined, true) 
            case "capture Asia and South America":
                return Continents.Asia.reduce((prev, curr)=>prev && player.territories[curr] != undefined, true) &&
                Continents.SouthAmerica.reduce((prev, curr)=>prev && player.territories[curr] != undefined, true) 
            case "capture North America and Australia":
                return Continents.NorthAmerica.reduce((prev, curr)=>prev && player.territories[curr] != undefined, true) &&
                Continents.Australia.reduce((prev, curr)=>prev && player.territories[curr] != undefined, true) 
            case "capture 24 territories":
                return Object.keys(player.territories).length >= 24
            case "destroy all armies of a named opponent or, in the case of being the named player oneself, to capture 24 territories":
                return
            case "capture 18 territories and occupy each with two troops":
                player.territories.values().reduce((prev, curr)=>prev + curr > 2 ? 1 : 0, 0)
            default:
                return false
        }
        
    },
    isEmpty : function(){
        return this.getNumPlayers() == 0
    },
    isFull : function(){
        return this.getNumPlayers() == 6
    },
    getTurnStack : function(){
        return this.getState().players.turn_stack
    },
    getPlayers : function(){
        return this.getState().players.playerList.filter(player=>player != null)
    },
    getNumPlayers : function(){
        return this.getPlayers().length
    },
    getFortifyCount : function(player){
        const min = Math.floor(Object.keys(player.territories).length / 3) 
        const base = min > 3 ? min : 3
        var extraCountries = 0
        Object.entries(Continents).forEach(keyVal=>{
            let [continent, territories] = [...keyVal]
            extraCountries += territories.reduce((prev, curr)=>prev && player.territories[curr] != undefined, true) ? ContinentCount[continent] : 0 
        })
        return base + extraCountries
    },
    getRedemption : function(){
        let c = this.getRedeemCount()
        return c > 6 ? 15 + (c-6)*5 : 4 + c*2
    },
    handleAction : function(action){
        let status = this.getStatus()
        this._store.dispatch({...action, gameStatus: status})
        switch(action.type){
            case "PLAYER_CHANGE/SELECT_TERRITORY":
                this._store.dispatch({type: "TURN_CHANGE"})
                this.queuedMessages.push({type: "ACTION", action: {type: "TURN_CHANGE"}})
                break
            case "PLAYER_CHANGE/PLACE_ARMIES":
                if(status == "INITIAL_ARMY_PLACEMENT"){
                    this._store.dispatch({type: "TURN_CHANGE"})
                    this.queuedMessages.push({type: "ACTION", action: {type: "TURN_CHANGE"}})
                    let _state = this._store.getState()
                    //console.log('State after dispatch: ', _state)
                    let players = this.getPlayers()
                    if(_state.players.available_territories.length == 0 && players.every(player=>player.army == 0)){
                        this.queuedMessages.push({type: 'STATUS/SET', status: 'POST_SETUP'})
                        this._store.dispatch({type: 'STATUS/SET', status: 'POST_SETUP'})
                        let newCount = this.getFortifyCount(this.peekFront())
                        this.queuedMessages.push({type: "ACTION", action:{type:"PLAYER_CHANGE/DRAFT_TROOPS", count: newCount}})
                        this._store.dispatch({type:"PLAYER_CHANGE/DRAFT_TROOPS", count: newCount})
                    }
                }
                break
            case "PLAYER_CHANGE/ATTACK":
                if(status == "POST_SETUP"){
                    let enemy = this.getPlayerByPosition(action.enemy.table_position)
                    let player = this.peekFront()
                    let toCount = enemy.territories[action.toTerritory] 
                    let fromCount = player.territories[action.fromTerritory]
                    this.queuedMessages.push({type: "ACTION", action: {...action, fromCount: fromCount, toCount: toCount}})
                    if(!toCount){
                        this.queuedMessages.push({type: "UI/CONQUER_TERRITORY",  player: player.table_position, enemy: action.enemy, fromTerritory: action.fromTerritory, toTerritory: action.toTerritory})
                    }
                }
            case "TURN_CHANGE":
                if(status == "POST_SETUP"){
                    let newCount = this.getFortifyCount(this.peekFront())
                    this.queuedMessages.push({type: "ACTION", action:{type:"PLAYER_CHANGE/DRAFT_TROOPS", count: newCount}})
                    this._store.dispatch({type:"PLAYER_CHANGE/DRAFT_TROOPS", count: newCount})
                }
            default:
                break
        }
    },
    initialize : function(){
        console.log("started");
        let p = this.getPlayers();

        p.forEach(function(player){
            this._store.dispatch({//
                type: "PLAYER_CHANGE/INITIALIZE",
                player: player,
                table_size: this.getTurnStack().length
            })
        }.bind(this))
        this._store.dispatch({type: "STATUS/SET", status: "INITIAL_ARMY_PLACEMENT"})
    },
    getId : function(){
        return this.id
    },
    getState : function(){
        return this._store.getState()
    },
    getStatus : function(){
        return this._store.getState().status
    },
    getPlayer : function(id){
        //console.log(JSON.stringify(this.getPlayers()));
        const players = this.getPlayers().filter((player)=>player && player.id==id)
        if(players.length == 1){
            return players[0]
        }
        return null
    },
    getPlayerByPosition: function(pos){
        const players = this.getPlayers().filter(player=>{return player && player.table_position==pos})
        if(players.length !=1){
            throw new Error("No Player found")
        }
        return players[0]
    },
    getPlayerPosition: function(id){
        const players = this.getPlayers().filter((player)=>player != null)
        //console.log(players);
        const player = players.filter((player) => player.name == playerName)
        if(player.length != 1){
            throw new Error("No Player found")
        }
        return this.getPlayer(id)?.table_position
    },
    peekFront : function(){
        let ts = this.getTurnStack()
        return ts.length ? this.getPlayers()[ts[0] - 1] : null
    },
}

module.exports = Game