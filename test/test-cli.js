var exec = require('child_process').exec
var test = require('tap').test
var helper = require('./helper')

test('cli with directory', function (t) {
  var dbName = 'test-cli-bootstrap'
  var mapDbName = JSON.stringify({'test-couchdb-bootstrap': dbName})
  var cmd = ['./cli.js', helper.url, helper.source, '--mapDbName=\'' + mapDbName + '\'']
  exec(cmd.join(' '), function (err, stdout) {
    t.error(err)
    var j = JSON.parse(stdout)
    t.ok(!!j.push[dbName])
    t.end()
  })
})

test('cli with js file', function (t) {
  var dbName = 'test-cli-bootstrap'
  var mapDbName = JSON.stringify({'test-couchdb-bootstrap': dbName})
  var cmd = ['./cli.js', helper.url, './test/fixtures/bootstrap.js', '--mapDbName=\'' + mapDbName + '\'']
  exec(cmd.join(' '), function (err, stdout) {
    t.error(err)
    var j = JSON.parse(stdout)
    t.ok(!!j.push[dbName])
    t.end()
  })
})
