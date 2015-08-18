var test = require('tape')
var helper = require('./helper')
var configure = require('../lib/configure')

test('configure', function(t) {
  helper.clearConfig(function(error) {
    t.error(error, 'no error occured')

    configure(helper.couch, helper.source, {}, function(error, responses) {
      t.error(error, 'no error occured')

      helper.couch.request({
        path: '_config/couchdb-bootstrap/foo'
      }, function(error, config) {
        t.equal(config, 'bar')
        t.end()
      })
    })
  })
})
