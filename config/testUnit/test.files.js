'use strict';
// This file is run inside a Webpack context, which allows it to use require.context() to get a list of files to include at run time

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
