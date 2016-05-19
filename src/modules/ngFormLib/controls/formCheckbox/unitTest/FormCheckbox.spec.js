import componentUnderTest from '../FormCheckbox';

describe('when I use the Form Checkbox button it', function() {
  var compileElement, scope, elem;

  beforeEach(function() {
    angular.mock.module(componentUnderTest);

    angular.mock.inject(($compile, $rootScope, $httpBackend) => {
      scope = $rootScope.$new();
      $httpBackend.expectGET(/template\/FormCheckboxTemplate\.tpl\.html/).respond(200, require('html!./../../formCheckbox/template/FormCheckboxTemplate.tpl.html'));
      $httpBackend.expectGET(/template\/RequiredMarkerTemplate\.tpl\.html/).respond(200, require('html!./../../requiredMarker/template/RequiredMarkerTemplate.tpl.html'));

      compileElement = function(html) {
        var element = $compile(html)(scope);
        $httpBackend.flush();
        scope.$digest();
        return element;
      };
    });
  });


  it('should create a checkbox with the minimum markup', function() {
    elem = compileElement('<form-checkbox uid="fld" name="btn">My label</form-checkbox>');

    expect(elem.find('input')[0].outerHTML).toEqual('<input type="checkbox" field-error-controller="" id="fld" name="btn" ng-required="false" aria-required="false">');
    expect(elem.find('label')[0].outerHTML).toEqual('<label for="fld"><span ng-transclude=""><span class="ng-scope">My label</span></span><span class="required ng-isolate-scope ng-hide" aria-hidden="true" ng-class="{\'ng-hide\': hide}" ng-transclude="" required-marker="" hide="!(false)"></span></label>');
  });


  it('should create a checkbox with a uid + name + change() + required', function() {
    elem = compileElement('<form-checkbox uid="fld" name="btn" ff-ng-model="state" ff-ng-checked="true" label-class="Amy" ff-aria-label="My label" ff-ng-change="testChange()" required="true"></form-checkbox>');

    // Little bit weird: The checkbox has a ng-checked=true initial state, but the model value 'state' does not exist! So the field looks checked, but it is invalid!
    // In practice, ng-checked should be an expression, or even better, just put a value into the model.
    expect(elem.find('input')[0].outerHTML).toMatch('<input type="checkbox" field-error-controller="" id="fld" name="btn" ng-model="state" ng-checked="true" aria-label="My label" ng-change="testChange()" ng-required="true" aria-required="true" ng-class="{\'checked\': state === true || true}" class=".*" required="required" checked="checked">');
    //expect(elem.find('label')[0].outerHTML).toEqual('<label for="fld" class="Amy checked" ng-class="{\'checked\': state === \'undefined\' || true}"><span ng-transclude=""></span><span class="required ng-isolate-scope" aria-hidden="true" ng-class="{\'ng-hide\': hide}" ng-transclude="" hide="!(true)"></span></label>');
  });

});
