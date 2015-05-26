#!/usr/bin/env node

var bootstrap = require('./')

var url = process.argv[2]
var source = process.argv[3]
var options = require('minimist')(process.argv.slice(4))


bootstrap(url, source, options, console.log.bind(console))
