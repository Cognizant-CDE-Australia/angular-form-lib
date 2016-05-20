module.exports = function (grunt) {
  'use strict';

  grunt.extendConfig({
    eslint: {
      options: {
        configFile: 'config/verify/.eslintrc',
        quiet: true // Report errors only
      },
      all: {
        src: [
            'src/**/*.js',
            'config/**/*.js'
          ]
      }
    },
    stylint: {
      all: {
        options: {
          configFile: 'config/verify/.stylintrc'
        },
        src: [
            'src/**/*.styl'
          ]
      }
    },
    watch: {
      verify: {
        options: {
          spawn: true
        },
        files: [
            'src/**/*.js',
            'config/**/*.js',
            '!src/modules/**/demoModule/',
            'src/**/*.styl'
          ],
        tasks: [
            'newer:eslint:all',
            'newer:stylint:all'
          ]
      }
    }
  });

  grunt.registerTask('verify', 'Run all the verify tasks', [
  'eslint:all',
  'stylint:all'
]);
};
