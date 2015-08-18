var test = require('tape')
var helper = require('./helper')
var push = require('../lib/push')

test('push docs', function(t) {
  helper.setup(function(error) {
    t.error(error, 'no error occured')

    push(helper.couch, helper.source, {}, function(error, response) {
      t.error(error, 'no error occured')

      Object.keys(helper.docs).forEach(function(db) {
        t.ok(db in response, db + ' included')

        var responses = response[db]
        var docs = helper.docs[db]

        t.equal(responses.length, docs.length, 'correct # of docs pushed')

        responses.forEach(function(r) {
          t.ok(r.ok, 'response is ok')
          t.ok(docs.indexOf(r.id) > -1, db + '/' + r.id + ' has been pushed')
        })
      })

      t.end()
    })
  })
})
