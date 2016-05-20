import angular from 'angular';
import defaultStateChangeBehaviour from './behaviourOnStateChange/PolicyBehaviourOnStateChange';
import defaultStateChangeChecks from './checkForStateChanges/PolicyCheckForStateChanges';
import defaultStateDefinitions from './stateDefinitions/PolicyStateDefinitions';

const mod = angular.module('ngFormLib.defaultPolicies', [
  defaultStateChangeBehaviour,
  defaultStateChangeChecks,
  defaultStateDefinitions
]);

export default mod.name;
