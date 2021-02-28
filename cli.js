#!/usr/bin/env node
const minimist = require('minimist')
const bootstrap = require('./')

const options = minimist(process.argv.slice(2), {
  boolean: ['multipart', 'watch'],
  string: ['concurrency', 'mapDbName']
})

if (!options._.length) {
  console.log('Usage: \ncouchdb-bootstrap URL [SOURCE] [OPTIONS]')
  process.exit()
}

const url = options._[0]
const source = options._[1] || process.cwd()

if (options.mapDbName) {
  options.mapDbName = JSON.parse(options.mapDbName)
}

bootstrap(url, source, options, function (error, response) {
  if (error) {
    process.exitCode = 1
    return console.error(error)
  }

  console.log(JSON.stringify(response, null, '  '))
})
