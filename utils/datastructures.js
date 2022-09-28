const Ring = function(){
    this._init()
}

Ring.prototype = {
    _init : function(){

    },
    forwards : function(){

    },
    backwards : function(){

    }
}

const PlayerRing = function(length=6){
    this.length = length
    this._init()
}

PlayerRing.prototype = {
    /*
        ************
        *  PRIVATE *
        ************
    */
    _pos: null, //0-indexed
    _vals: [], 
    _init: function(){
        this._pos = new Ring(this.length)
    },
    /*
        ************
        *  PUBLIC  *
        ************
    */
    length : 6,
    current : function(){
        return this._vals[this._pos]
    },
    getAt : function(position){
        if(position < 0 || position >= this._vals.length ) return -1
        return this._vals[position]
    },
    next : function(){
        
    },
    back : function(){

    },
    remove : function(item){
        this._vals = this._vals.filter((val) => val != item)
    }
}

module.exports = {PlayerRing}