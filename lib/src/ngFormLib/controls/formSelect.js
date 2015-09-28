/*
 Copyright 2014-2015 angular-form-lib project contributors (see CONTRIBUTORS.md).
 Licenced under Apache 2.0 licence (see LICENCE.txt)
*/

(function(angular) {
  'use strict';

  var mod = angular.module('ngFormLib.controls.formSelect', [
    'ngFormLib.controls.common',
    'ngFormLib.controls.errorMessageContainer'
  ]);

  // INPUT:
  //  <form-select id="frm-size" name="bookSize" required="true" label="Approximate size"
  //    ff-class="span12" ff-ng-model="model.size" placeholder="Select a size bracket"
  //    ff-ng-options="option.value as option.name for option in refData.bookSizes"
  //    field-errors="{required: 'Please select a size bracket'}"
  //    text-errors="['data.errors']"></form-select>

  // OUTPUT:



  mod.directive('formSelect', ['formControlService', function(formControlService) {

    function addPlaceholder(selectElem, placeholderText) {
      if (placeholderText) {
        selectElem.append('<option translate value="">' + placeholderText + '</option>');
      }
    }

    return formControlService.buildDirective({
      controlName: 'formSelect',
      inputElementName: 'select',
      expectedTemplateElements: ['select', 'label'],
      expectedAttributes: ['label'],
      configFn: function(tElement, tAttr, id, name, inputElem, labelElem) {
        labelElem.prepend(tAttr.label);
        addPlaceholder(inputElem, tAttr.placeholder);  // Adds the extra option element to the start of the <option>

        formControlService.createFieldHint(tElement, inputElem, tAttr.fieldHint, id + '-hint', tAttr.fieldHintDisplay);
        formControlService.createErrorFeatures(inputElem.parent(), inputElem, name, tAttr.label, tAttr.fieldErrors, tAttr.textErrors);
      }
    });

  }]);
})(window.angular);

angular.module('ngFormLib/controls/formSelect/template/FormSelectTemplate.html', []).run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('ngFormLib/controls/formSelect/template/FormSelectTemplate.html',
    "<div class=form-group><label class=control-label></label><div class=control-row><select class=form-control></select></div></div>"
  );

}]);
