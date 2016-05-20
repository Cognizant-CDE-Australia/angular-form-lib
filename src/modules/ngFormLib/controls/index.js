import angular from 'angular';
import ErrorMessageContainer from './errorMessageContainer/ErrorMessageContainer';
import FormCheckbox from './formCheckbox/FormCheckbox';
import FormDate from './formDate/FormDate';
import FormInput from './formInput/FormInput';
import FormRadioButton from './formRadioButton/FormRadioButton';
import FormReset from './formReset/FormReset';
import FormSelect from './formSelect/FormSelect';
import FormSubmit from './formSubmit/FormSubmit';

  // We need the utility module for the ngFormLibDateUtil.getDate() method for the formDateFormat directive, and ngFormLibStringUtil.trim() in controls.common
const mod = angular.module('ngFormLib.controls', [
  ErrorMessageContainer,
  FormCheckbox,
  FormDate,
  FormInput,
  FormRadioButton,
  FormReset,
  FormSelect,
  FormSubmit
]);

export default mod.name;
