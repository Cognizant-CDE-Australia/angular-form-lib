(function(window, angular) {
  'use strict';

  var mod = angular.module('ngFormLibDocs');

  mod.controller('ErrorMessageContainerDemoController', function() {
    var vm = this;

    vm.titleData = [
      {label: 'Dr'},
      {label: 'Mr'},
      {label: 'Ms'}
    ];

    vm.toggleTextError = function() {
      vm.myTextError = (vm.myTextError) ? '' : 'My text error. ';
    };
  });

})(window, window.angular);
