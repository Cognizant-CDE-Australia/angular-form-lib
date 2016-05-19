import angular from 'angular';
import angularAnimate from 'angular-animate';
import FormPolicy from './policy/FormPolicy';
import FormControls from './controls';

const mod = angular.module('ngFormLib', [angularAnimate,
  FormPolicy,
//    Add the policies you want, or define your own:
//    'ngFormLib.policy.checkForStateChanges',
//    'ngFormLib.policy.displayError',
//    'ngFormLib.policy.focusBehaviour',
  FormControls
]);

export default mod.name;
