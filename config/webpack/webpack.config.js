'use strict';

// START_CONFIT_GENERATED_CONTENT
/** Build START */

// For Upgrading from Webpack 1.x, see https://webpack.js.org/how-to/upgrade-from-webpack-1/
const webpack = require('webpack');
const path = require('path');
const helpers = require('./webpackHelpers')(path.resolve(__dirname, '../../'));


/*
 * Webpack Constants
 */
const HMR = helpers.hasProcessFlag('hot');
const METADATA = {
  title: 'Confit Sample Project',
  baseUrl: '/',
  isDevServer: helpers.isWebpackDevServer(),
  HMR: HMR
};



// https://gist.github.com/sokra/27b24881210b56bbaff7#resolving-options
let jsExtensions = [
      '.json',
      '.js',
      '.js',
      '.jsx'
    ];
let moduleDirectories = ['node_modules', 'bower_components']; // Only needed to exclude directories for certain loaders, not for resolving modules.


let config = {
  context: helpers.root('src'),  // The baseDir for resolving the entry option and the HTML-Webpack-Plugin


  /**
   * Devtool
   * Reference: https://webpack.js.org/configuration/devtool/
   * Type of sourcemap to use per build type
   */
  devtool: 'source-map',

  /**
   * Options affecting the output of the compilation.
   *
   * See: https://webpack.js.org/configuration/output/
   */
  output: {
    filename: 'js/[name].[hash:8].js',
    chunkFilename: 'js/[id].[chunkhash:8].js',  // The name for non-entry chunks
    path: helpers.root('dist/'),
    pathinfo: false   // Add path info beside module numbers in source code. Do not set to 'true' in production. http://webpack.github.io/docs/configuration.html#output-pathinfo
  },

  module: {
    rules: []
  },

  /*
   * Add additional plugins to the compiler.
   *
   * See: http://webpack.github.io/docs/configuration.html#plugins
   */
  plugins: [

    // Prints more readable module names in the browser console on HMR updates
    new webpack.NamedModulesPlugin()
  ],

  /*
   * Options affecting the resolving of modules.
   *
   * See: http://webpack.github.io/docs/configuration.html#resolve
   */
  resolve: {

    /*
     * An array of extensions that should be used to resolve modules.
     *
     * See: http://webpack.github.io/docs/configuration.html#resolve-extensions
     * See: https://gist.github.com/sokra/27b24881210b56bbaff7#resolving-options
     */
    extensions: jsExtensions,

    // An array of directory names to be resolved to the current directory
    modules: [helpers.root('src/'), 'node_modules']
  },


  // Output stats to provide more feedback when things go wrong:
  stats: {
    colors: true,
    modules: true,
    reasons: true
  },

  /*
   * Include polyfills or mocks for various node stuff
   * Description: Node configuration
   *
   * See: https://webpack.github.io/docs/configuration.html#node
   */
  node: {
    global: true,
    crypto: 'empty',
    process: false,
    module: false,
    clearImmediate: false,
    setImmediate: false
  },

  loaderOptions: {}     // Temporary property to allow multiple builders to add their options, then the dev/prod builds will add the LoaderOptionsPlugin
};
/* **/

/** Entry point START **/

config.entry = {
  'docs': [
    './modules/docs/index.js',
    './modules/docs/styles/docs.styl',
    'angular-motion/dist/angular-motion.css',
    'highlightjs/styles/github.css'
  ],
  'ngFormLib': [
    './modules/ngFormLib/index.js'
  ],
  'sampleFormStyle': [
    './modules/docs/styles/sampleFormStyle.styl'
  ]
};

// (Re)create the config.entry.vendor entryPoint
config.entry.vendor = [
  'angular',
  'angular-animate',
  'angular-scroll',
  'angular-translate',
  'highlightjs/highlight.pack.js'
];



/*
 * Plugin: CommonsChunkPlugin
 * Description: Shares common code between the pages.
 * It identifies common modules and put them into a commons chunk.
 *
 * See: https://webpack.js.org/how-to/code-splitting/splitting-vendor/#commonschunkplugin
 * See: https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
 */
let commonsChunkPlugin = new webpack.optimize.CommonsChunkPlugin({
  names: ['vendor', 'manifest'],
  filename: 'vendor/[name].[hash:8].js',
  minChunks: Infinity
});
config.plugins.push(commonsChunkPlugin);

/** Entry point END **/

/** JS START */


let srcLoader = {
  test: helpers.pathRegEx(/src\/.*\.(js|jsx)$/),
  use: [
  {
    'loader': 'babel-loader',
    'options': {
      'cacheDirectory': true
    }
  }
],
  exclude: moduleDirectories    // There should be no need to exclude unit or browser tests because they should NOT be part of the source code dependency tree
};
config.module.rules.push(srcLoader);

/* **/

/** TEST UNIT START */
/* **/

/** Assets START **/
// Output module-assets to: /assets/<moduleName>/font/<fileName>
// Other assets (such as assets in Bootstrap) will need their own loaders
// File-loader still uses the older Webpack 1 syntax.
let fontLoader = {
  test: helpers.pathRegEx(/assets\/font\/.*\.(eot|otf|svg|ttf|woff|woff2)$/),
  loader: 'file-loader?name=assets/[1]/font/[2].[hash:8].[ext]&regExp=' + helpers.pathRegEx('modules/(.*)/assets/font/(.+?)(.[^.]*$|$)')
};
config.module.rules.push(fontLoader);
// Output module-assets to: /assets/<moduleName>/img/<fileName>
// Other assets (such as assets in Bootstrap) will need their own loaders
// File-loader still uses the older Webpack 1 syntax.
let imgLoader = {
  test: helpers.pathRegEx(/assets\/img\/.*\.(gif|ico|jpe?g|png|svg|webp)$/),
  loader: 'file-loader?name=assets/[1]/img/[2].[hash:8].[ext]&regExp=' + helpers.pathRegEx('modules/(.*)/assets/img/(.+?)(.[^.]*$|$)')
};
config.module.rules.push(imgLoader);
// Output module-assets to: /assets/<moduleName>/media/<fileName>
// Other assets (such as assets in Bootstrap) will need their own loaders
// File-loader still uses the older Webpack 1 syntax.
let mediaLoader = {
  test: helpers.pathRegEx(/assets\/media\/.*\.(mp4|webm|wav|mp3|m4a|aac|oga)$/),
  loader: 'file-loader?name=assets/[1]/media/[2].[hash:8].[ext]&regExp=' + helpers.pathRegEx('modules/(.*)/assets/media/(.+?)(.[^.]*$|$)')
};
config.module.rules.push(mediaLoader);


/* **/

/** CSS START **/
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// Pass postCSS options onto the (temporary) loaderOptions property
const autoprefixer = require('autoprefixer');
let supportedBrowsers = {
  browsers: [
      'last 1 version',
      'last 2 versions',
      'ie 8',
      'ie 9',
      'ie 10',
      'ie 11'
    ]
};
config.loaderOptions.postcss = [
  autoprefixer(supportedBrowsers)
];

// ExtractTextPlugin still uses the older Webpack 1 syntax. See https://github.com/webpack/extract-text-webpack-plugin/issues/275
let cssLoader = {
  test: helpers.pathRegEx(/\.(styl)$/),
  loader: ExtractTextPlugin.extract({
    fallbackLoader: 'style-loader',
    loader: 'css-loader!postcss-loader!stylus-loader',
    publicPath: '/'   // This is relative to 'extractCSSTextPlugin.filename' below.
  })
};
config.module.rules.push(cssLoader);

// For any entry-point CSS file definitions, extract them as text files as well
let extractCSSTextPlugin = new ExtractTextPlugin({
  filename: 'css/[name].[contenthash:8].css',     // This affects the cssLoader.loader.publicPath (see above)
  allChunks: true
});
config.plugins.push(extractCSSTextPlugin);
/* **/

/** HTML START */
const HtmlWebpackPlugin = require('html-webpack-plugin');

let indexHtmlPlugin = new HtmlWebpackPlugin({
  template: helpers.root('src/index-template.html'),
  filename: 'index.html',
  title: METADATA.title,
  chunksSortMode: 'dependency',
  metadata: METADATA,   // Becomes available in the template as 'options.metadata'
  inject: false         // We want full control over where we inject the CSS and JS files
});
config.plugins.push(indexHtmlPlugin);


let htmlLoader = {
  test: /\.html$/,
  use: [
    {
      loader: 'html-loader'
    }
  ],
  exclude: /index-template.html$/
};
config.module.rules.push(htmlLoader);



/* **/

/** Server - DEV - START */
const yaml = require('js-yaml');
const fs = require('fs');   // path is declared elsewhere
const confitConfig = yaml.load(fs.readFileSync(path.join(process.cwd(), 'confit.yml')))['generator-confit'];  // Try to keep the code lively! If confit.json changes, this code still works.

const HOST = process.env.HOST || confitConfig.serverDev.hostname;
const PORT = Number(process.env.PORT || confitConfig.serverDev.port);

/**
 * Webpack Development Server configuration
 * Description: The webpack-dev-server is a little node.js Express server.
 * The server emits information about the compilation state to the client,
 * which reacts to those events.
 *
 * See: https://webpack.github.io/docs/webpack-dev-server.html
 */
config.devServer = {
  contentBase: path.resolve(__dirname, 'dev/'),  // We want to re-use this path
  port: PORT,
  host: HOST,
  https: confitConfig.serverDev.protocol === 'https',
  noInfo: false,
  historyApiFallback: true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },
  // CORS settings:
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'accept, content-type, authorization',
    'Access-Control-Allow-Credentials': 'true'
  }
};
/* **/


// To remove content hashes, call helpers.removeHash(config.prop.parent, propertyName, regExMatcher (optional));
// For example helpers.removeHash(config.output, 'fileName', /\[(contentHash|hash).*?\]/)
// END_CONFIT_GENERATED_CONTENT

extractCSSTextPlugin.filename = 'css/[name].css';

// Add additional loaders for Bootstrap assets
config.module.rules.push({
  test: /\.(eot|otf|svg|ttf|woff|woff2)(\?.*)?$/,
  loader: 'file-loader?name=/assets/font/[name].[hash:8].[ext]'
});

config.module.rules.push({
  test: /\.(gif|ico|jpg|png|svg)(\?.*)?$/,
  loader: 'file-loader?name=/assets/img/[name].[hash:8].[ext]'
});

// Add the CSS loader for the extra CSS files we need
config.module.rules.push({
  test: /\.(css)$/,
  loader: ExtractTextPlugin.extract({
    fallbackLoader: 'style-loader',
    loader: 'css-loader!postcss-loader',
    publicPath: '/'   // If this is not specified or is blank, it defaults to 'css/'
  })
});


// Stop webpack from removing whitespace (which breaks the source code formatting
config.loaderOptions.htmlLoader = {
  collapseWhitespace: false
};


module.exports = config;
