global.indexedDB = require('fake-indexeddb')
global.window = global
const spec = require('lucass/lib/test-basics')
const idblucass = require('../')

spec('level', idblucass('test'))
