import angular from 'angular';
import FormLibCommon from '../../common';

const mod = angular.module('ngFormLibDocs.controls.formDate.docs.formDate', [FormLibCommon]);

export default mod.name;

mod.directive('formDateDocs', function() {
  return {
    restrict: 'A',
    controller: 'FormDateDocsController',
    template: require('./formDate.docs.html')
  }
});


mod.controller('FormDateDocsController', ['ngFormLibDateUtil', function(DateUtil) {
  this.date1 = DateUtil.getToday();
}]);
