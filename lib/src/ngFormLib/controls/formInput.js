/*
 Copyright 2014-2015 angular-form-lib project contributors (see CONTRIBUTORS.md).
 Licenced under Apache 2.0 licence (see LICENCE.txt)
 */

(function(angular) {
  'use strict';

  var mod = angular.module('ngFormLib.controls.formInput', [
    'ngFormLib.controls.common',
    'ngFormLib.controls.errorMessageContainer'
  ]);

  // INPUT:
  //  <form-input id="" name="" label="Last name" required="{{expression}}"
  //      ff-class="span12" input-type="text|tel|email" ff-ng-model="application.lastName"
  //      ff-maxlength="40" ff-ng-pattern="/^[a-zA-Z0-9 \-.']+$/"
  //      field-hint="This must be the last name of the person who originally applied for the service."
  //      field-errors="{required: 'Please enter a valid last name', pattern: 'Please enter a valid last name'}"
  //      text-errors="['data.errors.']"
  //      content-class="span3"
  //      >My content</form-input>

  // OUTPUT:


  mod.directive('formInput', ['formControlService', function(formControlService) {

    function addPlaceholder(inputElem, placeholderText) {
      if (placeholderText) {
        inputElem.attr('placeholder', placeholderText);
      }
    }

    return formControlService.buildDirective({
      controlName: 'formInput',
      templateType: 'template',
      expectedTemplateElements: ['input', 'label'],
      expectedAttributes: ['label', 'inputType'],
      configFn: function(tElement, tAttr, id, name, inputElem, labelElem) {
        labelElem.prepend(tAttr.label);
        addPlaceholder(inputElem, tAttr.placeholder); // Do this to be API-compatible with the form-select control. ff-placeholder is still supported. Use one or the other.

        formControlService.createFieldHint(tElement, inputElem, tAttr.fieldHint, id + '-hint', tAttr.fieldHintDisplay);
        formControlService.createErrorFeatures(inputElem.parent(), inputElem, name, tAttr.label, tAttr.fieldErrors, tAttr.textErrors);
      }
    });
  }]);
})(window.angular);
