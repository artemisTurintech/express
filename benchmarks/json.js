'use strict'

const express = require('..')

const app = express()

app.get('/', function (req, res) {
  res.json({
    message: 'Hello World',
    timestamp: Date.now(),
    items: [
      { id: 1, name: 'Item 1', active: true },
      { id: 2, name: 'Item 2', active: false },
      { id: 3, name: 'Item 3', active: true }
    ]
  })
})

module.exports = app
