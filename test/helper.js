var path = require('path')
var async = require('async')

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

exports.configSection = 'couchdb-bootstrap'

exports.dbnames = Object.keys(exports.docs)
  .filter(function (dbname) {
    return dbname[0] !== '_'
  })

exports.url = process.env.COUCH || 'http://localhost:5984'
exports.source = path.join(__dirname, 'fixtures/bootstrap')

exports.couch = require('nano')(exports.url)

exports.setup = function (callback) {
  async.each(exports.dbnames, exports.couch.db.destroy, callback)
}

exports.createDatabases = function (callback) {
  async.each(exports.dbnames, exports.couch.db.create, callback)
}

let version
exports.getVersion = function (callback) {
  if (version) { return callback(null, version) }
  exports.couch.request({
    path: ''
  }, (error, info) => {
    if (error) { return callback(error) }
    version = info.version
    return callback(null, info.version)
  })
}

let configPaths
exports.getConfigPath = function (callback) {
  if (configPaths) { return callback(null, configPaths) } else {
    exports.getVersion((error, version) => {
      if (error) { return callback(error) } else {
        if (version > '2') {
          exports.couch.request({
            path: '_membership'
          }, (error, membership) => {
            if (error) { return callback(error) } else {
              configPaths = membership.all_nodes.map((node) => {
                return `_node/${node}/_config/`
              })
              return callback(null, configPaths)
            }
          })
        } else {
          configPaths = ['_config/']
          return callback(null, configPaths)
        }
      }
    })
  }
}

// There is an issue with section deletion in CouchDB.
// You cannot delete an entire section:
// $ curl -XDELETE http://localhost:5984/_config/couchdb-bootstrap
// {"error":"method_not_allowed","reason":"Only GET,PUT,DELETE allowed"}
exports.clearConfig = function (callback) {
  exports.getConfigPath((error, configPath) => {
    if (error) { return callback(error) } else {
      exports.couch.request({
        path: configPath + exports.configSection
      }, function (error, config) {
        if (error) return callback(error)
        async.map(Object.keys(config), function (key, next) {
          exports.couch.request({
            method: 'DELETE',
            path: configPath + exports.configSection + '/' + encodeURIComponent(key)
          }, next)
        }, callback)
      })
    }
  })
}
