var test = require('tape')
var helper = require('./helper')
var configureDatabases = require('../lib/configure-databases')

function setup(callback) {
  helper.setup(helper.createDatabases.bind(this, callback))
}

test('configure databases', function(t) {
  setup(function() {
    configureDatabases(helper.url, helper.source, {}, function(error, responses) {
      t.notOk(error, 'no error occured')

      helper.dbnames.forEach(function(dbname) {
        t.ok(responses[dbname].ok, 'response is ok')
      })

      t.end()
    })
  })
})
