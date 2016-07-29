'use strict';

const featFixScopes = [
  {name: 'a11y'},
  {name: 'build'},
  {name: 'controls'},
  {name: 'errorMessage'},
  {name: 'formCheckbox'},
  {name: 'formDate'},
  {name: 'formControlService'},
  {name: 'formRadioButton'},
  {name: 'formInput'},
  {name: 'formReset'},
  {name: 'formSelect'},
  {name: 'formSubmit'},
  {name: 'policy'},
  {name: 'requiredMarker'}
];

module.exports = {

  types: [
    {value: 'feat',     name: 'feat:     A new feature'},
    {value: 'fix',      name: 'fix:      A bug fix'},
    {value: 'docs',     name: 'docs:     Documentation only changes'},
    {value: 'style',    name: 'style:    Changes that do not affect the meaning of the code\n            (white-space, formatting, missing semi-colons, etc)'},
    {value: 'refactor', name: 'refactor: A code change that neither fixes a bug nor adds a feature'},
    {value: 'perf',     name: 'perf:     A code change that improves performance'},
    {value: 'test',     name: 'test:     Adding missing tests'},
    {value: 'chore',    name: 'chore:    Changes to the build process or auxiliary tools\n            and libraries such as documentation generation'},
    {value: 'WIP',      name: 'WIP:      Work in progress'}
  ],

  // it needs to match the value for field type. Eg.: 'fix'
  scopeOverrides: {
    feat: featFixScopes,
    fix: featFixScopes,
    docs: featFixScopes.concat([{name: 'readme'}, {name: 'site'}]),
    style: featFixScopes,
    refactor: featFixScopes,
    perf: featFixScopes,
    test: featFixScopes,
    chore: ['build']
  },


  allowCustomScopes: false,
  allowBreakingChanges: ['feat', 'fix']
};
