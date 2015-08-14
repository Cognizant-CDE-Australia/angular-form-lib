/*
 Copyright 2014-2015 angular-form-lib project contributors (see CONTRIBUTORS.md).
 Licenced under Apache 2.0 licence (see LICENCE.txt)
*/

(function(angular) {
  'use strict';

  // Define modules
  angular.module('ngFormLib', ['ngAnimate',
    'ngFormLib.policy',
//    Add the policies you want, or define your own:
//    'ngFormLib.policy.checkForStateChanges',
//    'ngFormLib.policy.displayError',
//    'ngFormLib.policy.focusBehaviour',
    'ngFormLib.controls'
  ]);

})(window.angular);
