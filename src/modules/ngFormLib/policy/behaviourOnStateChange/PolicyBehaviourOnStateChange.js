import angular from 'angular';
import 'angular-scroll';
import FormControlService from '../../controls/common/FormControlService';
import {getAriaErrorElementId} from '../accessibility/PolicyFormAccessibility';
import {ERROR_STATE} from '../stateDefinitions/PolicyStateDefinitions';

// The form policy intentionally has no hard dependencies.
// If there are form-policy values that exist when the service is being constructed, it will use them.
// Otherwise it will use no-op policy functions.
const mod = angular.module('ngFormLib.policy.behaviourOnStateChange', ['duScroll', FormControlService]);

export default mod.name;


// Helper functions
let timeoutPromise;
let scrollPromise;

function isElementVisible(element) {
  return !!element.getBoundingClientRect().top;
}

function setFocusOnField($document, $timeout, duration, element, offset) {
  // If no offsetHeight then assume it's invisible and let the next error field take the scroll position
  if (isElementVisible(element[0])) {
    // console.log('Error focus set to: ' + domElement.id);
    $timeout.cancel(timeoutPromise);
    $timeout.cancel(scrollPromise);   // This doesn't seem to make a difference on a Mac - user-generated scrolling does not get cancelled
    timeoutPromise = $timeout(function() {
     element[0].focus();
    }, duration);
    scrollPromise = $document.scrollToElement(element, offset, duration);  // scrollToElement() comes from the angular-scroll directive // No offset
    return true;
  }
  return false; // Indicate that we did NOT set the focus
}

// Make this available for people that want to add behaviours:
export function combineBehaviours(a, b) {
  // If 'a' is undefined, return b
  if (!a) {
    return b;
  }

  return function(...args) {
    let resultA = a(...args);
    let resultB = b(...args);

    return {
      applyBehaviour: (...args2) => {
        resultA.applyBehaviour.apply(null, args2);
        resultB.applyBehaviour.apply(null, args2);
      },
      resetBehaviour: (...args2) => {
        resultA.resetBehaviour.apply(null, args2);
        resultB.resetBehaviour.apply(null, args2);
      },
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
mod.service('formPolicyBehaviourOnStateChangeLibrary', ['$document', '$timeout', 'duScrollDuration', 'formControlService',
  function($document, $timeout, duScrollDuration, formControlService) {
    // Policy implementation functions
    function onSubmitFocusFirstFieldIfError(formController) {
      // We want to pretend that there is a single controller for the form, for the purpose of managing the focus.
      // Otherwise, the main form sets the focus, then the subform (ng-form) also sets the focus
      let focusController = formController._parentController || formController;

      return {

        // This function is called by the fieldErrorController when the fieldState changes and when the form is submitted
        applyBehaviour: function(fieldElem, fieldState, formSubmitAttempted/* , formName, fieldName*/) {
          // Set the focus to the field if there is an error showing and a form-submit has been attempted
          if (fieldState === ERROR_STATE && formSubmitAttempted) {
            // Make sure element is the first field with an error based on DOM order
            let elems = $document[0][focusController.$name].querySelectorAll('.form-group .ng-invalid');
            let firstElement;

            angular.forEach(elems, function(elem) {
              if (isElementVisible(elem) && !firstElement) {
                firstElement = elem;
              }
            });
            let isFirstElement = firstElement ? firstElement.id === fieldElem[0].id : false;

            // ...and if the focusErrorElement is blank...
            let scrollOffset = formController._policy.behaviourOnStateChange.fieldFocusScrollOffset;

            if (!focusController._focusErrorElement && isFirstElement && setFocusOnField($document, $timeout, duScrollDuration, fieldElem, scrollOffset)) {
              focusController._focusErrorElement = fieldElem;
            }
          }
        },

        resetBehaviour: () => {
          focusController._focusErrorElement = null;
        },
      };
    }


    function onErrorSetAriaDescribedByToAriaErrorElement(/* formController*/) {
      return {
        applyBehaviour: function(fieldElem, fieldState, formSubmitAttempted, formName, fieldName) {
          fieldElem.attr('aria-invalid', fieldState === ERROR_STATE);
          // Get a reference to the error element
          let errorElemId = getAriaErrorElementId(formName, fieldName);

          // Link the field to the ariaErrorElement.
          if (fieldState === ERROR_STATE) {
            formControlService.addToAttribute(fieldElem, 'aria-describedby', errorElemId);
          } else {
            formControlService.removeFromAttribute(fieldElem, 'aria-describedby', errorElemId);
          }
        },
        resetBehaviour: () => {},
      };
    }


    function updateElementStyle(formController) {
      return {
        applyBehaviour: (fieldElem, fieldState, formSubmitAttempted, formName, fieldName, formGroupElement) => {
          let policy = formController._policy.behaviourOnStateChange;

          formGroupElement[fieldState === ERROR_STATE ? 'addClass' : 'removeClass'](policy.fieldErrorClass);
          formGroupElement[fieldState === 'success' ? 'addClass' : 'removeClass'](policy.fieldSuccessClass);
        },
        resetBehaviour: () => {},
      };
    }

    return {
      onSubmitFocusFirstFieldIfError,
      onErrorSetAriaDescribedByToAriaErrorElement,
      updateElementStyle,
    };
  },
]);


mod.provider('formPolicyBehaviourOnStateChange', function Provider() {
  let config = this.config = {
    behaviour: undefined,
    fieldErrorClass: 'has-error',
    fieldSuccessClass: 'has-success',
    fieldFocusScrollOffset: 0,
  };

  this.$get = ['formPolicyBehaviourOnStateChangeLibrary', function(lib) {
    // If the behaviour has been over-ridden, great. Otherwise this is the default.
    config.behaviour = config.behaviour || [
      lib.onSubmitFocusFirstFieldIfError,
      lib.onErrorSetAriaDescribedByToAriaErrorElement,
      lib.updateElementStyle,
    ].reduce(combineBehaviours);

    return config;
  }];
});

