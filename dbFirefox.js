/*
  depends on upath, firefox-profile-path, Database
  global Logger
*/

'use strict'

// READONLY - 1
// READWRITE - 2
const { normalize, join } = require('upath')
const Database = require(normalize(join(__dirname, 'Database')))
// Until https://github.com/bluelovers/node-firefox-profile-path/pull/1 is ready
const firefoxPath = require('firefox-profile-path')

let exp = {
  name: 'firefox',
  file: '',
  query: 'SELECT url, title FROM moz_places WHERE title LIKE ? ORDER BY last_visit_date DESC LIMIT 20',
  mode: 1
}

var _init = function () {
  exp.file = null
  try {
    let pathList = firefoxPath.os_profile_list()
    let pathProfiles = Object.keys(pathList).map(key => pathList[key])
    exp.file = pathProfiles.length ? normalize(join(pathProfiles[0], 'places.sqlite')) : null
  } catch (e) {
    exp.file = null
  }
  return exp.file ? null : 'ENOENT'
}

var firefoxDb = null

module.exports = {
  init: function (callback) {
    if (firefoxDb) {
      return callback(null, firefoxDb)
    }
    let error = _init()
    if (error) {
      return callback(error)
    }
    firefoxDb = new Database(exp)
    firefoxDb.init(function (err) {
      if (err) {
        return callback(err)
      }
      callback(null, firefoxDb)
    })
  }
}
