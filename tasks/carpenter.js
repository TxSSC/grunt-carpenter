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

  // Set Defaults, should be configurable in Multi-Task
  var defaults = {
    layoutFolder: "templates/layouts",
    templatesFolder: "templates"
  };

  grunt.registerMultiTask('carpenter', 'Your task description goes here.', function() {
    var self = this;

    this.files.forEach(function(f) {

      f.src.forEach(function(item) {

        var options = grunt.util._.clone(defaults);
        options.destination = f.dest;

        if(grunt.file.isDir(item)) {
          expandFolder(item, options);
        }
      });
    });
  });

  var expandFolder = function(dir, options) {
    var files = grunt.file.expand(dir + '/*'),
        config = options || {},
        folders = [];

    // Check for a data.json file and load config
    files.forEach(function(file) {
      var filename = file.split('/').pop();
      if(filename === 'data.json') {
        var data = grunt.file.readJSON(file);
        config = grunt.util._.merge(options, data);
      }
    });

    // Create the filetree giving priority to top level files
    files.forEach(function(file) {
      if(grunt.file.isDir(file)) {
        folders.push(file);
        return false;
      }

      var filename = file.split('/').pop();
      if(filename !== 'data.json') {
        var data = grunt.util._.clone(config);
        data = loadLayouts(data);
        writeFile(file, data);
      }
    });

    // Expand Each Folder
    folders.forEach(function(folder) {
      expandFolder(folder, config);
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

  // Set the Layout and Template value, should be per file
  var loadLayouts = function(options) {
    options.layout = options.layout ?
      grunt.file.read(options.layoutFolder + "/"  + options.layout) : "{{{content}}}";

    options.template = options.template ?
      grunt.file.read(options.templatesFolder + "/"  + options.template) : "{{{content}}}";

    return options;
  };

  // Compile the Template using Handlebars
  var compileTemplate = function(template, data) {
    var fn = Handlebars.compile(template);
    return fn(data);
  };

};
