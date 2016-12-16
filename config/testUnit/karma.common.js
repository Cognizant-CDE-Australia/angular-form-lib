// Global karma config
'use strict';

// START_CONFIT_GENERATED_CONTENT
const DefinePlugin = require('webpack').DefinePlugin;   // Needed to pass the testFilesRegEx to test.files.js
let testFilesRegEx = /unitTest\/.*spec\.(js|jsx)$/;

// Customise the testFilesRegEx to filter which files to test, if desired.
// Remember to also update .babelrc
// E.g.
// if (process.argv.indexOf('--spec') !== -1) {
//   testFilesRegEx = ...
// }
// END_CONFIT_GENERATED_CONTENT


// START_CONFIT_GENERATED_CONTENT
// We want to re-use the loaders from the dev.webpack.config
let webpackConfig = require('./../webpack/dev.webpack.config.js');
let preprocessorList = ['webpack', 'sourcemap'];

let karmaConfig = {
  autoWatch: true,

  // base path, that will be used to resolve files and exclude
  basePath: '../../',

  // testing framework to use (jasmine/mocha/qunit/...)
  frameworks: ['jasmine'],

  // list of files / patterns to exclude
  exclude: [],

  // web server default port
  port: 8081,

  // Start these browsers, currently available:
  // - Chrome, ChromeCanary, Firefox, Opera, Safari (only Mac), PhantomJS, IE (only Windows)
  browsers: [
    'PhantomJS'
  ],

  plugins: [
    'karma-phantomjs-launcher',
    'karma-jasmine',
    'karma-junit-reporter',
    'karma-coverage',
    'karma-chrome-launcher',
    require('karma-webpack'),
    'karma-sourcemap-loader',
    'karma-threshold-reporter'
  ],

  files: [
    'node_modules/phantomjs-polyfill/bind-polyfill.js',
    'config/testUnit/test.files.js'
  ],

  preprocessors: {
    'config/testUnit/test.files.js': preprocessorList
  },

  reporters: ['progress', 'junit', 'coverage', 'threshold'],

  coverageReporter: {
    dir: 'reports/coverage/',
    reporters: [
      { type: 'cobertura', subdir: 'cobertura' },
      { type: 'lcovonly', subdir: 'lcov' },
      { type: 'html', subdir: 'html' },
      { type: 'json', subdir: 'json' },
      { type: 'text' }
    ]
  },

  junitReporter: {
    outputDir: 'reports/unit/'
  },

  thresholdReporter: require('./thresholds.json'),

  // Webpack please don't spam the console when running in karma!
  webpackMiddleware: { stats: 'errors-only'},

  singleRun: false,
  colors: true
};









webpackConfig.plugins.push(new DefinePlugin({
  __karmaTestSpec: testFilesRegEx
}));

// Change devtool to allow the sourcemap loader to work: https://github.com/webpack/karma-webpack
webpackConfig.devtool = 'inline-source-map';

karmaConfig.webpack = webpackConfig;
// END_CONFIT_GENERATED_CONTENT

module.exports = karmaConfig;
