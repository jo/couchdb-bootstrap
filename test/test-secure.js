var test = require('tap').test
var helper = require('./helper')
var secure = require('../lib/secure')

function setup (callback) {
  helper.setup(helper.createDatabases.bind(this, callback))
}

test('setup database securities', function (t) {
  setup(function (error) {
    t.error(error)

    secure(helper.couch, helper.source, {}, function (error, responses) {
      t.error(error)

      helper.dbnames.forEach(function (dbname) {
        t.ok(responses[dbname].ok, 'response is ok')
      })

      t.end()
    })
  })
})
