import angular from 'angular';

const mod = angular.module('ngFormLibDocs.controls.formSelect.docs.formSelect', []);

export default mod.name;

mod.directive('formSelectDocs', function() {
  return {
    restrict: 'A',
    controller: 'FormSelectDemoController',
    template: require('./formSelect.docs.html')
  }
});

mod.controller('FormSelectDemoController', function() {
  var vm = this;

  vm.titleData = [
    {label: 'Dr'},
    {label: 'Mr'},
    {label: 'Ms'}
  ];
});
