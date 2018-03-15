var test = require('tap').test
var helper = require('./helper')
var bootstrap = require('..')

test('basics', function (t) {
  helper.clearConfig(function (error) {
    t.error(error)

    bootstrap(helper.url, helper.source, function (error, response) {
      t.error(error)

      // config is ok
      t.ok('configure' in response)
      t.same(response.configure, {
        'couchdb-bootstrap/foo': {
          ok: true,
          value: 'bar'
        }
      }, 'correct response')
      helper.couch.request({
        path: '_config/couchdb-bootstrap/foo'
      }, function (error, config) {
        t.error(error)
        t.equal(config, 'bar')

        // push is ok
        t.ok('push' in response)
        Object.keys(helper.docs).forEach(function (db) {
          t.ok(db in response.push, db + ' included')

          var responses = response.push[db]
          var docs = helper.docs[db]

          t.equal(responses.length, docs.length, 'correct # of docs pushed')

          responses.forEach(function (r) {
            t.ok(r.ok, 'response is ok')
            t.ok(docs.indexOf(r.id) > -1, db + '/' + r.id + ' has been pushed')
          })
        })

        // secure is ok
        t.ok('secure' in response)
        helper.dbnames.forEach(function (dbname) {
          t.ok(response.secure[dbname].ok, 'response is ok')
        })

        t.end()
      })
    })
  })
})
