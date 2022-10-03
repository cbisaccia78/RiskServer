const users = require('./user')
const games = require('./game')
const login = require("./login")
const register = require("./register")

module.exports = app => {
    app.use('/users', users)
    app.use('/games', games)
    app.use('/login', login)
    app.use('/register', register)
}
