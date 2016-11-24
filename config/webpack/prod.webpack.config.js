'use strict';

// START_CONFIT_GENERATED_CONTENT
const path = require('path');
const webpack = require('webpack');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');

let config = require('./webpack.config.js');
const helpers = require('./webpackHelpers')(path.resolve(__dirname, '../../'));

const ENV = process.env.ENV = process.env.NODE_ENV = 'production';
const HMR = helpers.hasProcessFlag('hot');

/**
 * Devtool
 * Reference: https://webpack.js.org/configuration/devtool/
 * Type of sourcemap to use per build type
 */
Object.assign(config, {
  devtool: 'source-map'
});


/**
 * Add additional plugins to the compiler.
 *
 * See: http://webpack.github.io/docs/configuration.html#plugins
 */

/**
 * Plugin: DefinePlugin
 * Description: Define free variables.
 * Useful for having development builds with debug logging or adding global constants.
 *
 * Environment helpers
 *
 * See: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
 */
// NOTE: when adding more properties make sure you include them in custom-typings.d.ts
config.plugins.push(
  new DefinePlugin({
    'ENV': JSON.stringify(ENV),
    'HMR': HMR,
    'process.env': {
      'ENV': JSON.stringify(ENV),
      'NODE_ENV': JSON.stringify(ENV),
      'HMR': HMR,
    }
  })
);

/**
 * Plugin LoaderOptionsPlugin (experimental)
 *
 * See: https://gist.github.com/sokra/27b24881210b56bbaff7
 */
let loaderOptions = {
  debug: false,
  minimize: true,
  options: Object.assign({}, config.loaderOptions)
};

delete config.loaderOptions;  // Remove the property so that config is valid

let loaderOptionsPlugin = new LoaderOptionsPlugin(loaderOptions);

config.plugins.push(loaderOptionsPlugin);

// END_CONFIT_GENERATED_CONTENT

// Remove the CommonsChunk plugin, as it interferes with the module that we are trying to build
config.plugins = config.plugins.filter(function (plugin) {
  return !(plugin.ident && plugin.ident.indexOf('CommonsChunkPlugin'));
});

// Only have a single entry-point when building for production/distribution
config.entry = {
  ngFormLib: ['./modules/ngFormLib/index.js']
};
config.output.filename = 'es5/[name].js';
config.output.libraryTarget = 'umd';


// Exclude the external dependencies from the distributed module
config.externals = {
  angular: 'angular',
  'angular-animate': 'angular-animate',
  'angular-scroll': 'angular-scroll',
  'angular-translate': 'angular-translate'
};

module.exports = config;
