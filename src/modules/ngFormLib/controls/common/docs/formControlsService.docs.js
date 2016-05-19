import angular from 'angular';

const mod = angular.module('ngFormLibDocs.controls.common.docs.formControlsService', []);

export default mod.name;

mod.directive('formControlsServiceDocs', function() {
  return {
    restrict: 'A',
    controller: 'FormControlServiceDemoCtrl',
    template: require('./formControlsService.docs.html')
  }
});

mod.controller('FormControlServiceDemoCtrl', function() {
  // var vm = this;
  //
  // vm.titleData = [
  //   {label: 'Dr'},
  //   {label: 'Mr'},
  //   {label: 'Ms'}
  // ];
});
