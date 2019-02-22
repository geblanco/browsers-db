/*
  depends on sqlite3, chokidar, tmp, fs
  global Logger
*/

'use strict'

const chokidar = require('chokidar')
const sqlite = require('sqlite3').verbose()
const async = require('async')
const tmp = require('tmp')
const fs = require('fs')
const logger = global.Logger ? global.Logger : console

class Database {
  constructor (obj) {
    this.name = obj.name || ''
    this.file = obj.file || ''
    this.mode = obj.mode || sqlite.OPEN_READONLY
    this.queryStatement = obj.query || ''
    this.fileCopy = `${tmp.tmpNameSync()}.${this.name}.sqlite`
    this.watcher = null
    this.querying = false
    this.watch(this.fileCopy)
  }
  init (callback) {
    this.DB = null
    callback = (callback || function () {})
    async.waterfall([
      (callback) => {
        fs.stat(this.file, (err, stat) => { callback(err ? err.code : null) })
      },
      (callback) => {
        fs.copyFile(this.file, this.fileCopy, (err) => { callback(err ? err.code : null) })
      },
      (callback) => {
        let _DB = new sqlite.Database(this.fileCopy, this.mode, (err) => {
          if (err) {
            return callback(err.code)
          }
          callback(null, _DB)
        })
      }
    ], (err, db) => {
      let logMsg = `[DB ${this.name.toUpperCase()}]`
      if (err) {
        logMsg += ` Unable to register on Database \`${this.name}\` -> ENOENT`
      } else {
        logMsg += ` Registered on Database \`${this.name}\` -> ${this.file}`
        this.DB = db
      }
      logger.log(logMsg)
      callback(err)
    })
  }
  query (queryStr, callback) {
    this.querying = true
    this.DB.all(this.queryStatement, `%${String(queryStr)}%`, (err, rows) => {
      this.querying = false
      if (err) {
        return callback(err)
      }
      let results = rows instanceof Array ? rows : [ rows ]
      results.forEach((r) => { r.browser = this.name })
      callback(null, results)
    })
  }
  reload () {
    if (this.DB) {
      if (this.querying) {
        setTimeout(this.reload, 500)
      } else {
        this.DB.close(this.init)
      }
    }
  }
  watch (file) {
    // ToDo := There might be a collision if closing at the same time as a query
    this.watcher = chokidar.watch(file)
    this.watcher.on('change', this.reload)
  }
  close (callback) {
    let end = (callback || function () {})
    this.watcher && this.watcher.close()
    this.DB && this.DB.close(end)
  }
}

module.exports = Database
