# CouchDB Bootstrap
Bootstrap CouchDB database:

* Configure CouchDB
* Create Database
* Setup `_security` Settings
* Deploy Design Documents
* Create User Accounts

[![Build
Status](https://magnum.travis-ci.com/eHealthAfrica/couchdb-bootstrap.svg?token=17MT1MYgsDEiy3cPsdVy&branch=master)](https://magnum.travis-ci.com/eHealthAfrica/couchdb-bootstrap)


**:warning: Not ready now.**


## Example
Given the following directory layout:

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
    │   └── myapp
    │       ├── validate_doc_update.js
    │       └── views
    │           └── by-date
    │               ├── map.js
    │               └── reduce
    └── _security.json
```

You now can boostrap the project programmatically:

```js
var bootstrap = require('couchdb-bootstrap')
bootstrap('http://localhost:5984', '/path/to/my/project/couchdb', function(error, response) {
  // { ok: true }
})
```

Or via CLI:

```sh
couchdb-bootstrap http://localhost:5984 /path/to/my/project/couchdb -u jo -p secure
```

### `bootstrap(url, source, [options], [callback])`

## Tests
```sh
npm test
```
