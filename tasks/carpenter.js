/**
 * grunt-carpenter
 * https://github.com/TxSSC/grunt-carpenter
 *
 * Copyright (c) 2013 TxSSC
 * Licensed under the MIT license.
 */

var path = require("path"),
    marked = require("marked"),
    Mustache = require("mustache");

module.exports = function(grunt) {

  /**
   * Carpenter grunt task
   */

  grunt.registerMultiTask("carpenter", "A static site generator for grunt.", function() {
    var options = this.options({
      dataFilename: "data.json",
      metadataDelimiter: "---",
      metadataFieldDelimiter: ":",
      templatePath: "templates"
    });

    this.files.forEach(function(f) {
      var src = f.src.filter(function(file) {
        return grunt.file.isFile(file);
      });

      src.forEach(function(file) {
        var content = compile(file, options);

        if(content) {
          grunt.file.write(f.dest, content);
          grunt.log.ok("Wrote file " + f.dest);
        } else {
          grunt.log.error("File " + file + " was not compiled.");
        }
      });
    });
  });

  /**
   * Extract Metadata from the page head
   *
   * @param {String} content
   * @param {Object} options
   * @return {Object}
   */

  function extractMetadata(content, options) {
    var meta, kDelim, mDelim, match, matcher;

    mDelim = options.metadataDelimiter;
    kDelim = options.metadataFieldDelimiter;
    matcher = new RegExp("^" + mDelim + "([\\s\\S]*?)" + mDelim + "$", "m");
    match = content.match(matcher);
    meta = match ? match[1] : "";

    return {
      meta: parseMetadata(meta, kDelim),
      content: content.slice(match ? match[0].length : 0)
    };
  }

  /**
   * Build an object from each line of the Metadata
   *
   * @param {String} content
   * @param {String} delimiter
   * @return {Object}
   */

  function parseMetadata(content, delimiter) {
    var match, data = {},
        matcher = new RegExp("^(\\w+)\\s*" + delimiter + "\\s*(.+)$", "m");

    while(content.length) {
      match = content.match(matcher);

      if(match) {
        data[match[1].toLowerCase()] = match[2];
        content = content.slice(match[0].length);
        grunt.verbose.write("Found meta key " + match[1].toLowerCase());
      } else {
        break;
      }
    }

    return data;
  }

  /**
   * Compile all templates in the given path `p`
   *
   * @param {String} p path to layouts
   * @return {Object}
   */

  function compileTemplates(p) {
    var content, templates = {},
        files = grunt.file.expand({ cwd: p }, "**/*.{html,mustache}");

    files.forEach(function(file) {
      content = grunt.file.read(path.join(p, file));
      templates[file] = Mustache.compile(content);
      grunt.verbose.write("Compiled template " + path.join(p, file));
    });

    return templates;
  }

  /**
   * Return the filetype parser for the file
   *
   * @param {String} p
   * @return {Function}
   */

  function parser(p) {
    var type = path.extname(p).slice(1);

    if(type === "md" || type === "markdown") {
      return marked;
    }

    return function(c) {
      return c;
    };
  }

  /**
   * Get the nearest data file to `p`
   *
   * @param {String} p
   * @param {String} filename
   * @return {Object}
   */

  function readData(p, filename) {
    var data,
        f = grunt.file.findup(filename, { cwd: path.dirname(p) });

    if(!f) {
      grunt.fail.warn("Unable to find " +
        filename + " in path " + path.dirname(p) + ".");
      return null;
    }

    try {
      data = grunt.file.readJSON(f);
      grunt.log.debug("Using data file - " + f + " for file " + p);
    } catch(e) {
      grunt.fail.fatal(e.message);
    }

    return data;
  }

  /**
   * Compile the file using data in file `p`
   *
   * @param {String} p path to file
   * @param {Object} options
   * @return {String}
   */

  function compile(p, options) {
    var fn, data, rData, layout, template, templates;

    fn = parser(p);
    rData = readData(p, options.dataFilename);
    templates = compileTemplates(options.templatePath);

    if(!rData) {
      return null;
    }

    layout = templates[rData.layout];
    template = templates[rData.template];
    delete rData.layout;
    delete rData.template;

    if(!layout) {
      grunt.fail.warn("Unable to find layout " + layout);
      return null;
    }

    if(!template) {
      grunt.fail.warn("Unable to find template " + template);
      return null;
    }

    data = extractMetadata(grunt.file.read(p), options);
    data.content = fn(data.content);
    data = grunt.util._.merge(data, rData);
    data.content = template(data);

    return layout(data);
  }

};
