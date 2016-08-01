import angular from 'angular';
import FormControlService from '../common/FormControlService';
import {ERROR_STATE} from '../../policy/stateDefinitions/PolicyStateDefinitions';

const mod = angular.module('ngFormLib.controls.errorMessageContainer', [FormControlService]);

export default mod.name;

/**
 * This directive is really a FIELD error message container - it is designed to work with fields exclusively
 */
mod.directive('errorContainer', ['$compile', 'formControlService',  function($compile, formControlService) {

  function ErrorController(ariaElement, a11yPolicy) {
    let errors = {};

    return {
      addError: function(errorType, errorMessage, fieldLabel) {
        errors[errorType] = translateError(errorMessage, fieldLabel);
      },
      removeError: (errorType) => delete errors[errorType],
      updateAriaErrorElement: () => a11yPolicy.onErrorChangeBehaviour(ariaElement, errors)
    };
  }

  function translateError(errorMessage, fieldLabel) {
    var firstLetterIsAVowel = fieldLabel ? ('aeiou'.indexOf(fieldLabel[0].toLowerCase()) !== -1) : undefined;
    return formControlService.translate(errorMessage, {pronoun: firstLetterIsAVowel ? 'an' : 'a', fieldLabel: fieldLabel});
  }


  function generateErrorTag(errorType, errorText, fieldLabel) {
    return '<div class="text-error ec2-' + errorType + '"><span class="text-error-wrap">' + translateError(errorText, fieldLabel) + '</span></div>';
  }

  /**
   * Handle the field-based error messages
   */
  function toggleErrorVisibilityOnError(errorController, formController, scope, element, watchExpr, errorType, errorText, fieldLabel) {
    //console.log('watchExpr = ' + watchExpr);
    formController._scope.$watch(watchExpr, function(newValue) {
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

  /**
   * Handle text errors. Text errors are associated with a scope, rather than with a field.
   * This means we can clear them from the scope when the field-they-are-associated-with is changed.
   */
  function toggleErrorVisibilityForTextError(errorController, formController, fieldController, scope, element, watchExpr, fieldLabel) {
    //console.log('Watching error: ' + watchExpr);

    formController._scope.$watch(watchExpr, function(newValue) {

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
    fieldController.$viewChangeListeners.push(function() {
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
    link: function(scope, element, attr, controllers) {

      let fieldName = attr.fieldName,
        fieldLabel = attr.fieldLabel || '',
        formController = controllers[0],
        formName = formController.$name,
        formField = formName + '["' + fieldName + '"]',
        fieldErrors = scope.$eval(attr.fieldErrors || []),  // You can escape interpolation brackets inside strings by doing  \{\{   - wow!
        textErrors = scope.$eval(attr.textErrors || []);

      element.attr('id', formName + '-' + fieldName + '-errors');

      // Get a reference to the form policy
      let a11yPolicy = formController._policy.accessibilityBehaviour;
      let ariaElement = a11yPolicy.createAriaErrorElement(formName, fieldName);
      let errorController = new ErrorController(ariaElement, a11yPolicy);   // This controller contains state pertaining to this error container instance. Not a shareable controller across multiple instances.

      element.append(ariaElement);

      for (var error in fieldErrors) {
        if (fieldErrors.hasOwnProperty(error)) {
          let errorShowCondition = `${formField}.fieldState === "${ERROR_STATE}" && ${formField}.$error.${error}`;

          toggleErrorVisibilityOnError(errorController, formController, scope, element, errorShowCondition, error, fieldErrors[error], fieldLabel);
        }
      }

      // Watch formController[fieldName] - it may not have loaded yet. When it loads, call the main function.
      if (textErrors) {
        //console.log('textErrors: ' + textErrors + ', fieldName = ' + fieldName);
        var fieldWatcher = scope.$watch(function() {
          return formController[fieldName];
        }, function(newValue) {
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
