import angular from 'angular';

const mod = angular.module('ngFormLibDocs.controls.common.docs.formControlService', []);

export default mod.name;

mod.directive('formControlServiceDocs', function() {
  return {
    restrict: 'A',
    controller: 'FormControlServiceDemoCtrl',
    template: require('./formControlService.docs.html')
  };
});

mod.controller('FormControlServiceDemoCtrl', function Controller() {
  // var vm = this;
  //
  // vm.titleData = [
  //   {label: 'Dr'},
  //   {label: 'Mr'},
  //   {label: 'Ms'}
  // ];
});
