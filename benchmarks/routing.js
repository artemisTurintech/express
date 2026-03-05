'use strict'

const express = require('..')

const app = express()

const ROUTE_COUNT = 50

for (let i = 0; i < ROUTE_COUNT; i++) {
  app.get('/route-' + i, function (req, res) {
    res.send('Route ' + i)
  })
}

app.get('/users/:userId/posts/:postId', function (req, res) {
  res.json({ userId: req.params.userId, postId: req.params.postId })
})

module.exports = { app, targetUrl: '/users/42/posts/7' }
