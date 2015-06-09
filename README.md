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


## Directory

```
/path/to/my/project/couchdb
├── _config.json
├── _users
│   ├── alice.json
│   └── bob.json
├── alicedb
│   └── _security.json
└── bobdb
    ├── _design
    │   └── myapp.js
    ├── _security.json
    └── adoc.json
```

See [couchdb-compile](https://github.com/jo/couchdb-compile) for more details
about the CouchDB Filesystem Mapping.

## API

```js
bootstrap(url, source[, options], callback)
```

* `url` - CouchDB server URL
* `source` - directory holding the bootstrap tree
* `options.multipart` - When set to `true`, attachments are saved via multipart api.
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
couchdb-bootstrap URL [SOURCE]
```

When `SOURCE` is omitted the current directory will be used.

### Example

```sh
couchdb-bootstrap http://localhost:5984 project/couchdb
```

## Tests
```sh
npm test
```
