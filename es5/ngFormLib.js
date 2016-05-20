(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("angular"), require("angular-scroll"));
	else if(typeof define === 'function' && define.amd)
		define(["angular", "angular-scroll"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("angular"), require("angular-scroll")) : factory(root["angular"], root["angular-scroll"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_29__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(16);


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _angular = __webpack_require__(1);
	
	var _angular2 = _interopRequireDefault(_angular);
	
	var _FormControlService = __webpack_require__(4);
	
	var _FormControlService2 = _interopRequireDefault(_FormControlService);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var mod = _angular2.default.module('ngFormLib.controls.errorMessageContainer', [_FormControlService2.default]);
	
	exports.default = mod.name;
	
	//angular.module('ngFormLib.controls.errorMessageContainer', ['pascalprecht.translate'])
	
	/**
	 * This directive is really a FIELD error message container - it is designed to work with fields exclusively
	 */
	
	mod.directive('errorContainer', ['$compile', 'formControlService', function ($compile, formControlService) {
	
	  function translateError(errorMessage, fieldLabel) {
	    var firstLetterIsAVowel = fieldLabel ? 'aeiou'.indexOf(fieldLabel[0].toLowerCase()) !== -1 : undefined;
	    return formControlService.translate(errorMessage, { pronoun: firstLetterIsAVowel ? 'an' : 'a', fieldLabel: fieldLabel });
	  }
	
	  function ErrorController(element) {
	    var errors = [],
	        ariaElement = element;
	
	    return {
	      addError: function addError(errorType, errorMessage, fieldLabel) {
	        errors[errorType] = translateError(errorMessage, fieldLabel);
	      },
	
	      removeError: function removeError(errorType) {
	        delete errors[errorType];
	      },
	
	      refreshErrorText: function refreshErrorText() {
	        var str = '',
	            i = 0;
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
	    };
	  }
	
	  function generateErrorTag(errorType, errorText, fieldLabel) {
	    return '<div class="text-error ec2-' + errorType + '"><span class="text-error-wrap">' + translateError(errorText, fieldLabel) + '</span></div>';
	  }
	
	  /**
	   * Handle the field-based error messages
	   */
	  function toggleErrorVisibilityOnError(controller, formController, scope, element, watchExpr, errorType, errorText, fieldLabel) {
	    //console.log('watchExpr = ' + watchExpr);
	    formController._scope.$watch(watchExpr, function (newValue) {
	      if (newValue) {
	        // The error text could contain an interpolation string, so we need to compile it
	        var val = $compile(generateErrorTag(errorType, errorText, fieldLabel))(scope);
	        element.append(val);
	        controller.addError(errorType, errorText, fieldLabel);
	      } else {
	        removeErrorMessage(controller, formController, element, errorType);
	      }
	      controller.refreshErrorText();
	    });
	  }
	
	  /**
	   * Handle text errors. Text errors are associated with a scope, rather than with a field.
	   * This means we can clear them from the scope when the field-they-are-associated-with is changed.
	   */
	  function toggleErrorVisibilityForTextError(errorController, formController, fieldController, scope, element, watchExpr, fieldLabel) {
	    //console.log('Watching error: ' + watchExpr);
	
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
	      errorController.refreshErrorText();
	    });
	
	    // When the field changes, clear the errorText value
	    fieldController.$viewChangeListeners.push(function () {
	      if (scope.$eval(watchExpr)) {
	        scope.$eval(watchExpr + ' = null');
	      }
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
	
	  return {
	    restrict: 'AE',
	    require: ['^form'], // Require the formController controller somewhere in the parent hierarchy (mandatory for field-errors)
	    template: '<div class="container-error"></div>',
	    replace: true,
	    link: function link(scope, element, attr, controllers) {
	
	      var fieldName = attr.fieldName,
	          fieldLabel = attr.fieldLabel || '',
	          formController = controllers[0],
	          formName = formController.$name,
	          formField = formName + '.' + fieldName,
	          fieldErrors = scope.$eval(attr.fieldErrors || []),
	          // You can escape interpolation brackets inside strings by doing  \{\{   - wow!
	      textErrors = scope.$eval(attr.textErrors || []);
	
	      element.attr('id', formName + '-' + fieldName + '-errors');
	      element.append('<span class="sr-only" aria-hidden="true" id="' + formName + '-' + fieldName + '-errors-aria"></span>');
	
	      var ariaElement = element.find('span'),
	          errorController = new ErrorController(ariaElement); // new? Maybe make this the directive's controller instead
	
	      for (var error in fieldErrors) {
	        if (fieldErrors.hasOwnProperty(error)) {
	          var errorShowCondition = formField + '.fieldState === "error" && ' + formField + '.$error.' + error;
	          toggleErrorVisibilityOnError(errorController, formController, scope, element, errorShowCondition, error, fieldErrors[error], fieldLabel);
	        }
	      }
	
	      // Watch formController[fieldName] - it may not have loaded yet. When it loads, call the main function.
	      if (textErrors) {
	        //console.log('textErrors: ' + textErrors + ', fieldName = ' + fieldName);
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
	      }
	
	      element.removeAttr('error-container').removeAttr('field-name').removeAttr('field-errors').removeAttr('text-errors');
	    }
	  };
	}]);
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _angular = __webpack_require__(1);
	
	var _angular2 = _interopRequireDefault(_angular);
	
	var _FieldErrorController = __webpack_require__(6);
	
	var _FieldErrorController2 = _interopRequireDefault(_FieldErrorController);
	
	var _FormControlService = __webpack_require__(4);
	
	var _FormControlService2 = _interopRequireDefault(_FormControlService);
	
	var _RequiredMarker = __webpack_require__(15);
	
	var _RequiredMarker2 = _interopRequireDefault(_RequiredMarker);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var mod = _angular2.default.module('ngFormLib.controls.common', [_FieldErrorController2.default, _FormControlService2.default, _RequiredMarker2.default]);
	
	exports.default = mod.name;
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _angular = __webpack_require__(1);
	
	var _angular2 = _interopRequireDefault(_angular);
	
	var _Utility = __webpack_require__(5);
	
	var _Utility2 = _interopRequireDefault(_Utility);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var mod = _angular2.default.module('ngFormLib.controls.common.formControlService', [_Utility2.default]);
	
	exports.default = mod.name;
	
	// Workaround for bug #1404
	// https://github.com/angular/angular.js/issues/1404
	// Source: http://plnkr.co/edit/hSMzWC?p=preview
	// Not so great for IE8, but necessary for using radio buttons inside of dynamic forms (ng-repeat)
	
	mod.config(['$provide', function ($provide) {
	  $provide.decorator('ngModelDirective', ['$delegate', function ($delegate) {
	    var ngModel = $delegate[0],
	        controller = ngModel.controller;
	    ngModel.controller = ['$scope', '$element', '$attrs', '$injector', function (scope, element, attrs, $injector) {
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
	    var form = $delegate[0],
	        controller = form.controller;
	    form.controller = ['$scope', '$element', '$attrs', '$injector', function (scope, element, attrs, $injector) {
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
	mod.provider('formControlService', function () {
	  var self = this,
	      counter = 0; // Private variable
	
	  //
	  self.defaults = {
	    idPrefix: 'fpFld',
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
	      translator = _angular2.default.identity;
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
	            var id = tAttr.uid || service.getUniqueFieldId(),
	                name = tAttr.name || id,
	                // Doing this *will* break radio buttons, but they SHOULD provide a name anyway (for their own good)
	            inputElem = tElement.find(params.inputElementName || 'input'),
	                labelElem = tElement.find('label'),
	                required = service.getRequiredAttribute(tAttr.required);
	
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
	        var existingVal = element.attr(attributeName);
	        element.attr(attributeName, (existingVal ? existingVal + ' ' : '') + value);
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
	
	      addInputGroup: function addInputGroup(inputElem, inputGroupPrefix, inputGroupSuffix) {
	        if (inputGroupPrefix || inputGroupSuffix) {
	          inputElem.wrap('<div class="input-group">'); //inputElem.parent(); // This should be the 'control-row' element//wrap('<div class="input-group">');
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
	        if (!hideRequiredIndicator) {
	          labelElem.append('<span required-marker hide="!(' + required + ')"></span>');
	        }
	        // Some labels have suffix text - text that helps with describing the label, but isn't really the label text.
	        // E.g. Amount ($AUD)
	        if (labelSuffix) {
	          labelElem.text(labelElem.text() + ' ' + service.translate(labelSuffix));
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
	          var errorContainerElem = _angular2.default.element('<div error-container field-name="' + name + '"' + fieldLabelStr + '></div>');
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
	        var hintElement;
	
	        if (fieldHint) {
	          var hintText = service.translate(fieldHint);
	          // If we have a field hint, add that as well
	          if (fieldHintDisplay) {
	            // If a field hint display rule exists, implement.
	            hintElement = _angular2.default.element('<p ng-if="' + fieldHintDisplay + '" class="help-block" id="' + fieldHintId + '">' + hintText + '</p>');
	          } else {
	            hintElement = _angular2.default.element('<p class="help-block" id="' + fieldHintId + '">' + hintText + '</p>');
	          }
	          hostElement.append(hintElement);
	          inputElement.attr('aria-describedby', fieldHintId);
	        }
	      },
	
	      buildNgClassExpression: function buildNgClassExpression(inputElem, targetElem) {
	        // If the inputElem has an ngModel and/or ngChecked attribute, create the ng-class attribute
	        //todo.. test checkbox implementation
	        var modelStr = inputElem.attr('ng-model'),
	            checkedStr = inputElem.attr('ng-checked'),
	            disabledStr = inputElem.attr('ng-disabled'),
	            value = inputElem.attr('value'),
	            // a string - used for Radio buttons
	        ngValue = inputElem.attr('ng-value'),
	            // an expression - used for Radio buttons
	        ngTrueValue = inputElem.attr('ng-true-value');
	
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
	module.exports = exports['default'];

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _angular = __webpack_require__(1);
	
	var _angular2 = _interopRequireDefault(_angular);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var mod = _angular2.default.module('ngFormLib.common.utility', []);
	
	exports.default = mod.name;
	
	
	mod.constant('ngFormLibDateUtil', {
	  convertDate: function convertDate(dateStr, newSep) {
	    // Converts a date between dd/mm/yyyy and yyyy-mm-dd
	    if (!dateStr || !newSep || !(newSep === '/' || newSep === '-')) {
	      return dateStr;
	    }
	
	    // Choose a separator string that is the 'opposite' of the desired separator
	    var oldSep = newSep === '/' ? '-' : '/',
	        parts = dateStr.split(oldSep);
	
	    // if we get a dodgy date OR you tried to convert a date that was already in the correct format, return the input
	    if (isNaN(parts.join('')) || parts.length !== 3) {
	      return dateStr;
	    }
	
	    // Swap the year and day parts around
	    return parts[2] + newSep + parts[1] + newSep + parts[0];
	  },
	  formatDay: function formatDay(dayOrDate, month, year) {
	    var dd = dayOrDate,
	        mm = month,
	        yyyy = year;
	    if (dayOrDate.getUTCDay) {
	      dd = dayOrDate.getDate();
	      mm = dayOrDate.getMonth() + 1; //January is 0!`
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
	    return date2.getMonth() - date1.getMonth() + 12 * (date2.getFullYear() - date1.getFullYear());
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
	module.exports = exports['default'];

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _angular = __webpack_require__(1);
	
	var _angular2 = _interopRequireDefault(_angular);
	
	var _FormControlService = __webpack_require__(4);
	
	var _FormControlService2 = _interopRequireDefault(_FormControlService);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var mod = _angular2.default.module('ngFormLib.controls.common.fieldErrorController', [_FormControlService2.default]);
	
	exports.default = mod.name;
	
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
	
	  function updateAriaFeatures(fieldState, element, formName, fieldName) {
	    element.attr('aria-invalid', fieldState === 'error');
	    var errorElemId = formName + '-' + fieldName + '-errors-aria';
	
	    if (fieldState === 'error') {
	      // Use the errorContainer's special ARIA element as the source of the error text
	      formControlService.addToAttribute(element, 'aria-describedby', errorElemId);
	    } else {
	      formControlService.removeFromAttribute(element, 'aria-describedby', errorElemId);
	    }
	  }
	
	  function updateElementStyle(fieldState, element, formPolicy) {
	    element[fieldState === 'error' ? 'addClass' : 'removeClass'](formPolicy.fieldErrorClass);
	    element[fieldState === 'success' ? 'addClass' : 'removeClass'](formPolicy.fieldSuccessClass);
	  }
	
	  function setupCanShowErrorPropertyOnNgModelController(scope, formController, ngModelController, element, name) {
	    // Using the form policy, determine when to show errors for this field
	    var formPolicy = formController._policy,
	        formName = formController.$name,
	        fieldName = formName + '.' + name,
	        stateConditions = formPolicy.stateDefinitions(formName, fieldName);
	
	    formPolicy.checkForStateChanges(formController._scope, element, name, stateConditions, ngModelController, formController);
	  }
	
	  return {
	    restrict: 'AE',
	    require: ['?ngModel', '?^form', '?^formGroup'], // Require the formController controller somewhere in the parent hierarchy
	    replace: true,
	    link: function link(scope, element, attr, controllers) {
	      // Tried to use a template string, but the model was not binding properly. Using $compile() works :)
	      var ngModelController = controllers[0],
	          formController = controllers[1],
	          formGroupElement = (controllers[2] || {}).$element || element,
	          // This looks for a parent directive called formGroup, which has a controller, which has an $element property
	      name = attr.name;
	
	      if (formController) {
	        var formName = formController.$name,
	            errorBehaviour = formController._applyFormBehaviourOnStateChangePolicy; // returns a function which encapsulates the form policy rules for the behaviour to apply when errors show
	
	        if (ngModelController) {
	          setupCanShowErrorPropertyOnNgModelController(scope, formController, ngModelController, element, name);
	        }
	
	        // When the error-showing flag changes, update the field style
	        formController._scope.$watch(formName + '.' + name + '.fieldState', function (fieldState) {
	          updateAriaFeatures(fieldState, element, formName, name);
	          updateElementStyle(fieldState, formGroupElement, formController._policy);
	
	          // Apply the error behaviour behaviour
	          errorBehaviour.applyBehaviour(element, fieldState, false);
	        });
	
	        // Listen to form-submit events, to determine what to focus on too
	        scope.$on('event:FormSubmitAttempted', function () {
	          // Make sure that the field-level watchers have a chance to fire first, so use a timeout
	          $timeout(function () {
	            errorBehaviour.applyBehaviour(element, ngModelController.fieldState, true);
	          }, 1);
	        });
	      }
	    }
	  };
	}]);
	
	// This directive wraps all of the form elements and binds the universe together.
	// It MUST be used as a class as the form focus behaviour references '.form-control .ng-invalid' when finding controls to focus
	mod.directive('formGroup', [function () {
	  return {
	    restrict: 'C',
	    controller: ['$scope', '$element', function ($scope, $element) {
	      this.$element = $element;
	    }]
	  };
	}]);
	module.exports = exports['default'];

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _angular = __webpack_require__(1);
	
	var _angular2 = _interopRequireDefault(_angular);
	
	var _index = __webpack_require__(3);
	
	var _index2 = _interopRequireDefault(_index);
	
	var _ErrorMessageContainer = __webpack_require__(2);
	
	var _ErrorMessageContainer2 = _interopRequireDefault(_ErrorMessageContainer);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var mod = _angular2.default.module('ngFormLib.controls.formCheckbox', [_index2.default, _ErrorMessageContainer2.default]);
	
	exports.default = mod.name;
	
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
	      // Move the class attribute from the outer-DIV to the checkbox DIV (special case)
	      var checkboxDiv = tElement.find('div');
	      checkboxDiv.addClass(tElement.attr('class'));
	      tElement.removeAttr('class');
	
	      formControlService.createErrorFeatures(tElement, inputElem, name, '', tAttr.fieldErrors, tAttr.textErrors);
	      formControlService.buildNgClassExpression(inputElem, inputElem); // Put the ng-class onto the input element itself, as this makes styling easier
	    }
	  });
	}]);
	
	// Populate the template cache with the default template
	mod.run(['$templateCache', function ($templateCache) {
	  $templateCache.put('ngFormLib/template/formCheckbox.html', __webpack_require__(23));
	}]);
	module.exports = exports['default'];

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _angular = __webpack_require__(1);
	
	var _angular2 = _interopRequireDefault(_angular);
	
	var _common = __webpack_require__(3);
	
	var _common2 = _interopRequireDefault(_common);
	
	var _ErrorMessageContainer = __webpack_require__(2);
	
	var _ErrorMessageContainer2 = _interopRequireDefault(_ErrorMessageContainer);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var mod = _angular2.default.module('ngFormLib.controls.formDate', [_common2.default, _ErrorMessageContainer2.default]);
	
	//'mgcrea.ngStrap.datepicker'   We are using this, but if it is not loaded, we can still offer basic functionality
	exports.default = mod.name;
	
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
	
	      // If the user wants to use 'input-addon-prefix' or 'input-addon-suffix', change the DOM
	      var hasInputGroup = formControlService.addInputGroup(inputElem, tAttr.inputPrefix, tAttr.inputSuffix);
	      var parentElemForErrors = hasInputGroup ? inputElem.parent().parent() : inputElem.parent();
	
	      formControlService.createFieldHint(tElement, inputElem, tAttr.fieldHint, id + '-hint', tAttr.fieldHintDisplay);
	      formControlService.createErrorFeatures(parentElemForErrors, inputElem, name, tAttr.label, tAttr.fieldErrors, tAttr.textErrors);
	    }
	  });
	}]);
	
	// Populate the template cache with the default template
	mod.run(['$templateCache', function ($templateCache) {
	  $templateCache.put('ngFormLib/template/formDate.html', __webpack_require__(24));
	  try {
	    $templateCache.put('datepicker/datepicker.tpl.html', __webpack_require__(22));
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
	module.exports = exports['default'];

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _angular = __webpack_require__(1);
	
	var _angular2 = _interopRequireDefault(_angular);
	
	var _common = __webpack_require__(3);
	
	var _common2 = _interopRequireDefault(_common);
	
	var _ErrorMessageContainer = __webpack_require__(2);
	
	var _ErrorMessageContainer2 = _interopRequireDefault(_ErrorMessageContainer);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var mod = _angular2.default.module('ngFormLib.controls.formInput', [_common2.default, _ErrorMessageContainer2.default]);
	
	exports.default = mod.name;
	
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
	
	      // If the user wants to use 'input-addon-prefix' or 'input-addon-suffix', change the DOM
	      var hasInputGroup = formControlService.addInputGroup(inputElem, tAttr.inputPrefix, tAttr.inputSuffix);
	      var parentElemForErrors = hasInputGroup ? inputElem.parent().parent() : inputElem.parent();
	
	      formControlService.createFieldHint(tElement, inputElem, tAttr.fieldHint, id + '-hint', tAttr.fieldHintDisplay);
	      formControlService.createErrorFeatures(parentElemForErrors, inputElem, name, tAttr.label, tAttr.fieldErrors, tAttr.textErrors);
	    }
	  });
	}]);
	
	// Populate the template cache with the default template
	mod.run(['$templateCache', function ($templateCache) {
	  $templateCache.put('ngFormLib/template/formInput.html', __webpack_require__(25));
	}]);
	
	function addPlaceholder(inputElem, placeholderText) {
	  if (placeholderText) {
	    inputElem.attr('placeholder', placeholderText);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _angular = __webpack_require__(1);
	
	var _angular2 = _interopRequireDefault(_angular);
	
	var _common = __webpack_require__(3);
	
	var _common2 = _interopRequireDefault(_common);
	
	var _ErrorMessageContainer = __webpack_require__(2);
	
	var _ErrorMessageContainer2 = _interopRequireDefault(_ErrorMessageContainer);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var mod = _angular2.default.module('ngFormLib.controls.formRadioButton', [_common2.default, _ErrorMessageContainer2.default]);
	
	exports.default = mod.name;
	
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
	  $templateCache.put('ngFormLib/template/formRadioButton.html', __webpack_require__(26));
	}]);
	module.exports = exports['default'];

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _angular = __webpack_require__(1);
	
	var _angular2 = _interopRequireDefault(_angular);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var mod = _angular2.default.module('ngFormLib.controls.formReset', []);
	
	exports.default = mod.name;
	
	
	mod.directive('formReset', ['$parse', function ($parse) {
	
	  function resetFieldState(controlMap) {
	    // Loops through the controlMap and reset's each field's state
	    for (var item in controlMap) {
	      if (controlMap.hasOwnProperty(item)) {
	        var controlList = controlMap[item];
	        for (var j = 0, jLen = controlList.length; j < jLen; j++) {
	          var control = controlList[j].controller;
	          control.fieldState = '';
	        }
	      }
	    }
	  }
	
	  return {
	    restrict: 'A',
	    require: '^form',
	    link: function link(scope, element, attr, controller) {
	      var ngModelGet = $parse(attr.formReset),
	          ngModelSet = ngModelGet.assign;
	
	      if (!ngModelSet) {
	        throw Error('formReset requires an assignable scope-expression. "' + attr.formReset + '" is un-assignable.');
	      }
	
	      // Get a copy of the data as soon as the directive is created, which is after the scope/controller has been initialised (safe)
	      var originalData = _angular2.default.copy(ngModelGet(scope));
	
	      element.on('click', function () {
	        if (typeof controller.setSubmitted === 'function') {
	          controller.setSubmitted(false);
	        }
	        // Use a *copy* of the original data, as we don't want originalData to be modified by subsequent changes to the model by the form controls
	        ngModelSet(scope, _angular2.default.copy(originalData));
	        resetFieldState(controller._controls || {});
	        controller.$setPristine();
	
	        scope.$emit('event:FormReset');
	        scope.$digest();
	      });
	    }
	  };
	}]);
	module.exports = exports['default'];

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _angular = __webpack_require__(1);
	
	var _angular2 = _interopRequireDefault(_angular);
	
	var _common = __webpack_require__(3);
	
	var _common2 = _interopRequireDefault(_common);
	
	var _ErrorMessageContainer = __webpack_require__(2);
	
	var _ErrorMessageContainer2 = _interopRequireDefault(_ErrorMessageContainer);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var mod = _angular2.default.module('ngFormLib.controls.formSelect', [_common2.default, _ErrorMessageContainer2.default]);
	
	exports.default = mod.name;
	
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
	  $templateCache.put('ngFormLib/template/formSelect.html', __webpack_require__(27));
	}]);
	module.exports = exports['default'];

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _angular = __webpack_require__(1);
	
	var _angular2 = _interopRequireDefault(_angular);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var mod = _angular2.default.module('ngFormLib.controls.formSubmit', []);
	
	exports.default = mod.name;
	
	/**
	 *  formSubmit - Executes an expression when the form is valid (essentially a form.submit() handler).
	 *
	 *  It can be applied to either the form element or to a button.
	 *
	 */
	
	mod.directive('formSubmit', ['$parse', function ($parse) {
	  return {
	    restrict: 'A',
	    require: ['^form'], // Get the form controller
	    link: function link(scope, element, attr, controller) {
	
	      var fn = $parse(attr.formSubmit) || _angular2.default.noop,
	          isForm = element[0].tagName === 'FORM',
	          formController = controller[0];
	
	      element.bind(isForm ? 'submit' : 'click', function (event) {
	
	        formController.setSubmitted(true);
	
	        scope.$apply(function () {
	          //scope.$emit('event:FormSubmitAttempted');
	
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
	module.exports = exports['default'];

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _angular = __webpack_require__(1);
	
	var _angular2 = _interopRequireDefault(_angular);
	
	var _ErrorMessageContainer = __webpack_require__(2);
	
	var _ErrorMessageContainer2 = _interopRequireDefault(_ErrorMessageContainer);
	
	var _FormCheckbox = __webpack_require__(7);
	
	var _FormCheckbox2 = _interopRequireDefault(_FormCheckbox);
	
	var _FormDate = __webpack_require__(8);
	
	var _FormDate2 = _interopRequireDefault(_FormDate);
	
	var _FormInput = __webpack_require__(9);
	
	var _FormInput2 = _interopRequireDefault(_FormInput);
	
	var _FormRadioButton = __webpack_require__(10);
	
	var _FormRadioButton2 = _interopRequireDefault(_FormRadioButton);
	
	var _FormReset = __webpack_require__(11);
	
	var _FormReset2 = _interopRequireDefault(_FormReset);
	
	var _FormSelect = __webpack_require__(12);
	
	var _FormSelect2 = _interopRequireDefault(_FormSelect);
	
	var _FormSubmit = __webpack_require__(13);
	
	var _FormSubmit2 = _interopRequireDefault(_FormSubmit);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// We need the utility module for the ngFormLibDateUtil.getDate() method for the formDateFormat directive, and ngFormLibStringUtil.trim() in controls.common
	var mod = _angular2.default.module('ngFormLib.controls', [_ErrorMessageContainer2.default, _FormCheckbox2.default, _FormDate2.default, _FormInput2.default, _FormRadioButton2.default, _FormReset2.default, _FormSelect2.default, _FormSubmit2.default]);
	
	exports.default = mod.name;
	module.exports = exports['default'];

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _angular = __webpack_require__(1);
	
	var _angular2 = _interopRequireDefault(_angular);
	
	var _FormControlService = __webpack_require__(4);
	
	var _FormControlService2 = _interopRequireDefault(_FormControlService);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var mod = _angular2.default.module('ngFormLib.controls.requiredMarker', [_FormControlService2.default]);
	
	exports.default = mod.name;
	
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
	  $templateCache.put('ngFormLib/template/requiredMarker.html', __webpack_require__(28));
	}]);
	module.exports = exports['default'];

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _angular = __webpack_require__(1);
	
	var _angular2 = _interopRequireDefault(_angular);
	
	var _FormPolicy = __webpack_require__(17);
	
	var _FormPolicy2 = _interopRequireDefault(_FormPolicy);
	
	var _controls = __webpack_require__(14);
	
	var _controls2 = _interopRequireDefault(_controls);
	
	var _defaultPolicies = __webpack_require__(20);
	
	var _defaultPolicies2 = _interopRequireDefault(_defaultPolicies);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var mod = _angular2.default.module('ngFormLib', [_FormPolicy2.default, _controls2.default]);
	
	// The library, and the default policies
	
	
	// Don't include this in the angular module, only export it here for convenience
	exports.default = {
	  ngFormLib: mod.name,
	  defaultPolicies: _defaultPolicies2.default
	};
	module.exports = exports['default'];

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _angular = __webpack_require__(1);
	
	var _angular2 = _interopRequireDefault(_angular);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// The form policy intentionally has no hard dependencies.
	// If there are form-policy values that exist when the service is being constructed, it will use them.
	// Otherwise it will use no-op policy functions.
	var mod = _angular2.default.module('ngFormLib.policy', []);
	
	exports.default = mod.name;
	
	// This is a configurable service
	// It should contain the _default_ values for form policies
	
	mod.provider('formPolicyService', function () {
	  var self = this,
	      noop = _angular2.default.noop,
	      nullBehaviourOnStateChange = function nullBehaviourOnStateChange() {
	    return {
	      applyBehaviour: noop,
	      resetBehaviour: noop
	    };
	  },
	      nullStateChanges = function nullStateChanges() {
	    return {};
	  };
	
	  self.defaults = {
	    formSubmitAttemptedClass: 'form-submit-attempted',
	    fieldErrorClass: 'has-error',
	    fieldSuccessClass: 'has-success',
	    behaviourOnStateChange: null, // Previously called focusBehavior
	    checkForStateChanges: null,
	    stateDefinitions: null,
	    fieldFocusScrollOffset: 0
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
	    self.defaults.behaviourOnStateChange = self.defaults.behaviourOnStateChange || getService('formPolicyBehaviourOnStateChange') || nullBehaviourOnStateChange;
	    self.defaults.checkForStateChanges = self.defaults.checkForStateChanges || getService('formPolicyCheckForStateChanges') || noop;
	    self.defaults.stateDefinitions = self.defaults.stateDefinitions || getService('formPolicyStateDefinitions') || nullStateChanges;
	
	    var policyService = {
	      getCurrentPolicy: function getCurrentPolicy() {
	        return _angular2.default.copy(self.defaults);
	      }
	    };
	
	    return policyService;
	  }];
	});
	
	function formDirective(formPolicyService) {
	
	  return {
	    //priority: -1,
	    restrict: 'AE',
	    require: ['?form'], // Tells the directive to get the controller for the 'form' directive, which is the FormController controller
	    compile: function compile(tElement, tAttr) {
	
	      // Use element.data() to store a reference to this element for use by child.inheritedData()
	      // Will storing an element this way cause a memory leak? Or should I just store the data I currently need (attr.class)
	      // This has to happen during the compile step, as the children need access to the variable when they are compiled
	      //  ('class' is a reserved word to JavaScript, so we need to treat it as a string)
	      tElement.data('formElementClasses', tAttr['class']); //jscs:ignore
	
	      return {
	        pre: function pre(scope, element, attr, controller) {
	          // We want to extend the FormController by adding a form policy
	          var formController = controller[0];
	          formController._policy = _angular2.default.extend(formPolicyService.getCurrentPolicy(), scope.$eval(attr.formPolicy));
	
	          // Add a reference to the <form> element's scope to the formController, to support showing errors for nested components
	          formController._scope = scope;
	
	          // Determine if we have a parent form controller. If we do, we want to use it for the focus behaviour
	          formController._parentController = element.parent().controller('form');
	
	          if (!formController._parentController) {
	            // We also want to add an element reference when a control is added
	            formController._controls = {};
	          }
	
	          // Generate the focus policy function for use by other directive
	          formController._applyFormBehaviourOnStateChangePolicy = formController._policy.behaviourOnStateChange(formController);
	
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
	                //formController.setSubmitted(!!value, true);  // Don't send another notification, just update our own state
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
	
	_angular2.default.forEach(inputElements, function (inputElem) {
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
	
	          var rootFormController = controllers[0]._parentController || controllers[0],
	              fieldController = controllers[1],
	              name = attr.name;
	
	          if (rootFormController && rootFormController._controls) {
	            hookupElementToNameToElementMap(rootFormController, element, name, fieldController);
	          }
	        }
	      }
	    };
	  });
	});
	module.exports = exports['default'];

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _angular = __webpack_require__(1);
	
	var _angular2 = _interopRequireDefault(_angular);
	
	__webpack_require__(29);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// The form policy intentionally has no hard dependencies.
	// If there are form-policy values that exist when the service is being constructed, it will use them.
	// Otherwise it will use no-op policy functions.
	var mod = _angular2.default.module('ngFormLib.policy.behaviourOnStateChange', ['duScroll']);
	
	exports.default = mod.name;
	
	// Helper functions
	
	var timeoutPromise, scrollPromise;
	
	function setFocusOnField($document, $timeout, duration, element, offset) {
	  // If no offsetHeight then assume it's invisible and let the next error field take the scroll position
	  if (element[0].offsetHeight) {
	    //console.log('Error focus set to: ' + domElement.id);
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
	
	/**
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
	mod.service('formPolicyBehaviourOnStateChangeLibrary', ['$document', '$timeout', 'duScrollDuration', function ($document, $timeout, duScrollDuration) {
	
	  // Policy implementation functions
	  function behaviourOnErrorFocusFirstField(formController) {
	    // We want to pretend that there is a single controller for the form, for the purpose of managing the focus.
	    // Otherwise, the main form sets the focus, then the subform (ng-form) also sets the focus
	    var focusController = formController._parentController || formController;
	
	    return {
	      // This function is called by the fieldErrorController when the fieldState changes and when the form is submitted
	      applyBehaviour: function applyBehaviour(fieldElem, fieldState, formSubmitAttempted) {
	        // Set the focus to the field if there is an error showing and a form-submit has been attempted
	        if (fieldState === 'error' && formSubmitAttempted) {
	          // Make sure element is the first field with an error based on DOM order
	          var elems = $document[0][focusController.$name].querySelectorAll('.form-group .ng-invalid');
	          var firstElement;
	          _angular2.default.forEach(elems, function (elem) {
	            console.log(elem.getBoundingClientRect());
	            if (elem.getBoundingClientRect().top && !firstElement) {
	              firstElement = elem;
	            }
	          });
	          var isFirstElement = firstElement ? firstElement.id === fieldElem[0].id : false;
	
	          // ...and if the focusErrorElement is blank...
	          if (!focusController._focusErrorElement && isFirstElement && setFocusOnField($document, $timeout, duScrollDuration, fieldElem, formController._policy.fieldFocusScrollOffset)) {
	            focusController._focusErrorElement = fieldElem;
	          }
	        }
	      },
	      resetBehaviour: function resetBehaviour() {
	        focusController._focusErrorElement = null;
	      }
	    };
	  }
	
	  return {
	    onSubmitFocusFirstFieldIfError: behaviourOnErrorFocusFirstField
	  };
	}]);
	
	mod.factory('formPolicyBehaviourOnStateChange', ['formPolicyBehaviourOnStateChangeLibrary', function (formPolicyBehaviourOnStateChangeLibrary) {
	  return formPolicyBehaviourOnStateChangeLibrary.onSubmitFocusFirstFieldIfError;
	}]);
	module.exports = exports['default'];

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _angular = __webpack_require__(1);
	
	var _angular2 = _interopRequireDefault(_angular);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var mod = _angular2.default.module('ngFormLib.policy.checkForStateChanges', []);
	
	exports.default = mod.name;
	
	// Policy implementation functions
	
	function checkForStateChangesOnBlurUntilSubmitThenOnChange(scope, element, name, stateDefinitions, ngModelController) {
	  var errorWatch;
	
	  scope.$on('event:FormSubmitAttempted', function () {
	    (errorWatch || _angular2.default.noop)(); // Remove the error watcher, which may-or-may-not be present
	    errorWatch = watchForErrorChanges(scope, stateDefinitions, ngModelController);
	    //console.log('heard formSubmitAttempted');
	  });
	
	  // Listen for the form reset event and cancel the submit-watcher
	  scope.$on('event:FormReset', function () {
	    (errorWatch || _angular2.default.noop)(); // Remove the error watcher, which may-or-may-not be present
	    //console.log('heard formReset');
	  });
	
	  watchForBlurEvent(scope, element, name, stateDefinitions, ngModelController);
	}
	
	function checkForStateChangesOnChange(scope, element, name, stateDefinitions, ngModelController) {
	  // Watch the error condition for changes, and flag the field as inErrorShowing when the errorCondition is true
	  watchForErrorChanges(scope, stateDefinitions, ngModelController);
	}
	
	function checkForStateChangesOnBlur(scope, element, name, stateDefinitions, ngModelController) {
	  watchForBlurEvent(scope, element, name, stateDefinitions, ngModelController);
	}
	
	// Helper methods
	function createWatch(scope, ngModelController, stateName, stateCondition) {
	  scope.$watch(stateCondition, function (value) {
	    if (value === true) {
	      ngModelController.fieldState = stateName; // THIS IS THE KEY FLAG
	      //console.log('A: ' + stateCondition + ' = ' + value);
	    }
	  });
	}
	
	function watchForErrorChanges(scope, stateDefinitions, ngModelController) {
	  // Set up a watch for each state definition... expensive?
	  for (var stateName in stateDefinitions) {
	    if (stateDefinitions.hasOwnProperty(stateName)) {
	      createWatch(scope, ngModelController, stateName, stateDefinitions[stateName]);
	    }
	  }
	}
	
	function evaluateFieldStates(scope, stateDefinitions, ngModelController) {
	  for (var prop in stateDefinitions) {
	    if (scope.$eval(stateDefinitions[prop]) === true) {
	      ngModelController.fieldState = prop;
	      //console.log('B: ' + stateDefinitions[prop] + ' = ' + prop);
	      break;
	    }
	  }
	}
	
	function watchForBlurEvent(scope, element, fieldName, stateDefinitions, ngModelController) {
	  // Determine the initial field state. First state to evaluate to TRUE wins
	  evaluateFieldStates(scope, stateDefinitions, ngModelController);
	
	  element.bind('blur', function ngShowWatchAction() {
	    evaluateFieldStates(scope, stateDefinitions, ngModelController);
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
	
	// This 'service' is the default implementation of the check-for-errors policy
	mod.factory('formPolicyCheckForStateChanges', ['formPolicyCheckForStateChangesLibrary', function (formPolicyCheckForStateChangesLibrary) {
	  return formPolicyCheckForStateChangesLibrary.onBlurUntilSubmitThenOnChange;
	}]);
	module.exports = exports['default'];

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _angular = __webpack_require__(1);
	
	var _angular2 = _interopRequireDefault(_angular);
	
	var _PolicyBehaviourOnStateChange = __webpack_require__(18);
	
	var _PolicyBehaviourOnStateChange2 = _interopRequireDefault(_PolicyBehaviourOnStateChange);
	
	var _PolicyCheckForStateChanges = __webpack_require__(19);
	
	var _PolicyCheckForStateChanges2 = _interopRequireDefault(_PolicyCheckForStateChanges);
	
	var _PolicyStateDefinitions = __webpack_require__(21);
	
	var _PolicyStateDefinitions2 = _interopRequireDefault(_PolicyStateDefinitions);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var mod = _angular2.default.module('ngFormLib.defaultPolicies', [_PolicyBehaviourOnStateChange2.default, _PolicyCheckForStateChanges2.default, _PolicyStateDefinitions2.default]);
	
	exports.default = mod.name;
	module.exports = exports['default'];

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _angular = __webpack_require__(1);
	
	var _angular2 = _interopRequireDefault(_angular);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// Define the different display trigger implementations available
	var mod = _angular2.default.module('ngFormLib.policy.stateDefinitions', []);
	
	exports.default = mod.name;
	
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
	
	mod.value('formPolicyErrorDefinitionLibrary', function () {
	  return {
	    onSubmit: errorOnSubmit,
	    onDirty: errorOnDirty,
	    immediately: errorImmediately,
	    onSubmitAndDirty: errorOnSubmitAndDirty,
	    onSubmitOrDirty: errorOnSubmitOrDirty
	  };
	}());
	
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
	
	mod.value('formPolicySuccessDefinitionLibrary', function () {
	  return {
	    onSubmit: successOnSubmit,
	    onDirty: successOnDirty,
	    immediately: successImmediately,
	    onSubmitAndDirty: successOnSubmitAndDirty,
	    onSubmitOrDirty: successOnSubmitOrDirty
	  };
	}());
	
	// This 'service' is the default implementation of the check-for-errors policy
	mod.factory('formPolicyStateDefinitions', ['formPolicyErrorDefinitionLibrary', 'formPolicySuccessDefinitionLibrary', function (formPolicyErrorDefinitionLibrary, formPolicySuccessDefinitionLibrary) {
	
	  // The FieldErrorController will ask for the stateDefinitions, passing the formName and fieldName as parameters
	  return function (formName, fieldName) {
	    // Return an object with the stateName(key) and the stateDefinition string(value)
	    return {
	      'error': formPolicyErrorDefinitionLibrary.onSubmitOrDirty(formName, fieldName),
	      'success': formPolicySuccessDefinitionLibrary.onSubmitOrDirty(formName, fieldName)
	    };
	  };
	}]);
	module.exports = exports['default'];

/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports = "<div class=\"dropdown-menu datepicker\" ng-class=\"'datepicker-mode-' + $mode\" style=\"max-width:320px\">\n<table style=\"table-layout:fixed;height:100%;width:100%\">\n  <thead>\n    <tr class=\"text-center\">\n      <th>\n        <button tabindex=\"-1\" type=\"button\" class=\"btn btn-default pull-left\" ng-click=\"$selectPane(-1)\">\n          <i class=\"{{$iconLeft}}\"></i>\n        </button>\n      </th>\n      <th colspan=\"{{ rows[0].length - 2 }}\">\n        <button tabindex=\"-1\" type=\"button\" class=\"btn btn-default btn-block text-strong\" ng-click=\"$toggleMode()\">\n          <strong style=\"text-transform:capitalize\" ng-bind=\"title\"></strong>\n        </button>\n      </th>\n      <th>\n        <button tabindex=\"-1\" type=\"button\" class=\"btn btn-default pull-right\" ng-click=\"$selectPane(+1)\">\n          <i class=\"{{$iconRight}}\"></i>\n        </button>\n      </th>\n    </tr>\n    <tr ng-show=\"showLabels\" ng-bind-html=\"labels\"></tr>\n  </thead>\n  <tbody>\n    <tr ng-repeat=\"(i, row) in rows\" height=\"{{ 100 / rows.length }}%\">\n      <td class=\"text-center\" ng-repeat=\"(j, el) in row\">\n        <button tabindex=\"-1\" type=\"button\" class=\"btn btn-default\" style=\"width:100%\" ng-class=\"{'btn-primary': el.selected, 'btn-info btn-today': el.isToday && !el.selected}\" ng-click=\"$select(el.date)\" ng-disabled=\"el.disabled\">\n          <span ng-class=\"{'text-muted': el.muted}\" ng-bind=\"el.label\"></span>\n        </button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n</div>\n";

/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = "<div class=\"form-group form-group-checkbox\">\n\t<div class=\"checkbox\">\n\t\t<input type=\"checkbox\" field-error-controller>\n\t\t<label><span ng-transclude></span></label>\n\t</div>\n</div>\n";

/***/ },
/* 24 */
/***/ function(module, exports) {

	module.exports = "<div class=\"form-group\"><label class=\"control-label\"></label><div class=\"control-row\"><input type=\"text\" class=\"form-control\" maxlength=\"10\" placeholder=\"dd/mm/yyyy\" bs-datepicker form-date-format mask-date-digits><span ng-transclude></span></div></div>\n";

/***/ },
/* 25 */
/***/ function(module, exports) {

	module.exports = "<div class=\"form-group\"><label class=\"control-label\"></label><div class=\"control-row\"><input class=\"form-control\"><span ng-transclude></span></div></div>\n";

/***/ },
/* 26 */
/***/ function(module, exports) {

	module.exports = "<div>\n\t<div class=\"radio\">\n\t\t<input type=\"radio\" field-error-controller>\n\t\t<label><span ng-transclude></span></label>\n\t</div>\n</div>\n";

/***/ },
/* 27 */
/***/ function(module, exports) {

	module.exports = "<div class=\"form-group\"><label class=\"control-label\"></label><div class=\"control-row\"><select class=\"form-control\"></select></div></div>\n";

/***/ },
/* 28 */
/***/ function(module, exports) {

	module.exports = "<span class=\"required\" aria-hidden=\"true\" ng-class=\"{'ng-hide': hide}\" ng-transclude></span>\n";

/***/ },
/* 29 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_29__;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=ngFormLib.js.map