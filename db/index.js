const { Pool } = require('pg')

const pool = new Pool({
    user: 'postgres',
    password: 'postgres',
    host: '192.168.1.156',
    database: 'risk'
})

module.exports = {
    query: (text, params) => pool.query(text, params)
}
