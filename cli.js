#!/usr/bin/env node

'use strict'

const upath = require('upath')
const BrowsersDB = require(upath.normalize(upath.join(__dirname, 'BrowsersDB')))
const readline = require('readline')
const { bold, red, green, magenta } = require('cli-colors')

const browsers = new BrowsersDB('all')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

browsers.start(function work () {
  function search (word, callback) {
    browsers.query(word, (err, resp) => {
      if (err) {
        return callback(bold(red(err)))
      }
      callback(resp)
    })
  }

  function searchPrompt () {
    rl.question(bold(magenta('search := ')), (input) => {
      if (input === 'exit') {
        rl.close()
      } else {
        search(input, res => {
          console.log(res)
          searchPrompt()
        })
      }
    })
  }

  function searchWords (words) {
    search(words, (res) => {
      console.log(bold(green(words)))
      console.log(res)
      process.exit(0)
    })
  }

  if (process.argv.length > 2) {
    return searchWords(process.argv.splice(2).join(' '))
  }

  searchPrompt()
})
