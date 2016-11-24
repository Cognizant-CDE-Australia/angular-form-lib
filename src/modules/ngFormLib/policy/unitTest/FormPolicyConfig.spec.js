import componentUnderTest from '../FormPolicy';

describe('Form Policy Service configuration', function() {
  describe('has default settings', function() {
    let defaultFormSettings = {};

    beforeEach(function() {
      angular.mock.module(componentUnderTest, function(formPolicyServiceProvider) {
        defaultFormSettings = formPolicyServiceProvider.defaults;
      });

      angular.mock.inject(function(formPolicyService) {
        formPolicyService = formPolicyService;
      });
    });

    it('should have the default settings', function() {
      // By the time the service is created, the policy functions are stubbed if they are null
      expect(defaultFormSettings.formSubmitAttemptedClass).toEqual('form-submit-attempted');
      expect(typeof defaultFormSettings.accessibilityBehaviour).toEqual('object');
      expect(typeof defaultFormSettings.behaviourOnStateChange.behaviour).toEqual('function');
      expect(typeof defaultFormSettings.checkForStateChanges).toEqual('function');
      expect(typeof defaultFormSettings.stateDefinitions.states).toEqual('function');
    });
  });


  describe('can be changed using the service provider', function() {
    let mockFnA = () => 'a';
    let mockFnB = () => 'b';
    let mockFnC = () => 'c';
    let a11yMock = {d: 'd'};
    let mockDefaults = {
      formSubmitAttemptedClass: 'abc',
      behaviourOnError: mockFnA,
      checkForStateChanges: mockFnB,
      stateDefinitions: mockFnC,
      accessibilityBehaviour: a11yMock,
    };
    let formPolicyService;

    // Set the defaults using the provider method
    beforeEach(function() {
      angular.mock.module(componentUnderTest, function(formPolicyServiceProvider) {
        formPolicyServiceProvider.defaults = mockDefaults;
      });

      angular.mock.inject(function(_formPolicyService_) {
        formPolicyService = _formPolicyService_;
      });
    });

    it('should have the new default settings', function() {
      let policyConfig = formPolicyService.getCurrentPolicy();

      expect(policyConfig).toEqual(mockDefaults);
    });
  });
});
