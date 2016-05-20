'use strict';

// START_CONFIT_GENERATED_CONTENT
var _ = require('lodash');
var config = require('./webpack.config.js');
var webpack = require('webpack');

_.merge(config, {
  debug: false,
  devtool: 'source-map'
});

// Merging of arrays is tricky - just push the item onto the existing array
config.plugins.push(new webpack.DefinePlugin({
  __DEV__: false,
  __PROD__: true
}));
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
