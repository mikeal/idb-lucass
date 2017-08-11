const idb = require('idb')
const multihasher = require('multihasher')

class IDBLucass {
  constructor (name, hasher = multihasher('sha256')) {
    if (!name) throw new Error('Missing required argument: name.')
    this.dbPromise = idb.open(name, 1, upgrade => {
      return upgrade.createObjectStore('keyval')
    })
    this._hasher = hasher
  }
  async hash (value, ...args) {
    if (!Buffer.isBuffer(value)) throw new Error('Invalid type.')
    return this._hasher(value, ...args)
  }
  async get (hash) {
    let db = await this.dbPromise
    let tx = db.transaction('keyval')
    let value = await tx.objectStore('keyval').get(hash)
    if (typeof value === 'undefined') throw new Error('Not found.')
    return value
  }
  async set (value, ...args) {
    if (!Buffer.isBuffer(value)) throw new Error('Invalid type.')
    let hash = await this.hash(value, ...args)
    let db = await this.dbPromise
    let tx = db.transaction('keyval', 'readwrite')
    await tx.objectStore('keyval').put(value, hash).complete
    return hash
  }
  async missing (hashes) {
    let db = await this.dbPromise
    let tx = db.transaction('keyval', 'readwrite')
    let keys = new Set(await tx.objectStore('keyval').getAllKeys())
    return hashes.filter(hash => !keys.has(hash))
  }
}

module.exports = (...args) => new IDBLucass(...args)
