const validate_doc_update = function (newDoc, oldDoc, userCtx, secObj) {
  if (userCtx.roles.indexOf('_admin') === -1) {
    throw({
      forbidden: 'Admins only.'
    })
  }
}
            
const byDate = function (doc) {
  if ('date' in doc) {
    emit(doc.date, null)
  }
}

module.exports = {
  _config: {
    'couchdb-bootstrap': {
      foo: 'bar'
    }
  },
  'test-couchdb-bootstrap': {
    _security: {
      members: {
        roles: [],
        names: [
          'alice@example.com',
          'bob@example.com'
        ]
      },
      admins: {
        roles: [],
        names: [
          'alice@example.com'
        ]
      }
    },
    mydoc: {
      _id: 'mydoc-id'
    },
    _design: {
      myapp: {
        validate_doc_update,
        views: {
          'by-date': {
            map: byDate,
            reduce: '_count'
          }
        }
      }
    },
    _local: {
      localdoc: {
        foo: 'bar'
      }
    }
  },
  _users: {
    alice: {
      _id: 'org.couchdb.user:alice@example.com',
      type: 'user',
      roles: [],
      name: 'alice@example.com',
      password: 'secure'
    },
    bob: {
      _id: 'org.couchdb.user:bob@example.com',
      type: 'user',
      roles: [],
      name: 'bob@example.com',
      password: 'secure'
    }
  }
}
