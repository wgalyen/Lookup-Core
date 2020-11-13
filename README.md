Lookup-Core
===========

> This repository contains the core code of the Lookup framework. If you want to use Lookup, please visit the main [Lookup repository](https://github.com/wgalyen/Lookup).

Lookup Core provides a framework of sorts for creating static site generators in Nodejs.  It uses Markdown files as the basis for content structure and uses [Lunr.js](http://lunrjs.com) to provide full-text search functionality.

## Install

    npm install lookup-core

## Usage

```
var lookup = require('lookup-core');
lookup.getPage('path/to/a-file.md');
```

## Credits

Lookup was created by [Warren Galyen](http://mechnaikdesign.com). Released under the [MIT license](https://raw.githubusercontent.com/wgalyen/Lookup-Core/master/LICENSE).
