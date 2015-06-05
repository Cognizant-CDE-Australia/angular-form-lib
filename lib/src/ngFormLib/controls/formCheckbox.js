/*
 Copyright 2014-2015 angular-form-lib project contributors (see CONTRIBUTORS.md).
 Licenced under Apache 2.0 licence (see LICENCE.txt)
 */

(function(angular) {
  'use strict';

  var mod = angular.module('ngFormLib.controls.formCheckbox', [
    'ngFormLib.controls.common',
    'ngFormLib.controls.errorMessageContainer'
  ]);

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
      templateType: 'templateUrl',
      expectedTemplateElements: ['input', 'label', 'div'],
      expectedAttributes: [],
      configFn: function(tElement, tAttr, id, name, inputElem) {
        // Move the class attribute from the outer-DIV to the checkbox DIV (special case)
        var checkboxDiv = tElement.find('div');
        checkboxDiv.addClass(tElement.attr('class'));
        tElement.removeAttr('class');

        formControlService.createErrorFeatures(tElement, inputElem, name, '', tAttr.fieldErrors, tAttr.textErrors);
        formControlService.buildNgClassExpression(inputElem, inputElem);  // Put the ng-class onto the input element itself, as this makes styling easier
      }
    });

  }]);
})(window.angular);

angular.module('ngFormLib/controls/formCheckbox/template/FormCheckboxTemplate.html', []).run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('ngFormLib/controls/formCheckbox/template/FormCheckboxTemplate.html',
    "<div form-group><div class=checkbox><input type=checkbox field-error-controller><label><span ng-transclude></span></label></div></div>"
  );

}]);
