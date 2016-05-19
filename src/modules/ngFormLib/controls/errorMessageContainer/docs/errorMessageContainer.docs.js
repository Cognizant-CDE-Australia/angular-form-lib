import angular from 'angular';

const mod = angular.module('ngFormLibDocs.controls.errorMessageContainer.docs.errorMessageContainer', []);

export default mod.name;

mod.directive('errorMessageContainerDocs', function() {
  return {
    restrict: 'A',
    controller: 'ErrorMessageContainerDemoController',
    template: require('./errorMessageContainer.docs.html')
  }
});

mod.controller('ErrorMessageContainerDemoController', function() {
  var vm = this;

  vm.titleData = [
    {label: 'Dr'},
    {label: 'Mr'},
    {label: 'Ms'}
  ];

  vm.toggleTextError = function() {
    vm.myTextError = (vm.myTextError) ? '' : 'My text error. ';
  };
});

