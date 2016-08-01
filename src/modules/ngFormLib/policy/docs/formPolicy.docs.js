import angular from 'angular';

const mod = angular.module('ngFormLibDocs.policy.docs.formPolicy', []);

export default mod.name;

mod.directive('formPolicyDocs', function() {
  return {
    restrict: 'A',
    controller: 'FormPolicyDemoCtrl',
    template: require('./formPolicy.docs.html')
  };
});


mod.controller('FormPolicyDemoCtrl', ['formPolicyCheckForStateChangesLibrary', function Controller(formPolicyCheckForStateChangesLibrary) {
  let vm = this;

  vm.titleData = [
    {label: 'Dr'},
    {label: 'Mr'},
    {label: 'Ms'}
  ];

  vm.myCustomPolicy = {
    checkForStateChanges: formPolicyCheckForStateChangesLibrary.onChange
  };

}]);

