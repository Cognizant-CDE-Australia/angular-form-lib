webpackJsonp([1,4],{

/***/ "../node_modules/angular-strap/src/datepicker/datepicker.tpl.html":
/***/ function(module, exports) {

module.exports = "<div class=\"dropdown-menu datepicker\" ng-class=\"'datepicker-mode-' + $mode\" style=max-width:320px>\n<table style=table-layout:fixed;height:100%;width:100%>\n  <thead>\n    <tr class=text-center>\n      <th>\n        <button tabindex=-1 type=button class=\"btn btn-default pull-left\" ng-click=$selectPane(-1)>\n          <i class={{$iconLeft}}></i>\n        </button>\n      </th>\n      <th colspan=\"{{ rows[0].length - 2 }}\">\n        <button tabindex=-1 type=button class=\"btn btn-default btn-block text-strong\" ng-click=$toggleMode()>\n          <strong style=text-transform:capitalize ng-bind=title></strong>\n        </button>\n      </th>\n      <th>\n        <button tabindex=-1 type=button class=\"btn btn-default pull-right\" ng-click=$selectPane(+1)>\n          <i class={{$iconRight}}></i>\n        </button>\n      </th>\n    </tr>\n    <tr ng-show=showLabels ng-bind-html=labels></tr>\n  </thead>\n  <tbody>\n    <tr ng-repeat=\"(i, row) in rows\" height=\"{{ 100 / rows.length }}%\">\n      <td class=text-center ng-repeat=\"(j, el) in row\">\n        <button tabindex=-1 type=button class=\"btn btn-default\" style=width:100% ng-class=\"{'btn-primary': el.selected, 'btn-info btn-today': el.isToday && !el.selected}\" ng-click=$select(el.date) ng-disabled=el.disabled>\n          <span ng-class=\"{'text-muted': el.muted}\" ng-bind=el.label></span>\n        </button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n</div>\n";

/***/ },

/***/ "./modules/common/Utility.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);


var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLib.common.utility', []);

/* harmony default export */ exports["a"] = mod.name;

mod.constant('ngFormLibDateUtil', {
  convertDate: function convertDate(dateStr, newSep) {
    // Converts a date between dd/mm/yyyy and yyyy-mm-dd
    if (!dateStr || !newSep || !(newSep === '/' || newSep === '-')) {
      return dateStr;
    }

    // Choose a separator string that is the 'opposite' of the desired separator
    var oldSep = newSep === '/' ? '-' : '/';
    var parts = dateStr.split(oldSep);

    // if we get a dodgy date OR you tried to convert a date that was already in the correct format, return the input
    if (isNaN(parts.join('')) || parts.length !== 3) {
      return dateStr;
    }

    // Swap the year and day parts around
    return parts[2] + newSep + parts[1] + newSep + parts[0];
  },
  formatDay: function formatDay(dayOrDate, month, year) {
    var dd = dayOrDate;
    var mm = month;
    var yyyy = year;

    if (dayOrDate.getUTCDay) {
      dd = dayOrDate.getDate();
      mm = dayOrDate.getMonth() + 1; // January is 0!`
      yyyy = dayOrDate.getFullYear();
    }
    return (dd < 10 ? '0' + dd : dd) + '/' + (mm < 10 ? '0' + mm : mm) + '/' + yyyy;
  },
  dateAdd: function dateAdd(dateStr, numDays) {
    // Return a modified date in ISO format
    var myDate = this.getDate(dateStr);

    myDate.setDate(myDate.getDate() + numDays);

    return this.formatDay(myDate);
  },
  getToday: function getToday(optionalDate) {
    return this.formatDay(optionalDate || new Date());
  },
  isISODate: function isISODate(dateStr) {
    return typeof dateStr === 'string' && dateStr.indexOf('-') > 0;
  },
  getDate: function getDate(dateStr) {
    if (!this.isISODate(dateStr)) {
      dateStr = this.convertDate(dateStr, '-');
    }
    return new Date(dateStr);
  },
  monthsBetween: function monthsBetween(date1, date2) {
    return date2.getMonth() - date1.getMonth() + 12 * (date2.getFullYear() - date1.getFullYear()); // eslint-disable-line no-extra-parens
  }
});

mod.constant('ngFormLibStringUtil', function () {
  var trimRegExp = /^\s+|\s+$/g;

  return {
    trim: function trim(text) {
      if (typeof text === 'string') {
        return text.replace(trimRegExp, '');
      }
      return text;
    }
  };
}());

mod.constant('ngFormLibNumberUtil', function () {
  var isDigitsRegExp = /^\d+$/;

  return {
    isDigits: function isDigits(text) {
      return isDigitsRegExp.test(text);
    }
  };
}());

mod.constant('ngFormLibObjectUtil', {
  getUniqueId: function getUniqueId() {
    return ('' + new Date().getTime() + Math.random()).replace(/\./, '');
  },
  toArray: function toArray(obj) {
    var arr = [];

    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        arr[arr.length] = { key: i, value: obj[i] };
      }
    }
    arr.sort(function compare(a, b) {
      return a.key < b.key;
    });
    return arr;
  }
});

/***/ },

/***/ "./modules/ngFormLib/controls/common/FieldErrorController.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__FormControlService__ = __webpack_require__("./modules/ngFormLib/controls/common/FormControlService.js");



var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLib.controls.common.fieldErrorController', [__WEBPACK_IMPORTED_MODULE_1__FormControlService__["a" /* default */]]);

/* harmony default export */ exports["a"] = mod.name;

/**
 * The Field Error Controller directive is designed to indicate to the browser when the field is in error
 *  and what the errors are. It applies the form-policy for showing errors
 *
 * It works in tandem with the form controller (and FormPolicy.js) to identify when a form-element has an error, and decorates
 *  the element accordingly.
 *
 * It also toggles the fieldController.fieldState flag, based on the form policy provided
 *
 */

// INPUT:
//  <input ... field-error-controller></input>

// OUTPUT:
//  <input ... aria-invalid="false/true" aria-describedby="fieldId-errors">


mod.directive('fieldErrorController', ['formControlService', '$timeout', function (formControlService, $timeout) {
  function setupCanShowErrorPropertyOnNgModelController(scope, formController, ngModelController, element, name) {
    // Using the form policy, determine when to show errors for this field
    var formPolicy = formController._policy;
    var formName = formController.$name;
    var fieldName = formName + '["' + name + '"]';
    var stateConditions = formPolicy.stateDefinitions.create(formName, fieldName);

    formPolicy.checkForStateChanges(formController._scope, element, name, stateConditions, ngModelController, formController);
  }

  return {
    restrict: 'AE',
    require: ['?ngModel', '?^form', '?^formGroup'], // Require the formController controller somewhere in the parent hierarchy
    replace: true,
    link: function link(scope, element, attr, controllers) {
      var ngModelController = controllers[0];
      var formController = controllers[1];
      var formGroupElement = (controllers[2] || {}).$element || element; // This looks for a parent directive called formGroup, which has a controller, which has an $element property
      var name = attr.name;

      if (formController) {
        (function () {
          var formName = formController.$name;
          var stateChangeBehaviour = formController._applyFormBehaviourOnStateChangePolicy; // returns a function which encapsulates the form policy rules for the behaviour to apply when errors show

          if (ngModelController) {
            setupCanShowErrorPropertyOnNgModelController(scope, formController, ngModelController, element, name);
          }

          // When the error-showing flag changes, update the field style
          formController._scope.$watch(formName + '["' + name + '"].fieldState', function (fieldState) {
            // fieldState is set to '' when the form is reset. So must respond to that too.
            stateChangeBehaviour.applyBehaviour(element, fieldState, false, formName, name, formGroupElement);
          });

          // Listen to form-submit events, to determine what to focus on too
          scope.$on('event:FormSubmitAttempted', function () {
            // Make sure that the field-level watchers have a chance to fire first, so use a timeout
            $timeout(function () {
              return stateChangeBehaviour.applyBehaviour(element, ngModelController.fieldState, true, formName, name, formGroupElement);
            }, 1);
          });
        })();
      }
    }
  };
}]);

// This directive wraps all of the form elements and binds the universe together.
// It MUST be used as a class as the form focus behaviour references '.form-control .ng-invalid' when finding controls to focus
mod.directive('formGroup', [function () {
  return {
    restrict: 'C',
    controller: ['$scope', '$element', function Controller($scope, $element) {
      this.$element = $element;
    }]
  };
}]);

/***/ },

/***/ "./modules/ngFormLib/controls/common/FormControlService.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_Utility__ = __webpack_require__("./modules/common/Utility.js");



var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLib.controls.common.formControlService', [__WEBPACK_IMPORTED_MODULE_1__common_Utility__["a" /* default */]]);

/* harmony default export */ exports["a"] = mod.name;

// Workaround for bug #1404
// https://github.com/angular/angular.js/issues/1404
// Source: http://plnkr.co/edit/hSMzWC?p=preview
// Not so great for IE8, but necessary for using radio buttons inside of dynamic forms (ng-repeat)
mod.config(['$provide', function ($provide) {
  $provide.decorator('ngModelDirective', ['$delegate', function ($delegate) {
    var ngModel = $delegate[0];
    var controller = ngModel.controller;

    ngModel.controller = ['$scope', '$element', '$attrs', '$injector', function Controller(scope, element, attrs, $injector) {
      var $interpolate = $injector.get('$interpolate');

      attrs.$set('name', $interpolate(attrs.name || '')(scope));
      $injector.invoke(controller, this, {
        '$scope': scope,
        '$element': element,
        '$attrs': attrs
      });
    }];
    return $delegate;
  }]);
  $provide.decorator('formDirective', ['$delegate', function ($delegate) {
    var form = $delegate[0];
    var controller = form.controller;

    form.controller = ['$scope', '$element', '$attrs', '$injector', function Controller(scope, element, attrs, $injector) {
      var $interpolate = $injector.get('$interpolate');

      attrs.$set('name', $interpolate(attrs.name || attrs.ngForm || '')(scope));
      $injector.invoke(controller, this, {
        '$scope': scope,
        '$element': element,
        '$attrs': attrs
      });
    }];
    return $delegate;
  }]);
}]);

// Shared code for the accessible controls
mod.provider('formControlService', function Provider() {
  var self = this;
  var counter = 0; // Private variable

  //
  self.defaults = {
    idPrefix: 'fpFld',
    inputGroupButtonTemplateFunction: function inputGroupButtonTemplateFunction(val, handler) {
      return '<button type="button" class="btn btn-default" ' + (handler ? 'ng-click="' + handler + '"' : '') + '>' + val + '</button>';
    },
    templates: {
      formCheckbox: {
        template: 'ngFormLib/template/formCheckbox.html'
      },
      formDate: {
        template: 'ngFormLib/template/formDate.html'
      },
      formInput: {
        template: 'ngFormLib/template/formInput.html'
      },
      formRadioButton: {
        template: 'ngFormLib/template/formRadioButton.html'
      },
      formSelect: {
        template: 'ngFormLib/template/formSelect.html'
      },
      requiredMarker: {
        template: 'ngFormLib/template/requiredMarker.html'
      }
    }
  };

  this.$get = ['ngFormLibStringUtil', '$injector', function (StringUtil, $injector) {
    var translator = void 0;

    try {
      translator = $injector.get('$translate').instant;
    } catch (e) {
      translator = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.identity;
    }

    var service = {
      defaults: self.defaults,

      buildDirective: function buildDirective(params) {
        var directive = {
          restrict: 'AE',
          replace: true,
          transclude: true,
          compile: function compile(tElement, tAttr) {
            service.validateComponentStructure(params.controlName, tElement, params.expectedTemplateElements, tAttr, params.expectedAttributes);

            // For items that are inside repeaters, if more than one element has the same id, the checkbox stops working.
            // By using an attribute that is not called 'id', we can avoid this issue
            var id = tAttr.uid || service.getUniqueFieldId();
            var name = tAttr.name || id; // Doing this *will* break radio buttons, but they SHOULD provide a name anyway (for their own good)
            var inputElem = tElement.find(params.inputElementName || 'input');
            var labelElem = tElement.find('label');
            var required = service.getRequiredAttribute(tAttr.required);

            service.decorateLabel(labelElem, required, id, tAttr.labelClass, tAttr.hideLabel, tAttr.hideRequiredIndicator, tAttr.labelSuffix);
            inputElem = service.decorateInputField(inputElem, tElement, tAttr, id, name, required);

            // Do component-specific config last
            params.configFn(tElement, tAttr, id, name, inputElem, labelElem);

            // Clean up special attributes (to make HTML look nicer)
            tElement.removeAttr('uid').removeAttr('name').removeAttr('label').removeAttr('required').removeAttr('field-hint').removeAttr('input-type').removeAttr('hide-label').removeAttr('hideRequiredIndicator').removeAttr('label-class').removeAttr('field-errors').removeAttr('text-errors');
          },
          templateUrl: function templateUrl(element, attr) {
            // Check the element for a "template" attribute, which allows customisation-per-control. Otherwise, use the control-wide template.
            return attr.template || service.getHTMLTemplate(element, params.controlName);
          }
        };

        return directive;
      },

      getUniqueFieldId: function getUniqueFieldId() {
        return '' + self.defaults.idPrefix + counter++;
      },

      getHTMLTemplate: function getHTMLTemplate(element, type) {
        // Allow different templates to be applied for different form-styles (eg for horizontal forms, inline forms, "normal" forms).
        // This is an advanced feature that most users will not need.
        // E.g.: self.defaults.templates['select']['form-inline'] = 'path/to/your/custom/template.html'

        // Check this element's parent-form-element-classes to see if they match. First match, wins.
        var parentFormClasses = (element.inheritedData('formElementClasses') || '').split(' ');
        var result = self.defaults.templates[type].template; // The default template, if nothing else is specified.

        for (var i = 0; i < parentFormClasses.length; i++) {
          var template = self.defaults.templates[type][parentFormClasses[i]];

          if (template) {
            result = template;
            break;
          }
        }

        return result;
      },

      addToAttribute: function addToAttribute(element, attributeName, value) {
        var existingValues = element.attr(attributeName) || '';

        // Don't add the same attribute value - remove it first before adding it back
        if (existingValues.split(' ').indexOf(value) === -1) {
          element.attr(attributeName, existingValues + (existingValues ? ' ' : '') + value);
        }
      },

      removeFromAttribute: function removeFromAttribute(element, attributeName, value) {
        // Borrowed this statement from Angular.js
        var newValue = StringUtil.trim((' ' + (element.attr(attributeName) || '') + ' ').replace(/[\n\t]/g, ' ').replace(' ' + StringUtil.trim(value) + ' ', ' '));

        // Remove the attribute if it is empty
        if (newValue === '') {
          element.removeAttr(attributeName);
        } else {
          element.attr(attributeName, newValue);
        }
      },

      getRequiredAttribute: function getRequiredAttribute(required) {
        // When we set required="true" on a parent directive (like on-off-button), inputElem.attr('required', 'true')
        // becomes <input required="required" due to browser interference. So detect this case, and replace it with "true"
        // In v1.3, required="true" becomes required="".
        if (required === 'required' || required === '' || required === 'true') {
          return 'true';
        } else if (required === undefined) {
          return 'false';
        }
        return required;
      },

      addLabelText: function addLabelText(labelElem, labelText) {
        labelElem.prepend(service.translate(labelText));
      },

      addInputGroup: function addInputGroup(inputElem, attr) {
        var inputGroupMapping = [{ inputAttr: 'inputPrefix', className: 'input-group-addon', attachFn: 'prepend', clickHandler: '', content: function content(val) {
            return val;
          } }, { inputAttr: 'inputSuffix', className: 'input-group-addon', attachFn: 'append', clickHandler: '', content: function content(val) {
            return val;
          } }, { inputAttr: 'inputButtonPrefix', className: 'input-group-btn', attachFn: 'prepend', clickHandler: 'inputButtonPrefixClick', content: self.defaults.inputGroupButtonTemplateFunction }, { inputAttr: 'inputButtonSuffix', className: 'input-group-btn', attachFn: 'append', clickHandler: 'inputButtonSuffixClick', content: self.defaults.inputGroupButtonTemplateFunction }];
        var contentToAppend = [];

        inputGroupMapping.forEach(function (igConfig) {
          if (attr[igConfig.inputAttr]) {
            contentToAppend.push({
              attachFn: igConfig.attachFn,
              html: '<span class="' + igConfig.className + '">' + igConfig.content(attr[igConfig.inputAttr], attr[igConfig.clickHandler]) + '</span>'
            });
          }
        });

        if (contentToAppend.length) {
          (function () {
            inputElem.wrap('<div class="input-group">'); // This should be the 'control-row' element
            var wrapper = inputElem.parent();

            contentToAppend.forEach(function (content) {
              return wrapper[content.attachFn](content.html);
            });
          })();
        }

        return !!contentToAppend.length;
      },

      decorateLabel: function decorateLabel(labelElem, required, id, labelClass, hideLabelExpr, hideRequiredIndicator, labelSuffix) {
        if (id) {
          labelElem.attr('for', id);
        }
        if (labelClass) {
          labelElem.addClass(labelClass);
        }
        if (hideLabelExpr) {
          labelElem.attr('ng-class', '{\'sr-only\': ' + hideLabelExpr + '}');
        }
        // Some labels have suffix text - text that helps with describing the label, but isn't really the label text.
        // E.g. Amount ($AUD)
        if (labelSuffix) {
          labelElem.append('&nbsp;' + service.translate(labelSuffix));
        }

        if (!hideRequiredIndicator) {
          labelElem.append('<span required-marker hide="!(' + required + ')"></span>');
        }
      },

      decorateInputField: function decorateInputField(inputElem, hostElement, attr, id, name, required) {
        if (attr.inputType) {
          // inputElem.attr('type', attr.inputType); // THIS WILL NOT WORK ON IE8!
          // Instead, we must replace the entire node with the only property which SHOULD exist on the template: 'class'
          inputElem.replaceWith('<input type="' + attr.inputType + '" class="' + inputElem.attr('class') + '">');
          inputElem = hostElement.find('input');
        }

        inputElem.attr('id', id);

        // Allow the name to be interpolated
        inputElem.attr('name', name);

        // Apply all of the ff-* attributes to the input element. Use the original attribute names
        // attr.$attr contains the snake-case names e.g. 'form-field' vs camel case 'formField'
        for (var a in attr.$attr) {
          if (a.indexOf('ff') === 0) {
            // Don't search for 'ff-' as the '-' has been replaced with camel case now
            var origAttrName = attr.$attr[a].substr(3);

            if (origAttrName === 'class') {
              inputElem.addClass(attr[a]);

              // Special case for type property. It *must* be read-only. Therefore, don't write it to the element
              // See http://stackoverflow.com/questions/8378563/why-cant-i-change-the-type-of-an-input-element-to-submit
            } else if (origAttrName !== 'type') {
              inputElem.attr(origAttrName, attr[a]);
            }

            // Remove all attributes off the host element
            hostElement.removeAttr(attr.$attr[a]);
          }
        }

        inputElem.attr('ng-required', required);
        inputElem.attr('aria-required', '{{!!(' + required + ')}}'); // evaluates to true / false
        return inputElem;
      },

      createErrorFeatures: function createErrorFeatures(parentElement, inputElement, name, fieldLabel, fieldErrors, textErrors) {
        if (fieldErrors || textErrors) {
          // Add an fieldErrorControllers attribute to the element, to hook-up the error features
          inputElement.attr('field-error-controller', '');

          var fieldLabelStr = fieldLabel ? ' field-label="' + fieldLabel + '"' : '';
          var errorContainerElem = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.element('<div error-container field-name="' + name + '"' + fieldLabelStr + '></div>');

          if (fieldErrors) {
            errorContainerElem.attr('field-errors', fieldErrors);
          }
          if (textErrors) {
            errorContainerElem.attr('text-errors', textErrors);
          }
          parentElement.append(errorContainerElem);
        }
      },

      createFieldHint: function createFieldHint(hostElement, inputElement, fieldHint, fieldHintId, fieldHintDisplay) {
        var hintElement = void 0;

        if (fieldHint) {
          var hintText = service.translate(fieldHint);

          // If we have a field hint, add that as well
          if (fieldHintDisplay) {
            // If a field hint display rule exists, implement.
            hintElement = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.element('<p ng-if="' + fieldHintDisplay + '" class="help-block" id="' + fieldHintId + '">' + hintText + '</p>');
          } else {
            hintElement = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.element('<p class="help-block" id="' + fieldHintId + '">' + hintText + '</p>');
          }
          hostElement.append(hintElement);
          inputElement.attr('aria-describedby', fieldHintId);
        }
      },

      buildNgClassExpression: function buildNgClassExpression(inputElem, targetElem) {
        // If the inputElem has an ngModel and/or ngChecked attribute, create the ng-class attribute
        // todo.. test checkbox implementation
        var modelStr = inputElem.attr('ng-model');
        var checkedStr = inputElem.attr('ng-checked');
        var disabledStr = inputElem.attr('ng-disabled');
        var value = inputElem.attr('value'); // a string - used for Radio buttons
        var ngValue = inputElem.attr('ng-value'); // an expression - used for Radio buttons
        var ngTrueValue = inputElem.attr('ng-true-value');

        if (modelStr) {
          if (ngValue || ngTrueValue) {
            modelStr += ' === ' + (ngValue || ngTrueValue);
          } else if (value) {
            // The value is ALWAYS a string
            modelStr += ' === \'' + value + '\'';
          } else {
            modelStr += ' === true'; // For checkboxes, in the absence of ng-true-value
          }
        }

        if (modelStr && checkedStr) {
          modelStr += ' || ' + checkedStr;
        } else if (checkedStr) {
          modelStr = checkedStr;
        }

        if (modelStr && disabledStr) {
          targetElem.attr('ng-class', '{\'checked\': ' + modelStr + ', \'disabled\': ' + disabledStr + '}');
        } else if (modelStr) {
          targetElem.attr('ng-class', '{\'checked\': ' + modelStr + '}');
        }
      },

      translate: function translate(str, interpolatedParams) {
        return translator(str || '', interpolatedParams);
      },

      validateComponentStructure: function validateComponentStructure(componentName, element, requiredElements, attr, requiredAttributes) {
        for (var i = 0; i < requiredElements.length; i++) {
          if (!element.find(requiredElements[i])) {
            throw new Error('The ' + componentName + ' component template requires a ' + requiredElements[i] + ' element.');
          }
        }

        for (var j = 0; j < requiredAttributes.length; j++) {
          if (!attr[requiredAttributes[j]]) {
            throw new Error('The ' + componentName + ' component requires a ' + requiredAttributes[j] + ' attribute.');
          }
        }
      }

    };

    return service;
  }];
});

/***/ },

/***/ "./modules/ngFormLib/controls/common/index.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__FieldErrorController__ = __webpack_require__("./modules/ngFormLib/controls/common/FieldErrorController.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__FormControlService__ = __webpack_require__("./modules/ngFormLib/controls/common/FormControlService.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__requiredMarker_RequiredMarker__ = __webpack_require__("./modules/ngFormLib/controls/requiredMarker/RequiredMarker.js");



 // TODO: Not sure why this is here

var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLib.controls.common', [__WEBPACK_IMPORTED_MODULE_1__FieldErrorController__["a" /* default */], __WEBPACK_IMPORTED_MODULE_2__FormControlService__["a" /* default */], __WEBPACK_IMPORTED_MODULE_3__requiredMarker_RequiredMarker__["a" /* default */]]);

/* harmony default export */ exports["a"] = mod.name;

/***/ },

/***/ "./modules/ngFormLib/controls/errorMessageContainer/ErrorMessageContainer.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_FormControlService__ = __webpack_require__("./modules/ngFormLib/controls/common/FormControlService.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__policy_stateDefinitions_PolicyStateDefinitions__ = __webpack_require__("./modules/ngFormLib/policy/stateDefinitions/PolicyStateDefinitions.js");




var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLib.controls.errorMessageContainer', [__WEBPACK_IMPORTED_MODULE_1__common_FormControlService__["a" /* default */]]);

/* harmony default export */ exports["a"] = mod.name;

/*
 * This directive is really a FIELD error message container - it is designed to work with fields exclusively
 */
mod.directive('errorContainer', ['$compile', 'formControlService', function ($compile, formControlService) {
  function ErrorController(ariaElement, a11yPolicy) {
    var errors = {};

    return {
      addError: function addError(errorType, errorMessage, fieldLabel) {
        errors[errorType] = translateError(errorMessage, fieldLabel);
      },
      removeError: function removeError(errorType) {
        return delete errors[errorType];
      },
      updateAriaErrorElement: function updateAriaErrorElement() {
        return a11yPolicy.onErrorChangeBehaviour(ariaElement, errors);
      }
    };
  }

  function translateError(errorMessage, fieldLabel) {
    var firstLetterIsAVowel = fieldLabel ? 'aeiou'.indexOf(fieldLabel[0].toLowerCase() !== -1) : undefined;

    return formControlService.translate(errorMessage, { pronoun: firstLetterIsAVowel ? 'an' : 'a', fieldLabel: fieldLabel });
  }

  function generateErrorTag(errorType, errorText, fieldLabel) {
    return '<div class="text-error ec2-' + errorType + '"><span class="text-error-wrap">' + translateError(errorText, fieldLabel) + '</span></div>';
  }

  /*
   * Handle the field-based error messages
   */
  function toggleErrorVisibilityOnError(errorController, formController, scope, element, watchExpr, errorType, errorText, fieldLabel) {
    // console.log('watchExpr = ' + watchExpr);
    formController._scope.$watch(watchExpr, function (newValue) {
      if (newValue) {
        // The error text could contain an interpolation string, so we need to compile it
        var val = $compile(generateErrorTag(errorType, errorText, fieldLabel))(scope);

        element.append(val);
        errorController.addError(errorType, errorText, fieldLabel);
      } else {
        removeErrorMessage(errorController, formController, element, errorType);
      }
      errorController.updateAriaErrorElement();
    });
  }

  function removeErrorMessage(controller, formController, element, errorType) {
    // find the div with our special class, then remove it
    var divs = element.find('div');

    for (var len = divs.length, i = len - 1; i > -1; i--) {
      if (divs.eq(i).hasClass('ec2-' + errorType)) {
        divs.eq(i).remove();
      }
    }
    controller.removeError(errorType);
  }

  /*
   * Handle text errors. Text errors are associated with a scope, rather than with a field.
   * This means we can clear them from the scope when the field-they-are-associated-with is changed.
   */
  function toggleErrorVisibilityForTextError(errorController, formController, fieldController, scope, element, watchExpr, fieldLabel) {
    // console.log('Watching error: ' + watchExpr);

    formController._scope.$watch(watchExpr, function (newValue) {
      // Update the validity of the field's "watchExpr" error-key to match the value of the errorText
      fieldController.$setValidity(watchExpr, !newValue);

      // Remove the old error message for this same errorType first, in cases where the error message is changing.
      removeErrorMessage(errorController, formController, element, watchExpr);
      if (newValue) {
        // No need to compile the error message as we already have its value
        element.append(generateErrorTag(watchExpr, newValue, fieldLabel));

        errorController.addError(watchExpr, newValue, fieldLabel);
        // Turn the border red by sending a 'form-submit-attempted' event
        formController.setSubmitted(true);
      }
      errorController.updateAriaErrorElement();
    });

    // When the field changes, clear the errorText value
    fieldController.$viewChangeListeners.push(function () {
      if (scope.$eval(watchExpr)) {
        scope.$eval(watchExpr + ' = null');
      }
    });
  }

  return {
    restrict: 'AE',
    require: ['^form'], // Require the formController controller somewhere in the parent hierarchy (mandatory for field-errors)
    template: '<div class="container-error"></div>',
    replace: true,
    link: function link(scope, element, attr, controllers) {
      var fieldName = attr.fieldName;
      var fieldLabel = attr.fieldLabel || '';
      var formController = controllers[0];
      var formName = formController.$name;
      var formField = formName + '["' + fieldName + '"]';
      var fieldErrors = scope.$eval(attr.fieldErrors || []); // You can escape interpolation brackets inside strings by doing  \{\{   - wow!
      var textErrors = scope.$eval(attr.textErrors || []);

      element.attr('id', formName + '-' + fieldName + '-errors');

      // Get a reference to the form policy
      var a11yPolicy = formController._policy.accessibilityBehaviour;
      var ariaElement = a11yPolicy.createAriaErrorElement(formName, fieldName);
      var errorController = new ErrorController(ariaElement, a11yPolicy); // This controller contains state pertaining to this error container instance. Not a shareable controller across multiple instances.

      element.append(ariaElement);

      for (var error in fieldErrors) {
        if (fieldErrors.hasOwnProperty(error)) {
          var errorShowCondition = formField + '.fieldState === "' + __WEBPACK_IMPORTED_MODULE_2__policy_stateDefinitions_PolicyStateDefinitions__["b" /* ERROR_STATE */] + '" && ' + formField + '.$error.' + error;

          toggleErrorVisibilityOnError(errorController, formController, scope, element, errorShowCondition, error, fieldErrors[error], fieldLabel);
        }
      }

      // Watch formController[fieldName] - it may not have loaded yet. When it loads, call the main function.
      if (textErrors) {
        (function () {
          // console.log('textErrors: ' + textErrors + ', fieldName = ' + fieldName);
          var fieldWatcher = scope.$watch(function () {
            return formController[fieldName];
          }, function (newValue) {
            if (newValue) {
              fieldWatcher(); // Cancel the watcher

              // Do the actual thing you planned to do...
              for (var item in textErrors) {
                if (textErrors.hasOwnProperty(item)) {
                  toggleErrorVisibilityForTextError(errorController, formController, formController[fieldName], scope, element, textErrors[item], fieldLabel);
                }
              }
            }
          });
        })();
      }

      element.removeAttr('error-container').removeAttr('field-name').removeAttr('field-errors').removeAttr('text-errors');
    }
  };
}]);

/***/ },

/***/ "./modules/ngFormLib/controls/formCheckbox/FormCheckbox.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_index__ = __webpack_require__("./modules/ngFormLib/controls/common/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__errorMessageContainer_ErrorMessageContainer__ = __webpack_require__("./modules/ngFormLib/controls/errorMessageContainer/ErrorMessageContainer.js");




var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLib.controls.formCheckbox', [__WEBPACK_IMPORTED_MODULE_1__common_index__["a" /* default */], __WEBPACK_IMPORTED_MODULE_2__errorMessageContainer_ErrorMessageContainer__["a" /* default */]]);

/* harmony default export */ exports["a"] = mod.name;

// INPUT:
//  <form-checkbox id="id" name="name" required="{{expression}}"
//      ff-class="span12" ff-ng-model="application.contentType" ff-value="software" ff-aria-label="Software"
//        ff-ng-click="doSomething()"
//      field-errors="{required: 'Please select'}"
//      text-errors="['wrong value']"
//      >My label with <a href="http://www.google.com/">HTML bits</a> in it</form-checkbox>

// OUTPUT:


mod.directive('formCheckbox', ['formControlService', function (formControlService) {
  return formControlService.buildDirective({
    controlName: 'formCheckbox',
    expectedTemplateElements: ['input', 'label', 'div'],
    expectedAttributes: [],
    configFn: function configFn(tElement, tAttr, id, name, inputElem) {
      formControlService.createErrorFeatures(tElement, inputElem, name, '', tAttr.fieldErrors, tAttr.textErrors);
      formControlService.buildNgClassExpression(inputElem, inputElem); // Put the ng-class onto the input element itself, as this makes styling easier
    }
  });
}]);

// Populate the template cache with the default template
mod.run(['$templateCache', function ($templateCache) {
  $templateCache.put('ngFormLib/template/formCheckbox.html', __webpack_require__("./modules/ngFormLib/controls/formCheckbox/template/FormCheckboxTemplate.html"));
}]);

/***/ },

/***/ "./modules/ngFormLib/controls/formCheckbox/template/FormCheckboxTemplate.html":
/***/ function(module, exports) {

module.exports = "<div class=\"form-group form-group-checkbox\">\n\t<div class=checkbox>\n\t\t<input type=checkbox field-error-controller>\n\t\t<label><span ng-transclude></span></label>\n\t</div>\n</div>\n";

/***/ },

/***/ "./modules/ngFormLib/controls/formDate/FormDate.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common__ = __webpack_require__("./modules/ngFormLib/controls/common/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__errorMessageContainer_ErrorMessageContainer__ = __webpack_require__("./modules/ngFormLib/controls/errorMessageContainer/ErrorMessageContainer.js");




var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLib.controls.formDate', [__WEBPACK_IMPORTED_MODULE_1__common__["a" /* default */], __WEBPACK_IMPORTED_MODULE_2__errorMessageContainer_ErrorMessageContainer__["a" /* default */]]);

/* harmony default export */ exports["a"] = mod.name;

// INPUT:
//    <div form-date id="toDate" name="toDate" label="To date" hide-label="true"
//    ff-ng-model="acctCtrl.search.toDate" ff-max-date="today" ff-bs-show="acctCtrl.datePickers.datePickerTo"
//    ff-ng-blur="acctCtrl.toggleDatePicker('datePickerTo', true)"
//    ff-ng-focus="acctCtrl.toggleDatePicker('datePickerFrom', true)"
//    ff-class="form-control input-beta input-date"
//    field-errors="{date: 'ERROR.DATE_INVALID'}" >
//      <i class="calendar" ng-click="acctCtrl.toggleDatePicker('datePickerTo')"></i>
//    </div>


mod.directive('formDate', ['formControlService', function (formControlService) {
  return formControlService.buildDirective({
    controlName: 'formDate',
    expectedTemplateElements: ['input', 'label'],
    expectedAttributes: ['label'],
    configFn: function configFn(tElement, tAttr, id, name, inputElem, labelElem) {
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
mod.run(['$templateCache', function ($templateCache) {
  $templateCache.put('ngFormLib/template/formDate.html', __webpack_require__("./modules/ngFormLib/controls/formDate/template/FormDateInputTemplate.html"));
  try {
    $templateCache.put('datepicker/datepicker.tpl.html', __webpack_require__("../node_modules/angular-strap/src/datepicker/datepicker.tpl.html"));
  } catch (err) {
    console.debug('angular-strap/src/datepicker/datepicker.tpl.html is not available for the formDate control');
  }
}]);

function addPlaceholder(inputElem, placeholderText) {
  if (placeholderText) {
    inputElem.attr('placeholder', placeholderText);
  }
}

mod.directive('formDateFormat', ['ngFormLibDateUtil', function (DateUtil) {
  // All dates greater than AD 0 and less than AD 10000 in dd/mm/yyyy format
  // RegEx behaves oddly if /g is uses in Regexp.test() situations
  var dateRegEx = /^(((0[1-9]|[12][0-9]|3[01])([\/])(0[13578]|10|12)([\/])(\d{4}))|(([0][1-9]|[12][0-9]|30)([\/])(0[469]|11)([\/])(\d{4}))|((0[1-9]|1[0-9]|2[0-8])([\/])(02)([\/])(\d{4}))|((29)(\/)(02)([\/])([02468][048]00))|((29)([\/])(02)([\/])([13579][26]00))|((29)([\/])(02)([\/])([0-9][0-9][0][48]))|((29)([\/])(02)([\/])([0-9][0-9][2468][048]))|((29)([\/])(02)([\/])([0-9][0-9][13579][26])))$/;

  return {
    require: 'ngModel',
    priority: 150, // Higher priority than ui-mask (100), so the postLink function runs last
    link: function link(scope, elem, attrs, ctrl) {
      function resetValidators() {
        ctrl.$setValidity('dateFormat', true);
        ctrl.$setValidity('minDate', true); // Turn off the error if the date format isn't valid
        ctrl.$setValidity('maxDate', true); // Turn off the error if the date format isn't valid
      }

      ctrl.$parsers.unshift(function (viewValue) {
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

        // console.log('dateInput: ' + viewValue + ', ' + ctrl.$modelValue);

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
            var maxDate = void 0;

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
          ctrl.$setValidity('minDate', true); // Turn off the error if the date format isn't valid
          ctrl.$setValidity('maxDate', true); // Turn off the error if the date format isn't valid
        }
        return viewValue;
      });

      ctrl.$viewChangeListeners.push(function () {
        // If there is a date-change attribute, execute it when the control is valid
        if (attrs.dateChange && ctrl.$valid) {
          scope.$eval(attrs.dateChange);
        }
      });
    }
  };
}]);

/***/ },

/***/ "./modules/ngFormLib/controls/formDate/template/FormDateInputTemplate.html":
/***/ function(module, exports) {

module.exports = "<div class=form-group><label class=control-label></label><div class=control-row><input type=text class=form-control maxlength=10 placeholder=dd/mm/yyyy bs-datepicker form-date-format mask-date-digits><span ng-transclude></span></div></div>\n";

/***/ },

/***/ "./modules/ngFormLib/controls/formInput/FormInput.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common__ = __webpack_require__("./modules/ngFormLib/controls/common/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__errorMessageContainer_ErrorMessageContainer__ = __webpack_require__("./modules/ngFormLib/controls/errorMessageContainer/ErrorMessageContainer.js");




var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLib.controls.formInput', [__WEBPACK_IMPORTED_MODULE_1__common__["a" /* default */], __WEBPACK_IMPORTED_MODULE_2__errorMessageContainer_ErrorMessageContainer__["a" /* default */]]);

/* harmony default export */ exports["a"] = mod.name;

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


mod.directive('formInput', ['formControlService', function (formControlService) {
  return formControlService.buildDirective({
    controlName: 'formInput',
    expectedTemplateElements: ['input', 'label'],
    expectedAttributes: ['label', 'inputType'],
    configFn: function configFn(tElement, tAttr, id, name, inputElem, labelElem) {
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
mod.run(['$templateCache', function ($templateCache) {
  $templateCache.put('ngFormLib/template/formInput.html', __webpack_require__("./modules/ngFormLib/controls/formInput/template/FormInputTemplate.html"));
}]);

function addPlaceholder(inputElem, placeholderText) {
  if (placeholderText) {
    inputElem.attr('placeholder', placeholderText);
  }
}

/***/ },

/***/ "./modules/ngFormLib/controls/formInput/template/FormInputTemplate.html":
/***/ function(module, exports) {

module.exports = "<div class=form-group><label class=control-label></label><div class=control-row><input class=form-control><span ng-transclude></span></div></div>\n";

/***/ },

/***/ "./modules/ngFormLib/controls/formRadioButton/FormRadioButton.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common__ = __webpack_require__("./modules/ngFormLib/controls/common/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__errorMessageContainer_ErrorMessageContainer__ = __webpack_require__("./modules/ngFormLib/controls/errorMessageContainer/ErrorMessageContainer.js");




var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLib.controls.formRadioButton', [__WEBPACK_IMPORTED_MODULE_1__common__["a" /* default */], __WEBPACK_IMPORTED_MODULE_2__errorMessageContainer_ErrorMessageContainer__["a" /* default */]]);

/* harmony default export */ exports["a"] = mod.name;

// INPUT:
//  <form-radio-button uid="fld" name="name" aria-label="Book Type" label-class="btn btn-toggle"
//    ff-class="someCSS" ff-ng-model="application.bookType" ff-value="Fiction" ng-click="loadFiction()" class="span6">
//     <icon class="icon-fiction"></icon>Fiction
//  </form-radio-button>

// OUTPUT:

mod.directive('formRadioButton', ['formControlService', function (formControlService) {
  return formControlService.buildDirective({
    controlName: 'formRadioButton',
    expectedTemplateElements: ['input', 'label', 'div'],
    expectedAttributes: [], // The template should NOT have a form-group element inside it, as this has to be specified externally (due to the group-nature of radio buttons)
    configFn: function configFn(tElement, tAttr, id, name, inputElem) {
      // Move the class attribute from the outer-DIV to the radio-button DIV (special case)
      var rbDiv = tElement.find('div');

      rbDiv.addClass(tElement.attr('class'));
      tElement.removeAttr('class');

      formControlService.createErrorFeatures(tElement, inputElem, name, '', tAttr.fieldErrors, tAttr.textErrors);
      formControlService.buildNgClassExpression(inputElem, inputElem); // Put the ng-class onto the input element itself, as this makes styling easier
    }
  });
}]);

// Populate the template cache with the default template
mod.run(['$templateCache', function ($templateCache) {
  $templateCache.put('ngFormLib/template/formRadioButton.html', __webpack_require__("./modules/ngFormLib/controls/formRadioButton/template/FormRadioButtonTemplate.html"));
}]);

/***/ },

/***/ "./modules/ngFormLib/controls/formRadioButton/template/FormRadioButtonTemplate.html":
/***/ function(module, exports) {

module.exports = "<div>\n\t<div class=radio>\n\t\t<input type=radio field-error-controller>\n\t\t<label><span ng-transclude></span></label>\n\t</div>\n</div>\n";

/***/ },

/***/ "./modules/ngFormLib/controls/formReset/FormReset.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);


var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLib.controls.formReset', []);

/* harmony default export */ exports["a"] = mod.name;

mod.directive('formReset', ['$parse', function ($parse) {
  function resetFieldState(controlMap) {
    // Loops through the controlMap and reset's each field's state
    for (var item in controlMap) {
      if (controlMap.hasOwnProperty(item)) {
        var controlList = controlMap[item];

        for (var j = 0, jLen = controlList.length; j < jLen; j++) {
          controlList[j].controller.fieldState = '';
        }
      }
    }
  }

  return {
    restrict: 'A',
    require: '^form',
    link: function link(scope, element, attr, controller) {
      var ngModelGet = $parse(attr.formReset);
      var ngModelSet = ngModelGet.assign;

      if (!ngModelSet) {
        throw Error('formReset requires an assignable scope-expression. "' + attr.formReset + '" is un-assignable.');
      }

      // Get a copy of the data as soon as the directive is created, which is after the scope/controller has been initialised (safe)
      var originalData = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.copy(ngModelGet(scope));

      element.on('click', function () {
        if (typeof controller.setSubmitted === 'function') {
          controller.setSubmitted(false);
        }
        // Use a *copy* of the original data, as we don't want originalData to be modified by subsequent changes to the model by the form controls
        ngModelSet(scope, __WEBPACK_IMPORTED_MODULE_0_angular___default.a.copy(originalData));
        resetFieldState(controller._controls || {});
        controller.$setPristine();

        scope.$emit('event:FormReset');
        scope.$digest();
      });
    }
  };
}]);

/***/ },

/***/ "./modules/ngFormLib/controls/formSelect/FormSelect.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common__ = __webpack_require__("./modules/ngFormLib/controls/common/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__errorMessageContainer_ErrorMessageContainer__ = __webpack_require__("./modules/ngFormLib/controls/errorMessageContainer/ErrorMessageContainer.js");




var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLib.controls.formSelect', [__WEBPACK_IMPORTED_MODULE_1__common__["a" /* default */], __WEBPACK_IMPORTED_MODULE_2__errorMessageContainer_ErrorMessageContainer__["a" /* default */]]);

/* harmony default export */ exports["a"] = mod.name;

// INPUT:
//  <form-select id="frm-size" name="bookSize" required="true" label="Approximate size"
//    ff-class="span12" ff-ng-model="model.size" placeholder="Select a size bracket"
//    ff-ng-options="option.value as option.name for option in refData.bookSizes"
//    field-errors="{required: 'Please select a size bracket'}"
//    text-errors="['data.errors']"></form-select>

// OUTPUT:


mod.directive('formSelect', ['formControlService', function (formControlService) {
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
    configFn: function configFn(tElement, tAttr, id, name, inputElem, labelElem) {
      formControlService.addLabelText(labelElem, tAttr.label);
      addPlaceholder(inputElem, tAttr.placeholder); // Adds the extra option element to the start of the <option>

      formControlService.createFieldHint(tElement, inputElem, tAttr.fieldHint, id + '-hint', tAttr.fieldHintDisplay);
      formControlService.createErrorFeatures(inputElem.parent(), inputElem, name, tAttr.label, tAttr.fieldErrors, tAttr.textErrors);
    }
  });
}]);

// Populate the template cache with the default template
mod.run(['$templateCache', function ($templateCache) {
  $templateCache.put('ngFormLib/template/formSelect.html', __webpack_require__("./modules/ngFormLib/controls/formSelect/template/FormSelectTemplate.html"));
}]);

/***/ },

/***/ "./modules/ngFormLib/controls/formSelect/template/FormSelectTemplate.html":
/***/ function(module, exports) {

module.exports = "<div class=form-group><label class=control-label></label><div class=control-row><select class=form-control></select></div></div>\n";

/***/ },

/***/ "./modules/ngFormLib/controls/formSubmit/FormSubmit.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);


var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLib.controls.formSubmit', []);

/* harmony default export */ exports["a"] = mod.name;

/**
 * formSubmit - Executes an expression when the form is valid (essentially a form.submit() handler).
 *
 * It can be applied to either the form element or to a button.
 *
 * @param {Object} $parse   The $parse service
 *
 * @return {Object} Directive definition object
 */
mod.directive('formSubmit', ['$parse', function ($parse) {
  return {
    restrict: 'A',
    require: ['^form'], // Get the form controller
    link: function link(scope, element, attr, controller) {
      var fn = $parse(attr.formSubmit) || __WEBPACK_IMPORTED_MODULE_0_angular___default.a.noop;
      var isForm = element[0].tagName === 'FORM';
      var formController = controller[0];

      element.bind(isForm ? 'submit' : 'click', function (event) {
        formController.setSubmitted(true);

        scope.$apply(function () {
          // scope.$emit('event:FormSubmitAttempted');

          if (formController.$valid) {
            if (fn(scope, { $event: event }) !== false) {
              // Needed by the tracking tool as it clears the input data after a submission.
              // Potentially, form field validation to be done here, but unnecessary at the moment.
              // The reset behaviour can be over-ridden by returning false from the called function(maybe prevent default aswell?)
              formController.setSubmitted(false);
              formController.$setPristine();
            }
          } else {
            event.preventDefault();
          }
        });
      });
    }
  };
}]);

/***/ },

/***/ "./modules/ngFormLib/controls/index.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__errorMessageContainer_ErrorMessageContainer__ = __webpack_require__("./modules/ngFormLib/controls/errorMessageContainer/ErrorMessageContainer.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__formCheckbox_FormCheckbox__ = __webpack_require__("./modules/ngFormLib/controls/formCheckbox/FormCheckbox.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__formDate_FormDate__ = __webpack_require__("./modules/ngFormLib/controls/formDate/FormDate.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__formInput_FormInput__ = __webpack_require__("./modules/ngFormLib/controls/formInput/FormInput.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__formRadioButton_FormRadioButton__ = __webpack_require__("./modules/ngFormLib/controls/formRadioButton/FormRadioButton.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__formReset_FormReset__ = __webpack_require__("./modules/ngFormLib/controls/formReset/FormReset.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__formSelect_FormSelect__ = __webpack_require__("./modules/ngFormLib/controls/formSelect/FormSelect.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__formSubmit_FormSubmit__ = __webpack_require__("./modules/ngFormLib/controls/formSubmit/FormSubmit.js");










// We need the utility module for the ngFormLibDateUtil.getDate() method for the formDateFormat directive, and ngFormLibStringUtil.trim() in controls.common
var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLib.controls', [__WEBPACK_IMPORTED_MODULE_1__errorMessageContainer_ErrorMessageContainer__["a" /* default */], __WEBPACK_IMPORTED_MODULE_2__formCheckbox_FormCheckbox__["a" /* default */], __WEBPACK_IMPORTED_MODULE_3__formDate_FormDate__["a" /* default */], __WEBPACK_IMPORTED_MODULE_4__formInput_FormInput__["a" /* default */], __WEBPACK_IMPORTED_MODULE_5__formRadioButton_FormRadioButton__["a" /* default */], __WEBPACK_IMPORTED_MODULE_6__formReset_FormReset__["a" /* default */], __WEBPACK_IMPORTED_MODULE_7__formSelect_FormSelect__["a" /* default */], __WEBPACK_IMPORTED_MODULE_8__formSubmit_FormSubmit__["a" /* default */]]);

/* harmony default export */ exports["a"] = mod.name;

/***/ },

/***/ "./modules/ngFormLib/controls/requiredMarker/RequiredMarker.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_FormControlService__ = __webpack_require__("./modules/ngFormLib/controls/common/FormControlService.js");



var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLib.controls.requiredMarker', [__WEBPACK_IMPORTED_MODULE_1__common_FormControlService__["a" /* default */]]);

/* harmony default export */ exports["a"] = mod.name;

// Add a simple "required" marker that is not read-out by screen readers (as the field should also have a required indicator)
//
// INPUT:
//  <span required-marker></span>
//  <span required-marker hide="isNotRequired">Some Text</span>

// OUTPUT:
//  <span class="required" aria-hidden="true" ng-class="{\'ng-hide\': hide}" ng-transclude=""></span>
//  <span class="required" aria-hidden="true" ng-class="{\'ng-hide\': hide}" ng-transclude="" hide="isNotRequired">Some Text</span>

mod.directive('requiredMarker', ['formControlService', function (formControlService) {
  return {
    restrict: 'AE',
    replace: true,
    transclude: true,
    templateUrl: function templateUrl(element, attr) {
      return attr.template || formControlService.getHTMLTemplate(element, 'requiredMarker');
    },
    scope: {
      hide: '='
    }
  };
}]);

// Populate the template cache with the default template
mod.run(['$templateCache', function ($templateCache) {
  $templateCache.put('ngFormLib/template/requiredMarker.html', __webpack_require__("./modules/ngFormLib/controls/requiredMarker/template/RequiredMarkerTemplate.html"));
}]);

/***/ },

/***/ "./modules/ngFormLib/controls/requiredMarker/template/RequiredMarkerTemplate.html":
/***/ function(module, exports) {

module.exports = "<span class=required aria-hidden=true ng-class=\"{'ng-hide': hide}\" ng-transclude></span>\n";

/***/ },

/***/ "./modules/ngFormLib/index.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__policy_FormPolicy__ = __webpack_require__("./modules/ngFormLib/policy/FormPolicy.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__controls__ = __webpack_require__("./modules/ngFormLib/controls/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__policy_defaultPolicies__ = __webpack_require__("./modules/ngFormLib/policy/defaultPolicies.js");
/* harmony export (binding) */ __webpack_require__.d(exports, "ngFormLib", function() { return ngFormLib; });
/* harmony export (binding) */ __webpack_require__.d(exports, "defaultPolicies", function() { return defaultPolicies; });




// Don't include this in the angular module, only export it here for convenience


var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLib', [__WEBPACK_IMPORTED_MODULE_1__policy_FormPolicy__["a" /* default */], __WEBPACK_IMPORTED_MODULE_2__controls__["a" /* default */]]);

// The library, and the default policies

var ngFormLib = mod.name;
var defaultPolicies = __WEBPACK_IMPORTED_MODULE_3__policy_defaultPolicies__["a" /* default */];


/***/ },

/***/ "./modules/ngFormLib/policy/FormPolicy.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);


// The form policy intentionally has no hard dependencies.
// If there are form-policy values that exist when the service is being constructed, it will use them.
// Otherwise it will use no-op policy functions.
var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLib.policy', []);

/* harmony default export */ exports["a"] = mod.name;

// This is a configurable service
// It should contain the _default_ values for form policies

mod.provider('formPolicyService', function Provider() {
  var self = this;
  var noop = function noop() {};
  var nullBehaviourOnStateChange = {
    behaviour: function behaviour() {
      return {
        applyBehaviour: noop,
        resetBehaviour: noop
      };
    }
  };
  var nullStateDefinitions = {
    create: function create() {
      return {};
    }, // Return an empty object
    states: function states() {
      return {};
    }
  };
  var nullAccessibilityBehaviour = {
    createAriaErrorElement: function createAriaErrorElement() {
      return '';
    },
    onErrorChangeBehaviour: noop
  };

  // The self.defaults property allows the formPolicy to be customised for a specific form
  self.defaults = {
    formSubmitAttemptedClass: 'form-submit-attempted',
    accessibilityBehaviour: null,
    behaviourOnStateChange: null,
    checkForStateChanges: null,
    stateDefinitions: null
  };

  this.$get = ['$injector', function ($injector) {
    function getService(name) {
      try {
        return $injector.get(name);
      } catch (e) {
        return null; // Provider-not-found error, ignore and move on
      }
    }

    // Policy precedence: this.defaults, policy-value-object, noop
    self.defaults.accessibilityBehaviour = self.defaults.accessibilityBehaviour || getService('formPolicyAccessibilityBehaviour') || nullAccessibilityBehaviour;
    self.defaults.behaviourOnStateChange = self.defaults.behaviourOnStateChange || getService('formPolicyBehaviourOnStateChange') || nullBehaviourOnStateChange;
    self.defaults.checkForStateChanges = self.defaults.checkForStateChanges || (getService('formPolicyCheckForStateChanges') || {}).checker || noop;
    self.defaults.stateDefinitions = self.defaults.stateDefinitions || getService('formPolicyStateDefinitions') || nullStateDefinitions;

    var policyService = {
      getCurrentPolicy: function getCurrentPolicy() {
        return __WEBPACK_IMPORTED_MODULE_0_angular___default.a.copy(self.defaults);
      }
    };

    return policyService;
  }];
});

function formDirective(formPolicyService) {
  return {
    // priority: -1,
    restrict: 'AE',
    require: ['?form'], // Tells the directive to get the controller for the 'form' directive, which is the FormController controller
    compile: function compile(tElement, tAttr) {
      // Use element.data() to store a reference to this element for use by child.inheritedData()
      // Will storing an element this way cause a memory leak? Or should I just store the data I currently need (attr.class)
      // This has to happen during the compile step, as the children need access to the variable when they are compiled
      //  ('class' is a reserved word to JavaScript, so we need to treat it as a string)
      tElement.data('formElementClasses', tAttr['class']);

      return {
        pre: function pre(scope, element, attr, controller) {
          // We want to extend the FormController by adding a form policy
          var formController = controller[0];

          formController._policy = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.extend(formPolicyService.getCurrentPolicy(), scope.$eval(attr.formPolicy));

          // Add a reference to the <form> element's scope to the formController, to support showing errors for nested components
          formController._scope = scope;

          // Determine if we have a parent form controller. If we do, we want to use it for the focus behaviour
          formController._parentController = element.parent().controller('form');

          if (!formController._parentController) {
            // We also want to add an element reference when a control is added
            formController._controls = {};
          }

          // Generate the focus policy function for use by other directive
          formController._applyFormBehaviourOnStateChangePolicy = formController._policy.behaviourOnStateChange.behaviour(formController);

          // Add/remove a class onto the form based on the value of the formSubmitted variable
          formController.setSubmitted = function (value, tellNoOne) {
            element[value ? 'addClass' : 'removeClass'](formController._policy.formSubmitAttemptedClass);
            formController._formSubmitAttempted = value;
            formController._applyFormBehaviourOnStateChangePolicy.resetBehaviour();

            if (value && !tellNoOne) {
              scope.$broadcast('event:FormSubmitAttempted');
            }
          };

          // Flag to indicate whether the form has been submitted
          formController._formSubmitAttempted = false;
          formController._applyFormBehaviourOnStateChangePolicy.resetBehaviour();

          // If this form is an ngForm (in that it has a parent 'form'), then we need to make sure that
          // when the parent form is submitted or reset, the same thing happens to the child forms
          if (formController._parentController) {
            scope.$watch(function () {
              return formController._parentController._formSubmitAttempted;
            }, function (value) {
              if (value !== undefined) {
                // formController.setSubmitted(!!value, true);  // Don't send another notification, just update our own state
                formController.setSubmitted(!!value); // Don't send another notification, just update our own state
              }
            });
          }
        }
      };
    }
  };
}
mod.directive('form', ['formPolicyService', formDirective]);
mod.directive('ngForm', ['formPolicyService', formDirective]);

// We want our formController to expose the list of controls that are registered with the form,
// including controls inside sub-forms. That allows us to reset them directly. Relying simply on the fieldName
// does not work when using sub-forms inside ng-repeaters.

var inputElements = ['input', 'select'];

__WEBPACK_IMPORTED_MODULE_0_angular___default.a.forEach(inputElements, function (inputElem) {
  mod.directive(inputElem, function () {
    function hookupElementToNameToElementMap(formController, element, fieldName, fieldController) {
      // Each element in the map is an array, because form elements *can have the same name*!
      var map = formController._controls;

      if (!map[fieldName]) {
        map[fieldName] = [];
      }
      // Add the field to the end of the list of items with the same name
      map[fieldName][map[fieldName].length] = { 'element': element, 'controller': fieldController };

      element.on('$destroy', function () {
        // Delete just this element from the map of controls
        var map = formController._controls[element.attr('name')];
        var elementId = element.attr('id');

        for (var i = 0; i < map.length; i++) {
          if (map[i].element.attr('id') === elementId) {
            map.splice(i, 1);
            break;
          }
        }
      });
    }

    return {
      restrict: 'E',
      require: ['?^form', '?ngModel'],
      link: {
        pre: function pre(scope, element, attr, controllers) {
          if (!controllers[0]) {
            return;
          }

          var rootFormController = controllers[0]._parentController || controllers[0];
          var fieldController = controllers[1];
          var name = attr.name;

          if (rootFormController && rootFormController._controls) {
            hookupElementToNameToElementMap(rootFormController, element, name, fieldController);
          }
        }
      }
    };
  });
});

/***/ },

/***/ "./modules/ngFormLib/policy/accessibility/PolicyFormAccessibility.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony export (immutable) */ exports["b"] = getAriaErrorElementId;


var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLib.policy.formAccessibility', []);

/* harmony default export */ exports["a"] = mod.name;

var ariaErrorElementSuffix = '-errors-aria';
var ariaErrorElementTemplate = '<span class="sr-only" aria-hidden="true"></span>';

function createAriaErrorElement(formName, fieldName) {
  var elem = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.element(ariaErrorElementTemplate);

  elem.attr('id', getAriaErrorElementId(formName, fieldName));
  return elem;
}

// EXPORTED! Allows the PolicyBehaviourOnStateChange.onErrorSetAriaDescribedByToAriaErrorElement to work.
// Not perfect... still feels like ARIA behaviour is not in one place...
function getAriaErrorElementId(formName, fieldName) {
  return formName + '-' + fieldName + ariaErrorElementSuffix;
}

function createLongErrorDescription(ariaElement, errors) {
  var str = '';
  var i = 0;

  for (var type in errors) {
    if (errors.hasOwnProperty(type)) {
      str += 'Error ' + ++i + ', ' + errors[type] + ',';
    }
  }

  if (i === 1) {
    str = '. There is 1 error for this field. ' + str;
  } else if (i > 1) {
    str = '. There are ' + i + ' errors for this field. ' + str;
  }
  ariaElement.text(str);
}

function createShortErrorDescription(ariaElement, errors) {
  var errorMsgs = [];
  var prefix = '';

  for (var type in errors) {
    if (errors.hasOwnProperty(type)) {
      errorMsgs.push(errors[type]);
    }
  }

  if (errorMsgs.length > 1) {
    prefix = errorMsgs.length + ' errors: ';
  }
  ariaElement.text(prefix + errorMsgs.join('. '));
}

// Define the different display trigger implementations available
mod.constant('formPolicyAccessibilityLibrary', {
  createAriaErrorElement: createAriaErrorElement,
  createLongErrorDescription: createLongErrorDescription,
  createShortErrorDescription: createShortErrorDescription
});

mod.provider('formPolicyAccessibilityBehaviour', ['formPolicyAccessibilityLibrary', function Provider(lib) {
  var config = this.config = {
    createAriaErrorElement: lib.createAriaErrorElement,
    onErrorChangeBehaviour: lib.createLongErrorDescription
  };

  this.$get = function () {
    return config;
  };
}]);

/***/ },

/***/ "./modules/ngFormLib/policy/behaviourOnStateChange/PolicyBehaviourOnStateChange.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angular_scroll__ = __webpack_require__("../node_modules/angular-scroll/angular-scroll.min.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angular_scroll___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_angular_scroll__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__controls_common_FormControlService__ = __webpack_require__("./modules/ngFormLib/controls/common/FormControlService.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__accessibility_PolicyFormAccessibility__ = __webpack_require__("./modules/ngFormLib/policy/accessibility/PolicyFormAccessibility.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__stateDefinitions_PolicyStateDefinitions__ = __webpack_require__("./modules/ngFormLib/policy/stateDefinitions/PolicyStateDefinitions.js");
/* unused harmony export combineBehaviours */






// The form policy intentionally has no hard dependencies.
// If there are form-policy values that exist when the service is being constructed, it will use them.
// Otherwise it will use no-op policy functions.
var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLib.policy.behaviourOnStateChange', ['duScroll', __WEBPACK_IMPORTED_MODULE_2__controls_common_FormControlService__["a" /* default */]]);

/* harmony default export */ exports["a"] = mod.name;

// Helper functions
var timeoutPromise = void 0;
var scrollPromise = void 0;

function isElementVisible(element) {
  return !!element.getBoundingClientRect().top;
}

function setFocusOnField($document, $timeout, duration, element, offset) {
  // If no offsetHeight then assume it's invisible and let the next error field take the scroll position
  if (isElementVisible(element[0])) {
    // console.log('Error focus set to: ' + domElement.id);
    $timeout.cancel(timeoutPromise);
    $timeout.cancel(scrollPromise); // This doesn't seem to make a difference on a Mac - user-generated scrolling does not get cancelled
    timeoutPromise = $timeout(function () {
      element[0].focus();
    }, duration);
    scrollPromise = $document.scrollToElement(element, offset, duration); // scrollToElement() comes from the angular-scroll directive // No offset
    return true;
  }
  return false; // Indicate that we did NOT set the focus
}

// Make this available for people that want to add behaviours:
function combineBehaviours(a, b) {
  // If 'a' is undefined, return b
  if (!a) {
    return b;
  }

  return function () {
    var resultA = a.apply(undefined, arguments);
    var resultB = b.apply(undefined, arguments);

    return {
      applyBehaviour: function applyBehaviour() {
        for (var _len = arguments.length, args2 = Array(_len), _key = 0; _key < _len; _key++) {
          args2[_key] = arguments[_key];
        }

        resultA.applyBehaviour.apply(null, args2);
        resultB.applyBehaviour.apply(null, args2);
      },
      resetBehaviour: function resetBehaviour() {
        for (var _len2 = arguments.length, args2 = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args2[_key2] = arguments[_key2];
        }

        resultA.resetBehaviour.apply(null, args2);
        resultB.resetBehaviour.apply(null, args2);
      }
    };
  };
}

/*
 * Returns a function that can be called when an error is showing FOR THIS FIELD. The function is dynamically created
 *  based on the form policy.
 *
 *  The dynamic function sets the focus if the form policy allows it to
 *  The input parameters are:
 *    - DOMElement of the current form-field control that could get focus
 *    - whether an error is showing on the form-field
 *    - whether the form was just attempted to be submitted
 *
 *  The returned function is stored against the form controller as _applyFormFocusPolicy(...)
 *  _applyFormFocusPolicy() should be called by the field-error-controller directive whenever the field state changes,
 *   and when a form-submit event occurs.
 */
mod.service('formPolicyBehaviourOnStateChangeLibrary', ['$document', '$timeout', 'duScrollDuration', 'formControlService', function ($document, $timeout, duScrollDuration, formControlService) {
  // Policy implementation functions
  function onSubmitFocusFirstFieldIfError(formController) {
    // We want to pretend that there is a single controller for the form, for the purpose of managing the focus.
    // Otherwise, the main form sets the focus, then the subform (ng-form) also sets the focus
    var focusController = formController._parentController || formController;

    return {

      // This function is called by the fieldErrorController when the fieldState changes and when the form is submitted
      applyBehaviour: function applyBehaviour(fieldElem, fieldState, formSubmitAttempted /* , formName, fieldName*/) {
        // Set the focus to the field if there is an error showing and a form-submit has been attempted
        if (fieldState === __WEBPACK_IMPORTED_MODULE_4__stateDefinitions_PolicyStateDefinitions__["b" /* ERROR_STATE */] && formSubmitAttempted) {
          (function () {
            // Make sure element is the first field with an error based on DOM order
            var elems = $document[0][focusController.$name].querySelectorAll('.form-group .ng-invalid');
            var firstElement = void 0;

            __WEBPACK_IMPORTED_MODULE_0_angular___default.a.forEach(elems, function (elem) {
              if (isElementVisible(elem) && !firstElement) {
                firstElement = elem;
              }
            });
            var isFirstElement = firstElement ? firstElement.id === fieldElem[0].id : false;

            // ...and if the focusErrorElement is blank...
            var scrollOffset = formController._policy.behaviourOnStateChange.fieldFocusScrollOffset;

            if (!focusController._focusErrorElement && isFirstElement && setFocusOnField($document, $timeout, duScrollDuration, fieldElem, scrollOffset)) {
              focusController._focusErrorElement = fieldElem;
            }
          })();
        }
      },

      resetBehaviour: function resetBehaviour() {
        focusController._focusErrorElement = null;
      }
    };
  }

  function onErrorSetAriaDescribedByToAriaErrorElement() /* formController*/{
    return {
      applyBehaviour: function applyBehaviour(fieldElem, fieldState, formSubmitAttempted, formName, fieldName) {
        fieldElem.attr('aria-invalid', fieldState === __WEBPACK_IMPORTED_MODULE_4__stateDefinitions_PolicyStateDefinitions__["b" /* ERROR_STATE */]);
        // Get a reference to the error element
        var errorElemId = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__accessibility_PolicyFormAccessibility__["b" /* getAriaErrorElementId */])(formName, fieldName);

        // Link the field to the ariaErrorElement.
        if (fieldState === __WEBPACK_IMPORTED_MODULE_4__stateDefinitions_PolicyStateDefinitions__["b" /* ERROR_STATE */]) {
          formControlService.addToAttribute(fieldElem, 'aria-describedby', errorElemId);
        } else {
          formControlService.removeFromAttribute(fieldElem, 'aria-describedby', errorElemId);
        }
      },
      resetBehaviour: function resetBehaviour() {}
    };
  }

  function updateElementStyle(formController) {
    return {
      applyBehaviour: function applyBehaviour(fieldElem, fieldState, formSubmitAttempted, formName, fieldName, formGroupElement) {
        var policy = formController._policy.behaviourOnStateChange;

        formGroupElement[fieldState === __WEBPACK_IMPORTED_MODULE_4__stateDefinitions_PolicyStateDefinitions__["b" /* ERROR_STATE */] ? 'addClass' : 'removeClass'](policy.fieldErrorClass);
        formGroupElement[fieldState === 'success' ? 'addClass' : 'removeClass'](policy.fieldSuccessClass);
      },
      resetBehaviour: function resetBehaviour() {}
    };
  }

  return {
    onSubmitFocusFirstFieldIfError: onSubmitFocusFirstFieldIfError,
    onErrorSetAriaDescribedByToAriaErrorElement: onErrorSetAriaDescribedByToAriaErrorElement,
    updateElementStyle: updateElementStyle
  };
}]);

mod.provider('formPolicyBehaviourOnStateChange', function Provider() {
  var config = this.config = {
    behaviour: undefined,
    fieldErrorClass: 'has-error',
    fieldSuccessClass: 'has-success',
    fieldFocusScrollOffset: 0
  };

  this.$get = ['formPolicyBehaviourOnStateChangeLibrary', function (lib) {
    // If the behaviour has been over-ridden, great. Otherwise this is the default.
    config.behaviour = config.behaviour || [lib.onSubmitFocusFirstFieldIfError, lib.onErrorSetAriaDescribedByToAriaErrorElement, lib.updateElementStyle].reduce(combineBehaviours);

    return config;
  }];
});

/***/ },

/***/ "./modules/ngFormLib/policy/checkForStateChanges/PolicyCheckForStateChanges.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__stateDefinitions_PolicyStateDefinitions__ = __webpack_require__("./modules/ngFormLib/policy/stateDefinitions/PolicyStateDefinitions.js");



var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLib.policy.checkForStateChanges', []);

/* harmony default export */ exports["a"] = mod.name;

// Policy implementation functions
function checkForStateChangesOnBlurUntilSubmitThenOnChange(scope, element, name, stateDefinitions, ngModelController) {
  var errorWatch = void 0;

  scope.$on('event:FormSubmitAttempted', function () {
    (errorWatch || __WEBPACK_IMPORTED_MODULE_0_angular___default.a.noop)(); // Remove the error watcher, which may-or-may-not be present
    errorWatch = watchForErrorChanges(scope, stateDefinitions, ngModelController);
    // console.log('heard formSubmitAttempted');
  });

  // Listen for the form reset event and cancel the submit-watcher
  scope.$on('event:FormReset', function () {
    (errorWatch || __WEBPACK_IMPORTED_MODULE_0_angular___default.a.noop)(); // Remove the error watcher, which may-or-may-not be present
    errorWatch = undefined;
    // console.log('heard formReset');
  });

  // Initially just watch for blur event. But once there's an error, watch for keyup events too
  watchForBlurEvent(scope, element, name, stateDefinitions, ngModelController);
}

function checkForStateChangesOnChange(scope, element, name, stateDefinitions, ngModelController) {
  // Watch the error condition for changes, and flag the field as inErrorShowing when the errorCondition is true
  return watchForErrorChanges(scope, stateDefinitions, ngModelController);
}

function checkForStateChangesOnBlur(scope, element, name, stateDefinitions, ngModelController) {
  watchForBlurEvent(scope, element, name, stateDefinitions, ngModelController);
}

// Helper methods
function createWatch(scope, ngModelController, stateName, stateCondition) {
  return scope.$watch(stateCondition, function (value) {
    if (value === true) {
      ngModelController.fieldState = stateName; // THIS IS THE KEY FLAG
      // console.log('A: ' + stateCondition + ' = ' + value);
    }
  });
}

function watchForErrorChanges(scope, stateDefinitions, ngModelController) {
  // Set up a watch for each state definition... expensive?
  var watchers = [];

  for (var stateName in stateDefinitions) {
    if (stateDefinitions.hasOwnProperty(stateName)) {
      watchers.push(createWatch(scope, ngModelController, stateName, stateDefinitions[stateName]));
    }
  }

  // Return a de-registration function
  return function () {
    // console.log('Remove error watchers...', watchers);
    watchers.forEach(function (deregistrationFn) {
      return deregistrationFn();
    });
  };
}

function evaluateFieldStates(scope, stateDefinitions, ngModelController) {
  for (var prop in stateDefinitions) {
    if (scope.$eval(stateDefinitions[prop]) === true) {
      ngModelController.fieldState = prop;
      // console.log('B: ' + stateDefinitions[prop] + ' = ' + prop);
      break;
    }
  }
}

function watchForBlurEvent(scope, element, fieldName, stateDefinitions, ngModelController) {
  // Determine the initial field state. First state to evaluate to TRUE wins
  evaluateFieldStates(scope, stateDefinitions, ngModelController);

  var handleErrorsOnKeyChangeWatcher = void 0;

  element.bind('blur', function ngShowWatchAction() {
    var initialFieldState = ngModelController.fieldState;

    evaluateFieldStates(scope, stateDefinitions, ngModelController);
    // console.log(initialFieldState, '=>', ngModelController.fieldState);

    // If onBlur we change into an error state (from a non error state), start watching for error-changes (as soon as the field become valid).
    if (initialFieldState !== ngModelController.fieldState && ngModelController.fieldState === __WEBPACK_IMPORTED_MODULE_1__stateDefinitions_PolicyStateDefinitions__["b" /* ERROR_STATE */] && !handleErrorsOnKeyChangeWatcher) {
      // console.log('adding change watchers');
      handleErrorsOnKeyChangeWatcher = watchForErrorChanges(scope, stateDefinitions, ngModelController);
      // If we are already watching for error-changes and the field is no longer in error, stop watching for error changes
    } else if (handleErrorsOnKeyChangeWatcher && ngModelController.fieldState !== __WEBPACK_IMPORTED_MODULE_1__stateDefinitions_PolicyStateDefinitions__["b" /* ERROR_STATE */]) {
      handleErrorsOnKeyChangeWatcher(); // Remove the watcher
      handleErrorsOnKeyChangeWatcher = undefined;
    }

    scope.$apply(); // We are in a jQueryLite handler and have changed a scope property - fire the watchers!
  });
}

// Define the different display trigger implementations available
mod.constant('formPolicyCheckForStateChangesLibrary', function () {
  return {
    onChange: checkForStateChangesOnChange,
    onBlur: checkForStateChangesOnBlur,
    onBlurUntilSubmitThenOnChange: checkForStateChangesOnBlurUntilSubmitThenOnChange
  };
}());

mod.provider('formPolicyCheckForStateChanges', ['formPolicyCheckForStateChangesLibrary', function Provider(lib) {
  var config = this.config = {
    checker: lib.onBlurUntilSubmitThenOnChange
  };

  this.$get = function () {
    return config;
  };
}]);

/***/ },

/***/ "./modules/ngFormLib/policy/defaultPolicies.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__accessibility_PolicyFormAccessibility__ = __webpack_require__("./modules/ngFormLib/policy/accessibility/PolicyFormAccessibility.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__behaviourOnStateChange_PolicyBehaviourOnStateChange__ = __webpack_require__("./modules/ngFormLib/policy/behaviourOnStateChange/PolicyBehaviourOnStateChange.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__checkForStateChanges_PolicyCheckForStateChanges__ = __webpack_require__("./modules/ngFormLib/policy/checkForStateChanges/PolicyCheckForStateChanges.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__stateDefinitions_PolicyStateDefinitions__ = __webpack_require__("./modules/ngFormLib/policy/stateDefinitions/PolicyStateDefinitions.js");






var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLib.defaultPolicies', [__WEBPACK_IMPORTED_MODULE_1__accessibility_PolicyFormAccessibility__["a" /* default */], __WEBPACK_IMPORTED_MODULE_2__behaviourOnStateChange_PolicyBehaviourOnStateChange__["a" /* default */], __WEBPACK_IMPORTED_MODULE_3__checkForStateChanges_PolicyCheckForStateChanges__["a" /* default */], __WEBPACK_IMPORTED_MODULE_4__stateDefinitions_PolicyStateDefinitions__["a" /* default */]]);

/* harmony default export */ exports["a"] = mod.name;

/***/ },

/***/ "./modules/ngFormLib/policy/stateDefinitions/PolicyStateDefinitions.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony export (binding) */ __webpack_require__.d(exports, "b", function() { return ERROR_STATE; });
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



// TODO: What if the state definition expressions returned the statename, rather than true or false, so we wouldn't need
// to create a watch for each state definition. Instead, the expressions for each state would be like a big
// switch statement, returning a state name or undefined.


// Define the different display trigger implementations available
var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLib.policy.stateDefinitions', []);

/* harmony default export */ exports["a"] = mod.name;
var ERROR_STATE = 'error';

// Error Conditions
function errorOnSubmit(formName, fieldName) {
  return formName + '._formSubmitAttempted && ' + fieldName + '.$invalid';
}

function errorOnDirty(formName, fieldName) {
  return fieldName + '.$dirty && ' + fieldName + '.$invalid';
}

function errorImmediately(formName, fieldName) {
  return fieldName + '.$invalid';
}

function errorOnSubmitAndDirty(formName, fieldName) {
  return formName + '._formSubmitAttempted && ' + fieldName + '.$dirty && ' + fieldName + '.$invalid';
}

function errorOnSubmitOrDirty(formName, fieldName) {
  return '(' + formName + '._formSubmitAttempted || ' + fieldName + '.$dirty) && ' + fieldName + '.$invalid';
}

mod.constant('formPolicyErrorDefinitionLibrary', {
  onSubmit: errorOnSubmit,
  onDirty: errorOnDirty,
  immediately: errorImmediately,
  onSubmitAndDirty: errorOnSubmitAndDirty,
  onSubmitOrDirty: errorOnSubmitOrDirty
});

// Success Definitions
function successOnSubmit(formName, fieldName) {
  return formName + '._formSubmitAttempted && ' + fieldName + '.$valid';
}

function successOnDirty(formName, fieldName) {
  return fieldName + '.$dirty && ' + fieldName + '.$valid';
}

function successImmediately(formName, fieldName) {
  return fieldName + '.$valid';
}

function successOnSubmitAndDirty(formName, fieldName) {
  return formName + '._formSubmitAttempted && ' + fieldName + '.$dirty && ' + fieldName + '.$valid';
}

function successOnSubmitOrDirty(formName, fieldName) {
  return '(' + formName + '._formSubmitAttempted || ' + fieldName + '.$dirty) && ' + fieldName + '.$valid';
}

mod.constant('formPolicySuccessDefinitionLibrary', {
  onSubmit: successOnSubmit,
  onDirty: successOnDirty,
  immediately: successImmediately,
  onSubmitAndDirty: successOnSubmitAndDirty,
  onSubmitOrDirty: successOnSubmitOrDirty
});

mod.provider('formPolicyStateDefinitions', ['formPolicyErrorDefinitionLibrary', 'formPolicySuccessDefinitionLibrary', function Provider(errorLib, successLib) {
  var _states;

  var config = this.config = {
    states: (_states = {}, _defineProperty(_states, ERROR_STATE, errorLib.onSubmitOrDirty), _defineProperty(_states, 'success', successLib.onSubmitOrDirty), _states)
  };

  config.create = function (formName, fieldName) {
    var result = {};

    for (var state in config.states) {
      if (config.states.hasOwnProperty(state)) {
        result[state] = config.states[state](formName, fieldName);
      }
    }
    return result;
  };

  this.$get = function () {
    return config;
  };
}]);

/***/ },

/***/ 1:
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./modules/ngFormLib/index.js");


/***/ }

},[1]);
//# sourceMappingURL=ngFormLib.10aa5a2d.js.map