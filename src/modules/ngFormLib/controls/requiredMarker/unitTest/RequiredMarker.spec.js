import componentUnderTest from '../RequiredMarker';

describe('Required Marker tag', function() {
  let compileElement;
  let scope;
  let elem;

  beforeEach(() => {
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

  it('should transform the required-marker element into accessible HTML, basic', function() {
    elem = compileElement('<div><span required-marker></span></div>');

    expect(elem.find('span')[0].outerHTML).toEqual('<span class="required ng-isolate-scope" aria-hidden="true" ng-class="{\'ng-hide\': hide}" ng-transclude="" required-marker=""></span>');
  });


  it('should transform the required-marker element into accessible HTML, advanced', function() {
    elem = compileElement('<div><span required-marker hide="isNotRequired">Hint text</span></div>');

    expect(elem.find('span')[0].outerHTML).toEqual('<span class="required ng-isolate-scope" aria-hidden="true" ng-class="{\'ng-hide\': hide}" ng-transclude="" required-marker="" hide="isNotRequired"><span class="ng-scope">Hint text</span></span>');
    expect(elem.find('span').eq(0).hasClass('ng-hide')).toEqual(false);

    // Now set the scope.isNotRequired variable to true, which should add the 'ng-hide' class
    scope.isNotRequired = true;
    scope.$digest();
    expect(elem.find('span').eq(0).hasClass('ng-hide')).toEqual(true);
  });
});
