import angular from 'angular';

const mod = angular.module('ngFormLibDocs.controls.formInput.docs.formInput', []);

export default mod.name;

mod.directive('formInputDocs', function() {
  let prefixCount = 0;
  let suffixCount = 0;

  return {
    restrict: 'A',
    template: require('./formInput.docs.html'),
    controller: function() {
      this.igbPrefixHandler = () => window.alert(`input group button prefix clicked ${++prefixCount} times`);
      this.igbSuffixHandler = () => window.alert(`input group button suffix clicked ${++suffixCount} times`);
    },
    controllerAs: '$ctrl',
  };
});
