import angular from 'angular';

const mod = angular.module('ngFormLibDocs.controls.formSubmit.docs.formSubmit', []);

export default mod.name;

mod.directive('formSubmitDocs', function() {
  return {
    restrict: 'A',
    controller: 'FormSubmitDemoController',
    template: require('./formSubmit.docs.html'),
  };
});

mod.controller('FormSubmitDemoController', function Controller() {
  let vm = this;

  vm.callWhenValid = function() {
    window.alert('Form is valid');
  };
});
