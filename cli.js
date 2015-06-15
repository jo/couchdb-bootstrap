#!/usr/bin/env node
var minimist = require('minimist')
var bootstrap = require('./')

var options = minimist(process.argv.slice(2), {
  boolean: ['index', 'multipart'],
  string: 'concurrency'
})

if (!options._.length) {
  return console.log('Usage: \ncouchdb-bootstrap URL [SOURCE] [OPTIONS]')
}

var url = options._[0]
var source = options._[1] || process.cwd()

bootstrap(url, source, options, function(error, response) {
  if (error) return console.error(error)

  console.log(JSON.stringify(response, null, '  '))
})
