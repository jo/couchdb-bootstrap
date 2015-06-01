var test = require('tape')
var helper = require('./helper')
var pushSecurities = require('../lib/push-securities')

function setup(callback) {
  helper.setup(helper.createDatabases.bind(this, callback))
}

test('setup database securities', function(t) {
  setup(function() {
    pushSecurities(helper.url, helper.source, {}, function(error, responses) {
      t.notOk(error, 'no error occured')

      helper.dbnames.forEach(function(dbname) {
        t.ok(responses[dbname].ok, 'response is ok')
      })

      t.end()
    })
  })
})
