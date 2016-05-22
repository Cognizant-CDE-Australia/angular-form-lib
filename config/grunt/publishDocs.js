module.exports = function (grunt) {
  'use strict';

  grunt.extendConfig({
    PKG: grunt.file.readJSON('package.json'),
    'gh-pages': {
      options: {
        tag: 'v<%= PKG.version %>_doc',
        message: 'docs(github): Update documentation for v<%= PKG.version %>',
        base: 'dist',
        push: true,
        branch: 'gh-pages',
        user: {
          name: 'TravisCI',
          email: 'fake-email@travisci.com'
        },
        repo: 'https://' + process.env.GH_TOKEN + '@github.com/odecee/angular-form-lib.git',
        silent: true
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
