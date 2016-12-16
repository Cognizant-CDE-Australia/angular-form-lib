import componentUnderTest from '../FormRadioButton';

describe('when I use the Form Radio Button it', function() {
  let compileElement;
  let scope;
  let elem;

  beforeEach(function() {
    angular.mock.module(componentUnderTest);

    angular.mock.inject(($compile, $rootScope) => {
      scope = $rootScope.$new();

      compileElement = function(html) {
        let element = $compile(html)(scope);

        scope.$digest();
        return element;
      };
    });
  });


  it('should create a radio button with the minimum markup', function() {
    elem = compileElement('<form-radio-button uid="fld" name="btn">My label</form-radio-button>');

    // Added form directive bits HTML changes initially
    expect(elem.find('input')[0].outerHTML).toEqual('<input type="radio" field-error-controller="" id="fld" name="btn" ng-required="false" aria-required="false">');
    expect(elem.find('label')[0].outerHTML).toEqual('<label for="fld"><span ng-transclude=""><span class="ng-scope">My label</span></span><span class="required ng-isolate-scope ng-hide" aria-hidden="true" ng-class="{\'ng-hide\': hide}" ng-transclude="" required-marker="" hide="!(false)"></span></label>');
  });


  it('should create a radio button with a uid + name + change() + required', function() {
    elem = compileElement('<form-radio-button uid="fld" name="btn" ff-ng-model="state" ff-ng-checked="true" ff-value="puppy" label-class="Amy" ff-aria-label="My label" ff-ng-change="testChange()" required="true"></form-radio-button>');

    expect(elem.find('input')[0].outerHTML).toMatch('<input type="radio" field-error-controller="" id="fld" name="btn" ng-model="state" ng-checked="true" value="puppy" aria-label="My label" ng-change="testChange()" ng-required="true" aria-required="true" ng-class="{\'checked\': state === \'puppy\' || true}" class=".*" required="required" checked="checked">');
    expect(elem.find('label')[0].outerHTML).toEqual('<label for="fld" class="Amy"><span ng-transclude=""></span><span class="required ng-isolate-scope" aria-hidden="true" ng-class="{\'ng-hide\': hide}" ng-transclude="" required-marker="" hide="!(true)"></span></label>');
  });
});
