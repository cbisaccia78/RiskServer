const DoublyLL = function(values=[]){
    this._vals = values
    this._init()
}

DoublyLL.prototype = {
    /*
        ************
        *  PRIVATE  *
        ************
    */
    _pos: 0, //0-indexed
    _vals: [], 
    _init: function(){

    },
    /*
        ************
        *  PUBLIC  *
        ************
    */
    
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

module.exports = {DoublyLL}