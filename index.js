const KeyValueStore = require('idb-kv-store')
const createHasher = require('hashes-stream')
const bl = require('bl')
const through = require('through2')

const proxy = () => {
  return through(function (chunk, enc, cb) {
    this.push(chunk)
    cb()
  })
}

class IDBLucass {
  constructor (name, algo = 'sha256', _createHasher = createHasher) {
    if (!name) throw new Error('Missing required argument: name.')
    this.kv = new KeyValueStore(name)
    this._algo = algo
    this._createHasher = _createHasher
  }
  hash (value, cb) {
    if (Buffer.isBuffer(value)) {
      let hasher = this._createHasher(this._algo, cb)
      hasher.write(value)
      hasher.end()
    } else if (value && value.readable) {
      value.pipe(bl((err, buff) => {
        if (err) return cb(err)
        return this.hash(buff, cb)
      }))
    } else {
      return cb(new Error('Invalid type.'))
    }
  }
  set (value, cb) {
    if (Buffer.isBuffer(value)) {
      this.hash(value, (err, hash) => {
        if (err) return cb(err)
        this.kv.set(hash, value, err => cb(err, hash))
      })
    } else if (value && value.readable) {
      value.pipe(bl((err, buff) => {
        if (err) return cb(err)
        return this.set(buff, cb)
      }))
    } else {
      return cb(new Error('Invalid type.'))
    }
  }
  getBuffer (hash, cb) {
    this.kv.get(hash, (err, buff) => {
      if (!err && typeof buff === 'undefined') {
        err = new Error('Not found')
      }
      cb(err, buff)
    })
  }
  getStream (hash) {
    let stream = proxy()
    this.kv.get(hash, (err, buff) => {
      if (err) return stream.emit('error', err)
      if (typeof buff === 'undefined') {
        return stream.emit('error', new Error('Not found.'))
      }
      stream.write(buff)
      stream.end()
    })
    return stream
  }
}

module.exports = (...args) => new IDBLucass(...args)
