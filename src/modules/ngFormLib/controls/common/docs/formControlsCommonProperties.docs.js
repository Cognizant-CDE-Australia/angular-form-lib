import angular from 'angular';

const mod = angular.module('ngFormLibDocs.controls.common.docs.formControlsCommonProperties', []);

export default mod.name;

mod.directive('formControlsCommonPropertiesDocs', function() {
  return {
    restrict: 'A',
    template: require('./formControlsCommonProperties.docs.html')
  }
});
