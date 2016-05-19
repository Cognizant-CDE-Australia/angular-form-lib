import componentUnderTest from '../FormSelect';

describe('Form Select directive', function() {

  var compileElement, scope, elem;

  beforeEach(function() {
    angular.mock.module(componentUnderTest);

    angular.mock.inject(($compile, $rootScope, $httpBackend) => {
      scope = $rootScope.$new();
      $httpBackend.expectGET(/template\/FormSelectTemplate\.tpl\.html/).respond(200, require('html!./../../formSelect/template/FormSelectTemplate.tpl.html'));
      $httpBackend.expectGET(/template\/RequiredMarkerTemplate\.tpl\.html/).respond(200, require('html!./../../requiredMarker/template/RequiredMarkerTemplate.tpl.html'));

      compileElement = function(html) {
        var element = $compile(html)(scope);
        $httpBackend.flush();
        scope.$digest();
        return element;
      };
    });
  });


  it('should create a select dropdown with the minimum markup', function() {
    elem = compileElement('<form-select label="sel" uid="sel" name="select"></form-select>');

    expect(elem.find('select')[0].outerHTML).toEqual('<select class="form-control" id="sel" name="select" ng-required="false" aria-required="false"></select>');
    expect(elem.find('select').length).toEqual(1);
  });


  it('should create a select dropdown with a placeholder, if the placeholder attribute is specified', function() {
    elem = compileElement('<form-select label="sel" uid="sel" name="select" placeholder="Select an item"></form-select>');

    expect(elem.find('select').find('option')[0].outerHTML).toEqual('<option translate="" value="" class="ng-scope">Select an item</option>');
  });


  it('should throw an error if any of the label, id and name attributes are missing', function() {
    var controlName = 'formSelect', directiveName = 'form-select';
    var errorNoLabel = 'The ' + controlName + ' component requires a label attribute.';
    var exceptionFn = function(html) {
      compileElement(html);
    };

    var testData = [
      {html: '<' + directiveName + ' label="" uid="b" name="c"></' + directiveName + '>', expected: errorNoLabel}
    ];

    testData.forEach(function(testData) {
      expect(function() {exceptionFn(testData.html);}).toThrow(new Error(testData.expected));
    });
  });
});
