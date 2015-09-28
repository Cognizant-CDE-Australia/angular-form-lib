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

    return formControlService.buildDirective({
      controlName: 'formInput',
      expectedTemplateElements: ['input', 'label'],
      expectedAttributes: ['label', 'inputType'],
      configFn: function(tElement, tAttr, id, name, inputElem, labelElem) {
        labelElem.prepend(tAttr.label);
        addPlaceholder(inputElem, tAttr.placeholder); // Do this to be API-compatible with the form-select control. ff-placeholder is still supported. Use one or the other.

        // If the user wants to use 'input-addon-prefix' or 'input-addon-suffix', change the DOM
        var hasInputGroup = addInputGroup(inputElem, tAttr.inputPrefix, tAttr.inputSuffix);
        var parentElemForErrors = (hasInputGroup) ? inputElem.parent().parent() : inputElem.parent();

        formControlService.createFieldHint(tElement, inputElem, tAttr.fieldHint, id + '-hint', tAttr.fieldHintDisplay);
        formControlService.createErrorFeatures(parentElemForErrors, inputElem, name, tAttr.label, tAttr.fieldErrors, tAttr.textErrors);
      }
    });
  }]);

  function addPlaceholder(inputElem, placeholderText) {
    if (placeholderText) {
      inputElem.attr('placeholder', placeholderText);
    }
  }


  function addInputGroup(inputElem, inputGroupPrefix, inputGroupSuffix) {
    if (inputGroupPrefix || inputGroupSuffix) {
      inputElem.wrap('<div class="input-group">');//inputElem.parent(); // This should be the 'control-row' element//wrap('<div class="input-group">');
      var wrapper = inputElem.parent();

      if (inputGroupPrefix) {
        wrapper.prepend('<span class="input-group-addon">' + inputGroupPrefix + '</span>');
      }
      if (inputGroupSuffix) {
        wrapper.append('<span class="input-group-addon">' + inputGroupSuffix + '</span>');
      }
      return true;
    }
    return false;
  }

})(window.angular);
