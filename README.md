# grunt-includes [![Build Status](https://travis-ci.org/TxSSC/grunt-carpenter.png?branch=master)](https://travis-ci.org/TxSSC/grunt-carpenter)

***Requires grunt ~0.4.0***

A grunt task for building static sites from markdown and html.

## Getting Started

Install this grunt plugin next to your project's *Gruntfile.js* with: `npm install grunt-carpenter --save-dev`

Then add this line to your project's `Gruntfile.js`:

```javascript
grunt.loadNpmTasks('grunt-carpenter');
```

## Options

#### dataFileName
Type: `String`
Default: `"data.json"`

Filename of the file that contains template information regarding the current file. This file fill be looked for upwards in the directory tree. Any keys apart from `layout` and `template` will be merged into the data object before templates are rendered.

#### metadataDelimiter
Type: `String`
Default: `"---"`

The character or set of characters that will show *grunt-carpenter* where the metadata for the particular file is.

#### metadataFieldDelimiter
Type: `String`
Default: `":"`

The character or set of characters that will be used to split `key: value` metadata pairs.

#### templatePath
Type: `String`
Default: `"templates"`

The path to templates used by the site.

## Usage

Typical usage is done by using grunt's built in dynamic file objects, see [building the files object dynamically](http://gruntjs.com/configuring-tasks#building-the-files-object-dynamically) for reference.

An example from the *grunt-carpenter* `Gruntfile.js`:

```javascript
carpenter: {
  base: {
    options: {
      templatePath: "test/fixtures/templates"
    },
    files: [
      {
        expand: true,
        cwd: 'test/fixtures/',
        src: ['content/**/*.md', 'content/**/*.html'],
        dest: 'tmp',
        ext: '.html'
      }
    ]
  }
}
```

## License (MIT)

Copyright (c) 2013 TxSSC

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.