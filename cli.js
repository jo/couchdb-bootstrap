#!/usr/bin/env node
var minimist = require('minimist')
var bootstrap = require('./')

var options = minimist(process.argv.slice(2), {
  boolean: ['multipart', 'watch'],
  string: ['concurrency', 'mapDbName']
})

if (!options._.length) {
  console.log('Usage: \ncouchdb-bootstrap URL [SOURCE] [OPTIONS]')
  process.exit()
}

var url = options._[0]
var source = options._[1] || process.cwd()

if (options.mapDbName) {
  options.mapDbName = JSON.parse(options.mapDbName)
}

bootstrap(url, source, options, function (error, response) {
  if (error) return console.error(error)

  console.log(JSON.stringify(response, null, '  '))
})
