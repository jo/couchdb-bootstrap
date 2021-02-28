const exec = require('child_process').exec
const test = require('tap').test
const helper = require('./helper')

test('cli with directory', function (t) {
  const dbName = 'test-cli-bootstrap'
  const mapDbName = JSON.stringify({ 'test-couchdb-bootstrap': dbName })
  const cmd = ['./cli.js', helper.url, helper.source, '--mapDbName=\'' + mapDbName + '\'']
  exec(cmd.join(' '), function (err, stdout) {
    t.error(err)
    const j = JSON.parse(stdout)
    t.ok(!!j.push[dbName])
    t.end()
  })
})

test('cli with js file', function (t) {
  const dbName = 'test-cli-bootstrap'
  const mapDbName = JSON.stringify({ 'test-couchdb-bootstrap': dbName })
  const cmd = ['./cli.js', helper.url, './test/fixtures/bootstrap.js', '--mapDbName=\'' + mapDbName + '\'']
  exec(cmd.join(' '), function (err, stdout) {
    t.error(err)
    const j = JSON.parse(stdout)
    t.ok(!!j.push[dbName])
    t.end()
  })
})
