# idb-lucass

A content addressable file store on top of indexedDB, implemented to the
[`lucass`](https://github.com/mikeal/lucass) spec.

[![Coverage Status](https://coveralls.io/repos/github/mikeal/contentfs/badge.svg?branch=master)](https://coveralls.io/github/mikeal/contentfs?branch=master)
[![Build Status](https://travis-ci.org/mikeal/contentfs.svg?branch=master)](https://travis-ci.org/mikeal/contentfs)
[![dependencies Status](https://david-dm.org/mikeal/contentfs/status.svg)](https://david-dm.org/mikeal/contentfs)

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

API conforms to the lucass spec and supports optional arguments to the
hasher.

```javascript
const idblucass = require('idb-lucass')
const store = idblucass('noop', argHasher)
store.set(Buffer.from('asdf'), (err, hash) => {
  if (err) throw err
  store.get(hash, (err, buff) => {
    if (err) throw err
    console.log(buff.toString()) // 'asdf'
  })
})
```
