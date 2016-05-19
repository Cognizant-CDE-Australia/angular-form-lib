import angular from 'angular';

const mod = angular.module('ngFormLibDocs.controls.requiredMarker.docs.requiredMarker', []);

export default mod.name;

mod.directive('requiredMarkerDocs', function() {
  return {
    restrict: 'A',
    controller: 'RequiredMarkerDemoController',
    template: require('./requiredMarker.docs.html')
  }
});

mod.controller('RequiredMarkerDemoController', function() {
  var vm = this;

  vm.titleData = [
    {label: 'Dr'},
    {label: 'Mr'},
    {label: 'Ms'}
  ];
});
