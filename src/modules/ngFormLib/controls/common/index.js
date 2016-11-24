import angular from 'angular';
import FieldErrorController from './FieldErrorController';
import FormControlService from './FormControlService';
import RequiredMarker from '../requiredMarker/RequiredMarker';    // TODO: Not sure why this is here

const mod = angular.module('ngFormLib.controls.common', [
  FieldErrorController,
  FormControlService,
  RequiredMarker,
]);

export default mod.name;
