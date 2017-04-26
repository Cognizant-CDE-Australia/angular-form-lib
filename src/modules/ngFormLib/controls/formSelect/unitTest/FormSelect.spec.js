import componentUnderTest from '../FormSelect';

describe('Form Select directive', function() {
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


  it('should create a select dropdown with the minimum markup', function() {
    elem = compileElement('<form-select label="sel" uid="sel" name="select"></form-select>');

    expect(elem.find('select')[0].outerHTML).toEqual('<select class="form-control" id="sel" name="select" ng-required="false"></select>');
    expect(elem.find('select').length).toEqual(1);
  });


  it('should create a select dropdown with a placeholder, if the placeholder attribute is specified', function() {
    elem = compileElement('<form-select label="sel" uid="sel" name="select" placeholder="Select an item"></form-select>');

    expect(elem.find('select').find('option')[0].outerHTML).toEqual('<option translate="" value="">Select an item</option>');
  });


  it('should throw an error if any of the label, id and name attributes are missing', function() {
    let controlName = 'formSelect';
    let directiveName = 'form-select';
    let errorNoLabel = 'The ' + controlName + ' component requires a label attribute.';
    let exceptionFn = function(html) {
      compileElement(html);
    };

    let testData = [
      {html: '<' + directiveName + ' label="" uid="b" name="c"></' + directiveName + '>', expected: errorNoLabel},
    ];

    testData.forEach(function(testData) {
      expect(function() {
        exceptionFn(testData.html);
      }).toThrow(new Error(testData.expected));
    });
  });
});
