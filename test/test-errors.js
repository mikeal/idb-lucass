global.indexedDB = require('fake-indexeddb')
global.IDBKeyRange = require('fake-indexeddb/lib/FDBKeyRange')
global.IDBIndex = require('fake-indexeddb/lib/FDBIndex')
global.IDBCursor = require('fake-indexeddb/lib/FDBCursor')
global.IDBObjectStore = require('fake-indexeddb/lib/FDBObjectStore')
global.IDBTransaction = require('fake-indexeddb/lib/FDBTransaction')
global.IDBDatabase = require('fake-indexeddb/lib/FDBDatabase')
global.window = global
const idblucass = require('../')
const test = require('tap').test

const failHasher = async () => {
  throw new Error('Test Error')
}

test('errors: (implementation) hash error in hash()', async t => {
  t.plan(1)
  let store = idblucass('test', failHasher)
  try {
    await store.hash(Buffer.from('asdf'))
  } catch (e) {
    t.type(e, 'Error')
  }
})

test('errors: (implementation) hash error in set()', async t => {
  t.plan(1)
  let store = idblucass('test', failHasher)
  try {
    await store.set(Buffer.from('asdf'))
  } catch (e) {
    t.type(e, 'Error')
  }
})

test('errors: must pass name to constructor', t => {
  t.plan(2)
  try {
    idblucass()
  } catch (e) {
    t.same(e.message, 'Missing required argument: name.')
    t.type(e, 'Error')
  }
})
