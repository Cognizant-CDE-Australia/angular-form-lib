import componentUnderTest from '../FormInput';

describe('Form Input Directive', function() {
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


  it('should create a form input element with the minimum markup', function() {
    elem = compileElement('<form name="frm"><form-input uid="fld" name="fldName" label="hi" input-type="text"></form>');

    expect(elem.html()).toEqual('<div class="form-group"><label class="control-label" for="fld">hi<span class="required ng-isolate-scope ng-hide" aria-hidden="true" ng-class="{\'ng-hide\': hide}" ng-transclude="" required-marker="" hide="!(false)"></span></label>' +
                    '<div class="control-row">' +
                    '<input type="text" class="form-control" id="fld" name="fldName" ng-required="false">' +
                    '<span ng-transclude=""></span></div></div>');
  });


  it('should allow the required field to be dynamic', function() {
    // Create a falsy value for the scope, then we will change it later
    scope.some = {value: ''};

    elem = compileElement('<form name="frm"><form-input uid="fld" name="fldName" label="hi" input-type="text" required="some.value"></form>');

    // Initialy the required marker is not showing and the input is not required
    expect(elem.find('label')[0].outerHTML).toEqual('<label class="control-label" for="fld">hi<span class="required ng-isolate-scope ng-hide" aria-hidden="true" ng-class="{\'ng-hide\': hide}" ng-transclude="" required-marker="" hide="!(some.value)"></span></label>');
    expect(elem.find('input')[0].outerHTML).toEqual('<input type="text" class="form-control" id="fld" name="fldName" ng-required="some.value">');

    scope.some.value = 'something';
    scope.$digest();

    // The required marker is now showing and the input field has a required attribute
    expect(elem.find('label')[0].outerHTML).toEqual('<label class="control-label" for="fld">hi<span class="required ng-isolate-scope" aria-hidden="true" ng-class="{\'ng-hide\': hide}" ng-transclude="" required-marker="" hide="!(some.value)"></span></label>');
    expect(elem.find('input')[0].outerHTML).toEqual('<input type="text" class="form-control" id="fld" name="fldName" ng-required="some.value" required="required">');

    // Now change it falsy again
    scope.some.value = 0;
    scope.$digest();

    // The required marker is hidden again and the input field no longer has a required attribute
    expect(elem.find('label')[0].outerHTML).toEqual('<label class="control-label" for="fld">hi<span class="required ng-isolate-scope ng-hide" aria-hidden="true" ng-class="{\'ng-hide\': hide}" ng-transclude="" required-marker="" hide="!(some.value)"></span></label>');
    expect(elem.find('input')[0].outerHTML).toEqual('<input type="text" class="form-control" id="fld" name="fldName" ng-required="some.value">');
  });


  it('should hide the label if the label should not be shown', function() {
    elem = compileElement('<form name="frm"><form-input uid="fld" name="fldName" label="hi" hide-label="true" input-type="text" required="some.value"></form>');
    expect(elem.find('label').hasClass('sr-only')).toEqual(true);
  });


  it('should create a form input element and apply all ff- prefixed attributes to the <input element (except for the type attribute, which is read-only and must come from the template)', function() {
    elem = compileElement('<form-input uid="fld" name="name" label="Some field" input-type="text" ff-a="1" ff-b="true" ff-maxlength="8" ff-class="newClass">');
    expect(elem.find('input')[0].outerHTML).toEqual('<input type="text" class="form-control newClass" id="fld" name="name" a="1" b="true" maxlength="8" ng-required="false">');
  });


  it('should allow the placeholder attribute to be specified as "placeholder"', function() {
    elem = compileElement('<form-input uid="fld" input-type="text" label="label" placeholder="direct">');
    expect(elem.find('input')[0].outerHTML).toEqual('<input type="text" class="form-control" id="fld" name="fld" ng-required="false" placeholder="direct">');
  });


  it('should show a label-suffix when one is provided AND show the required indicator at the same time', function() {
    elem = compileElement('<form-input uid="fld" input-type="text" label="label" label-suffix="(please)" required="true">');
    expect(elem.find('label')[0].outerHTML).toEqual('<label class="control-label" for="fld">label&nbsp;(please)<span class="required ng-isolate-scope" aria-hidden="true" ng-class="{\'ng-hide\': hide}" ng-transclude="" required-marker="" hide="!(true)"></span></label>');
  });


  it('should allow the placeholder attribute to be specified as "ff-placeholder" too', function() {
    // Now use ff-placeholder
    elem = compileElement('<form-input uid="fld" input-type="text" label="label" ff-placeholder="indirect">');
    expect(elem.find('input')[0].outerHTML).toEqual('<input type="text" class="form-control" id="fld" name="fld" placeholder="indirect" ng-required="false">');
  });

  it('should support input-prefix to add a Bootstrap input group addon before the field', function() {
    elem = compileElement('<form-input uid="fld" input-type="text" label="label" input-prefix="AUD">');
    expect(elem.find('input').parent()[0].outerHTML).toEqual('<div class="input-group"><span class="input-group-addon">AUD</span><input type="text" class="form-control" id="fld" name="fld" ng-required="false"></div>');
  });

  it('should support input-suffix to add a Bootstrap input group addon after the field', function() {
    elem = compileElement('<form-input uid="fld" input-type="text" label="label" input-suffix="per hour">');
    expect(elem.find('input').parent()[0].outerHTML).toEqual('<div class="input-group"><input type="text" class="form-control" id="fld" name="fld" ng-required="false"><span class="input-group-addon">per hour</span></div>');
  });

  it('should support both input-prefix and input-suffix to add a Bootstrap input group addons before and after the field', function() {
    elem = compileElement('<form-input uid="fld" input-type="text" label="label" input-prefix="$" input-suffix="per hour">');
    expect(elem.find('input').parent()[0].outerHTML).toEqual('<div class="input-group"><span class="input-group-addon">$</span><input type="text" class="form-control" id="fld" name="fld" ng-required="false"><span class="input-group-addon">per hour</span></div>');
  });


  it('should support input-button-prefix to add a Bootstrap input group button addon before the field, without a click handler', function() {
    elem = compileElement('<form-input uid="fld" input-type="text" label="label" input-button-prefix="Open">');
    expect(elem.find('input').parent()[0].outerHTML).toEqual('<div class="input-group"><span class="input-group-btn"><button type="button" class="btn btn-default">Open</button></span><input type="text" class="form-control" id="fld" name="fld" ng-required="false"></div>');
  });

  it('should support input-button-prefix to add a Bootstrap input group button addon before the field, with a click handler', function() {
    scope.foo = jasmine.createSpy('foo');
    elem = compileElement('<form-input uid="fld" input-type="text" label="label" input-button-prefix="Open" input-button-prefix-click="foo()">');
    expect(elem.find('input').parent()[0].outerHTML).toEqual('<div class="input-group"><span class="input-group-btn"><button type="button" class="btn btn-default" ng-click="foo()">Open</button></span><input type="text" class="form-control" id="fld" name="fld" ng-required="false"></div>');

    expect(scope.foo).not.toHaveBeenCalled();
    elem.find('button').triggerHandler('click');
    expect(scope.foo).toHaveBeenCalled();
  });


  it('should support input-button-suffix to add a Bootstrap input group button addon after the field, without a click handler', function() {
    elem = compileElement('<form-input uid="fld" input-type="text" label="label" input-button-suffix="Close">');
    expect(elem.find('input').parent()[0].outerHTML).toEqual('<div class="input-group"><input type="text" class="form-control" id="fld" name="fld" ng-required="false"><span class="input-group-btn"><button type="button" class="btn btn-default">Close</button></span></div>');
  });

  it('should support input-button-prefix and input-button-suffix with a click handlers', function() {
    scope.foo = jasmine.createSpy('foo');
    scope.bar = jasmine.createSpy('bar');
    elem = compileElement('<form-input uid="fld" input-type="text" label="label" input-button-prefix="Open" input-button-prefix-click="foo()" input-button-suffix="Close" input-button-suffix-click="bar()">');
    expect(elem.find('input').parent()[0].outerHTML).toEqual('<div class="input-group"><span class="input-group-btn"><button type="button" class="btn btn-default" ng-click="foo()">Open</button></span><input type="text" class="form-control" id="fld" name="fld" ng-required="false"><span class="input-group-btn"><button type="button" class="btn btn-default" ng-click="bar()">Close</button></span></div>');

    expect(scope.foo).not.toHaveBeenCalled();
    expect(scope.bar).not.toHaveBeenCalled();
    elem.find('button').eq(0).triggerHandler('click');
    expect(scope.foo).toHaveBeenCalled();
    expect(scope.bar).not.toHaveBeenCalled();

    elem.find('button').eq(1).triggerHandler('click');
    expect(scope.bar).toHaveBeenCalled();
  });


  it('should throw an error if any of the label, id and name attributes are missing', function() {
    let controlName = 'formInput';
    let directiveName = 'form-input';
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


  // it('should show errors related to the field AKA fieldErrors', function() {
  //   // The form policy indicates that we want errors to appear when the form is submitted (or the field is dirty)
  //   scope.returnFalse = function() { return false; };

  //   // The field MUST have an ng-model attribute for errors to show up
  //   elem = angular.element('<form name="frm" form-policy="policy" form-submit="returnFalse()">' +
  //               '<form-input id="fld" name="fldName" label="hi" input-type="text" ff-ng-model="cust.name" required="true" ' +
  //                 'field-errors="{required: \'Please enter something\'}"></form>');
  //   $compile(elem)(scope);
  //   scope.$digest();

  //   // Error block is produced, but is initially hidden
  //   expect(elem.find('div').eq(2).html()).toEqual('<span class="sr-only" aria-hidden="true" id="frm-fldName-errors-aria"></span>');
  //   expect(elem.find('input')[0].outerHTML).toEqual('<input id="fld" name="fldName" type="text" ng-model="cust.name" ng-required="true" field-error-controller="" class="ng-pristine ng-invalid ng-invalid-required" aria-invalid="false" required="required">');


  //   // Submit the form, then the error should appear
  //   elem.triggerHandler('submit');
  //   expect(elem.find('div').eq(2).html()).toEqual('<span class="sr-only" aria-hidden="true" id="frm-fldName-errors-aria">. There is 1 error for this field. Error 1, Please enter something,</span><div class="text-error ec2-required ng-scope">Please enter something</div>');
  // });


  describe(', when inside a repeater,', function() {
    it('should generate valid IDs and names using $index', function() {
      scope.items = ['a', 'b', 'c'];
      elem = compileElement('<form name="frm"><div ng-repeat="item in items"><form-input uid="fld{{$index + item}}" name="fldName{{$index}}" label="hi {{item}}" input-type="text"></div></form>');

      expect(elem.find('label').eq(0).attr('for')).toEqual('fld0a');
      expect(elem.find('label').eq(1).attr('for')).toEqual('fld1b');
      expect(elem.find('label').eq(2).attr('for')).toEqual('fld2c');
      expect(elem.find('label').eq(0).text()).toEqual('hi a');
      expect(elem.find('label').eq(1).text()).toEqual('hi b');
      expect(elem.find('label').eq(2).text()).toEqual('hi c');

      expect(elem.find('input').eq(0).attr('id')).toEqual('fld0a');
      expect(elem.find('input').eq(1).attr('id')).toEqual('fld1b');
      expect(elem.find('input').eq(2).attr('id')).toEqual('fld2c');

      expect(elem.find('input').eq(0).attr('name')).toEqual('fldName0');
      expect(elem.find('input').eq(1).attr('name')).toEqual('fldName1');
      expect(elem.find('input').eq(2).attr('name')).toEqual('fldName2');
    });
  });
});
