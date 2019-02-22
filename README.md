# Browsers DB

[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

An Interface to query your browsers history. By now only firefox, chrome and chromium are supported (contribution to other browsers is welcome).

## Usage

Install it as usual:

```bash
npm install --save browsers-db
```

You can use it from the command line:

```bash
# With no arguments a REPL is started
./cli.js
# otherwise search and exit
./cli.js <words>
```

Or require it in your code:

```js
const BrowsersDB = require('./BrowsersDB')
// pass the name of the browsers or `all`
const browsers = new BrowsersDB('all')

browsers.start((error) => {
  // handle error
  browsers.query(word, (err, resp) => {
    // handle error
    console.log(resp)
  })
}
```

By default each browser's query is limited to 20 results, in the future this could be customizable

## Contributing
Any help is welcome, just send a pull request (please document a little what you want to do), with any ideas/code

## MIT LICENSE

The MIT License (MIT)
Copyright (c) 2019 m0n0l0c0

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
OR OTHER DEALINGS IN THE SOFTWARE.
