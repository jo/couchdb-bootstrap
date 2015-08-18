var test = require('tape')
var helper = require('./helper')
var bootstrap = require('..')

test('basics', function(t) {
  bootstrap(helper.url, helper.source, function(error, response) {
    t.error(error, 'no error occured')

    t.end()
  })
})
