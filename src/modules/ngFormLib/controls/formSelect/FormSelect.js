import angular from 'angular';
import FormLibCommon from '../common';
import ErrorMessageContainer from '../errorMessageContainer/ErrorMessageContainer';

const mod = angular.module('ngFormLib.controls.formSelect', [FormLibCommon, ErrorMessageContainer]);

export default mod.name;

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
      formControlService.addLabelText(labelElem, tAttr.label);
      addPlaceholder(inputElem, tAttr.placeholder);  // Adds the extra option element to the start of the <option>

      formControlService.createFieldHint(tElement, inputElem, tAttr.fieldHint, id + '-hint', tAttr.fieldHintDisplay);
      formControlService.createErrorFeatures(inputElem.parent(), inputElem, name, tAttr.label, tAttr.fieldErrors, tAttr.textErrors);
    }
  });
}]);

// Populate the template cache with the default template
mod.run(['$templateCache', ($templateCache) => {
  $templateCache.put('ngFormLib/template/formSelect.html', require('./template/FormSelectTemplate.html'));
}]);
