const async = require('async')
const test = require('tap').test
const helper = require('./helper')
const bootstrap = require('..')
const config = require('./fixtures/bootstrap')

function check (t, response, done) {
  t.test('configure', s => {
    s.ok('configure' in response, 'configure response')

    s.same(response.configure, {
      'couchdb-bootstrap/foo': {
        ok: true,
        value: 'bar'
      }
    }, 'correct response')

    helper.getConfigPath((error, configPaths) => {
      s.error(error)
      const tasks = configPaths.map((configPath) => {
        return helper.couch.request.bind(null, {
          path: `${configPath}/couchdb-bootstrap/foo`
        })
      })
      async.series(tasks, function (error, configs) {
        const config = configs[0][0]
        s.error(error)
        s.equal(config, 'bar')
        s.end()
      })
    })
  })

  t.test('secure', s => {
    s.ok('secure' in response, 'secure response')

    helper.dbnames.forEach(function (dbname) {
      s.ok(response.secure[dbname].ok, 'response is ok')
    })
    s.end()
  })

  t.test('index', s => {
    helper.getVersion((error, version) => {
      s.error(error)

      if (version < '2') {
        s.ok(true, 'couchdb version prior 2 did not support Mango')
        return
      }

      s.ok('index' in response, 'index response')

      helper.dbnames.forEach(function (dbname) {
        s.ok(response.secure[dbname].ok, 'response is ok')
      })
      s.end()
    })
  })

  t.test('push', s => {
    s.ok('push' in response, 'push response')

    Object.keys(helper.docs).forEach(function (db) {
      s.ok(db in response.push, db + ' included')

      const responses = response.push[db]
      const docs = helper.docs[db]

      s.equal(responses.length, docs.length, 'correct # of docs pushed')

      responses.forEach(function (r) {
        s.ok(r.ok, 'response is ok')
        s.ok(docs.indexOf(r.id) > -1, db + '/' + r.id + ' has been pushed')
      })
    })

    s.end()
  })

  done()
}

test('directory', function (t) {
  helper.clearConfig(function (error) {
    t.error(error)

    bootstrap(helper.url, helper.source, function (error, response) {
      t.error(error)

      check(t, response, t.end)
    })
  })
})

test('object', function (t) {
  helper.clearConfig(function (error) {
    t.error(error)

    bootstrap(helper.url, config, function (error, response) {
      t.error(error)

      check(t, response, t.end)
    })
  })
})
