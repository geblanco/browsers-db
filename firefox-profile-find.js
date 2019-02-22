/**
 * Taken from
 */

'use strict'

var path = require('upath')
var fs = require('fs')
var ini = require('ini')

/**
 * get Firefox Data dir
 *
 * @param platform
 * @param env - APPDATA, HOME, USERPROFILE
 * @returns {*}
 *
 * @see https://github.com/saadtazi/firefox-profile-js/blob/5c4a98f6e2977a2efc10afaecf1f86d621b7f069/lib/profile_finder.js
 */
function osAppdata (platform = process.platform, env = process.env) {
  let profiledir = null

  switch (platform) {
    case 'darwin':
      profiledir = path.join(env.HOME, 'Library/Application Support/Firefox')
      break
    case 'linux':
      profiledir = path.join(env.HOME, '.mozilla/firefox')
      break
    case 'win32':
    default:

      if (!env.APPDATA) {
        env.APPDATA = path.join(env.HOME || env.USERPROFILE, 'AppData/Roaming')
      }

      profiledir = path.join(env.APPDATA, 'Mozilla/Firefox')
      break
  }

  return profiledir
}

/**
 * parse firefox profile ini
 *
 * @param platform
 * @param env
 * @returns {*|number}
 */
function osProfileIni (platform = process.platform, env = process.env) {
  let basedir = osAppdata(platform, env)

  let profiles = fs.readFileSync(path.join(basedir, 'profiles.ini'))
  return ini.parse(profiles.toString())
}

/**
 * get profile list from profile.ini
 *
 * @param platform
 * @param env
 * @returns {*}
 */
function osProfileList (platform = process.platform, env = process.env) {
  let basedir = osAppdata(platform, env)
  let profile = osProfileIni(platform, env)

  return Object.keys(profile)
    .reduce((a, b) => {
      let dir = profile[b].Path

      if (/^Profile(\d+)$/.test(b) && dir) {
        // some profile has same name, so use dir name
        let name = path.basename(dir)

        if (profile[b].IsRelative) {
          dir = path.join(basedir, dir)
        }

        a[name] = dir
      }

      return a
    }, {})
}

/**
 * get profile list by search profile dir
 *
 * @param platform
 * @param env
 * @returns {*}
 */
function osProfileList2 (platform = process.platform, env = process.env) {
  let basedir = osAppdata(platform, env)

  basedir = path.join(basedir, 'Profiles')

  let ls = fs.readdirSync(basedir)

  return ls.reduce((a, b) => {
    let dir = path.join(basedir, b)

    try {
      let stat = fs.statSync(dir)

      if (stat.isDirectory()) {
        a[b] = dir
      }
    } catch (e) {
      if (e.code === 'ENOENT') {
        // console.error(e);
      } else {
        throw e
      }
    }

    return a
  }, {})
}

/**
 * get profile list from PortableApps env
 * only for windows system
 *
 * @param env - PAL:PortableAppsBaseDir
 * @returns {*}
 */
function paProfileList (env = process.env) {
  // console.log(env['PAL:PortableAppsBaseDir']);

  if (env['PAL:PortableAppsBaseDir']) {
    let basedir = path.join(env['PAL:PortableAppsBaseDir'], 'PortableApps')
    let ls = fs.readdirSync(basedir)

    if (ls) {
      return ls.reduce((a, b) => {
        let dir = path.join(basedir, b, 'Data/profile')

        if (/^Firefox(.*)?Portable/i.test(b)) {
          try {
            let stat = fs.statSync(dir)

            if (stat.isDirectory()) {
              a[b] = dir
            }
          } catch (e) {
            if (e.code === 'ENOENT') {
              // console.error(e);
            } else {
              throw e
            }
          }
        }

        return a
      }, {})
    }
  }

  return false
}

module.exports = {
  osAppdata: osAppdata,
  osProfileIni: osProfileIni,
  osProfileList: osProfileList,
  osProfileList2: osProfileList2,
  paProfileList: paProfileList
}
