global.indexedDB = require('fake-indexeddb')
global.IDBKeyRange = require('fake-indexeddb/lib/FDBKeyRange')
global.IDBIndex = require('fake-indexeddb/lib/FDBIndex')
global.IDBCursor = require('fake-indexeddb/lib/FDBCursor')
global.IDBObjectStore = require('fake-indexeddb/lib/FDBObjectStore')
global.IDBTransaction = require('fake-indexeddb/lib/FDBTransaction')
global.IDBDatabase = require('fake-indexeddb/lib/FDBDatabase')
global.window = global
const spec = require('lucass/lib/test-basics')
const idblucass = require('../')
const test = require('tap').test

spec('idb', idblucass('test'))

test('idb: hasher args', async t => {
  t.plan(2)
  const argHasher = async (value, one, two, three) => {
    t.same([one, two, three], [1, 2, 3])
    return 'asdf'
  }
  let store = idblucass('noop', argHasher)
  await store.set(Buffer.from('asdf'), 1, 2, 3)
  await store.hash(Buffer.from('asdf'), 1, 2, 3)
})

test('spec: missing API', async t => {
  t.plan(2)
  let store = idblucass('noop2')
  let key = await store.set(Buffer.from('asdf'))
  t.same(await store.missing(['asdf']), ['asdf'])
  t.same(await store.missing([key]), [])
})

test('spec: missing API w/o', async t => {
  t.plan(2)
  let store = idblucass('noop3')
  let key = await store.set(Buffer.from('asdfaksdflkasjdfklajsldfkj'))
  store._cache = new Set()
  t.same(await store.missing(['asdf']), ['asdf'])
  t.same(await store.missing([key]), [])
})
