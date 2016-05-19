import angular from 'angular';

const mod = angular.module('ngFormLibDocs.controls.formCheckbox.docs.formCheckbox', []);

export default mod.name;

mod.directive('formCheckboxDocs', function() {
  return {
    restrict: 'A',
    controller: 'FormCheckboxDemoController',
    template: require('./formCheckbox.docs.html')
  }
});

mod.controller('FormCheckboxDemoController', function() {
  var vm = this;

  vm.titleData = [
    {label: 'Dr'},
    {label: 'Mr'},
    {label: 'Ms'}
  ];
});
