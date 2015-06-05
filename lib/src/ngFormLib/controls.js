/*
 Copyright 2014-2015 angular-form-lib project contributors (see CONTRIBUTORS.md).
 Licenced under Apache 2.0 licence (see LICENCE.txt)
 */

(function(angular) {
  'use strict';

  // We need the utility module for the DateUtil.getDate() method for the formDateFormat directive, and StringUtil.trim() in controls.common
  angular.module('ngFormLib.controls', [
    'ngFormLib.controls.errorMessageContainer',
    'ngFormLib.controls.formCheckbox',
    'ngFormLib.controls.formDate',
    'ngFormLib.controls.formInput',
    'ngFormLib.controls.formRadioButton',
    'ngFormLib.controls.formSelect',
    'ngFormLib.controls.formReset',
    'ngFormLib.controls.formSubmit'
  ]);

})(window.angular);
