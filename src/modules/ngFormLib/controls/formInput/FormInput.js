import angular from 'angular';
import FormLibCommon from '../common';
import ErrorMessageContainer from '../errorMessageContainer/ErrorMessageContainer';

const mod = angular.module('ngFormLib.controls.formInput', [FormLibCommon, ErrorMessageContainer]);

export default mod.name;


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
      formControlService.addLabelText(labelElem, tAttr.label);
      addPlaceholder(inputElem, formControlService.translate(tAttr.placeholder)); // Do this to be API-compatible with the form-select control. ff-placeholder is still supported. Use one or the other.

      // If the user wants to use addons (either text or buttons), change the DOM
      var hasInputGroup = formControlService.addInputGroup(inputElem, tAttr);
      var parentElemForErrors = hasInputGroup ? inputElem.parent().parent() : inputElem.parent();

      formControlService.createFieldHint(tElement, inputElem, tAttr.fieldHint, id + '-hint', tAttr.fieldHintDisplay);
      formControlService.createErrorFeatures(parentElemForErrors, inputElem, name, tAttr.label, tAttr.fieldErrors, tAttr.textErrors);
    }
  });
}]);

// Populate the template cache with the default template
mod.run(['$templateCache', ($templateCache) => {
  $templateCache.put('ngFormLib/template/formInput.html', require('./template/FormInputTemplate.html'));
}]);


function addPlaceholder(inputElem, placeholderText) {
  if (placeholderText) {
    inputElem.attr('placeholder', placeholderText);
  }
}


