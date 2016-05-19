import componentUnderTest from '../ErrorMessageContainer';
import controlsCommon from '../../common';
import formInput from '../../formInput/FormInput';
import formSubmit from '../../formSubmit/FormSubmit';
import formPolicy from '../../../policy/FormPolicy';
import defaultPolicies from '../../../policy/defaultPolicies';

describe('Error Message Container directive', function() {
  var compileElement, scope, $httpBackend;

  beforeEach(function() {
    angular.mock.module(componentUnderTest, controlsCommon, formInput, formSubmit, formPolicy, defaultPolicies);


    // Just in case the $sceProvider is enabled, we need to disable it for this test (I think?)
    angular.mock.module(['$sceProvider', function($sceProvider) {
      $sceProvider.enabled(false);
    }]);
  });


  describe('simple tests', function() {

    beforeEach(function() {
      angular.mock.inject(($compile, $rootScope, _$httpBackend_) => {
        scope = $rootScope.$new();
        $httpBackend = _$httpBackend_;

        compileElement = function(html) {
          var element = $compile(html)(scope);
          scope.$digest();
          return element;
        };
      });
    });


    it('should create an error message container with minimum markup', function() {
      var elem = compileElement('<form name="frm"><error-container field-name="someName"></error-container></form>');

      //<div class="container-error" id="frm-someName-errors"><span class="sr-only" aria-hidden="true" id="frm-someName-errors-aria"></span></div>
      //<div class="container-error" id="frm-someName-errors"><span class="sr-only" aria-hidden="true" id="frm-someName-errors-aria"></span></div>
      expect(elem.html()).toEqual('<div class="container-error" id="frm-someName-errors"><span class="sr-only" aria-hidden="true" id="frm-someName-errors-aria"></span></div>');
      expect(elem.find('div').length).toEqual(1);
    });


    it('should create error messages when supplied with a field-errors attribute', function() {
      scope.returnFalse = function() {
        return false;
      };

      var elem = compileElement('<form name="frm" form-submit="returnFalse()">' +
        '<div class="form-group">' +
        '<input type="text" name="someName" ng-pattern="/^\\d{4}$/" ng-model="postcode" field-error-controller>' +
        '<error-container field-name="someName" field-errors="{pattern: \'msg1\', someOtherErrorType: \'msg2\'}"></error-container>' +
        '</div></form>');

      // No actual errors are shown, yet.
      expect(elem.find('div')[1].outerHTML).toEqual('<div class="container-error" id="frm-someName-errors"><span class="sr-only" aria-hidden="true" id="frm-someName-errors-aria"></span></div>');
      expect(elem.find('div').eq(1).find('div').length).toEqual(0);

      // Produce an error by submitting the form with invalid data
      scope.postcode = 'abcd';
      elem.triggerHandler('submit');

      expect(elem.find('input').hasClass('ng-invalid')).toEqual(true);
      expect(elem.find('div').eq(1).find('div').length).toEqual(1);

      expect(elem.find('div').eq(1).find('div')[0].outerHTML).toEqual('<div class="text-error ec2-pattern ng-scope"><span class="text-error-wrap">msg1</span></div>');

      expect(elem.find('div').eq(0).hasClass('has-error')).toEqual(true);   // class-name is from the default form policy

      // Fix the error
      scope.postcode = '1234';
      elem.triggerHandler('submit');

      expect(elem.find('input').hasClass('ng-invalid')).toEqual(false);
      expect(elem.find('div').eq(1).find('div').length).toEqual(0);

      expect(elem.find('div').eq(0).hasClass('has-error')).toEqual(false);   // class-name is from the default form policy
    });


    it('should create error messages when supplied with a text-errors attribute', function() {
      $httpBackend.expectGET(/template\/FormInputTemplate\.tpl\.html/).respond(200, require('html!./../../formInput/template/FormInputTemplate.tpl.html'));
      $httpBackend.expectGET(/template\/RequiredMarkerTemplate\.tpl\.html/).respond(200, require('html!./../../requiredMarker/template/RequiredMarkerTemplate.tpl.html'));

      var elem = compileElement('<form name="frm">' +
        '<form-input input-type="text" name="someName" uid="x" label="y" ff-ng-model="something"></form-input>' +
        '<error-container field-name="someName" text-errors="[\'msg1\', \'msg2\']"></error-container>' +
        '</form>');
      $httpBackend.flush();

      var errorDiv = elem.find('div').eq(2);

      expect(errorDiv[0].outerHTML).toEqual('<div class="container-error" id="frm-someName-errors"><span class="sr-only" aria-hidden="true" id="frm-someName-errors-aria"></span></div>');

      // When the scope value contains a non-falsy value, it should be displaying the value
      scope.msg1 = 'Some message value';
      scope.$digest();

      expect(errorDiv.find('div').length).toEqual(1);
      expect(errorDiv.find('div')[0].outerHTML).toEqual('<div class="text-error ec2-msg1"><span class="text-error-wrap">Some message value</span></div>');
      expect(errorDiv.find('span').html()).toEqual('. There is 1 error for this field. Error 1, Some message value,');
    });
  });


  describe('on an isolate-scope directive', function() {

    beforeEach(function() {
      angular.module('myIsolateScopeMod', [formInput])
        .directive('myIsolateScopeDirective', function() {
          return {
            scope: {
              model: '='
            },
            restrict: 'E',
            template: '<form-input input-type="text" name="isoField" uid="isoField" label="Isolate Postcode" required="true" ff-ng-model="model.postcode1" ff-ng-pattern="/^\\d{4}$/" field-errors="{pattern: \'msg1\', required: \'required\'}"></form-input>'
          };
        });

      angular.mock.module('myIsolateScopeMod');

      angular.mock.inject(($compile, $rootScope, _$httpBackend_) => {
        scope = $rootScope.$new();
        $httpBackend = _$httpBackend_;
        scope.returnFalse = function() { return false; };

        compileElement = function(html) {
          var element = $compile(html)(scope);
          scope.$digest();
          return element;
        };
      });
    });


    it('should display error messages even for form-inputs that are inside components that have isolate-scopes', function() {
      scope.address = {
        postcode1: '2000',
        postcode2: '3000'
      };

      $httpBackend.expectGET(/template\/FormInputTemplate\.tpl\.html/).respond(200, require('html!./../../formInput/template/FormInputTemplate.tpl.html'));
      $httpBackend.expectGET(/template\/RequiredMarkerTemplate\.tpl\.html/).respond(200, require('html!./../../requiredMarker/template/RequiredMarkerTemplate.tpl.html'));

      var elem = compileElement('<form name="frm" novalidate form-submit>' +
        '<my-isolate-scope-directive model="address"></my-isolate-scope-directive>' +
        '<form-input input-type="text" name="normalField" uid="normalField" label="Normal Postcode" ff-ng-model="address.postcode2" ff-ng-pattern="/^\\d{4}$/" field-errors="{pattern: \'msg3\'}"></form-input>' +
        '</form>');
      $httpBackend.flush();

      // Make sure it's generated the markup correctly
      expect(elem.find('label')[0].outerHTML).toContain('<label class="control-label" for="isoField">');
      expect(elem.find('input')[0].outerHTML).toContain('name="isoField" ng-model="model.postcode1"');
      // Both inputs are valid at the moment
      expect(elem.find('input').eq(0).hasClass('ng-invalid')).toEqual(false);
      expect(elem.find('input').eq(1).hasClass('ng-invalid')).toEqual(false);
      expect(elem.find('div').eq(1).find('div')[0].outerHTML).toContain('<div class="container-error" field-label="Isolate Postcode" id="frm-isoField-errors"><span class="sr-only" aria-hidden="true" id="frm-isoField-errors-aria"></span></div>');

      // Produce an error by submitting the form with invalid data
      scope.address.postcode1 = 'abcd';
      scope.address.postcode2 = '3000';
      scope.$digest();

      elem.triggerHandler('submit');

      //angular.element(document.body).append(elem);

      expect(elem.find('input').eq(0).hasClass('ng-invalid')).toEqual(true);
      expect(elem.find('input').eq(1).hasClass('ng-invalid')).toEqual(false);
      expect(elem.find('div').eq(1).find('div')[0].outerHTML).toContain('There are 2 errors for this field. Error 1, msg1,Error 2, required');
    });

  });
});
