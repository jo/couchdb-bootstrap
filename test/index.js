var test = require('tape')
var nano = require('nano')
var path = require('path')
var bootstrap = require('..')

var url = process.env.COUCH || 'http://localhost:5984'

var source = path.join(__dirname, 'fixtures')
var couch = nano(url)

function cleanup(callback) {
  callback()
}


test('basics', function(t) {
  cleanup(function() {
    bootstrap(url, source, function(error, response) {
      t.equal(error, null)

      console.log(response)

      t.end()
    })
  })
})
