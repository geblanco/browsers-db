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
  name: 'chrome',
  file: upath.normalize(upath.join(getAppDataPath(), 'google-chrome/Default/History')),
  query: 'SELECT url, title FROM urls WHERE url LIKE ? LIMIT 20',
  mode: 1
}

var chromeDb = null

module.exports = {
  init: function (callback) {
    if (chromeDb) {
      return callback(null, chromeDb)
    }
    chromeDb = new Database(exp)
    chromeDb.init(function (err) {
      if (err) {
        return callback(err)
      }
      callback(null, chromeDb)
    })
  }
}
