module.exports = function (grunt) {
  'use strict';

  grunt.extendConfig({
    PKG: grunt.file.readJSON('package.json'),
    'gh-pages': {
      options: {
        tag: 'v<%= PKG.version %>_doc',
        message: 'docs(v<%= PKG.version %>): Update documentation',
        base: 'dist',
        push: false,
        branch: 'gh-pages'
      },
      src: ['**']
    }
  });

  grunt.registerTask('publishSite', 'Publishes the GitHub Pages site', function() {
    // Modify the dist/assets/config/docConfig.json file
    var docConfig = grunt.file.readJSON('dist/assets/config/docConfig.json');
    docConfig.version = grunt.config('PKG').version;
    grunt.file.writeJSON(docConfig);

    grunt.task.run('gh-pages');
  });
};
