import angular from 'angular';
import defaultFormAccessibility from './accessibility/PolicyFormAccessibility';
import defaultStateChangeBehaviour from './behaviourOnStateChange/PolicyBehaviourOnStateChange';
import defaultStateChangeChecks from './checkForStateChanges/PolicyCheckForStateChanges';
import defaultStateDefinitions from './stateDefinitions/PolicyStateDefinitions';

const mod = angular.module('ngFormLib.defaultPolicies', [
  defaultFormAccessibility,
  defaultStateChangeBehaviour,
  defaultStateChangeChecks,
  defaultStateDefinitions,
]);

export default mod.name;
