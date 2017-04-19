import angular from 'angular';
import Utility from '../../../common/Utility';

const mod = angular.module('ngFormLib.controls.common.formControlService', [Utility]);

export default mod.name;

// Workaround for bug #1404
// https://github.com/angular/angular.js/issues/1404
// Source: http://plnkr.co/edit/hSMzWC?p=preview
// Not so great for IE8, but necessary for using radio buttons inside of dynamic forms (ng-repeat)
mod.config(['$provide', function($provide) {
  $provide.decorator('ngModelDirective', ['$delegate', function($delegate) {
    let ngModel = $delegate[0];
    let controller = ngModel.controller;

    ngModel.controller = ['$scope', '$element', '$attrs', '$injector', function Controller(scope, element, attrs, $injector) {
      let $interpolate = $injector.get('$interpolate');

      attrs.$set('name', $interpolate(attrs.name || '')(scope));
      $injector.invoke(controller, this, {
        '$scope': scope,
        '$element': element,
        '$attrs': attrs,
      });
    }];
    return $delegate;
  }]);
  $provide.decorator('formDirective', ['$delegate', function($delegate) {
    let form = $delegate[0];
    let controller = form.controller;

    form.controller = ['$scope', '$element', '$attrs', '$injector', function Controller(scope, element, attrs, $injector) {
      let $interpolate = $injector.get('$interpolate');

      attrs.$set('name', $interpolate(attrs.name || attrs.ngForm || '')(scope));
      $injector.invoke(controller, this, {
        '$scope': scope,
        '$element': element,
        '$attrs': attrs,
      });
    }];
    return $delegate;
  }]);
}]);


// Shared code for the accessible controls
mod.provider('formControlService', function Provider() {
  let self = this;
  let counter = 0;    // Private variable

  //
  self.defaults = {
    idPrefix: 'fpFld',
    inputGroupButtonTemplateFunction: (val, handler) => `<button type="button" class="btn btn-default" ${handler ? 'ng-click="' + handler + '"' : ''}>${val}</button>`,
    templates: {
      formCheckbox: {
        template: 'ngFormLib/template/formCheckbox.html',
      },
      formDate: {
        template: 'ngFormLib/template/formDate.html',
      },
      formInput: {
        template: 'ngFormLib/template/formInput.html',
      },
      formRadioButton: {
        template: 'ngFormLib/template/formRadioButton.html',
      },
      formSelect: {
        template: 'ngFormLib/template/formSelect.html',
      },
      requiredMarker: {
        template: 'ngFormLib/template/requiredMarker.html',
      },
    },
  };

  this.$get = ['ngFormLibStringUtil', '$injector', function(StringUtil, $injector) {
    let translator;

    try {
      translator = $injector.get('$translate').instant;
    } catch (e) {
      translator = angular.identity;
    }

    let service = {
      defaults: self.defaults,

      buildDirective: function(params) {
        let directive = {
          restrict: 'AE',
          replace: true,
          transclude: true,
          compile: function(tElement, tAttr) {
            service.validateComponentStructure(params.controlName, tElement, params.expectedTemplateElements, tAttr, params.expectedAttributes);

            // For items that are inside repeaters, if more than one element has the same id, the checkbox stops working.
            // By using an attribute that is not called 'id', we can avoid this issue
            let id = tAttr.uid || service.getUniqueFieldId();
            let name = tAttr.name || id; // Doing this *will* break radio buttons, but they SHOULD provide a name anyway (for their own good)
            let inputElem = tElement.find(params.inputElementName || 'input');
            let labelElem = tElement.find('label');
            let required = service.getRequiredAttribute(tAttr.required);

            service.decorateLabel(labelElem, required, id, tAttr.labelClass, tAttr.hideLabel, tAttr.hideRequiredIndicator, tAttr.labelSuffix);
            inputElem = service.decorateInputField(inputElem, tElement, tAttr, id, name, required);

            // Do component-specific config last
            params.configFn(tElement, tAttr, id, name, inputElem, labelElem);

            // Clean up special attributes (to make HTML look nicer)
            tElement.removeAttr('uid').removeAttr('name').removeAttr('label').removeAttr('required').removeAttr('field-hint')
              .removeAttr('input-type').removeAttr('hide-label').removeAttr('hideRequiredIndicator')
              .removeAttr('label-class').removeAttr('field-errors').removeAttr('text-errors');
          },
          templateUrl: function(element, attr) {
            // Check the element for a "template" attribute, which allows customisation-per-control. Otherwise, use the control-wide template.
            return attr.template || service.getHTMLTemplate(element, params.controlName);
          },
        };

        return directive;
      },

      getUniqueFieldId: function() {
        return '' + self.defaults.idPrefix + counter++;
      },

      getHTMLTemplate: function(element, type) {
        // Allow different templates to be applied for different form-styles (eg for horizontal forms, inline forms, "normal" forms).
        // This is an advanced feature that most users will not need.
        // E.g.: self.defaults.templates['select']['form-inline'] = 'path/to/your/custom/template.html'

        // Check this element's parent-form-element-classes to see if they match. First match, wins.
        let parentFormClasses = (element.inheritedData('formElementClasses') || '').split(' ');
        let result = self.defaults.templates[type].template;  // The default template, if nothing else is specified.

        for (let i = 0; i < parentFormClasses.length; i++) {
          let template = self.defaults.templates[type][parentFormClasses[i]];

          if (template) {
            result = template;
            break;
          }
        }

        return result;
      },

      addToAttribute: function(element, attributeName, value) {
        let existingValues = element.attr(attributeName) || '';

        // Don't add the same attribute value - remove it first before adding it back
        if (existingValues.split(' ').indexOf(value) === -1) {
          element.attr(attributeName, existingValues + (existingValues ? ' ' : '') + value);
        }
      },


      removeFromAttribute: function(element, attributeName, value) {
        // Borrowed this statement from Angular.js
        let newValue = StringUtil.trim(
          (' ' + (element.attr(attributeName) || '') + ' ')
          .replace(/[\n\t]/g, ' ')
          .replace(' ' + StringUtil.trim(value) + ' ', ' ')
        );

        // Remove the attribute if it is empty
        if (newValue === '') {
          element.removeAttr(attributeName);
        } else {
          element.attr(attributeName, newValue);
        }
      },


      getRequiredAttribute: function(required) {
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

      addLabelText: function(labelElem, labelText) {
        labelElem.prepend(service.translate(labelText));
      },

      addInputGroup: function(inputElem, attr) {
        const inputGroupMapping = [
          {inputAttr: 'inputPrefix', className: 'input-group-addon', attachFn: 'prepend', clickHandler: '', content: (val) => val},
          {inputAttr: 'inputSuffix', className: 'input-group-addon', attachFn: 'append', clickHandler: '', content: (val) => val},
          {inputAttr: 'inputButtonPrefix', className: 'input-group-btn', attachFn: 'prepend', clickHandler: 'inputButtonPrefixClick', content: self.defaults.inputGroupButtonTemplateFunction},
          {inputAttr: 'inputButtonSuffix', className: 'input-group-btn', attachFn: 'append', clickHandler: 'inputButtonSuffixClick', content: self.defaults.inputGroupButtonTemplateFunction},
        ];
        let contentToAppend = [];

        inputGroupMapping.forEach((igConfig) => {
          if (attr[igConfig.inputAttr]) {
            contentToAppend.push({
              attachFn: igConfig.attachFn,
              html: `<span class="${igConfig.className}">${igConfig.content(attr[igConfig.inputAttr], attr[igConfig.clickHandler])}</span>`,
            });
          }
        });

        if (contentToAppend.length) {
          inputElem.wrap('<div class="input-group">');// This should be the 'control-row' element
          let wrapper = inputElem.parent();

          contentToAppend.forEach((content) => wrapper[content.attachFn](content.html));
        }

        return !!contentToAppend.length;
      },

      decorateLabel: function(labelElem, required, id, labelClass, hideLabelExpr, hideRequiredIndicator, labelSuffix) {
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


      decorateInputField: function(inputElem, hostElement, attr, id, name, required) {
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
        for (let a in attr.$attr) {
          if (a.indexOf('ff') === 0) {    // Don't search for 'ff-' as the '-' has been replaced with camel case now
            let origAttrName = attr.$attr[a].substr(3);

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
        return inputElem;
      },


      createErrorFeatures: function(parentElement, inputElement, name, fieldLabel, fieldErrors, textErrors) {
        if (fieldErrors || textErrors) {
          // Add an fieldErrorControllers attribute to the element, to hook-up the error features
          inputElement.attr('field-error-controller', '');

          let fieldLabelStr = fieldLabel ? ' field-label="' + fieldLabel + '"' : '';
          let errorContainerElem = angular.element('<div error-container field-name="' + name + '"' + fieldLabelStr + '></div>');

          if (fieldErrors) {
            errorContainerElem.attr('field-errors', fieldErrors);
          }
          if (textErrors) {
            errorContainerElem.attr('text-errors', textErrors);
          }
          parentElement.append(errorContainerElem);
        }
      },

      createFieldHint: function(hostElement, inputElement, fieldHint, fieldHintId, fieldHintDisplay) {
        let hintElement;

        if (fieldHint) {
          let hintText = service.translate(fieldHint);

          // If we have a field hint, add that as well
          if (fieldHintDisplay) {
            // If a field hint display rule exists, implement.
            hintElement = angular.element('<p ng-if="' + fieldHintDisplay + '" class="help-block" id="' + fieldHintId + '">' + hintText + '</p>');
          } else {
            hintElement = angular.element('<p class="help-block" id="' + fieldHintId + '">' + hintText + '</p>');
          }
          hostElement.append(hintElement);
          inputElement.attr('aria-describedby', fieldHintId);
        }
      },

      buildNgClassExpression: function(inputElem, targetElem) {
        // If the inputElem has an ngModel and/or ngChecked attribute, create the ng-class attribute
        // todo.. test checkbox implementation
        let modelStr = inputElem.attr('ng-model');
        let checkedStr = inputElem.attr('ng-checked');
        let disabledStr = inputElem.attr('ng-disabled');
        let value = inputElem.attr('value');        // a string - used for Radio buttons
        let ngValue = inputElem.attr('ng-value');   // an expression - used for Radio buttons
        let ngTrueValue = inputElem.attr('ng-true-value');

        if (modelStr) {
          if (ngValue || ngTrueValue) {
            modelStr += ' === ' + (ngValue || ngTrueValue);
          } else if (value) {
            // The value is ALWAYS a string
            modelStr += ' === \'' + value + '\'';
          } else {
            modelStr += ' === true';  // For checkboxes, in the absence of ng-true-value
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

      translate: (str, interpolatedParams) => translator(str || '', interpolatedParams),

      validateComponentStructure: function(componentName, element, requiredElements, attr, requiredAttributes) {
        for (let i = 0; i < requiredElements.length; i++) {
          if (!element.find(requiredElements[i])) {
            throw new Error('The ' + componentName + ' component template requires a ' + requiredElements[i] + ' element.');
          }
        }

        for (let j = 0; j < requiredAttributes.length; j++) {
          if (!attr[requiredAttributes[j]]) {
            throw new Error('The ' + componentName + ' component requires a ' + requiredAttributes[j] + ' attribute.');
          }
        }
      },

    };

    return service;
  }];
});
