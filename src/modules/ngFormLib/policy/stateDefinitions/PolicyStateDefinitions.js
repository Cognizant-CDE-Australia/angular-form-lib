import angular from 'angular';

// TODO: What if the state definition expressions returned the statename, rather than true or false, so we wouldn't need
// to create a watch for each state definition. Instead, the expressions for each state would be like a big
// switch statement, returning a state name or undefined.


// Define the different display trigger implementations available
const mod = angular.module('ngFormLib.policy.stateDefinitions', []);

export default mod.name;
export const ERROR_STATE = 'error';

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
  let config = this.config = {
    states: {
      [ERROR_STATE]: errorLib.onSubmitOrDirty,
      success: successLib.onSubmitOrDirty
    }
  };

  config.create = (formName, fieldName) => {
    let result = {};

    for (var state in config.states) {
      if (config.states.hasOwnProperty(state)) {
        result[state] = config.states[state](formName, fieldName);
      }
    }
    return result;
  };

  this.$get = function() {
    return config;
  };
}]);
