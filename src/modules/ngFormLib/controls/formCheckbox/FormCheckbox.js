import angular from 'angular';
import FormLibCommon from '../common/index';
import ErrorMessageContainer from '../errorMessageContainer/ErrorMessageContainer';

const mod = angular.module('ngFormLib.controls.formCheckbox', [FormLibCommon, ErrorMessageContainer]);

export default mod.name;


// INPUT:
//  <form-checkbox id="id" name="name" required="{{expression}}"
//      ff-class="span12" ff-ng-model="application.contentType" ff-value="software" ff-aria-label="Software"
//        ff-ng-click="doSomething()"
//      field-errors="{required: 'Please select'}"
//      text-errors="['wrong value']"
//      >My label with <a href="http://www.google.com/">HTML bits</a> in it</form-checkbox>

// OUTPUT:


mod.directive('formCheckbox', ['formControlService', function(formControlService) {
  return formControlService.buildDirective({
    controlName: 'formCheckbox',
    expectedTemplateElements: ['input', 'label', 'div'],
    expectedAttributes: [],
    configFn: function(tElement, tAttr, id, name, inputElem) {
      formControlService.createErrorFeatures(tElement, inputElem, name, '', tAttr.fieldErrors, tAttr.textErrors);
      formControlService.buildNgClassExpression(inputElem, inputElem);  // Put the ng-class onto the input element itself, as this makes styling easier
    },
  });
}]);

// Populate the template cache with the default template
mod.run(['$templateCache', ($templateCache) => {
  $templateCache.put('ngFormLib/template/formCheckbox.html', require('./template/FormCheckboxTemplate.html'));
}]);
