import componentUnderTest from '../FormDate';

describe('Date Directives spec,', function() {

  let compileElement, scope, elem;

  beforeEach(() => {
    angular.mock.module(componentUnderTest);
  });

  describe('formDateFormat', function() {

    let DateUtil;

    beforeEach(() => {
      angular.mock.inject(($compile, $rootScope, ngFormLibDateUtil) => {
        scope = $rootScope.$new();

        compileElement = function(html) {
          let element = $compile(html)(scope);

          scope.$digest();
          return element;
        };
        DateUtil = ngFormLibDateUtil;
      });
    });

    function testDate(element, testData) {
      let inputElem = element.find('input');

      // Initially it is blank
      expect(inputElem.val()).toEqual('');
      expect(inputElem.hasClass('ng-dirty')).toEqual(false);
      expect(inputElem.hasClass('ng-invalid-date')).toEqual(false);

      for (let i = 0; i < testData.length; i++) {
        inputElem.val(testData[i].input).triggerHandler('change');
        //scope.$digest();

        expect(inputElem.val()).toEqual(testData[i].output);

        for (let c = 0; c < testData[i].expectedClasses.length; c++) {
          //console.log(inputElem[0].outerHTML);
          expect(inputElem.hasClass(testData[i].expectedClasses[c])).toEqual(true);
        }
      }
    }

    it('should validate an ordinary input field which must be a date, no other restrictions', function() {
      let testData = [
        {input: '02',         output: '02',         expectedClasses: ['ng-invalid', 'ng-invalid-date-format'], desc: 'Partial date'},
        {input: '02/01/1900', output: '02/01/1900', expectedClasses: ['ng-valid'],                      desc: 'Old valid date'},
        {input: '',           output: '',           expectedClasses: ['ng-valid'],                      desc: 'Blank date'},
        {input: '29/02/2000', output: '29/02/2000', expectedClasses: ['ng-valid'],                      desc: 'Is a leap year'},
        {input: '29/02/1900', output: '29/02/1900', expectedClasses: ['ng-invalid', 'ng-invalid-date-format'], desc: 'Not leap year'},
        {input: '29/02/2012', output: '29/02/2012', expectedClasses: ['ng-valid'],                      desc: 'Is a leap year'},
        {input: '29/02/2013', output: '29/02/2013', expectedClasses: ['ng-invalid', 'ng-invalid-date-format'], desc: 'Not leap year'},
        {input: '31122015',   output: '31122015',   expectedClasses: ['ng-valid'],                      desc: 'String of 8 digits accepted??'}
      ];
      let element = compileElement('<form name="frm"><input type="text" name="startDate" ng-model="startDate" form-date-format></form>');

      testDate(element, testData);
    });


    it('should validate an ordinary input field which must be a date, with a min and max date restriction', function() {
      let testData = [
        {input: '02',         output: '02',         expectedClasses: ['ng-invalid', 'ng-invalid-date-format'],     desc: 'Partial date'},
        {input: '31/12/1999', output: '31/12/1999', expectedClasses: ['ng-invalid', 'ng-invalid-min-date'], desc: 'Date too small'},
        {input: '',           output: '',           expectedClasses: ['ng-valid'],                          desc: 'Blank date'},
        {input: '01/01/2011', output: '01/01/2011', expectedClasses: ['ng-invalid', 'ng-invalid-max-date'], desc: 'Date too large'},
        {input: '01/01/2000', output: '01/01/2000', expectedClasses: ['ng-valid'],                          desc: 'Min boundary date'},
        {input: '01/01/2005', output: '01/01/2005', expectedClasses: ['ng-valid'],                          desc: 'Somewehere in the middle'},
        {input: '31/12/2010', output: '31/12/2010', expectedClasses: ['ng-valid'],                          desc: 'Max boundary date'}
      ];
      let element = compileElement('<form name="frm"><input type="text" name="startDate" ng-model="startDate" min-date="01/01/2000" max-date="31/12/2010" form-date-format></form>');

      testDate(element, testData);
    });


    it('should validate an ordinary input field which must be a date, with max date restriction of "today"', function() {
      let today = DateUtil.getToday();
      let tomorrow = DateUtil.dateAdd(today, 1);
      let yesterday = DateUtil.dateAdd(today, -1);
      let testData = [
        {input: today, output: today,         expectedClasses: ['ng-valid'],                          desc: 'Max date boundary'},
        {input: tomorrow, output: tomorrow,   expectedClasses: ['ng-invalid', 'ng-invalid-max-date'], desc: 'Over max date'},
        {input: yesterday, output: yesterday, expectedClasses: ['ng-valid'],                          desc: 'Below max date'}
      ];
      let element = compileElement('<form name="frm"><input type="text" name="startDate" ng-model="startDate" max-date="today" form-date-format></form>');

      testDate(element, testData);
    });


    it('should eval the dateChange attribute when the date is valid', function() {
      scope.callback = jasmine.createSpy('callback');
      elem = compileElement('<form name="frm"><input type="text" name="startDate" ng-model="startDate" date-change="callback()" form-date-format></form>');

      let inputElem = elem.find('input');

      expect(scope.callback.calls.count()).toEqual(0);

      // We send a change event, so we should call the callback function
      inputElem.val('').triggerHandler('change');
      expect(inputElem.hasClass('ng-valid')).toEqual(true);
      expect(scope.callback.calls.count()).toEqual(1);

      // Make the date invalid, should not trigger a call
      inputElem.val('xyz').triggerHandler('change');
      expect(inputElem.hasClass('ng-invalid')).toEqual(true);
      expect(scope.callback.calls.count()).toEqual(1);

      // valid date should trigger callback
      inputElem.val('01/01/1976').triggerHandler('change');
      expect(inputElem.hasClass('ng-valid')).toEqual(true);
      expect(scope.callback.calls.count()).toEqual(2);
    });
  });


  describe('formDateInput', function() {

    beforeEach(() => {
      angular.mock.inject(($compile, $rootScope) => {
        scope = $rootScope.$new();

        compileElement = function(html) {
          let element = $compile(html)(scope);

          scope.$digest();
          return element;
        };
      });
    });

    it('should create a date input', function() {
      elem = compileElement('<form name="frm"><form-date ff-ng-model="scope.date" label="frm-date" uid="frm-date" name="frm-date"></form-date></form>');

      expect(elem.html()).toMatch('<div class="form-group">' +
        '<label class="control-label" for="frm-date">frm-date<span class="required ng-isolate-scope ng-hide" aria-hidden="true" ng-class="{\'ng-hide\': hide}" ng-transclude="" required-marker="" hide="\\!\\(false\\)"></span></label>' +
        '<div class="control-row"><input type="text" class=".*" maxlength="10" placeholder="dd/mm/yyyy" bs-datepicker="" form-date-format="" mask-date-digits="" id="frm-date" name="frm-date" ng-model="scope.date" ng-required="false" aria-required="false"><span ng-transclude=""></span></div>' +
        '</div>');
    });


    it('should throw an error if any of the label, id and name attributes are missing', function() {
      let controlName = 'formDate';
      let directiveName = 'form-date';
      //let errorNoNameOrId = 'All ' + controlName + ' components MUST have a uid and name attribute, and the directive MUST exist inside a <form> for errors to appear';
      let errorNoLabel = 'The ' + controlName + ' component requires a label attribute.';
      let exceptionFn = function(html) {
        compileElement(html);
      };

      let testData = [
        {html: '<' + directiveName + ' label="" uid="b" name="c"></' + directiveName + '>', expected: errorNoLabel}
      ];

      testData.forEach(function(testData) {
        expect(function() {exceptionFn(testData.html);}).toThrow(new Error(testData.expected));
      });
    });
  });

});
