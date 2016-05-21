module.exports = function (grunt) {
  'use strict';

  grunt.extendConfig({
    PKG: grunt.file.readJSON('package.json'),
    'gh-pages': {
      options: {
        tag: 'v<%= PKG.version %>_doc',
        message: 'docs(v<%= PKG.version %>): Update documentation',
        base: 'dist',
        push: true,
        branch: 'gh-pages',
        user: {
          name: 'Brett Uglow',
          email: 'buglow@odecee.com.au'
        }
      },
      src: ['**']
    }
  });

  grunt.registerTask('publishDocs', 'Publishes the GitHub Pages site', function() {
    // Modify the dist/assets/config/docConfig.json file
    var configPath = 'dist/assets/config/docsConfig.json';
    var docConfig = grunt.file.readJSON(configPath);
    docConfig.version = grunt.config('PKG').version;

    grunt.log.ok('Updated docConfig.json version to ' + docConfig.version);
    grunt.file.write(configPath, JSON.stringify(docConfig, null, '  '));

    grunt.task.run('gh-pages');
  });
};
