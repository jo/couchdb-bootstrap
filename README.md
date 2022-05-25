# CouchDB Bootstrap
Bootstrap CouchDB server from CLI or API.

* set and override `/_config`
* create databases (unless existent)
* create and update database \_security objects
* create and update user accounts
* create and update design documents
* create and update replication documents
* create and update seed documents
* create indexes

CouchDB Bootstrap combines different small tools, which can also be used
independently. Each of those tools come has a similar API and is shipped with a
CLI:
* [couchdb-compile](https://github.com/jo/couchdb-compile) - Handle sources: fs mapping / JSON / CommonJS
* [couchdb-configure](https://github.com/jo/couchdb-configure) - Configure CouchDB
* [couchdb-ensure](https://github.com/jo/couchdb-ensure) - Create database unless exists
* [couchdb-push](https://github.com/jo/couchdb-push) - Push documents: users, replications, design docs and normal documents
* [couchdb-secure](https://github.com/jo/couchdb-secure) - Secure databases: write security object
* [couchdb-create-index](https://github.com/jo/couchdb-create-index) - Add Mango indexes

## Directory

Think about CouchDB Bootstrap as a toplevel manager, which reads a directory of
databases and optional `_config` and hands each file over to the appropriate tool:

```
project/couchdb
├── _config.json
├── _replicator
│   ├── setup-alice.json
│   └── setup-bob.json
├── _users
│   ├── alice.json
│   └── bob.json
├── myapp
│   ├── _design
│   │   └── myapp.js
│   ├── _security.json
│   ├── _index.json
│   └── adoc.json
├── myapp-alice
│   ├── doc1.json
│   ├── doc2-commonjs.js
│   └── _security.json
└── myapp-bob
    └── _security.json
```

In the directory tree above `project/couchdb/_config.json` is handed to
[couchdb-configure](https://github.com/jo/couchdb-configure),
`project/couchdb/_replicator/setup-alice.json`,
`project/couchdb/myapp/_design/myapp.js`
`project/couchdb/myapp/adoc.json` are handed (beside others) to
[couchdb-push](https://github.com/jo/couchdb-push)
and `project/couchdb/myapp-alice/_security.json` to
[couchdb-secure](https://github.com/jo/couchdb-secure).

Since couchdb-bootstrap@14.2 it is possible to provide a configuration object:
```js
{
  'my-db': {
    _security: {
      members: {
        roles: [],
        names: [
          'alice@example.com'
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
      date: '2018-03-16T19:27:52.361Z',
      title: 'Welcome'
    },
    _index: {
      index: {
        fields: ['date']
      },
      name: 'by-date',
      type: 'json'
    },
    _design: {
      myapp: {
        views: {
          'by-date': {
            map: function (doc) {
              if ('date' in doc) {
                emit(doc.date, null)
              }
            },
            reduce: '_count'
          }
        }
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
    }
  }
}
```

See [couchdb-compile](https://github.com/jo/couchdb-compile) for more details
about the CouchDB Filesystem Mapping on a document / security object / config
level.

## API

```js
bootstrap(url, source[, options], callback)
```

* `url` - CouchDB server URL
* `source` - bootstrap object or directory holding the bootstrap tree
* `options.index` - When set to `true`, folders are searched for `index.js`, which, if present, is treated as CommonJS module. Default is `false`.
* `options.concurrency` - Limit number of concurrent requests. Defaults to `100`.
* `options.multipart` - When set to `true`, attachments are saved via multipart api. Default is `false`.
* `options.watch` - When set to `true`, documents are pushed (not `_config`!) on filesystem change. Default is `false`.
* `options.mapDbName` - Set to `object` or `function` to map directories to custom database names
* `callback` - called when done with a `response` object describing the status of all operations.

### API Example

```js
var bootstrap = require('couchdb-bootstrap')
bootstrap('http://localhost:5984', 'project/couchdb', function(error, response) {
  // here we go
})
```

Since 14.2.0 it is possible to provide a configuration object:

```js
var bootstrap = require('couchdb-bootstrap')
var config = {
  'my-db': {
    _design: {
      myapp: {
        views: {
          'by-date': {
            map: function (doc) {
              if ('date' in doc) {
                emit(doc.date, null)
              }
            },
            reduce: '_count'
          }
        }
      }
    }
  }
}

bootstrap('http://localhost:5984', config, function(error, response) {
  //
})
```


## CLI

```sh
couchdb-bootstrap URL [SOURCE] [OPTIONS]
```

Or use the shortcurt `cdbb`.

When `SOURCE` is omitted, the current directory will be used.
`options.index` is always true.
`OPTIONS` can be `--concurrency`, `--multipart`, `--watch` or `--mapDbName='{"old-name": "new-name"}'`, see above.

### CLI Example

```sh
couchdb-bootstrap http://localhost:5984 project/couchdb
```

Source as CommonJS file:
```sh
couchdb-bootstrap http://localhost:5984 bootstrap.js
```

See test/fixtures/bootstrap.js for an example.

## Tests
```sh
npm test
```
