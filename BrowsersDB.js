/*
  depends on lodash, fs, upath, async
  global Logger
*/
'use strict'

// Dependencies
const _ = require('lodash')
const upath = require('upath')
const async = require('async')
const dbScripts = ['dbChrome', 'dbChromium', 'dbFirefox']
const knownDbs = ['chrome', 'chromium', 'firefox']
const logger = global.Logger ? global.Logger : console

class BrowsersDB {
  constructor (dbNames) {
    let names = (dbNames || knownDbs)
    if (typeof names === 'string' && names.toLowerCase() === 'all') {
      names = knownDbs
    }
    names = names instanceof Array ? names : [names]
    let indexes = names.map(d => knownDbs.indexOf(d.toLowerCase()))
    this.dbNames = indexes.filter(i => i !== -1).map(i => dbScripts[i])
    this.dbs = []
    // Lazy loading, do not overwhelm constructor
  }

  start (callback) {
    async.each(this.dbNames, (dbScript, cb) => {
      let d = require(upath.normalize(upath.join(__dirname, dbScript)))
      d.init((err, db) => {
        if (!err) {
          this.dbs.push(db)
        } else {
          logger.log('[DB MANAGER] Bad init on Database', dbScript, 'skipping', err)
        }
        cb(null)
      })
    }, callback)
  }

  query (queryStr, callback) {
    async.map(this.dbs, (db, cb) => {
      db.query(queryStr, cb)
    }, (err, results) => {
      if (err) {
        return callback(err)
      }
      callback(null, _.flatten(results).filter(r => r !== undefined && r !== null))
    })
  }

  shutdown (callback) {
    logger.log('[DB MANAGER] db shutdown')
    async.each(this.dbs, (db, cb) => { db.close(cb) }, callback)
  }
}

module.exports = BrowsersDB
