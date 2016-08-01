import angular from 'angular';
import FormControlService from './FormControlService';

const mod = angular.module('ngFormLib.controls.common.fieldErrorController', [
  FormControlService,
]);

export default mod.name;

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


mod.directive('fieldErrorController', ['formControlService', '$timeout', function(formControlService, $timeout) {

  function setupCanShowErrorPropertyOnNgModelController(scope, formController, ngModelController, element, name) {
    // Using the form policy, determine when to show errors for this field
    let formPolicy = formController._policy;
    let formName = formController.$name;
    let fieldName = formName + '["' + name + '"]';
    let stateConditions = formPolicy.stateDefinitions.create(formName, fieldName);

    formPolicy.checkForStateChanges(formController._scope, element, name, stateConditions, ngModelController, formController);
  }


  return {
    restrict: 'AE',
    require: ['?ngModel', '?^form', '?^formGroup'],  // Require the formController controller somewhere in the parent hierarchy
    replace: true,
    link: function(scope, element, attr, controllers) {
      let ngModelController = controllers[0];
      let formController = controllers[1];
      let formGroupElement = (controllers[2] || {}).$element || element;// This looks for a parent directive called formGroup, which has a controller, which has an $element property
      let name = attr.name;

      if (formController) {
        let formName = formController.$name;
        let stateChangeBehaviour = formController._applyFormBehaviourOnStateChangePolicy; // returns a function which encapsulates the form policy rules for the behaviour to apply when errors show

        if (ngModelController) {
          setupCanShowErrorPropertyOnNgModelController(scope, formController, ngModelController, element, name);
        }

        // When the error-showing flag changes, update the field style
        formController._scope.$watch(formName + '["' + name + '"].fieldState', function(fieldState) {
          // fieldState is set to '' when the form is reset. So must respond to that too.
          stateChangeBehaviour.applyBehaviour(element, fieldState, false, formName, name, formGroupElement);
        });

        // Listen to form-submit events, to determine what to focus on too
        scope.$on('event:FormSubmitAttempted', () => {
          // Make sure that the field-level watchers have a chance to fire first, so use a timeout
          $timeout(() => stateChangeBehaviour.applyBehaviour(element, ngModelController.fieldState, true, formName, name, formGroupElement), 1);
        });
      }
    }
  };
}]);


// This directive wraps all of the form elements and binds the universe together.
// It MUST be used as a class as the form focus behaviour references '.form-control .ng-invalid' when finding controls to focus
mod.directive('formGroup', [function() {
  return {
    restrict: 'C',
    controller: ['$scope', '$element', function Controller($scope, $element) {
      this.$element = $element;
    }]
  };
}]);

