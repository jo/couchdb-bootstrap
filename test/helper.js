var path = require('path')
var async = require('async')
var nano = require('nano')


exports.docs = {
  '_users': [
    'org.couchdb.user:alice@example.com',
    'org.couchdb.user:bob@example.com'
  ],
  'test-couchdb-bootstrap': [
    '_design/myapp',
    '_local/localdoc',
    'mydoc-id'
  ]
}

exports.dbnames = Object.keys(exports.docs)
  .filter(function(dbname) {
    return dbname[0] !== '_'
  })

exports.url = process.env.COUCH || 'http://localhost:5984'
exports.source = path.join(__dirname, 'fixtures')

exports.couch = require('nano')(exports.url)

exports.setup = function(callback) {
  async.each(exports.dbnames, exports.couch.db.destroy, callback)
}

exports.createDatabases = function(callback) {
  async.each(exports.dbnames, exports.couch.db.create, callback)
}
