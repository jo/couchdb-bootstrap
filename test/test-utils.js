var test = require('tape')
var utils = require('../lib/utils')

test('group by database', function(t) {
  utils.groupByDatabase('foo', function(err, result) {
    t.notOk(err, 'no error occured')
    t.ok(result.foo === 'bar', 'result is ok')
    t.end()
  })(null, 'bar')
});

test('group by database proxies error', function(t) {
  utils.groupByDatabase('foo', function(err, result) {
    t.ok(err, 'expected error occured')
    t.end()
  })(new Error('boom'))
});