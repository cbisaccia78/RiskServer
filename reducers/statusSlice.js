
const statusReducer = function(state="UNINITIALIZED", action){
    switch(action.type){
        case 'STATUS/SET':
            return action.status
        default:
            return state
    }
}


module.exports = statusReducer