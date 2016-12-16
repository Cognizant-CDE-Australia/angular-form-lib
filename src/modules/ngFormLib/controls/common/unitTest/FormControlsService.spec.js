import componentUnderTest from '../FormControlService';

describe('Form controls common library', function() {
  let formControlService;

  beforeEach(function() {
    angular.mock.module(componentUnderTest);

    angular.mock.inject(function(_formControlService_) {
      formControlService = _formControlService_;
    });
  });

  describe('addToAttribute()', function() {
    it('should add a new attribute if the attribute did not exist', function() {
      let elem = angular.element('<div></div>');

      formControlService.addToAttribute(elem, 'some-attribute', '777');
      expect(elem[0].outerHTML).toEqual('<div some-attribute="777"></div>');
    });

    it('should add to an existing attribute if the attribute already exists', function() {
      let elem = angular.element('<div existing-attribute="Brett"></div>');

      formControlService.addToAttribute(elem, 'existing-attribute', 'Uglow');
      expect(elem[0].outerHTML).toEqual('<div existing-attribute="Brett Uglow"></div>');

      formControlService.addToAttribute(elem, 'existing-attribute', 'adds attributes');
      expect(elem[0].outerHTML).toEqual('<div existing-attribute="Brett Uglow adds attributes"></div>');
    });
  });


  describe('removeAttribute()', function() {
    it('should remove a value from the attribute if the value existed', function() {
      let elem = angular.element('<div names="a Waltzing Matilda"></div>');

      // In-exact value match, so no change
      formControlService.removeFromAttribute(elem, 'names', 'Waltzin');
      expect(elem[0].outerHTML).toEqual('<div names="a Waltzing Matilda"></div>');

      // Exact value match, value removed
      formControlService.removeFromAttribute(elem, 'names', 'Waltzing');
      expect(elem[0].outerHTML).toEqual('<div names="a Matilda"></div>');
    });


    it('should remove a value from the attribute and the attribute as well if it is empty', function() {
      let elem = angular.element('<div country="Malaysia"></div>');

      // In-exact value match, so no change
      formControlService.removeFromAttribute(elem, 'country', 'Malaysia');
      expect(elem[0].outerHTML).toEqual('<div></div>');
    });
  });


  describe('getRequiredAttribute()', function() {
    it('should get the required attribute as the string "true" when it is "required"', function() {
      let testData = [
        {input: 'required', expectedOutput: 'true'},
        {input: 'true', expectedOutput: 'true'},
        {input: undefined, expectedOutput: 'false'},
        {input: 'false', expectedOutput: 'false'},
        {input: 'random', expectedOutput: 'random'},
        {input: '', expectedOutput: 'true'},
        {input: true, expectedOutput: true},
        {input: false, expectedOutput: false},
        {input: 0, expectedOutput: 'false'},
        {input: 1, expectedOutput: 1},
      ];

      for (let i = i; i < testData.length; i++) {
        expect(formControlService.getRequiredAttribute(testData[i].input)).toEqual(testData[i].expectedOutput);
      }
    });
  });


  describe('decorateLabel()', function() {
    it('should not decorate the label when it doesn\'t need to', function() {
      let elem = angular.element('<label></label>');

      // Minimal decorations to the label - last param: hide required label
      formControlService.decorateLabel(elem, 'false', '', undefined, '', true);
      expect(elem[0].outerHTML).toEqual('<label></label>');
    });


    it('should decorate the label when it needs to', function() {
      let elem = angular.element('<frankfurt></frankfurt>');

      // Minimal decorations to the label - last param: hide required label
      formControlService.decorateLabel(elem, 'true', 'myId', 'myLabelClass', 'false', false);
      expect(elem[0].outerHTML).toEqual('<frankfurt for="myId" class="myLabelClass" ng-class="{\'sr-only\': false}">' +
          '<span required-marker="" hide="!(true)"></span></frankfurt>');
    });
  });


  describe('decorateInputField()', function() {
    it('should add an id, name, label and required attributes as the bare minimum', function() {
      let elem = angular.element('<input>');
      let attr = {
        '$attr': {'noFfAttributes': 'no-ff-attributes', 'soNothingWillBeCopiedFromHere': 'so-nothing-will-be-copied-from-here'},
        'noFfAttributes': 'ok',
        'soNothingWillBeCopiedFromHere': 'cool',
      };

      let hostElem = angular.element('<div no-ff-attributes="ok" so-nothing-will-be-copied-from-here="cool"></div>');

      formControlService.decorateInputField(elem, hostElem, attr, 'myId', 'myName', 'state === \'VIC\'');

      expect(elem[0].outerHTML).toEqual('<input id="myId" name="myName" ng-required="state === \'VIC\'" aria-required="{{!!(state === \'VIC\')}}">');
      expect(hostElem[0].outerHTML).toEqual('<div no-ff-attributes="ok" so-nothing-will-be-copied-from-here="cool"></div>');
    });


    it('should preserve existing content and add new attributes to the target element, EXCEPT the type attribute which is ignored', function() {
      let hostElem = angular.element('<div ff-type="checkbox" class="row" ff-ng-pattern="[0-9]{4}"></div>');
      let elem = angular.element('<input class="inline"><span>some text</span></input>');
      // All of the attributes that start with "ff" will be copied from the hostElem(ent) to the (input) elem(ent)
      let attr = {
        '$attr': {'ffType': 'ff-type', 'ffNgPattern': 'ff-ng-pattern'},
        'ffType': 'checkbox',
        'ffNgPattern': '[0-9]{4}',
      };

      formControlService.decorateInputField(elem, hostElem, attr, 'myId', 'myName', 'true');

      expect(elem[0].outerHTML).toEqual('<input class="inline" id="myId" name="myName" ng-pattern="[0-9]{4}" ng-required="true" aria-required="{{!!(true)}}">');
      expect(hostElem[0].outerHTML).toEqual('<div class="row"></div>');
    });
  });


  describe('createErrorFeatures()', function() {
    it('should not create any error features when the element has no error messages to show', function() {
      let elem = angular.element('<input>');
      let hostElem = angular.element('<div></div>');

      formControlService.createErrorFeatures(hostElem, elem, 'myName', 'myLabel', '', '');
      expect(elem[0].outerHTML).toEqual('<input>');
      expect(hostElem[0].outerHTML).toEqual('<div></div>');
    });


    it('should create some error features when the element has field error messages to show', function() {
      let elem = angular.element('<input>');
      let hostElem = angular.element('<div></div>');

      // Field errors
      formControlService.createErrorFeatures(hostElem, elem, 'myName', 'myLabel', '{required: \'Please enter a valid email address\', email: \'Please enter a valid email address\'}', '');
      expect(elem[0].outerHTML).toEqual('<input field-error-controller="">');
      expect(hostElem[0].outerHTML).toEqual('<div><div error-container="" field-name="myName" field-label="myLabel" field-errors="{required: \'Please enter a valid email address\', email: \'Please enter a valid email address\'}"></div></div>');
    });


    it('should create some error features when the element has text error messages to show', function() {
      let elem = angular.element('<input>');
      let hostElem = angular.element('<div></div>');

      // Text errors
      formControlService.createErrorFeatures(hostElem, elem, 'myName', '', '', '[\'myScopeVar1\', \'myScopeVar2\']');
      expect(elem[0].outerHTML).toEqual('<input field-error-controller="">');
      expect(hostElem[0].outerHTML).toEqual('<div><div error-container="" field-name="myName" text-errors="[\'myScopeVar1\', \'myScopeVar2\']"></div></div>');
    });


    it('should create some error features when the element has field and text error messages to show', function() {
      let elem = angular.element('<input>');
      let hostElem = angular.element('<div></div>');

      // Text errors
      formControlService.createErrorFeatures(hostElem, elem, 'myName', 'myLabel', '{required: \'Please enter a valid email address\'}', '[\'myScopeVar1\', \'myScopeVar2\']');
      expect(elem[0].outerHTML).toEqual('<input field-error-controller="">');
      expect(hostElem[0].outerHTML).toEqual('<div><div error-container="" field-name="myName" field-label="myLabel" field-errors="{required: \'Please enter a valid email address\'}" text-errors="[\'myScopeVar1\', \'myScopeVar2\']"></div></div>');
    });
  });


  describe('createFieldHint()', function() {
    it('should not create a field hint when it doesn\'t need to', function() {
      let elem = angular.element('<anything></anything>');
      let hostElem = angular.element('<youlike></youlike>');

      formControlService.createFieldHint(hostElem, elem, '', '');
      expect(elem[0].outerHTML).toEqual('<anything></anything>');
      expect(hostElem[0].outerHTML).toEqual('<youlike></youlike>');
    });


    it('should create a field hint the label when it needs to', function() {
      let elem = angular.element('<anything></anything>');
      let hostElem = angular.element('<youlike></youlike>');

      formControlService.createFieldHint(hostElem, elem, 'Format: dd/mm/yyyy', 'hint-id');
      expect(elem[0].outerHTML).toEqual('<anything aria-describedby="hint-id"></anything>');
      expect(hostElem[0].outerHTML).toEqual('<youlike><p class="help-block" id="hint-id">Format: dd/mm/yyyy</p></youlike>');
    });
  });
});
