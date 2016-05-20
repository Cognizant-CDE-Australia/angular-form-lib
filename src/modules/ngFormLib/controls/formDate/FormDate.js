import angular from 'angular';
import FormLibCommon from '../common';
import ErrorMessageContainer from '../errorMessageContainer/ErrorMessageContainer';


const mod = angular.module('ngFormLib.controls.formDate', [
  FormLibCommon,
  ErrorMessageContainer,
  //'mgcrea.ngStrap.datepicker'   We are using this, but if it is not loaded, we can still offer basic functionality
]);

export default mod.name;

// INPUT:
//    <div form-date id="toDate" name="toDate" label="To date" hide-label="true"
//    ff-ng-model="acctCtrl.search.toDate" ff-max-date="today" ff-bs-show="acctCtrl.datePickers.datePickerTo"
//    ff-ng-blur="acctCtrl.toggleDatePicker('datePickerTo', true)"
//    ff-ng-focus="acctCtrl.toggleDatePicker('datePickerFrom', true)"
//    ff-class="form-control input-beta input-date"
//    field-errors="{date: 'ERROR.DATE_INVALID'}" >
//      <i class="calendar" ng-click="acctCtrl.toggleDatePicker('datePickerTo')"></i>
//    </div>


mod.directive('formDate', ['formControlService', function(formControlService) {

  return formControlService.buildDirective({
    controlName: 'formDate',
    expectedTemplateElements: ['input', 'label'],
    expectedAttributes: ['label'],
    configFn: function(tElement, tAttr, id, name, inputElem, labelElem) {
      formControlService.addLabelText(labelElem, tAttr.label);
      addPlaceholder(inputElem, formControlService.translate(tAttr.placeholder)); // Do this to be API-compatible with the form-select control. ff-placeholder is still supported. Use one or the other.

      // If the user wants to use 'input-addon-prefix' or 'input-addon-suffix', change the DOM
      var hasInputGroup = formControlService.addInputGroup(inputElem, tAttr.inputPrefix, tAttr.inputSuffix);
      var parentElemForErrors = (hasInputGroup) ? inputElem.parent().parent() : inputElem.parent();

      formControlService.createFieldHint(tElement, inputElem, tAttr.fieldHint, id + '-hint', tAttr.fieldHintDisplay);
      formControlService.createErrorFeatures(parentElemForErrors, inputElem, name, tAttr.label, tAttr.fieldErrors, tAttr.textErrors);
    }
  });
}]);

// Populate the template cache with the default template
mod.run(['$templateCache', ($templateCache) => {
  $templateCache.put('ngFormLib/template/formDate.html', require('./template/FormDateInputTemplate.html'));
  try {
    $templateCache.put('datepicker/datepicker.tpl.html', require('angular-strap/src/datepicker/datepicker.tpl.html'));
  } catch (err) {
    console.debug('angular-strap/src/datepicker/datepicker.tpl.html is not available for the formDate control');
  }
}]);


function addPlaceholder(inputElem, placeholderText) {
  if (placeholderText) {
    inputElem.attr('placeholder', placeholderText);
  }
}


mod.directive('formDateFormat', ['ngFormLibDateUtil', function(DateUtil) {
  // All dates greater than AD 0 and less than AD 10000 in dd/mm/yyyy format
  // RegEx behaves oddly if /g is uses in Regexp.test() situations
  var dateRegEx = /^(((0[1-9]|[12][0-9]|3[01])([\/])(0[13578]|10|12)([\/])(\d{4}))|(([0][1-9]|[12][0-9]|30)([\/])(0[469]|11)([\/])(\d{4}))|((0[1-9]|1[0-9]|2[0-8])([\/])(02)([\/])(\d{4}))|((29)(\/)(02)([\/])([02468][048]00))|((29)([\/])(02)([\/])([13579][26]00))|((29)([\/])(02)([\/])([0-9][0-9][0][48]))|((29)([\/])(02)([\/])([0-9][0-9][2468][048]))|((29)([\/])(02)([\/])([0-9][0-9][13579][26])))$/;

  return {
    require: 'ngModel',
    priority: 150,    // Higher priority than ui-mask (100), so the postLink function runs last
    link: function(scope, elem, attrs, ctrl) {

      function resetValidators() {
        ctrl.$setValidity('dateFormat', true);
        ctrl.$setValidity('minDate', true);  // Turn off the error if the date format isn't valid
        ctrl.$setValidity('maxDate', true);  // Turn off the error if the date format isn't valid
      }

      ctrl.$parsers.unshift(function(viewValue) {

        // If viewValue or modelValue is undefined or null, jump out
        if (!viewValue) {
          resetValidators();
          return viewValue;
        }

        if (viewValue.getTime) {
          // Convert the date value to a date string
          viewValue = DateUtil.formatDay(viewValue);
        }

        // If viewValue is a string of 8 digits, then convert it to dd/dd/dddd first
        if (viewValue.length === 8 && !isNaN(viewValue * 1)) {
          viewValue = viewValue.substr(0, 2) + '/' + viewValue.substr(2, 2) + '/' + viewValue.substr(4);
        }

        // Check that it is a valid date
        var dateFormatValid = dateRegEx.test(viewValue) || typeof viewValue === 'undefined' || !viewValue;
        ctrl.$setValidity('dateFormat', dateFormatValid);

        //console.log('dateInput: ' + viewValue + ', ' + ctrl.$modelValue);

        // If the date is valid
        if (dateFormatValid && viewValue) {
          var fieldDate = DateUtil.getDate(viewValue);
          // and there is a min date, check if the value is greater than the min date
          if (attrs.minDate) {
            var minDate = DateUtil.getDate(attrs.minDate);
            ctrl.$setValidity('minDate', fieldDate.getTime() >= minDate.getTime());
          } else {
            ctrl.$setValidity('minDate', true);
          }
          // and there is a max date, check if the value is less than the max date
          if (attrs.maxDate) {
            var maxDate;

            if (attrs.maxDate === 'today') {
              maxDate = DateUtil.getDate(DateUtil.getToday());
            } else {
              maxDate = DateUtil.getDate(attrs.maxDate);
            }

            ctrl.$setValidity('maxDate', fieldDate.getTime() <= maxDate.getTime());
          } else {
            ctrl.$setValidity('maxDate', true);
          }
        } else {
          ctrl.$setValidity('minDate', true);  // Turn off the error if the date format isn't valid
          ctrl.$setValidity('maxDate', true);  // Turn off the error if the date format isn't valid
        }
        return viewValue;
      });

      ctrl.$viewChangeListeners.push(function() {
        // If there is a date-change attribute, execute it when the control is valid
        if (attrs.dateChange && ctrl.$valid) {
          scope.$eval(attrs.dateChange);
        }
      });
    }
  };
}]);
