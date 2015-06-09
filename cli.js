#!/usr/bin/env node

var bootstrap = require('./')

var args = process.argv.slice(2);
if (!args.length) {
  return console.log('Usage: \ncouchdb-bootstrap URL [SOURCE]')
}

var url = args[0];
var source = args[1] || process.cwd();

bootstrap(url, source, function(error, response) {
  if (error) return console.error(error)

  console.log(JSON.stringify(response, null, '  '))
})
