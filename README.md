# CouchDB Bootstrap
Bootstrap CouchDB server from CLI or API.

[![Build
Status](https://travis-ci.org/eHealthAfrica/couchdb-bootstrap.svg?branch=master)](https://travis-ci.org/eHealthAfrica/couchdb-bootstrap)


* Configure CouchDB
* Create users
* Create databases (unless they exist)
* Setup database \_security object
* Deploy design documents
* Initiate replications
* Seed documents


CouchDB Bootstrap combines different small tools, which can also be used
independently. Each of those tools come has a similar API and is shipped with a
CLI:
* [couchdb-compile](https://github.com/jo/couchdb-compile) - Handle sources: fs mapping / JSON / CommonJS
* [couchdb-configure](https://github.com/eHealthAfrica/couchdb-configure) - Configure CouchDB
* [couchdb-ensure](https://github.com/eHealthAfrica/couchdb-ensure) - Create database unless exists
* [couchdb-push](https://github.com/jo/couchdb-push) - Push documens: users, replications, design docs and normal documents
* [couchdb-secure](https://github.com/eHealthAfrica/couchdb-secure) - Secure databases: write security object

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
│   └── adoc.json
├── myapp-alice
│   └── _security.json
└── myapp-bob
    └── _security.json
```

In the directory tree above `project/couchdb/_config.json` is handed to
[couchdb-configure](https://github.com/eHealthAfrica/couchdb-configure),
`project/couchdb/_replicator/setup-alice.json`,
`project/couchdb/myapp/_design/myapp.js`
`project/couchdb/myapp/adoc.json` are handed (beside others) to
[couchdb-push](https://github.com/jo/couchdb-push)
and `project/couchdb/myapp-alice/_security.json` to
[couchdb-secure](https://github.com/eHealthAfrica/couchdb-secure).

See [couchdb-compile](https://github.com/jo/couchdb-compile) for more details
about the CouchDB Filesystem Mapping on a document / security object / config
level.

## API

```js
bootstrap(url, source[, options], callback)
```

* `url` - CouchDB server URL
* `source` - directory holding the bootstrap tree
* `options.index` - When set to `true`, folders are searched for `index.js`, which, if present, is treated as CommonJS module. Default is `false`.
* `options.concurrency` - Limit number of concurrent requests. Defaults to `100`.
* `options.multipart` - When set to `true`, attachments are saved via multipart api. Default is `false`.
* `options.watch` - When set to `true`, documents are pushed on filesystem change. Default is `false`.
* `options.mapDbName` - Set to `object` or `function` to map directories to custom database names
* `callback` - called when done with a `response` object describing the status of all operations.

### Example

```js
var bootstrap = require('couchdb-bootstrap')
bootstrap('http://localhost:5984', 'project/couchdb', function(error, response) {
  // here we go
})
```


## CLI

```sh
couchdb-bootstrap URL [SOURCE] [OPTIONS]
```

Or use the shortcurt `cdbb`.

When `SOURCE` is omitted, the current directory will be used.
`options.index` is always true.
`OPTIONS` can be '--concurrency', `--multipart` or `--watch`, see above.

### Example

```sh
couchdb-bootstrap http://localhost:5984 project/couchdb
```

## Tests
```sh
npm test
```
