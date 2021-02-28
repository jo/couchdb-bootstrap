const path = require('path')
const async = require('async')
const nanoOption = require('nano-option')
const assert = require('assert')

const compile = require('couchdb-compile')
const couchdbConfigure = require('couchdb-configure')
const couchdbSecure = require('couchdb-secure')
const couchdbPush = require('couchdb-push')

const DOCS_REGEX = /^(_design|_local|[^_].*)$/
const DBS_REGEX = /^(_users|_dbs|_global_changes|_replicator|[^_].*)$/

function isDb (key) {
  return key.match(DBS_REGEX)
}

function isDoc (key) {
  return key.match(DOCS_REGEX)
}

function groupByDatabase (dbname, callback) {
  return function (error, results) {
    if (error) return callback(error)

    const result = {}
    result[dbname] = results

    callback(null, result)
  }
}

function reduceGroupedResult (callback) {
  return function (error, results) {
    if (error) return callback(error)

    const result = results.reduce(function (memo, res) {
      if (typeof res !== 'object') return memo

      Object.keys(res).forEach(function (key) {
        memo[key] = res[key]
      })

      return memo
    }, {})

    callback(null, result)
  }
}

function mapDbName (options, dbname) {
  if (!('mapDbName' in options)) return dbname
  if (typeof options.mapDbName === 'object') return options.mapDbName[dbname] || dbname
  if (typeof options.mapDbName === 'function') return options.mapDbName(dbname)

  return dbname
}

module.exports = function (url, source, options, callback) {
  if (typeof options === 'function') {
    callback = options
    options = {}
  }

  const couch = nanoOption(url)

  assert(typeof couch.request === 'function',
    'URL must point to the root of a CouchDB server (not to a database).')

  if (typeof source === 'string') {
    source = path.resolve(process.cwd(), source)
  }

  compile(source, function (error, source) {
    if (error) return callback(error)

    options = options || {}

    options.concurrency = 'concurrency' in options ? options.concurrency : 100

    const series = {}

    if ('_config' in source) series.configure = couchdbConfigure.bind(null, couch, source._config)

    const dbs = Object.keys(source).filter(isDb)

    const dbsWithSecurity = dbs.filter(dbname => '_security' in source[dbname])
    if (dbsWithSecurity.length) {
      series.secure = done => {
        async.map(dbsWithSecurity, (dbname, next) => {
          const db = mapDbName(options, dbname)
          couchdbSecure(couch.use(db), source[dbname]._security, groupByDatabase(db, next))
        }, reduceGroupedResult(done))
      }
    }

    const dbsWithDocs = dbs.filter(dbname => Object.keys(source[dbname]).filter(isDoc).length)
    if (dbsWithDocs.length) {
      series.push = done => {
        async.map(dbsWithDocs, (dbname, next) => {
          const docs = Object.keys(source[dbname])
            .filter(isDoc)
            .reduce((memo, id) => {
              let docs = []

              if (id === '_local') {
                docs = Object.keys(source[dbname]._local)
                  .map(name => {
                    const doc = source[dbname]._local[name]
                    if (!('_id' in doc)) doc._id = '_local/' + name
                    return doc
                  })

                return memo.concat(docs)
              }

              if (id === '_design') {
                docs = Object.keys(source[dbname]._design)
                  .map(name => {
                    const doc = source[dbname]._design[name]
                    if (!('_id' in doc)) doc._id = '_design/' + name
                    return doc
                  })

                return memo.concat(docs)
              }

              const doc = source[dbname][id]

              if (!('_id' in doc)) doc._id = id

              return memo.concat(doc)
            }, [])

          const db = mapDbName(options, dbname)
          async.mapLimit(docs, options.concurrency, (doc, next) => {
            couchdbPush(couch.use(db), doc, options, next)
          }, groupByDatabase(db, next))
        }, reduceGroupedResult(done))
      }
    }

    return async.series(series, callback)
  })
}
