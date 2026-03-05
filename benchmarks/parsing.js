'use strict'

const express = require('..')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post('/', function (req, res) {
  res.json({ received: true, bodyKeys: Object.keys(req.body) })
})

module.exports = app
