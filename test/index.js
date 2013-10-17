var grunt = require('grunt');

exports.carpenter = {

  /**
   * Tests for `grunt-carpenter`
   */

  basic: function(test) {
    var i, len, expect, result, tests;

    tests = grunt.file.expand({ cwd: "test/expected" }, "**/*.{md,html}");
    test.expect(tests.length);

    for(i = 0, len = tests.length; i < len; i++) {
      expect = grunt.file.read("test/expected/" + tests[i]);
      result = grunt.file.read("tmp/" + tests[i]);
      test.equal(expect, result, "should correctly compile " + tests[i]);
    }

    test.done();
  }
};
