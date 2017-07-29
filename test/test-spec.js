global.indexedDB = require('fake-indexeddb')
global.window = global
const spec = require('lucass/lib/test-basics')
const idblucass = require('../')
const through = require('through2')
const test = require('tap').test

spec('idb', idblucass('test'))

test('idb: hasher args', t => {
  t.plan(4)
  const argHasher = (one, two, three, cb) => {
    t.same([one, two, three], [1, 2, 3])
    return through(() => setTimeout(() => cb(null, 'asdf'), 100))
  }
  let store = idblucass('noop', argHasher)
  store.set(Buffer.from('asdf'), 1, 2, 3, (err, hash) => {
    t.error(err)
  })
  store.hash(Buffer.from('asdf'), 1, 2, 3, (err, hash) => {
    t.error(err)
  })
})
