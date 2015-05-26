var test = require('tape')
var helper = require('./helper')
var createDatabases = require('../lib/create-databases')

test('create databases', function(t) {
  helper.setup(function() {
    createDatabases(helper.url, helper.source, {}, function(error, responses) {
      t.notOk(error, 'no error occured')

      helper.dbnames.forEach(function(dbname) {
        t.ok(responses[dbname].ok, 'response is ok')
      })

      t.end()
    })
  })
})
