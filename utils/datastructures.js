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

    }

}

module.exports = {DoublyLL}