var test = require('tap').test
var utils = require('../lib/utils')

test('group by database', function (t) {
  utils.groupByDatabase('foo', function (error, result) {
    t.error(error)
    t.ok(result.foo === 'bar', 'result is ok')
    t.end()
  })(null, 'bar')
})

test('group by database proxies error', function (t) {
  utils.groupByDatabase('foo', function (error, result) {
    t.ok(error)
    t.end()
  })(new Error('boom'))
})
