import angular from 'angular';
import FormPolicy from './policy/FormPolicy';
import FormControls from './controls';

// Don't include this in the angular module, only export it here for convenience
import policyDefaults from './policy/defaultPolicies';

const mod = angular.module('ngFormLib', [
  FormPolicy,
  FormControls
]);

// The library, and the default policies
export default {
  ngFormLib: mod.name,
  defaultPolicies: policyDefaults
};

