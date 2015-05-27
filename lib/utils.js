var glob = require('glob')
var path = require('path')

var DBS = '{_users,[^_]*}'
var DOCS = '{_design/*,_local/*,[^_]*}'
var SECURITIES = '_security.json'


exports.dbs = function(source, callback) {
  glob(path.join(source, DBS), callback)
}

exports.docs = function(source, callback) {
  glob(path.join(source, DOCS), callback)
}

exports.securities = function(source, callback) {
  glob(path.join(source, SECURITIES), callback)
}

exports.ignoreError = function(callback, defaultResponse) {
  return function(error, response) {
    callback(null, response || defaultResponse)
  }
}

exports.groupByDatabase = function(dbname, callback) {
  return function(error, results) {
    if (error) return done(error)

    var result = {}
    result[dbname] = results

    callback(null, result)
  }
}

exports.reduceGroupedResult = function(callback) {
  return function(error, results) {
    if (error) return callback(error)

    var result = results.reduce(function(memo, res) {
      if (typeof res !== 'object') return memo

      Object.keys(res).forEach(function(key) {
        memo[key] = res[key]
      })

      return memo
    }, {})

    callback(null, result)
  }
}
