import angular from 'angular';

const mod = angular.module('ngFormLibDocs.controls.formReset.docs.formReset', []);

export default mod.name;

mod.directive('formResetDocs', function() {
  return {
    restrict: 'A',
    controller: 'FormResetDemoController',
    template: require('./formReset.docs.html')
  };
});

mod.controller('FormResetDemoController', function Controller() {
  var vm = this;

  vm.titleData = [
    {label: 'Dr'},
    {label: 'Mr'},
    {label: 'Ms'}
  ];

  // Demonstrate the reset directive with non-empty data models
  vm.data = {
    name: 'Not-empty-initially',
    title: vm.titleData[2]
  };
});
