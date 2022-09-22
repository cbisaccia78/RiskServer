const express = require('express')
const router = express.Router()

const db = require('../db')

router.get('/:id', async (req, res) => {
    const { id } = req.params
    const { rows } = await db.query(`select * from users where id=${id};`)
    res.send(rows[0])
})

module.exports = router