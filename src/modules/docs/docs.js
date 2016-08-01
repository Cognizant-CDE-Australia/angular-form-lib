import angular from 'angular';
import angularAnimate from 'angular-animate';   // Allows animations to run
import 'angular-strap';   // No export, currently
import highlightjs from 'highlightjs/highlight.pack.js';
import {ngFormLib, defaultPolicies} from '../ngFormLib';
import ngTranslate from 'angular-translate';

// import all of the documentation JS files
import docFixtures from './docFixtures';


const mod = angular.module('ngFormLibDocs.docs', [
  'mgcrea.ngStrap',
  ngFormLib,
  defaultPolicies,
  angularAnimate,
  ngTranslate,

  // require ALL of the docs /demo components
  docFixtures
]);

export default mod.name;


// Needed to bind to HTML and compile it when it is loaded
mod.directive('bindCompile', ['$compile', function($compile) {
  return {
    restrict: 'A',
    replace: true,
    link: function(scope, element, attrs) {
      scope.$watch(attrs.bindCompile, function(html) {
        element[0].innerHTML = html;
        $compile(element.contents())(scope);
      });
    }
  };
}]);

mod.config(['$locationProvider', function($locationProvider) {
  // configure html5 to get links working on jsfiddle
  $locationProvider.html5Mode(false);
}]);

mod.config(['$anchorScrollProvider', function($anchorScrollProvider) {
  $anchorScrollProvider.disableAutoScrolling();
}]);

mod.config(['$translateProvider', function($translateProvider) {
  let translations = require('json!./assets/language/enAU.json');

  $translateProvider.translations('enAU', translations);
  $translateProvider.preferredLanguage('enAU');
  $translateProvider.useSanitizeValueStrategy(null);
}]);

// Set the field-error-focus-scroll-position, to allow for the website's fixed header
mod.config(['formPolicyBehaviourOnStateChangeProvider', function(stateChangeBehavePolicy) {
  stateChangeBehavePolicy.config.fieldFocusScrollOffset = 80;
}]);

mod.config(['formPolicyAccessibilityBehaviourProvider', 'formPolicyAccessibilityLibrary', function(a11yPolicy, lib) {
  // Configure the formPolicyAccessibilityBehaviour to use the short-error version of the onErrorChangeBehaviour
  a11yPolicy.config.onErrorChangeBehaviour = lib.createShortErrorDescription;
}]);


//mod.config(['formPolicyCheckForStateChangesProvider', 'formPolicyCheckForStateChangesLibrary', function(statePolicy, lib) {
//  // DEMO: Check for errors as soon as the control is changed
//  statePolicy.config.checker = lib.onChange;
//}]);

//mod.config(['formPolicyStateDefinitionsProvider', 'formPolicyErrorDefinitionLibrary', function(stateDefs, errorLib) {
//  // DEMO: Show errors immediately
//  stateDefs.config.states.error = errorLib.immediately;
//}]);


mod.controller('MainController', ['$http', function Controller($http) {
  var vm = this; // view-model

  // Fetch the documentation config and store it on the rootScope (for laughs :)
  let fileName = require('file?name=assets/config/[name].[ext]!./assets/config/docsConfig.json');

  $http.get(fileName).then(function(result) {
    vm.DOC_CONFIG = result.data;
    vm.REPO_HOST = result.data.repository.host;
    vm.REPO = vm.REPO_HOST + result.data.repository.branch;
    vm.VERSION = result.data.version;
  });
}]);


mod.directive('docsComponent', [() => {
  return {
    restrict: 'A',    // IE8 support
    controller: 'MainController',
    controllerAs: 'mainCtrl',
    template: require('./templates/docs-component.html')
  };
}]);


mod.directive('docsNavbar', [() => {
  require('file?name=/assets/aside.html!./templates/aside.inc');    // If the file is called *.html, it gets wrapped inside a JS module. This gives us just the HTML
  return {
    restrict: 'A',    // IE8 support
    template: require('./templates/navbar.html')
  };
}]);

mod.directive('docsHeader', [() => {
  return {
    restrict: 'A',    // IE8 support
    template: require('./templates/header.html')
  };
}]);

mod.directive('docsFooter', [() => {
  return {
    restrict: 'A',    // IE8 support
    template: require('./templates/footer.html')
  };
}]);

mod.directive('docsAffixedSidenav', [() => {
  return {
    restrict: 'A',    // IE8 support
    template: require('./templates/affixed-sidenav.html')
  };
}]);


mod.directive('docsSidenav', [() => {
  return {
    restrict: 'A',    // IE8 support
    template: require('./templates/sidenav.html')
  };
}]);

mod.directive('docsGettingStarted', [() => {
  return {
    restrict: 'A',    // IE8 support
    template: require('./templates/getting-started.html')
  };
}]);


// These directives are purely needed for documentation purposes
mod.directive('code', function() {
  return {restrict: 'E', terminal: true};
});


mod.directive('appendSource', ['$compile', 'indent', function($compile, indent) {
  return {
    compile: function(element, attr) {

      // Directive options
      let options = {placement: 'after'};

      angular.forEach(['placement', 'hlClass'], function(key) {
        if (angular.isDefined(attr[key])) {
          options[key] = attr[key];
        }
      });

      let hlElement = angular.element('<div class="highlight" ng-non-bindable><pre><code class="html" style="margin:0"></code></pre></div>');
      let codeElement = hlElement.children('pre').children('code');
      let elementHtml = indent(element.html());

      codeElement.text(elementHtml);
      if (options.hlClass) {
        codeElement.addClass(options.hlClass);
      }
      element[options.placement](hlElement);
      highlightjs.highlightBlock(codeElement[0]);
    }
  };
}]);


mod.directive('highlightBlock', ['indent', function(indent) {
  return {
    compile: function(element) {
      element.html(indent(element.html()));
      return function postLink(scope, element) {
        highlightjs.highlightBlock(element[0]);
      };
    }
  };
}]);


mod.value('indent', function(text, spaces) {

  if (!text) {
    return text;
  }
  let lines = text.split(/\r?\n/);
  let prefix = '      '.substr(0, spaces || 0);
  let i;

  // Remove any leading blank lines
  while (lines.length && lines[0].match(/^\s*$/)) {
    lines.shift();
  }
  // Remove any trailing blank lines
  while (lines.length && lines[lines.length - 1].match(/^\s*$/)) {
    lines.pop();
  }
  // Calculate proper indent
  let minIndent = 999;

  for (i = 0; i < lines.length; i++) {
    let line = lines[0];
    let indent = line.match(/^\s*/)[0];

    if (indent !== line && indent.length < minIndent) {
      minIndent = indent.length;
    }
  }

  for (i = 0; i < lines.length; i++) {
    lines[i] = prefix + lines[i].substring(minIndent).replace(/=""/g, '');
  }
  lines.push('');
  return lines.join('\n');
});


// Anchor directive
// Add anchor-like behaviour to any element, and take advantage of smooth scrolling
mod.directive('ahref', ['$location', '$document', 'scrollContainerAPI', 'duScrollDuration',
  function($location, $document, scrollContainerAPI, duScrollDuration) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        element.on('click', function() {
          // The anchor reference should be valid
          let ahref = attrs.ahref;

          if (!ahref || ahref.indexOf('#') === -1) {
            return;
          }
          let elemId = ahref.replace(/.*(?=#[^\s]+$)/, '').substring(1);

          // Only add the scroll to the history if directed to
          if (attrs.useHash) {
            $location.hash(elemId);  // Change the URL
            scope.$apply();
          }
          let target = $document[0].getElementById(elemId);

          if (!target || !target.getBoundingClientRect) {
            return;
          }

          let offset = parseInt(attrs.scrollOffset || 0) + (attrs.scrollBottom === 'true' ? -target.offsetHeight : 0);
          let duration = attrs.duration ? parseInt(attrs.duration, 10) : duScrollDuration;
          let container = scrollContainerAPI.getContainer(scope);

          container.scrollToElement(angular.element(target), isNaN(offset) ? 0 : offset, isNaN(duration) ? 0 : duration);
        });
      }
    };
  }
]);
