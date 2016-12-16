'use strict';
// This file is run inside a Webpack context, which allows it to use require.context() to get a list of files to include at run time
/*
 * When testing with webpack and ES6, we have to do some extra
 * things to get testing to work right. Because we are gonna write tests
 * in ES6 too, we have to compile those as well. That's handled in
 * karma.conf.js with the karma-webpack plugin. This is the entry
 * file for webpack test. Just like webpack will create a bundle.js
 * file for our client, when we run test, it will compile and bundle them
 * all here! Crazy huh. So we need to do some setup
 */


// START_CONFIT_GENERATED_CONTENT
Error.stackTraceLimit = Infinity;

// Polyfill required for PhantomJS
require('phantomjs-polyfill');

// Load the test dependencies!
require('angular');
require('angular-mocks');
require('angular-animate');
require('angular-scroll');
require('angular-translate');


// Don't load any source code! The unit tests are responsible for loading the code-under-test.
// Includes the *.spec.<ext> files in the unitTest directory. The '../../' is the relative path from where
// this file is (config/testUnit/) to where the source folders are.
var testsContext = require.context('../../src/modules', true, __karmaTestSpec);
testsContext.keys().forEach(testsContext);
// END_CONFIT_GENERATED_CONTENT
