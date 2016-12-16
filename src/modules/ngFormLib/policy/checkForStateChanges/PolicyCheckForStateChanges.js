import angular from 'angular';
import {ERROR_STATE} from '../stateDefinitions/PolicyStateDefinitions';

const mod = angular.module('ngFormLib.policy.checkForStateChanges', []);

export default mod.name;


// Policy implementation functions
function checkForStateChangesOnBlurUntilSubmitThenOnChange(scope, element, name, stateDefinitions, ngModelController) {
  let errorWatch;

  scope.$on('event:FormSubmitAttempted', function() {
    (errorWatch || angular.noop)(); // Remove the error watcher, which may-or-may-not be present
    errorWatch = watchForErrorChanges(scope, stateDefinitions, ngModelController);
    // console.log('heard formSubmitAttempted');
  });


  // Listen for the form reset event and cancel the submit-watcher
  scope.$on('event:FormReset', function() {
    (errorWatch || angular.noop)(); // Remove the error watcher, which may-or-may-not be present
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
  return scope.$watch(stateCondition, function(value) {
    if (value === true) {
      ngModelController.fieldState = stateName;       // THIS IS THE KEY FLAG
      // console.log('A: ' + stateCondition + ' = ' + value);
    }
  });
}

function watchForErrorChanges(scope, stateDefinitions, ngModelController) {
  // Set up a watch for each state definition... expensive?
  let watchers = [];

  for (let stateName in stateDefinitions) {
    if (stateDefinitions.hasOwnProperty(stateName)) {
      watchers.push(createWatch(scope, ngModelController, stateName, stateDefinitions[stateName]));
    }
  }

  // Return a de-registration function
  return () => {
    // console.log('Remove error watchers...', watchers);
    watchers.forEach((deregistrationFn) => deregistrationFn());
  };
}

function evaluateFieldStates(scope, stateDefinitions, ngModelController) {
  for (let prop in stateDefinitions) {
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

  let handleErrorsOnKeyChangeWatcher;

  element.bind('blur', function ngShowWatchAction() {
    let initialFieldState = ngModelController.fieldState;

    evaluateFieldStates(scope, stateDefinitions, ngModelController);
    // console.log(initialFieldState, '=>', ngModelController.fieldState);

    // If onBlur we change into an error state (from a non error state), start watching for error-changes (as soon as the field become valid).
    if (initialFieldState !== ngModelController.fieldState && ngModelController.fieldState === ERROR_STATE && !handleErrorsOnKeyChangeWatcher) {
      // console.log('adding change watchers');
      handleErrorsOnKeyChangeWatcher = watchForErrorChanges(scope, stateDefinitions, ngModelController);
    // If we are already watching for error-changes and the field is no longer in error, stop watching for error changes
    } else if (handleErrorsOnKeyChangeWatcher && ngModelController.fieldState !== ERROR_STATE) {
      handleErrorsOnKeyChangeWatcher();   // Remove the watcher
      handleErrorsOnKeyChangeWatcher = undefined;
    }

    scope.$apply(); // We are in a jQueryLite handler and have changed a scope property - fire the watchers!
  });
}

// Define the different display trigger implementations available
mod.constant('formPolicyCheckForStateChangesLibrary', (function() {
  return {
    onChange: checkForStateChangesOnChange,
    onBlur: checkForStateChangesOnBlur,
    onBlurUntilSubmitThenOnChange: checkForStateChangesOnBlurUntilSubmitThenOnChange,
  };
})());


mod.provider('formPolicyCheckForStateChanges', ['formPolicyCheckForStateChangesLibrary', function Provider(lib) {
  let config = this.config = {
    checker: lib.onBlurUntilSubmitThenOnChange,
  };

  this.$get = function() {
    return config;
  };
}]);
