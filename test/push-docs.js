var test = require('tape')
var nano = require('nano')
var path = require('path')
var pushDocs = require('../lib/push-docs')

var url = process.env.COUCH || 'http://localhost:5984'

var source = path.join(__dirname, 'fixtures')
var couch = nano(url)

var ids = [
  '_design/myapp',
  '_local/localdoc',
  'mydoc-id'
]

test('basics', function(t) {
  pushDocs(url, source, {}, function(error, responses) {
    t.notOk(error, 'no error occured')
    t.equal(responses.length, 3)
    responses.forEach(function(response) {
      t.ok(response.ok, 'response is ok')
      t.ok(ids.indexOf(response.id) > -1, response.id + ' has been pushed')
    })

    t.end()
  })
})
