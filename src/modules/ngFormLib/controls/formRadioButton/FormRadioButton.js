import angular from 'angular';
import FormLibCommon from '../common';
import ErrorMessageContainer from '../errorMessageContainer/ErrorMessageContainer';

const mod = angular.module('ngFormLib.controls.formRadioButton', [FormLibCommon, ErrorMessageContainer]);

export default mod.name;


// INPUT:
//  <form-radio-button uid="fld" name="name" aria-label="Book Type" label-class="btn btn-toggle"
//    ff-class="someCSS" ff-ng-model="application.bookType" ff-value="Fiction" ng-click="loadFiction()" class="span6">
//     <icon class="icon-fiction"></icon>Fiction
//  </form-radio-button>

// OUTPUT:

mod.directive('formRadioButton', ['formControlService', function(formControlService) {

  return formControlService.buildDirective({
    controlName: 'formRadioButton',
    expectedTemplateElements: ['input', 'label', 'div'],
    expectedAttributes: [], // The template should NOT have a form-group element inside it, as this has to be specified externally (due to the group-nature of radio buttons)
    configFn: function(tElement, tAttr, id, name, inputElem) {
      // Move the class attribute from the outer-DIV to the radio-button DIV (special case)
      var rbDiv = tElement.find('div');
      rbDiv.addClass(tElement.attr('class'));
      tElement.removeAttr('class');

      formControlService.createErrorFeatures(tElement, inputElem, name, '', tAttr.fieldErrors, tAttr.textErrors);
      formControlService.buildNgClassExpression(inputElem, inputElem);  // Put the ng-class onto the input element itself, as this makes styling easier
    }
  });
}]);


// Populate the template cache with the default template
mod.run(['$templateCache', ($templateCache) => {
  $templateCache.put('ngFormLib/template/formRadioButton.html', require('./template/FormRadioButtonTemplate.html'));
}]);
