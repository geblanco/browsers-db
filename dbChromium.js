/*
  depends on appdata-path, upath, Database
*/

'use strict'
// READONLY - 1
// READWRITE - 2

const upath = require('upath')
const Database = require(upath.normalize(upath.join(__dirname, 'Database')))
const getAppDataPath = require('appdata-path')

const exp = {
  name: 'chromium',
  file: upath.normalize(upath.join(getAppDataPath(), 'chromium/Default/History')),
  query: 'SELECT url, title FROM urls WHERE title LIKE ? LIMIT 20',
  mode: 1
}

var chromiumDb = null

module.exports = {
  init: function (callback) {
    if (chromiumDb) {
      return callback(null, chromiumDb)
    }
    chromiumDb = new Database(exp)
    chromiumDb.init(function (err) {
      if (err) {
        return callback(err)
      }
      callback(null, chromiumDb)
    })
  }
}
