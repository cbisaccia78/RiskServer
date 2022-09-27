const users = require('./user')
const games = require('./game')
const login = require("./login")

module.exports = app => {
    app.use('/users', users)
    app.use('/games', games)
    app.use('login', login)
}
