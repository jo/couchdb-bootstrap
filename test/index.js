var test = require('tape')
var nano = require('nano')
var path = require('path')
var bootstrap = require('..')

var url = process.env.COUCH || 'http://localhost:5984'

var source = path.join(__dirname, 'fixtures')
var couch = nano(url)

test('basics', function(t) {
  bootstrap(url, source, function(error, response) {
    t.notOk(error, 'no error occured')

    t.end()
  })
})
