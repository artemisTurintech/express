'use strict'

const autocannon = require('autocannon')
const http = require('http')
const path = require('path')

const DURATION = 2 // seconds per benchmark
const CONNECTIONS = 100
const PIPELINING = 10

const benchmarks = [
  {
    name: 'Hello World (text)',
    module: './hello',
    method: 'GET',
    path: '/'
  },
  {
    name: 'JSON response',
    module: './json',
    method: 'GET',
    path: '/'
  },
  {
    name: 'Middleware chain (20 deep)',
    module: './middleware',
    method: 'GET',
    path: '/'
  },
  {
    name: 'Routing (50 routes + params)',
    module: './routing',
    method: 'GET',
    path: '/users/42/posts/7'
  },
  {
    name: 'Body parsing (JSON POST)',
    module: './parsing',
    method: 'POST',
    path: '/',
    body: JSON.stringify({ username: 'bench', email: 'bench@test.com', age: 30 }),
    headers: { 'Content-Type': 'application/json' }
  }
]

function formatNumber (n) {
  return n.toLocaleString('en-US')
}

function runBenchmark (bench) {
  return new Promise(function (resolve, reject) {
    const mod = require(bench.module)
    const app = mod.app || mod

    const server = http.createServer(app)
    server.listen(0, function () {
      const port = server.address().port
      const url = 'http://localhost:' + port + bench.path

      const opts = {
        url: url,
        connections: CONNECTIONS,
        pipelining: PIPELINING,
        duration: DURATION,
        method: bench.method
      }

      if (bench.body) opts.body = bench.body
      if (bench.headers) opts.headers = bench.headers

      autocannon(opts, function (err, result) {
        server.close()
        if (err) return reject(err)
        resolve(result)
      })
    })
  })
}

function pad (str, len) {
  str = String(str)
  while (str.length < len) str += ' '
  return str
}

function printResult (name, result) {
  const req = result.requests
  const lat = result.latency
  const tp = result.throughput

  console.log('  ' + name)
  console.log('    Req/sec  : avg ' + pad(formatNumber(Math.round(req.average)), 10) +
    ' min ' + pad(formatNumber(Math.round(req.min)), 10) +
    ' max ' + formatNumber(Math.round(req.max)))
  console.log('    Latency  : avg ' + pad(lat.average.toFixed(2) + 'ms', 10) +
    ' min ' + pad(lat.min + 'ms', 10) +
    ' max ' + lat.max + 'ms')
  console.log('    Bytes/sec: avg ' + formatNumber(Math.round(tp.average)))
  console.log()
}

async function main () {
  console.log()
  console.log('  Express.js v%s Benchmark Suite', require('../package.json').version)
  console.log('  Node.js %s | %s %s', process.version, process.platform, process.arch)
  console.log('  %d connections | %d pipelining | %ds duration', CONNECTIONS, PIPELINING, DURATION)
  console.log('  ' + '='.repeat(58))
  console.log()

  const summary = []

  for (const bench of benchmarks) {
    process.stdout.write('  Running: ' + bench.name + '...\r')
    const result = await runBenchmark(bench)
    printResult(bench.name, result)
    summary.push({ name: bench.name, rps: Math.round(result.requests.average) })
  }

  console.log('  ' + '='.repeat(58))
  console.log('  Summary (avg req/sec):')
  console.log()
  for (const s of summary) {
    console.log('    ' + pad(s.name, 38) + ' ' + formatNumber(s.rps) + ' req/sec')
  }
  console.log()
}

main().catch(function (err) {
  console.error(err)
  process.exit(1)
})
