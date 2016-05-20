import angular from 'angular';

const mod = angular.module('ngFormLibDocs.controls.formInput.docs.formInput', []);

export default mod.name;

mod.directive('formInputDocs', function() {
  return {
    restrict: 'A',
    template: require('./formInput.docs.html')
  }
});
