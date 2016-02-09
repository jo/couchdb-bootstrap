var test = require('tap').test
var helper = require('./helper')
var bootstrap = require('..')

test('options.mapDbName is object', function (t) {
  bootstrap(helper.url, helper.source, {
    mapDbName: {
      'test-couchdb-bootstrap': 'custom-db-name'
    }
  }, function (error, response) {
    t.error(error)
    t.ok(response.secure['custom-db-name'].ok, 'creates security in db with custom name')
    t.ok(response.push['custom-db-name'], 'pushes docs to db with custom name')
    t.end()
  })
})

test('options.mapDbName is function', function (t) {
  bootstrap(helper.url, helper.source, {
    mapDbName: function (name) { return name.replace('test', 'foobar') }
  }, function (error, response) {
    t.error(error)
    t.ok(response.secure['foobar-couchdb-bootstrap'], 'creates security in db with custom name')
    t.ok(response.push['foobar-couchdb-bootstrap'], 'pushes docs to db with custom name')
    t.end()
  })
})
