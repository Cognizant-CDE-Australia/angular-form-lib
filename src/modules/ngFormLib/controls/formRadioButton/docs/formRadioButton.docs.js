import angular from 'angular';

const mod = angular.module('ngFormLibDocs.controls.formRadioButton.docs.formRadioButton', []);

export default mod.name;

mod.directive('formRadioButtonDocs', function() {
  return {
    restrict: 'A',
    controller: 'FormRadioButtonDemoController',
    template: require('./formRadioButton.docs.html'),
  };
});


mod.controller('FormRadioButtonDemoController', function Controller() {
  let vm = this;

  vm.titleData = [
    {label: 'Amazing Spiderman, The'},
    {label: 'Batman'},
    {label: 'Catwoman'},
  ];

  vm.data = {
    radioVal2: 2,   // Initial value of second radio button
  };
});
