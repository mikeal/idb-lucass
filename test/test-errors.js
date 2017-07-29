global.indexedDB = require('fake-indexeddb')
global.window = global
const idblucass = require('../')
const test = require('tap').test
const through = require('through2')

const proxy = () => {
  return through(function (chunk, enc, cb) {
    this.push(chunk)
    cb()
  })
}

const failHasher = cb => {
  process.nextTick(() => cb(new Error('Test Error')))
  return through(() => {})
}

test('errors: (implementation) hash error in hash()', t => {
  t.plan(1)
  let store = idblucass('test', failHasher)
  store.hash(Buffer.from('asdf'), err => {
    t.type(err, 'Error')
  })
})

test('errors: (implementation) hash error in set()', t => {
  t.plan(1)
  let store = idblucass('test', failHasher)
  store.set(Buffer.from('asdf'), err => {
    t.type(err, 'Error')
  })
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

test('errors: stream input hash error', t => {
  t.plan(2)
  let stream = proxy()
  let store = idblucass('test')
  store.hash(stream, err => {
    t.same(err.message, 'test')
    t.type(err, 'Error')
  })
  stream.emit('error', new Error('test'))
})

test('errors: stream input set error', t => {
  t.plan(2)
  let stream = proxy()
  let store = idblucass('test')
  store.set(stream, err => {
    t.same(err.message, 'test')
    t.type(err, 'Error')
  })
  stream.emit('error', new Error('test'))
})

test('errors: error in get stream', t => {
  t.plan(2)
  let store = idblucass('test')
  store.kv.get = (hash, cb) => {
    process.nextTick(() => cb(new Error('test')))
  }
  let stream = store.getStream('test')
  stream.on('error', err => {
    t.same(err.message, 'test')
    t.type(err, 'Error')
  })
})
