# CouchDB Bootstrap
Bootstrap CouchDB database:

* Configure CouchDB
* Create Database
* Setup `_security` Settings
* Deploy Design Documents
* Create User Accounts


**:warning: Not ready now.**


## Example
Given the following directory layout:

```
/path/to/my/project/couchdb
├── _config.json
├── _users
│   ├── org.couchdb.user:alice@example.com.json
│   └── org.couchdb.user:bob@example.com.json
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
