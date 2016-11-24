import angular from 'angular';

const mod = angular.module('ngFormLib.policy.formAccessibility', []);

export default mod.name;

const ariaErrorElementSuffix = '-errors-aria';
const ariaErrorElementTemplate = '<span class="sr-only" aria-hidden="true"></span>';


function createAriaErrorElement(formName, fieldName) {
  let elem = angular.element(ariaErrorElementTemplate);

  elem.attr('id', getAriaErrorElementId(formName, fieldName));
  return elem;
}

// EXPORTED! Allows the PolicyBehaviourOnStateChange.onErrorSetAriaDescribedByToAriaErrorElement to work.
// Not perfect... still feels like ARIA behaviour is not in one place...
export function getAriaErrorElementId(formName, fieldName) {
  return formName + '-' + fieldName + ariaErrorElementSuffix;
}

function createLongErrorDescription(ariaElement, errors) {
  let str = '';
  let i = 0;

  for (let type in errors) {
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
  let errorMsgs = [];
  let prefix = '';

  for (let type in errors) {
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
  createAriaErrorElement,
  createLongErrorDescription,
  createShortErrorDescription,
});


mod.provider('formPolicyAccessibilityBehaviour', ['formPolicyAccessibilityLibrary', function Provider(lib) {
  let config = this.config = {
    createAriaErrorElement: lib.createAriaErrorElement,
    onErrorChangeBehaviour: lib.createLongErrorDescription,
  };

  this.$get = () => config;
}]);

