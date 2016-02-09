var test = require('tap').test
var helper = require('./helper')
var configure = require('../lib/configure')

test('configure', function (t) {
  helper.clearConfig(function (error) {
    t.error(error)

    configure(helper.couch, helper.source, {}, function (error, responses) {
      t.error(error)

      helper.couch.request({
        path: '_config/couchdb-bootstrap/foo'
      }, function (error, config) {
        t.error(error)
        t.equal(config, 'bar')
        t.end()
      })
    })
  })
})

test('configure with trailing slash', function (t) {
  helper.clearConfig(function (error) {
    t.error(error)

    configure(helper.url + '/', helper.source, {}, function (error, responses) {
      t.error(error)

      helper.couch.request({
        path: '_config/couchdb-bootstrap/foo'
      }, function (error, config) {
        t.error(error)
        t.equal(config, 'bar')
        t.end()
      })
    })
  })
})
