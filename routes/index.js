const users = require('./user')
const games = require('./game')

module.exports = app => {
    app.use('/users', users)
    app.use('/games', games)
}
