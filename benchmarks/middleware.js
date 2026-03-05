'use strict'

const express = require('..')

const app = express()

const MIDDLEWARE_COUNT = 20

for (let i = 0; i < MIDDLEWARE_COUNT; i++) {
  app.use(function (req, res, next) {
    next()
  })
}

app.get('/', function (req, res) {
  res.send('Hello from middleware chain')
})

module.exports = app
