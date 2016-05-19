import angular from 'angular';

const mod = angular.module('ngFormLibDocs.controls.common.docs.formControlsDemos', []);

export default mod.name;

mod.directive('formControlsDemosDocs', function() {
  return {
    restrict: 'A',
    controller: 'FormControlsDemosController',
    template: require('./formControlsDemos.docs.html')
  }
});

mod.controller('FormControlsDemosController', function() {
  var vm = this;

  vm.titleData = [
    {label: 'Dr'},
    {label: 'Mr'},
    {label: 'Ms'}
  ];

  vm.schoolData = [
    {label: 'Primary'},
    {label: 'Secondary'},
    {label: 'Tertiary'}
  ];

  vm.formDemo4 = {
    name: '',
    education: [
      {
        name: 'Melbourne High School',
        type: vm.schoolData[1]
      },
      {
        name: undefined,
        type: undefined
      }
    ]
  };

  vm.addSchool = function() {
    vm.formDemo4.education.push({name: '', type: undefined});
  };
});
