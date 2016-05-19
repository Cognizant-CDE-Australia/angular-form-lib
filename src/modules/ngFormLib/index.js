import angular from 'angular';
import FormPolicy from './policy/FormPolicy';
import FormControls from './controls';

const mod = angular.module('ngFormLib', [
  FormPolicy,
//    Add the policies you want, or define your own:
//    'ngFormLib.policy.checkForStateChanges',
//    'ngFormLib.policy.displayError',
//    'ngFormLib.policy.focusBehaviour',
  FormControls
]);

export default mod.name;
