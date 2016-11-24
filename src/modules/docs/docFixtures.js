import angular from 'angular';

// import all of the documentation JS files
// There should be a nicer way to do this, but this won't change very often...
import formControlsCommonDocs from '../ngFormLib/controls/common/docs/formControlsCommon.docs';
import formControlsCommonPropertiesDocs from '../ngFormLib/controls/common/docs/formControlsCommonProperties.docs';
import formControlsDemosDocs from '../ngFormLib/controls/common/docs/formControlsDemos.docs';
import formControlServiceDocs from '../ngFormLib/controls/common/docs/formControlService.docs';
import formPolicyDocs from '../ngFormLib/policy/docs/formPolicy.docs';
import formSubmitDocs from '../ngFormLib/controls/formSubmit/docs/formSubmit.docs';
import formResetDocs from '../ngFormLib/controls/formReset/docs/formReset.docs';
import formInputDocs from '../ngFormLib/controls/formInput/docs/formInput.docs';
import formCheckboxDocs from '../ngFormLib/controls/formCheckbox/docs/formCheckbox.docs';
import formRadioButtonDocs from '../ngFormLib/controls/formRadioButton/docs/formRadioButton.docs';
import formSelectDocs from '../ngFormLib/controls/formSelect/docs/formSelect.docs';
import formDateDocs from '../ngFormLib/controls/formDate/docs/formDate.docs';
import errorMessageContainerDocs from '../ngFormLib/controls/errorMessageContainer/docs/errorMessageContainer.docs';
import requiredMarkerDocs from '../ngFormLib/controls/requiredMarker/docs/requiredMarker.docs';


const mod = angular.module('ngFormLibDocs.docs.fixtures', [
  formControlsCommonDocs,
  formControlsCommonPropertiesDocs,
  formControlsDemosDocs,
  formControlServiceDocs,
  formPolicyDocs,
  formResetDocs,
  formSubmitDocs,
  formInputDocs,
  formCheckboxDocs,
  formRadioButtonDocs,
  formSelectDocs,
  formDateDocs,
  errorMessageContainerDocs,
  requiredMarkerDocs,
]);

export default mod.name;
