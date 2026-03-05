'use strict'

const express = require('..')

const app = express()

app.get('/', function (req, res) {
  res.send('Hello World')
})

module.exports = app
