var test = require('tap').test
var helper = require('./helper')
var bootstrap = require('..')

test('basics', function (t) {
  bootstrap(helper.url, helper.source, function (error, response) {
    t.error(error)

    t.end()
  })
})
