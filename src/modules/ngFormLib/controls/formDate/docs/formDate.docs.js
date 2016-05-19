import angular from 'angular';

const mod = angular.module('ngFormLibDocs.controls.formDate.docs.formDate', []);

export default mod.name;

mod.directive('formDateDocs', function() {
  return {
    restrict: 'A',
    template: require('./formDate.docs.html')
  }
});

