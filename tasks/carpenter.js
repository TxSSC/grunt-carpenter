/*
 * grunt-carpenter
 * https://github.com/TxSSC/grunt-carpenter
 *
 * Copyright (c) 2013 Cody Stoltman
 * Licensed under the MIT license.
 */

'use strict';

var marked = require('marked'),
    Handlebars = require('handlebars');

module.exports = function(grunt) {

  grunt.registerMultiTask('carpenter', 'Your task description goes here.', function() {

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      layoutFolder: "templates/layouts",
      templatesFolder: "templates"
    });

    this.files.forEach(function(f) {
      options.destination = f.dest;

      f.src.forEach(function(item) {
        if(grunt.file.isDir(item)) {
          expandFolder(item, options);
          return false;
        }

        writeFile(item, options);
      });
    });
  });

  var expandFolder = function(dir, options) {
    var config;

    grunt.file.recurse(dir, function(abspath, rootdir, subdir, filename) {
      if(filename === 'data.json') {
        config = grunt.file.readJSON(abspath);

        grunt.util._.merge(options, config);

        options.layout = config.layout ?
          grunt.file.read(options.layoutFolder + "/"  + config.layout) : "{{{content}}}";

        options.template = config.template ?
          grunt.file.read(options.templatesFolder + "/"  + config.template) : "{{{content}}}";

        return false;
      }

      if(grunt.file.isDir(abspath)) {
        expandFolder(abspath, options);
        return false;
      }

      writeFile(abspath, options);
    });
  };

  var writeFile = function(path, options) {
    var dest = options.destination || "",
        content = marked(grunt.file.read(path)),
        data = {},
        destination;

    data.content = content;
    grunt.util._.merge(data, options);

    path = path.split('content/')[1];
    destination = dest + '/' + path.split('.md')[0] + '.html';

    if(options.template) {
      data.content = compileTemplate(options.template, data);
    }

    if(options.layout) {
      data.content = compileTemplate(options.layout, data);
    }

    grunt.file.write(destination, data.content);
  };

  var compileTemplate = function(template, data) {
    var fn = Handlebars.compile(template);
    return fn(data);
  };

};
