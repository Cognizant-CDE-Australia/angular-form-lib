import angular from 'angular';

const mod = angular.module('ngFormLibDocs.controls.common.docs.formControlsCommon', []);

export default mod.name;

mod.directive('formControlsCommonDocs', function() {
  return {
    restrict: 'A',
    template: require('./formControlsCommon.docs.html')
  };
});
