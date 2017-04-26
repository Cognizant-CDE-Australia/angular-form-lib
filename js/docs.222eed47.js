webpackJsonp([0,4],{

/***/ "../node_modules/angular-motion/dist/angular-motion.css":
/***/ function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ },

/***/ "../node_modules/angular-strap/dist/angular-strap.js":
/***/ function(module, exports) {

/**
 * angular-strap
 * @version v2.1.6 - 2015-01-11
 * @link http://mgcrea.github.io/angular-strap
 * @author Olivier Louvignes (olivier@mg-crea.com)
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
(function(window, document, undefined) {
'use strict';
// Source: module.js
angular.module('mgcrea.ngStrap', [
  'mgcrea.ngStrap.modal',
  'mgcrea.ngStrap.aside',
  'mgcrea.ngStrap.alert',
  'mgcrea.ngStrap.button',
  'mgcrea.ngStrap.select',
  'mgcrea.ngStrap.datepicker',
  'mgcrea.ngStrap.timepicker',
  'mgcrea.ngStrap.navbar',
  'mgcrea.ngStrap.tooltip',
  'mgcrea.ngStrap.popover',
  'mgcrea.ngStrap.dropdown',
  'mgcrea.ngStrap.typeahead',
  'mgcrea.ngStrap.scrollspy',
  'mgcrea.ngStrap.affix',
  'mgcrea.ngStrap.tab',
  'mgcrea.ngStrap.collapse'
]);

// Source: affix.js
angular.module('mgcrea.ngStrap.affix', ['mgcrea.ngStrap.helpers.dimensions', 'mgcrea.ngStrap.helpers.debounce'])

  .provider('$affix', function() {

    var defaults = this.defaults = {
      offsetTop: 'auto'
    };

    this.$get = ["$window", "debounce", "dimensions", function($window, debounce, dimensions) {

      var bodyEl = angular.element($window.document.body);
      var windowEl = angular.element($window);

      function AffixFactory(element, config) {

        var $affix = {};

        // Common vars
        var options = angular.extend({}, defaults, config);
        var targetEl = options.target;

        // Initial private vars
        var reset = 'affix affix-top affix-bottom',
            setWidth = false,
            initialAffixTop = 0,
            initialOffsetTop = 0,
            offsetTop = 0,
            offsetBottom = 0,
            affixed = null,
            unpin = null;

        var parent = element.parent();
        // Options: custom parent
        if (options.offsetParent) {
          if (options.offsetParent.match(/^\d+$/)) {
            for (var i = 0; i < (options.offsetParent * 1) - 1; i++) {
              parent = parent.parent();
            }
          }
          else {
            parent = angular.element(options.offsetParent);
          }
        }

        $affix.init = function() {

          this.$parseOffsets();
          initialOffsetTop = dimensions.offset(element[0]).top + initialAffixTop;
          setWidth = !element[0].style.width;

          // Bind events
          targetEl.on('scroll', this.checkPosition);
          targetEl.on('click', this.checkPositionWithEventLoop);
          windowEl.on('resize', this.$debouncedOnResize);

          // Both of these checkPosition() calls are necessary for the case where
          // the user hits refresh after scrolling to the bottom of the page.
          this.checkPosition();
          this.checkPositionWithEventLoop();

        };

        $affix.destroy = function() {

          // Unbind events
          targetEl.off('scroll', this.checkPosition);
          targetEl.off('click', this.checkPositionWithEventLoop);
          windowEl.off('resize', this.$debouncedOnResize);

        };

        $affix.checkPositionWithEventLoop = function() {

          // IE 9 throws an error if we use 'this' instead of '$affix'
          // in this setTimeout call
          setTimeout($affix.checkPosition, 1);

        };

        $affix.checkPosition = function() {
          // if (!this.$element.is(':visible')) return

          var scrollTop = getScrollTop();
          var position = dimensions.offset(element[0]);
          var elementHeight = dimensions.height(element[0]);

          // Get required affix class according to position
          var affix = getRequiredAffixClass(unpin, position, elementHeight);

          // Did affix status changed this last check?
          if(affixed === affix) return;
          affixed = affix;

          // Add proper affix class
          element.removeClass(reset).addClass('affix' + ((affix !== 'middle') ? '-' + affix : ''));

          if(affix === 'top') {
            unpin = null;
            element.css('position', (options.offsetParent) ? '' : 'relative');
            if(setWidth) {
              element.css('width', '');
            }
            element.css('top', '');
          } else if(affix === 'bottom') {
            if (options.offsetUnpin) {
              unpin = -(options.offsetUnpin * 1);
            }
            else {
              // Calculate unpin threshold when affixed to bottom.
              // Hopefully the browser scrolls pixel by pixel.
              unpin = position.top - scrollTop;
            }
            if(setWidth) {
              element.css('width', '');
            }
            element.css('position', (options.offsetParent) ? '' : 'relative');
            element.css('top', (options.offsetParent) ? '' : ((bodyEl[0].offsetHeight - offsetBottom - elementHeight - initialOffsetTop) + 'px'));
          } else { // affix === 'middle'
            unpin = null;
            if(setWidth) {
              element.css('width', element[0].offsetWidth + 'px');
            }
            element.css('position', 'fixed');
            element.css('top', initialAffixTop + 'px');
          }

        };

        $affix.$onResize = function() {
          $affix.$parseOffsets();
          $affix.checkPosition();
        };
        $affix.$debouncedOnResize = debounce($affix.$onResize, 50);

        $affix.$parseOffsets = function() {
          var initialPosition = element.css('position');
          // Reset position to calculate correct offsetTop
          element.css('position', (options.offsetParent) ? '' : 'relative');

          if(options.offsetTop) {
            if(options.offsetTop === 'auto') {
              options.offsetTop = '+0';
            }
            if(options.offsetTop.match(/^[-+]\d+$/)) {
              initialAffixTop = - options.offsetTop * 1;
              if(options.offsetParent) {
                offsetTop = dimensions.offset(parent[0]).top + (options.offsetTop * 1);
              }
              else {
                offsetTop = dimensions.offset(element[0]).top - dimensions.css(element[0], 'marginTop', true) + (options.offsetTop * 1);
              }
            }
            else {
              offsetTop = options.offsetTop * 1;
            }
          }

          if(options.offsetBottom) {
            if(options.offsetParent && options.offsetBottom.match(/^[-+]\d+$/)) {
              // add 1 pixel due to rounding problems...
              offsetBottom = getScrollHeight() - (dimensions.offset(parent[0]).top + dimensions.height(parent[0])) + (options.offsetBottom * 1) + 1;
            }
            else {
              offsetBottom = options.offsetBottom * 1;
            }
          }

          // Bring back the element's position after calculations
          element.css('position', initialPosition);
        };

        // Private methods

        function getRequiredAffixClass(unpin, position, elementHeight) {

          var scrollTop = getScrollTop();
          var scrollHeight = getScrollHeight();

          if(scrollTop <= offsetTop) {
            return 'top';
          } else if(unpin !== null && (scrollTop + unpin <= position.top)) {
            return 'middle';
          } else if(offsetBottom !== null && (position.top + elementHeight + initialAffixTop >= scrollHeight - offsetBottom)) {
            return 'bottom';
          } else {
            return 'middle';
          }

        }

        function getScrollTop() {
          return targetEl[0] === $window ? $window.pageYOffset : targetEl[0].scrollTop;
        }

        function getScrollHeight() {
          return targetEl[0] === $window ? $window.document.body.scrollHeight : targetEl[0].scrollHeight;
        }

        $affix.init();
        return $affix;

      }

      return AffixFactory;

    }];

  })

  .directive('bsAffix', ["$affix", "$window", function($affix, $window) {

    return {
      restrict: 'EAC',
      require: '^?bsAffixTarget',
      link: function postLink(scope, element, attr, affixTarget) {

        var options = {scope: scope, offsetTop: 'auto', target: affixTarget ? affixTarget.$element : angular.element($window)};
        angular.forEach(['offsetTop', 'offsetBottom', 'offsetParent', 'offsetUnpin'], function(key) {
          if(angular.isDefined(attr[key])) options[key] = attr[key];
        });

        var affix = $affix(element, options);
        scope.$on('$destroy', function() {
          affix && affix.destroy();
          options = null;
          affix = null;
        });

      }
    };

  }])

  .directive('bsAffixTarget', function() {
    return {
      controller: ["$element", function($element) {
        this.$element = $element;
      }]
    };
  });

// Source: alert.js
// @BUG: following snippet won't compile correctly
// @TODO: submit issue to core
// '<span ng-if="title"><strong ng-bind="title"></strong>&nbsp;</span><span ng-bind-html="content"></span>' +

angular.module('mgcrea.ngStrap.alert', ['mgcrea.ngStrap.modal'])

  .provider('$alert', function() {

    var defaults = this.defaults = {
      animation: 'am-fade',
      prefixClass: 'alert',
      prefixEvent: 'alert',
      placement: null,
      template: 'alert/alert.tpl.html',
      container: false,
      element: null,
      backdrop: false,
      keyboard: true,
      show: true,
      // Specific options
      duration: false,
      type: false,
      dismissable: true
    };

    this.$get = ["$modal", "$timeout", function($modal, $timeout) {

      function AlertFactory(config) {

        var $alert = {};

        // Common vars
        var options = angular.extend({}, defaults, config);

        $alert = $modal(options);

        // Support scope as string options [/*title, content, */ type, dismissable]
        $alert.$scope.dismissable = !!options.dismissable;
        if(options.type) {
          $alert.$scope.type = options.type;
        }

        // Support auto-close duration
        var show = $alert.show;
        if(options.duration) {
          $alert.show = function() {
            show();
            $timeout(function() {
              $alert.hide();
            }, options.duration * 1000);
          };
        }

        return $alert;

      }

      return AlertFactory;

    }];

  })

  .directive('bsAlert', ["$window", "$sce", "$alert", function($window, $sce, $alert) {

    var requestAnimationFrame = $window.requestAnimationFrame || $window.setTimeout;

    return {
      restrict: 'EAC',
      scope: true,
      link: function postLink(scope, element, attr, transclusion) {

        // Directive options
        var options = {scope: scope, element: element, show: false};
        angular.forEach(['template', 'placement', 'keyboard', 'html', 'container', 'animation', 'duration', 'dismissable'], function(key) {
          if(angular.isDefined(attr[key])) options[key] = attr[key];
        });

        // Support scope as data-attrs
        angular.forEach(['title', 'content', 'type'], function(key) {
          attr[key] && attr.$observe(key, function(newValue, oldValue) {
            scope[key] = $sce.trustAsHtml(newValue);
          });
        });

        // Support scope as an object
        attr.bsAlert && scope.$watch(attr.bsAlert, function(newValue, oldValue) {
          if(angular.isObject(newValue)) {
            angular.extend(scope, newValue);
          } else {
            scope.content = newValue;
          }
        }, true);

        // Initialize alert
        var alert = $alert(options);

        // Trigger
        element.on(attr.trigger || 'click', alert.toggle);

        // Garbage collection
        scope.$on('$destroy', function() {
          if (alert) alert.destroy();
          options = null;
          alert = null;
        });

      }
    };

  }]);

// Source: aside.js
angular.module('mgcrea.ngStrap.aside', ['mgcrea.ngStrap.modal'])

  .provider('$aside', function() {

    var defaults = this.defaults = {
      animation: 'am-fade-and-slide-right',
      prefixClass: 'aside',
      prefixEvent: 'aside',
      placement: 'right',
      template: 'aside/aside.tpl.html',
      contentTemplate: false,
      container: false,
      element: null,
      backdrop: true,
      keyboard: true,
      html: false,
      show: true
    };

    this.$get = ["$modal", function($modal) {

      function AsideFactory(config) {

        var $aside = {};

        // Common vars
        var options = angular.extend({}, defaults, config);

        $aside = $modal(options);

        return $aside;

      }

      return AsideFactory;

    }];

  })

  .directive('bsAside', ["$window", "$sce", "$aside", function($window, $sce, $aside) {

    var requestAnimationFrame = $window.requestAnimationFrame || $window.setTimeout;

    return {
      restrict: 'EAC',
      scope: true,
      link: function postLink(scope, element, attr, transclusion) {
        // Directive options
        var options = {scope: scope, element: element, show: false};
        angular.forEach(['template', 'contentTemplate', 'placement', 'backdrop', 'keyboard', 'html', 'container', 'animation'], function(key) {
          if(angular.isDefined(attr[key])) options[key] = attr[key];
        });

        // Support scope as data-attrs
        angular.forEach(['title', 'content'], function(key) {
          attr[key] && attr.$observe(key, function(newValue, oldValue) {
            scope[key] = $sce.trustAsHtml(newValue);
          });
        });

        // Support scope as an object
        attr.bsAside && scope.$watch(attr.bsAside, function(newValue, oldValue) {
          if(angular.isObject(newValue)) {
            angular.extend(scope, newValue);
          } else {
            scope.content = newValue;
          }
        }, true);

        // Initialize aside
        var aside = $aside(options);

        // Trigger
        element.on(attr.trigger || 'click', aside.toggle);

        // Garbage collection
        scope.$on('$destroy', function() {
          if (aside) aside.destroy();
          options = null;
          aside = null;
        });

      }
    };

  }]);

// Source: button.js
angular.module('mgcrea.ngStrap.button', [])

  .provider('$button', function() {

    var defaults = this.defaults = {
      activeClass:'active',
      toggleEvent:'click'
    };

    this.$get = function() {
      return {defaults: defaults};
    };

  })

  .directive('bsCheckboxGroup', function() {

    return {
      restrict: 'A',
      require: 'ngModel',
      compile: function postLink(element, attr) {
        element.attr('data-toggle', 'buttons');
        element.removeAttr('ng-model');
        var children = element[0].querySelectorAll('input[type="checkbox"]');
        angular.forEach(children, function(child) {
          var childEl = angular.element(child);
          childEl.attr('bs-checkbox', '');
          childEl.attr('ng-model', attr.ngModel + '.' + childEl.attr('value'));
        });
      }

    };

  })

  .directive('bsCheckbox', ["$button", "$$rAF", function($button, $$rAF) {

    var defaults = $button.defaults;
    var constantValueRegExp = /^(true|false|\d+)$/;

    return {
      restrict: 'A',
      require: 'ngModel',
      link: function postLink(scope, element, attr, controller) {

        var options = defaults;

        // Support label > input[type="checkbox"]
        var isInput = element[0].nodeName === 'INPUT';
        var activeElement = isInput ? element.parent() : element;

        var trueValue = angular.isDefined(attr.trueValue) ? attr.trueValue : true;
        if(constantValueRegExp.test(attr.trueValue)) {
          trueValue = scope.$eval(attr.trueValue);
        }
        var falseValue = angular.isDefined(attr.falseValue) ? attr.falseValue : false;
        if(constantValueRegExp.test(attr.falseValue)) {
          falseValue = scope.$eval(attr.falseValue);
        }

        // Parse exotic values
        var hasExoticValues = typeof trueValue !== 'boolean' || typeof falseValue !== 'boolean';
        if(hasExoticValues) {
          controller.$parsers.push(function(viewValue) {
            // console.warn('$parser', element.attr('ng-model'), 'viewValue', viewValue);
            return viewValue ? trueValue : falseValue;
          });
          // modelValue -> $formatters -> viewValue
          controller.$formatters.push(function(modelValue) {
             // console.warn('$formatter("%s"): modelValue=%o (%o)', element.attr('ng-model'), modelValue, typeof modelValue);
             return angular.equals(modelValue, trueValue);
          });
          // Fix rendering for exotic values
          scope.$watch(attr.ngModel, function(newValue, oldValue) {
            controller.$render();
          });
        }

        // model -> view
        controller.$render = function () {
          // console.warn('$render', element.attr('ng-model'), 'controller.$modelValue', typeof controller.$modelValue, controller.$modelValue, 'controller.$viewValue', typeof controller.$viewValue, controller.$viewValue);
          var isActive = angular.equals(controller.$modelValue, trueValue);
          $$rAF(function() {
            if(isInput) element[0].checked = isActive;
            activeElement.toggleClass(options.activeClass, isActive);
          });
        };

        // view -> model
        element.bind(options.toggleEvent, function() {
          scope.$apply(function () {
            // console.warn('!click', element.attr('ng-model'), 'controller.$viewValue', typeof controller.$viewValue, controller.$viewValue, 'controller.$modelValue', typeof controller.$modelValue, controller.$modelValue);
            if(!isInput) {
              controller.$setViewValue(!activeElement.hasClass('active'));
            }
            if(!hasExoticValues) {
              controller.$render();
            }
          });
        });

      }

    };

  }])

  .directive('bsRadioGroup', function() {

    return {
      restrict: 'A',
      require: 'ngModel',
      compile: function postLink(element, attr) {
        element.attr('data-toggle', 'buttons');
        element.removeAttr('ng-model');
        var children = element[0].querySelectorAll('input[type="radio"]');
        angular.forEach(children, function(child) {
          angular.element(child).attr('bs-radio', '');
          angular.element(child).attr('ng-model', attr.ngModel);
        });
      }

    };

  })

  .directive('bsRadio', ["$button", "$$rAF", function($button, $$rAF) {

    var defaults = $button.defaults;
    var constantValueRegExp = /^(true|false|\d+)$/;

    return {
      restrict: 'A',
      require: 'ngModel',
      link: function postLink(scope, element, attr, controller) {

        var options = defaults;

        // Support `label > input[type="radio"]` markup
        var isInput = element[0].nodeName === 'INPUT';
        var activeElement = isInput ? element.parent() : element;

        var value = constantValueRegExp.test(attr.value) ? scope.$eval(attr.value) : attr.value;

        // model -> view
        controller.$render = function () {
          // console.warn('$render', element.attr('value'), 'controller.$modelValue', typeof controller.$modelValue, controller.$modelValue, 'controller.$viewValue', typeof controller.$viewValue, controller.$viewValue);
          var isActive = angular.equals(controller.$modelValue, value);
          $$rAF(function() {
            if(isInput) element[0].checked = isActive;
            activeElement.toggleClass(options.activeClass, isActive);
          });
        };

        // view -> model
        element.bind(options.toggleEvent, function() {
          scope.$apply(function () {
            // console.warn('!click', element.attr('value'), 'controller.$viewValue', typeof controller.$viewValue, controller.$viewValue, 'controller.$modelValue', typeof controller.$modelValue, controller.$modelValue);
            controller.$setViewValue(value);
            controller.$render();
          });
        });

      }

    };

  }]);

// Source: collapse.js
angular.module('mgcrea.ngStrap.collapse', [])

  .provider('$collapse', function() {

    var defaults = this.defaults = {
      animation: 'am-collapse',
      disallowToggle: false,
      activeClass: 'in',
      startCollapsed: false,
      allowMultiple: false
    };

    var controller = this.controller = function($scope, $element, $attrs) {
      var self = this;

      // Attributes options
      self.$options = angular.copy(defaults);
      angular.forEach(['animation', 'disallowToggle', 'activeClass', 'startCollapsed', 'allowMultiple'], function (key) {
        if(angular.isDefined($attrs[key])) self.$options[key] = $attrs[key];
      });

      self.$toggles = [];
      self.$targets = [];

      self.$viewChangeListeners = [];

      self.$registerToggle = function(element) {
        self.$toggles.push(element);
      };
      self.$registerTarget = function(element) {
        self.$targets.push(element);
      };

      self.$unregisterToggle = function(element) {
        var index = self.$toggles.indexOf(element);
        // remove toggle from $toggles array
        self.$toggles.splice(index, 1);
      };
      self.$unregisterTarget = function(element) {
        var index = self.$targets.indexOf(element);

        // remove element from $targets array
        self.$targets.splice(index, 1);

        if (self.$options.allowMultiple) {
          // remove target index from $active array values
          deactivateItem(element);
        }

        // fix active item indexes
        fixActiveItemIndexes(index);

        self.$viewChangeListeners.forEach(function(fn) {
          fn();
        });
      };

      // use array to store all the currently open panels
      self.$targets.$active = !self.$options.startCollapsed ? [0] : [];
      self.$setActive = $scope.$setActive = function(value) {
        if(angular.isArray(value)) {
          self.$targets.$active = angular.copy(value);
        }
        else if(!self.$options.disallowToggle) {
          // toogle element active status
          isActive(value) ? deactivateItem(value) : activateItem(value);
        } else {
          activateItem(value);
        }

        self.$viewChangeListeners.forEach(function(fn) {
          fn();
        });
      };

      self.$activeIndexes = function() {
        return self.$options.allowMultiple ? self.$targets.$active :
          self.$targets.$active.length === 1 ? self.$targets.$active[0] : -1;
      };

      function fixActiveItemIndexes(index) {
        // item with index was removed, so we
        // need to adjust other items index values
        var activeIndexes = self.$targets.$active;
        for(var i = 0; i < activeIndexes.length; i++) {
          if (index < activeIndexes[i]) {
            activeIndexes[i] = activeIndexes[i] - 1;
          }

          // the last item is active, so we need to
          // adjust its index
          if (activeIndexes[i] === self.$targets.length) {
            activeIndexes[i] = self.$targets.length - 1;
          }
        }
      }

      function isActive(value) {
        var activeItems = self.$targets.$active;
        return activeItems.indexOf(value) === -1 ? false : true;
      }

      function deactivateItem(value) {
        var index = self.$targets.$active.indexOf(value);
        if (index !== -1) {
          self.$targets.$active.splice(index, 1);
        }
      }

      function activateItem(value) {
        if (!self.$options.allowMultiple) {
          // remove current selected item
          self.$targets.$active.splice(0, 1);
        }

        if (self.$targets.$active.indexOf(value) === -1) {
          self.$targets.$active.push(value);
        }
      }

    };

    this.$get = function() {
      var $collapse = {};
      $collapse.defaults = defaults;
      $collapse.controller = controller;
      return $collapse;
    };

  })

  .directive('bsCollapse', ["$window", "$animate", "$collapse", function($window, $animate, $collapse) {

    var defaults = $collapse.defaults;

    return {
      require: ['?ngModel', 'bsCollapse'],
      controller: ['$scope', '$element', '$attrs', $collapse.controller],
      link: function postLink(scope, element, attrs, controllers) {

        var ngModelCtrl = controllers[0];
        var bsCollapseCtrl = controllers[1];

        if(ngModelCtrl) {

          // Update the modelValue following
          bsCollapseCtrl.$viewChangeListeners.push(function() {
            ngModelCtrl.$setViewValue(bsCollapseCtrl.$activeIndexes());
          });

          // modelValue -> $formatters -> viewValue
          ngModelCtrl.$formatters.push(function(modelValue) {
            // console.warn('$formatter("%s"): modelValue=%o (%o)', element.attr('ng-model'), modelValue, typeof modelValue);
            if (angular.isArray(modelValue)) {
              // model value is an array, so just replace
              // the active items directly
              bsCollapseCtrl.$setActive(modelValue);
            }
            else {
              var activeIndexes = bsCollapseCtrl.$activeIndexes();

              if (angular.isArray(activeIndexes)) {
                // we have an array of selected indexes
                if (activeIndexes.indexOf(modelValue * 1) === -1) {
                  // item with modelValue index is not active
                  bsCollapseCtrl.$setActive(modelValue * 1);
                }
              }
              else if (activeIndexes !== modelValue * 1) {
                bsCollapseCtrl.$setActive(modelValue * 1);
              }
            }
            return modelValue;
          });

        }

      }
    };

  }])

  .directive('bsCollapseToggle', function() {

    return {
      require: ['^?ngModel', '^bsCollapse'],
      link: function postLink(scope, element, attrs, controllers) {

        var ngModelCtrl = controllers[0];
        var bsCollapseCtrl = controllers[1];

        // Add base attr
        element.attr('data-toggle', 'collapse');

        // Push pane to parent bsCollapse controller
        bsCollapseCtrl.$registerToggle(element);

        // remove toggle from collapse controller when toggle is destroyed
        scope.$on('$destroy', function() {
          bsCollapseCtrl.$unregisterToggle(element);
        });

        element.on('click', function() {
          var index = attrs.bsCollapseToggle || bsCollapseCtrl.$toggles.indexOf(element);
          bsCollapseCtrl.$setActive(index * 1);
          scope.$apply();
        });

      }
    };

  })

  .directive('bsCollapseTarget', ["$animate", function($animate) {

    return {
      require: ['^?ngModel', '^bsCollapse'],
      // scope: true,
      link: function postLink(scope, element, attrs, controllers) {

        var ngModelCtrl = controllers[0];
        var bsCollapseCtrl = controllers[1];

        // Add base class
        element.addClass('collapse');

        // Add animation class
        if(bsCollapseCtrl.$options.animation) {
          element.addClass(bsCollapseCtrl.$options.animation);
        }

        // Push pane to parent bsCollapse controller
        bsCollapseCtrl.$registerTarget(element);

        // remove pane target from collapse controller when target is destroyed
        scope.$on('$destroy', function() {
          bsCollapseCtrl.$unregisterTarget(element);
        });

        function render() {
          var index = bsCollapseCtrl.$targets.indexOf(element);
          var active = bsCollapseCtrl.$activeIndexes();
          var action = 'removeClass';
          if (angular.isArray(active)) {
            if (active.indexOf(index) !== -1) {
              action = 'addClass';
            }
          }
          else if (index === active) {
            action = 'addClass';
          }

          $animate[action](element, bsCollapseCtrl.$options.activeClass);
        }

        bsCollapseCtrl.$viewChangeListeners.push(function() {
          render();
        });
        render();

      }
    };

  }]);

// Source: datepicker.js
angular.module('mgcrea.ngStrap.datepicker', [
  'mgcrea.ngStrap.helpers.dateParser',
  'mgcrea.ngStrap.helpers.dateFormatter',
  'mgcrea.ngStrap.tooltip'])

  .provider('$datepicker', function() {

    var defaults = this.defaults = {
      animation: 'am-fade',
      prefixClass: 'datepicker',
      placement: 'bottom-left',
      template: 'datepicker/datepicker.tpl.html',
      trigger: 'focus',
      container: false,
      keyboard: true,
      html: false,
      delay: 0,
      // lang: $locale.id,
      useNative: false,
      dateType: 'date',
      dateFormat: 'shortDate',
      modelDateFormat: null,
      dayFormat: 'dd',
      monthFormat: 'MMM',
      yearFormat: 'yyyy',
      monthTitleFormat: 'MMMM yyyy',
      yearTitleFormat: 'yyyy',
      strictFormat: false,
      autoclose: false,
      minDate: -Infinity,
      maxDate: +Infinity,
      startView: 0,
      minView: 0,
      startWeek: 0,
      daysOfWeekDisabled: '',
      iconLeft: 'glyphicon glyphicon-chevron-left',
      iconRight: 'glyphicon glyphicon-chevron-right'
    };

    this.$get = ["$window", "$document", "$rootScope", "$sce", "$dateFormatter", "datepickerViews", "$tooltip", "$timeout", function($window, $document, $rootScope, $sce, $dateFormatter, datepickerViews, $tooltip, $timeout) {

      var bodyEl = angular.element($window.document.body);
      var isNative = /(ip(a|o)d|iphone|android)/ig.test($window.navigator.userAgent);
      var isTouch = ('createTouch' in $window.document) && isNative;
      if(!defaults.lang) defaults.lang = $dateFormatter.getDefaultLocale();

      function DatepickerFactory(element, controller, config) {

        var $datepicker = $tooltip(element, angular.extend({}, defaults, config));
        var parentScope = config.scope;
        var options = $datepicker.$options;
        var scope = $datepicker.$scope;
        if(options.startView) options.startView -= options.minView;

        // View vars

        var pickerViews = datepickerViews($datepicker);
        $datepicker.$views = pickerViews.views;
        var viewDate = pickerViews.viewDate;
        scope.$mode = options.startView;
        scope.$iconLeft = options.iconLeft;
        scope.$iconRight = options.iconRight;
        var $picker = $datepicker.$views[scope.$mode];

        // Scope methods

        scope.$select = function(date) {
          $datepicker.select(date);
        };
        scope.$selectPane = function(value) {
          $datepicker.$selectPane(value);
        };
        scope.$toggleMode = function() {
          $datepicker.setMode((scope.$mode + 1) % $datepicker.$views.length);
        };

        // Public methods

        $datepicker.update = function(date) {
          // console.warn('$datepicker.update() newValue=%o', date);
          if(angular.isDate(date) && !isNaN(date.getTime())) {
            $datepicker.$date = date;
            $picker.update.call($picker, date);
          }
          // Build only if pristine
          $datepicker.$build(true);
        };

        $datepicker.updateDisabledDates = function(dateRanges) {
          options.disabledDateRanges = dateRanges;
          for(var i = 0, l = scope.rows.length; i < l; i++) {
            angular.forEach(scope.rows[i], $datepicker.$setDisabledEl);
          }
        };

        $datepicker.select = function(date, keep) {
          // console.warn('$datepicker.select', date, scope.$mode);
          if(!angular.isDate(controller.$dateValue)) controller.$dateValue = new Date(date);
          if(!scope.$mode || keep) {
            controller.$setViewValue(angular.copy(date));
            controller.$render();
            if(options.autoclose && !keep) {
              $timeout(function() { $datepicker.hide(true); });
            }
          } else {
            angular.extend(viewDate, {year: date.getFullYear(), month: date.getMonth(), date: date.getDate()});
            $datepicker.setMode(scope.$mode - 1);
            $datepicker.$build();
          }
        };

        $datepicker.setMode = function(mode) {
          // console.warn('$datepicker.setMode', mode);
          scope.$mode = mode;
          $picker = $datepicker.$views[scope.$mode];
          $datepicker.$build();
        };

        // Protected methods

        $datepicker.$build = function(pristine) {
          // console.warn('$datepicker.$build() viewDate=%o', viewDate);
          if(pristine === true && $picker.built) return;
          if(pristine === false && !$picker.built) return;
          $picker.build.call($picker);
        };

        $datepicker.$updateSelected = function() {
          for(var i = 0, l = scope.rows.length; i < l; i++) {
            angular.forEach(scope.rows[i], updateSelected);
          }
        };

        $datepicker.$isSelected = function(date) {
          return $picker.isSelected(date);
        };

        $datepicker.$setDisabledEl = function(el) {
          el.disabled = $picker.isDisabled(el.date);
        };

        $datepicker.$selectPane = function(value) {
          var steps = $picker.steps;
          // set targetDate to first day of month to avoid problems with
          // date values rollover. This assumes the viewDate does not
          // depend on the day of the month
          var targetDate = new Date(Date.UTC(viewDate.year + ((steps.year || 0) * value), viewDate.month + ((steps.month || 0) * value), 1));
          angular.extend(viewDate, {year: targetDate.getUTCFullYear(), month: targetDate.getUTCMonth(), date: targetDate.getUTCDate()});
          $datepicker.$build();
        };

        $datepicker.$onMouseDown = function(evt) {
          // Prevent blur on mousedown on .dropdown-menu
          evt.preventDefault();
          evt.stopPropagation();
          // Emulate click for mobile devices
          if(isTouch) {
            var targetEl = angular.element(evt.target);
            if(targetEl[0].nodeName.toLowerCase() !== 'button') {
              targetEl = targetEl.parent();
            }
            targetEl.triggerHandler('click');
          }
        };

        $datepicker.$onKeyDown = function(evt) {
          if (!/(38|37|39|40|13)/.test(evt.keyCode) || evt.shiftKey || evt.altKey) return;
          evt.preventDefault();
          evt.stopPropagation();

          if(evt.keyCode === 13) {
            if(!scope.$mode) {
              return $datepicker.hide(true);
            } else {
              return scope.$apply(function() { $datepicker.setMode(scope.$mode - 1); });
            }
          }

          // Navigate with keyboard
          $picker.onKeyDown(evt);
          parentScope.$digest();
        };

        // Private

        function updateSelected(el) {
          el.selected = $datepicker.$isSelected(el.date);
        }

        function focusElement() {
          element[0].focus();
        }

        // Overrides

        var _init = $datepicker.init;
        $datepicker.init = function() {
          if(isNative && options.useNative) {
            element.prop('type', 'date');
            element.css('-webkit-appearance', 'textfield');
            return;
          } else if(isTouch) {
            element.prop('type', 'text');
            element.attr('readonly', 'true');
            element.on('click', focusElement);
          }
          _init();
        };

        var _destroy = $datepicker.destroy;
        $datepicker.destroy = function() {
          if(isNative && options.useNative) {
            element.off('click', focusElement);
          }
          _destroy();
        };

        var _show = $datepicker.show;
        $datepicker.show = function() {
          _show();
          // use timeout to hookup the events to prevent
          // event bubbling from being processed imediately.
          $timeout(function() {
            // if $datepicker is no longer showing, don't setup events
            if(!$datepicker.$isShown) return;
            $datepicker.$element.on(isTouch ? 'touchstart' : 'mousedown', $datepicker.$onMouseDown);
            if(options.keyboard) {
              element.on('keydown', $datepicker.$onKeyDown);
            }
          }, 0, false);
        };

        var _hide = $datepicker.hide;
        $datepicker.hide = function(blur) {
          if(!$datepicker.$isShown) return;
          $datepicker.$element.off(isTouch ? 'touchstart' : 'mousedown', $datepicker.$onMouseDown);
          if(options.keyboard) {
            element.off('keydown', $datepicker.$onKeyDown);
          }
          _hide(blur);
        };

        return $datepicker;

      }

      DatepickerFactory.defaults = defaults;
      return DatepickerFactory;

    }];

  })

  .directive('bsDatepicker', ["$window", "$parse", "$q", "$dateFormatter", "$dateParser", "$datepicker", function($window, $parse, $q, $dateFormatter, $dateParser, $datepicker) {

    var defaults = $datepicker.defaults;
    var isNative = /(ip(a|o)d|iphone|android)/ig.test($window.navigator.userAgent);

    return {
      restrict: 'EAC',
      require: 'ngModel',
      link: function postLink(scope, element, attr, controller) {

        // Directive options
        var options = {scope: scope, controller: controller};
        angular.forEach(['placement', 'container', 'delay', 'trigger', 'keyboard', 'html', 'animation', 'template', 'autoclose', 'dateType', 'dateFormat', 'modelDateFormat', 'dayFormat', 'strictFormat', 'startWeek', 'startDate', 'useNative', 'lang', 'startView', 'minView', 'iconLeft', 'iconRight', 'daysOfWeekDisabled', 'id'], function(key) {
          if(angular.isDefined(attr[key])) options[key] = attr[key];
        });

        // Visibility binding support
        attr.bsShow && scope.$watch(attr.bsShow, function(newValue, oldValue) {
          if(!datepicker || !angular.isDefined(newValue)) return;
          if(angular.isString(newValue)) newValue = !!newValue.match(/true|,?(datepicker),?/i);
          newValue === true ? datepicker.show() : datepicker.hide();
        });

        // Initialize datepicker
        var datepicker = $datepicker(element, controller, options);
        options = datepicker.$options;
        // Set expected iOS format
        if(isNative && options.useNative) options.dateFormat = 'yyyy-MM-dd';

        var lang = options.lang;

        var formatDate = function(date, format) {
          return $dateFormatter.formatDate(date, format, lang);
        };

        var dateParser = $dateParser({format: options.dateFormat, lang: lang, strict: options.strictFormat});

        // Observe attributes for changes
        angular.forEach(['minDate', 'maxDate'], function(key) {
          // console.warn('attr.$observe(%s)', key, attr[key]);
          angular.isDefined(attr[key]) && attr.$observe(key, function(newValue) {
            // console.warn('attr.$observe(%s)=%o', key, newValue);
            datepicker.$options[key] = dateParser.getDateForAttribute(key, newValue);
            // Build only if dirty
            !isNaN(datepicker.$options[key]) && datepicker.$build(false);
            validateAgainstMinMaxDate(controller.$dateValue);
          });
        });

        // Watch model for changes
        scope.$watch(attr.ngModel, function(newValue, oldValue) {
          datepicker.update(controller.$dateValue);
        }, true);

        // Normalize undefined/null/empty array,
        // so that we don't treat changing from undefined->null as a change.
        function normalizeDateRanges(ranges) {
          if (!ranges || !ranges.length) return null;
          return ranges;
        }

        if (angular.isDefined(attr.disabledDates)) {
          scope.$watch(attr.disabledDates, function(disabledRanges, previousValue) {
            disabledRanges = normalizeDateRanges(disabledRanges);
            previousValue = normalizeDateRanges(previousValue);

            if (disabledRanges) {
              datepicker.updateDisabledDates(disabledRanges);
            }
          });
        }

        function validateAgainstMinMaxDate(parsedDate) {
          if (!angular.isDate(parsedDate)) return;
          var isMinValid = isNaN(datepicker.$options.minDate) || parsedDate.getTime() >= datepicker.$options.minDate;
          var isMaxValid = isNaN(datepicker.$options.maxDate) || parsedDate.getTime() <= datepicker.$options.maxDate;
          var isValid = isMinValid && isMaxValid;
          controller.$setValidity('date', isValid);
          controller.$setValidity('min', isMinValid);
          controller.$setValidity('max', isMaxValid);
          // Only update the model when we have a valid date
          if(isValid) controller.$dateValue = parsedDate;
        }

        // viewValue -> $parsers -> modelValue
        controller.$parsers.unshift(function(viewValue) {
          // console.warn('$parser("%s"): viewValue=%o', element.attr('ng-model'), viewValue);
          // Null values should correctly reset the model value & validity
          if(!viewValue) {
            controller.$setValidity('date', true);
            // BREAKING CHANGE:
            // return null (not undefined) when input value is empty, so angularjs 1.3
            // ngModelController can go ahead and run validators, like ngRequired
            return null;
          }
          var parsedDate = dateParser.parse(viewValue, controller.$dateValue);
          if(!parsedDate || isNaN(parsedDate.getTime())) {
            controller.$setValidity('date', false);
            // return undefined, causes ngModelController to
            // invalidate model value
            return;
          } else {
            validateAgainstMinMaxDate(parsedDate);
          }
          if(options.dateType === 'string') {
            return formatDate(parsedDate, options.modelDateFormat || options.dateFormat);
          } else if(options.dateType === 'number') {
            return controller.$dateValue.getTime();
          } else if(options.dateType === 'unix') {
            return controller.$dateValue.getTime() / 1000;
          } else if(options.dateType === 'iso') {
            return controller.$dateValue.toISOString();
          } else {
            return new Date(controller.$dateValue);
          }
        });

        // modelValue -> $formatters -> viewValue
        controller.$formatters.push(function(modelValue) {
          // console.warn('$formatter("%s"): modelValue=%o (%o)', element.attr('ng-model'), modelValue, typeof modelValue);
          var date;
          if(angular.isUndefined(modelValue) || modelValue === null) {
            date = NaN;
          } else if(angular.isDate(modelValue)) {
            date = modelValue;
          } else if(options.dateType === 'string') {
            date = dateParser.parse(modelValue, null, options.modelDateFormat);
          } else if(options.dateType === 'unix') {
            date = new Date(modelValue * 1000);
          } else {
            date = new Date(modelValue);
          }
          // Setup default value?
          // if(isNaN(date.getTime())) {
          //   var today = new Date();
          //   date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
          // }
          controller.$dateValue = date;
          return getDateFormattedString();
        });

        // viewValue -> element
        controller.$render = function() {
          // console.warn('$render("%s"): viewValue=%o', element.attr('ng-model'), controller.$viewValue);
          element.val(getDateFormattedString());
        };

        function getDateFormattedString() {
          return !controller.$dateValue || isNaN(controller.$dateValue.getTime()) ? '' : formatDate(controller.$dateValue, options.dateFormat);
        }

        // Garbage collection
        scope.$on('$destroy', function() {
          if(datepicker) datepicker.destroy();
          options = null;
          datepicker = null;
        });

      }
    };

  }])

  .provider('datepickerViews', function() {

    var defaults = this.defaults = {
      dayFormat: 'dd',
      daySplit: 7
    };

    // Split array into smaller arrays
    function split(arr, size) {
      var arrays = [];
      while(arr.length > 0) {
        arrays.push(arr.splice(0, size));
      }
      return arrays;
    }

    // Modulus operator
    function mod(n, m) {
      return ((n % m) + m) % m;
    }

    this.$get = ["$dateFormatter", "$dateParser", "$sce", function($dateFormatter, $dateParser, $sce) {

      return function(picker) {

        var scope = picker.$scope;
        var options = picker.$options;

        var lang = options.lang;
        var formatDate = function(date, format) {
          return $dateFormatter.formatDate(date, format, lang);
        };
        var dateParser = $dateParser({format: options.dateFormat, lang: lang, strict: options.strictFormat});

        var weekDaysMin = $dateFormatter.weekdaysShort(lang);
        var weekDaysLabels = weekDaysMin.slice(options.startWeek).concat(weekDaysMin.slice(0, options.startWeek));
        var weekDaysLabelsHtml = $sce.trustAsHtml('<th class="dow text-center">' + weekDaysLabels.join('</th><th class="dow text-center">') + '</th>');

        var startDate = picker.$date || (options.startDate ? dateParser.getDateForAttribute('startDate', options.startDate) : new Date());
        var viewDate = {year: startDate.getFullYear(), month: startDate.getMonth(), date: startDate.getDate()};
        var timezoneOffset = startDate.getTimezoneOffset() * 6e4;

        var views = [{
            format: options.dayFormat,
            split: 7,
            steps: { month: 1 },
            update: function(date, force) {
              if(!this.built || force || date.getFullYear() !== viewDate.year || date.getMonth() !== viewDate.month) {
                angular.extend(viewDate, {year: picker.$date.getFullYear(), month: picker.$date.getMonth(), date: picker.$date.getDate()});
                picker.$build();
              } else if(date.getDate() !== viewDate.date) {
                viewDate.date = picker.$date.getDate();
                picker.$updateSelected();
              }
            },
            build: function() {
              var firstDayOfMonth = new Date(viewDate.year, viewDate.month, 1), firstDayOfMonthOffset = firstDayOfMonth.getTimezoneOffset();
              var firstDate = new Date(+firstDayOfMonth - mod(firstDayOfMonth.getDay() - options.startWeek, 7) * 864e5), firstDateOffset = firstDate.getTimezoneOffset();
              var today = new Date().toDateString();
              // Handle daylight time switch
              if(firstDateOffset !== firstDayOfMonthOffset) firstDate = new Date(+firstDate + (firstDateOffset - firstDayOfMonthOffset) * 60e3);
              var days = [], day;
              for(var i = 0; i < 42; i++) { // < 7 * 6
                day = dateParser.daylightSavingAdjust(new Date(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate() + i));
                days.push({date: day, isToday: day.toDateString() === today, label: formatDate(day, this.format), selected: picker.$date && this.isSelected(day), muted: day.getMonth() !== viewDate.month, disabled: this.isDisabled(day)});
              }
              scope.title = formatDate(firstDayOfMonth, options.monthTitleFormat);
              scope.showLabels = true;
              scope.labels = weekDaysLabelsHtml;
              scope.rows = split(days, this.split);
              this.built = true;
            },
            isSelected: function(date) {
              return picker.$date && date.getFullYear() === picker.$date.getFullYear() && date.getMonth() === picker.$date.getMonth() && date.getDate() === picker.$date.getDate();
            },
            isDisabled: function(date) {
              var time = date.getTime();

              // Disabled because of min/max date.
              if (time < options.minDate || time > options.maxDate) return true;

              // Disabled due to being a disabled day of the week
              if (options.daysOfWeekDisabled.indexOf(date.getDay()) !== -1) return true;

              // Disabled because of disabled date range.
              if (options.disabledDateRanges) {
                for (var i = 0; i < options.disabledDateRanges.length; i++) {
                  if (time >= options.disabledDateRanges[i].start && time <= options.disabledDateRanges[i].end) {
                    return true;
                  }
                }
              }

              return false;
            },
            onKeyDown: function(evt) {
              if (!picker.$date) {
                return;
              }
              var actualTime = picker.$date.getTime();
              var newDate;

              if(evt.keyCode === 37) newDate = new Date(actualTime - 1 * 864e5);
              else if(evt.keyCode === 38) newDate = new Date(actualTime - 7 * 864e5);
              else if(evt.keyCode === 39) newDate = new Date(actualTime + 1 * 864e5);
              else if(evt.keyCode === 40) newDate = new Date(actualTime + 7 * 864e5);

              if (!this.isDisabled(newDate)) picker.select(newDate, true);
            }
          }, {
            name: 'month',
            format: options.monthFormat,
            split: 4,
            steps: { year: 1 },
            update: function(date, force) {
              if(!this.built || date.getFullYear() !== viewDate.year) {
                angular.extend(viewDate, {year: picker.$date.getFullYear(), month: picker.$date.getMonth(), date: picker.$date.getDate()});
                picker.$build();
              } else if(date.getMonth() !== viewDate.month) {
                angular.extend(viewDate, {month: picker.$date.getMonth(), date: picker.$date.getDate()});
                picker.$updateSelected();
              }
            },
            build: function() {
              var firstMonth = new Date(viewDate.year, 0, 1);
              var months = [], month;
              for (var i = 0; i < 12; i++) {
                month = new Date(viewDate.year, i, 1);
                months.push({date: month, label: formatDate(month, this.format), selected: picker.$isSelected(month), disabled: this.isDisabled(month)});
              }
              scope.title = formatDate(month, options.yearTitleFormat);
              scope.showLabels = false;
              scope.rows = split(months, this.split);
              this.built = true;
            },
            isSelected: function(date) {
              return picker.$date && date.getFullYear() === picker.$date.getFullYear() && date.getMonth() === picker.$date.getMonth();
            },
            isDisabled: function(date) {
              var lastDate = +new Date(date.getFullYear(), date.getMonth() + 1, 0);
              return lastDate < options.minDate || date.getTime() > options.maxDate;
            },
            onKeyDown: function(evt) {
              if (!picker.$date) {
                return;
              }
              var actualMonth = picker.$date.getMonth();
              var newDate = new Date(picker.$date);

              if(evt.keyCode === 37) newDate.setMonth(actualMonth - 1);
              else if(evt.keyCode === 38) newDate.setMonth(actualMonth - 4);
              else if(evt.keyCode === 39) newDate.setMonth(actualMonth + 1);
              else if(evt.keyCode === 40) newDate.setMonth(actualMonth + 4);

              if (!this.isDisabled(newDate)) picker.select(newDate, true);
            }
          }, {
            name: 'year',
            format: options.yearFormat,
            split: 4,
            steps: { year: 12 },
            update: function(date, force) {
              if(!this.built || force || parseInt(date.getFullYear()/20, 10) !== parseInt(viewDate.year/20, 10)) {
                angular.extend(viewDate, {year: picker.$date.getFullYear(), month: picker.$date.getMonth(), date: picker.$date.getDate()});
                picker.$build();
              } else if(date.getFullYear() !== viewDate.year) {
                angular.extend(viewDate, {year: picker.$date.getFullYear(), month: picker.$date.getMonth(), date: picker.$date.getDate()});
                picker.$updateSelected();
              }
            },
            build: function() {
              var firstYear = viewDate.year - viewDate.year % (this.split * 3);
              var years = [], year;
              for (var i = 0; i < 12; i++) {
                year = new Date(firstYear + i, 0, 1);
                years.push({date: year, label: formatDate(year, this.format), selected: picker.$isSelected(year), disabled: this.isDisabled(year)});
              }
              scope.title = years[0].label + '-' + years[years.length - 1].label;
              scope.showLabels = false;
              scope.rows = split(years, this.split);
              this.built = true;
            },
            isSelected: function(date) {
              return picker.$date && date.getFullYear() === picker.$date.getFullYear();
            },
            isDisabled: function(date) {
              var lastDate = +new Date(date.getFullYear() + 1, 0, 0);
              return lastDate < options.minDate || date.getTime() > options.maxDate;
            },
            onKeyDown: function(evt) {
              if (!picker.$date) {
                return;
              }
              var actualYear = picker.$date.getFullYear(),
                  newDate = new Date(picker.$date);

              if(evt.keyCode === 37) newDate.setYear(actualYear - 1);
              else if(evt.keyCode === 38) newDate.setYear(actualYear - 4);
              else if(evt.keyCode === 39) newDate.setYear(actualYear + 1);
              else if(evt.keyCode === 40) newDate.setYear(actualYear + 4);

              if (!this.isDisabled(newDate)) picker.select(newDate, true);
            }
          }];

        return {
          views: options.minView ? Array.prototype.slice.call(views, options.minView) : views,
          viewDate: viewDate
        };

      };

    }];

  });

// Source: dropdown.js
angular.module('mgcrea.ngStrap.dropdown', ['mgcrea.ngStrap.tooltip'])

  .provider('$dropdown', function() {

    var defaults = this.defaults = {
      animation: 'am-fade',
      prefixClass: 'dropdown',
      placement: 'bottom-left',
      template: 'dropdown/dropdown.tpl.html',
      trigger: 'click',
      container: false,
      keyboard: true,
      html: false,
      delay: 0
    };

    this.$get = ["$window", "$rootScope", "$tooltip", "$timeout", function($window, $rootScope, $tooltip, $timeout) {

      var bodyEl = angular.element($window.document.body);
      var matchesSelector = Element.prototype.matchesSelector || Element.prototype.webkitMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector;

      function DropdownFactory(element, config) {

        var $dropdown = {};

        // Common vars
        var options = angular.extend({}, defaults, config);
        var scope = $dropdown.$scope = options.scope && options.scope.$new() || $rootScope.$new();

        $dropdown = $tooltip(element, options);
        var parentEl = element.parent();

        // Protected methods

        $dropdown.$onKeyDown = function(evt) {
          if (!/(38|40)/.test(evt.keyCode)) return;
          evt.preventDefault();
          evt.stopPropagation();

          // Retrieve focused index
          var items = angular.element($dropdown.$element[0].querySelectorAll('li:not(.divider) a'));
          if(!items.length) return;
          var index;
          angular.forEach(items, function(el, i) {
            if(matchesSelector && matchesSelector.call(el, ':focus')) index = i;
          });

          // Navigate with keyboard
          if(evt.keyCode === 38 && index > 0) index--;
          else if(evt.keyCode === 40 && index < items.length - 1) index++;
          else if(angular.isUndefined(index)) index = 0;
          items.eq(index)[0].focus();

        };

        // Overrides

        var show = $dropdown.show;
        $dropdown.show = function() {
          show();
          // use timeout to hookup the events to prevent
          // event bubbling from being processed imediately.
          $timeout(function() {
            options.keyboard && $dropdown.$element.on('keydown', $dropdown.$onKeyDown);
            bodyEl.on('click', onBodyClick);
          }, 0, false);
          parentEl.hasClass('dropdown') && parentEl.addClass('open');
        };

        var hide = $dropdown.hide;
        $dropdown.hide = function() {
          if(!$dropdown.$isShown) return;
          options.keyboard && $dropdown.$element.off('keydown', $dropdown.$onKeyDown);
          bodyEl.off('click', onBodyClick);
          parentEl.hasClass('dropdown') && parentEl.removeClass('open');
          hide();
        };

        var destroy = $dropdown.destroy;
        $dropdown.destroy = function() {
          bodyEl.off('click', onBodyClick);
          destroy();
        };

        // Private functions

        function onBodyClick(evt) {
          if(evt.target === element[0]) return;
          return evt.target !== element[0] && $dropdown.hide();
        }

        return $dropdown;

      }

      return DropdownFactory;

    }];

  })

  .directive('bsDropdown', ["$window", "$sce", "$dropdown", function($window, $sce, $dropdown) {

    return {
      restrict: 'EAC',
      scope: true,
      link: function postLink(scope, element, attr, transclusion) {

        // Directive options
        var options = {scope: scope};
        angular.forEach(['placement', 'container', 'delay', 'trigger', 'keyboard', 'html', 'animation', 'template', 'id'], function(key) {
          if(angular.isDefined(attr[key])) options[key] = attr[key];
        });

        // Support scope as an object
        attr.bsDropdown && scope.$watch(attr.bsDropdown, function(newValue, oldValue) {
          scope.content = newValue;
        }, true);

        // Visibility binding support
        attr.bsShow && scope.$watch(attr.bsShow, function(newValue, oldValue) {
          if(!dropdown || !angular.isDefined(newValue)) return;
          if(angular.isString(newValue)) newValue = !!newValue.match(/true|,?(dropdown),?/i);
          newValue === true ? dropdown.show() : dropdown.hide();
        });

        // Initialize dropdown
        var dropdown = $dropdown(element, options);

        // Garbage collection
        scope.$on('$destroy', function() {
          if (dropdown) dropdown.destroy();
          options = null;
          dropdown = null;
        });

      }
    };

  }]);

// Source: date-formatter.js
angular.module('mgcrea.ngStrap.helpers.dateFormatter', [])

  .service('$dateFormatter', ["$locale", "dateFilter", function($locale, dateFilter) {

    // The unused `lang` arguments are on purpose. The default implementation does not
    // use them and it always uses the locale loaded into the `$locale` service.
    // Custom implementations might use it, thus allowing different directives to
    // have different languages.

    this.getDefaultLocale = function() {
      return $locale.id;
    };

    // Format is either a data format name, e.g. "shortTime" or "fullDate", or a date format
    // Return either the corresponding date format or the given date format.
    this.getDatetimeFormat = function(format, lang) {
      return $locale.DATETIME_FORMATS[format] || format;
    };

    this.weekdaysShort = function(lang) {
      return $locale.DATETIME_FORMATS.SHORTDAY;
    };

    function splitTimeFormat(format) {
      return /(h+)([:\.])?(m+)[ ]?(a?)/i.exec(format).slice(1);
    }

    // h:mm a => h
    this.hoursFormat = function(timeFormat) {
      return splitTimeFormat(timeFormat)[0];
    };

    // h:mm a => mm
    this.minutesFormat = function(timeFormat) {
      return splitTimeFormat(timeFormat)[2];
    };

    // h:mm a => :
    this.timeSeparator = function(timeFormat) {
      return splitTimeFormat(timeFormat)[1];
    };

    // h:mm a => true, H.mm => false
    this.showAM = function(timeFormat) {
      return !!splitTimeFormat(timeFormat)[3];
    };

    this.formatDate = function(date, format, lang){
      return dateFilter(date, format);
    };

  }]);

// Source: date-parser.js
angular.module('mgcrea.ngStrap.helpers.dateParser', [])

.provider('$dateParser', ["$localeProvider", function($localeProvider) {

  // define a custom ParseDate object to use instead of native Date
  // to avoid date values wrapping when setting date component values
  function ParseDate() {
    this.year = 1970;
    this.month = 0;
    this.day = 1;
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
    this.milliseconds = 0;
  }

  ParseDate.prototype.setMilliseconds = function(value) { this.milliseconds = value; };
  ParseDate.prototype.setSeconds = function(value) { this.seconds = value; };
  ParseDate.prototype.setMinutes = function(value) { this.minutes = value; };
  ParseDate.prototype.setHours = function(value) { this.hours = value; };
  ParseDate.prototype.getHours = function() { return this.hours; };
  ParseDate.prototype.setDate = function(value) { this.day = value; };
  ParseDate.prototype.setMonth = function(value) { this.month = value; };
  ParseDate.prototype.setFullYear = function(value) { this.year = value; };
  ParseDate.prototype.fromDate = function(value) {
    this.year = value.getFullYear();
    this.month = value.getMonth();
    this.day = value.getDate();
    this.hours = value.getHours();
    this.minutes = value.getMinutes();
    this.seconds = value.getSeconds();
    this.milliseconds = value.getMilliseconds();
    return this;
  };

  ParseDate.prototype.toDate = function() {
    return new Date(this.year, this.month, this.day, this.hours, this.minutes, this.seconds, this.milliseconds);
  };

  var proto = ParseDate.prototype;

  function noop() {
  }

  function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  function indexOfCaseInsensitive(array, value) {
    var len = array.length, str=value.toString().toLowerCase();
    for (var i=0; i<len; i++) {
      if (array[i].toLowerCase() === str) { return i; }
    }
    return -1; // Return -1 per the "Array.indexOf()" method.
  }

  var defaults = this.defaults = {
    format: 'shortDate',
    strict: false
  };

  this.$get = ["$locale", "dateFilter", function($locale, dateFilter) {

    var DateParserFactory = function(config) {

      var options = angular.extend({}, defaults, config);

      var $dateParser = {};

      var regExpMap = {
        'sss'   : '[0-9]{3}',
        'ss'    : '[0-5][0-9]',
        's'     : options.strict ? '[1-5]?[0-9]' : '[0-9]|[0-5][0-9]',
        'mm'    : '[0-5][0-9]',
        'm'     : options.strict ? '[1-5]?[0-9]' : '[0-9]|[0-5][0-9]',
        'HH'    : '[01][0-9]|2[0-3]',
        'H'     : options.strict ? '1?[0-9]|2[0-3]' : '[01]?[0-9]|2[0-3]',
        'hh'    : '[0][1-9]|[1][012]',
        'h'     : options.strict ? '[1-9]|1[012]' : '0?[1-9]|1[012]',
        'a'     : 'AM|PM',
        'EEEE'  : $locale.DATETIME_FORMATS.DAY.join('|'),
        'EEE'   : $locale.DATETIME_FORMATS.SHORTDAY.join('|'),
        'dd'    : '0[1-9]|[12][0-9]|3[01]',
        'd'     : options.strict ? '[1-9]|[1-2][0-9]|3[01]' : '0?[1-9]|[1-2][0-9]|3[01]',
        'MMMM'  : $locale.DATETIME_FORMATS.MONTH.join('|'),
        'MMM'   : $locale.DATETIME_FORMATS.SHORTMONTH.join('|'),
        'MM'    : '0[1-9]|1[012]',
        'M'     : options.strict ? '[1-9]|1[012]' : '0?[1-9]|1[012]',
        'yyyy'  : '[1]{1}[0-9]{3}|[2]{1}[0-9]{3}',
        'yy'    : '[0-9]{2}',
        'y'     : options.strict ? '-?(0|[1-9][0-9]{0,3})' : '-?0*[0-9]{1,4}',
      };

      var setFnMap = {
        'sss'   : proto.setMilliseconds,
        'ss'    : proto.setSeconds,
        's'     : proto.setSeconds,
        'mm'    : proto.setMinutes,
        'm'     : proto.setMinutes,
        'HH'    : proto.setHours,
        'H'     : proto.setHours,
        'hh'    : proto.setHours,
        'h'     : proto.setHours,
        'EEEE'  : noop,
        'EEE'   : noop,
        'dd'    : proto.setDate,
        'd'     : proto.setDate,
        'a'     : function(value) { var hours = this.getHours() % 12; return this.setHours(value.match(/pm/i) ? hours + 12 : hours); },
        'MMMM'  : function(value) { return this.setMonth(indexOfCaseInsensitive($locale.DATETIME_FORMATS.MONTH, value)); },
        'MMM'   : function(value) { return this.setMonth(indexOfCaseInsensitive($locale.DATETIME_FORMATS.SHORTMONTH, value)); },
        'MM'    : function(value) { return this.setMonth(1 * value - 1); },
        'M'     : function(value) { return this.setMonth(1 * value - 1); },
        'yyyy'  : proto.setFullYear,
        'yy'    : function(value) { return this.setFullYear(2000 + 1 * value); },
        'y'     : proto.setFullYear
      };

      var regex, setMap;

      $dateParser.init = function() {
        $dateParser.$format = $locale.DATETIME_FORMATS[options.format] || options.format;
        regex = regExpForFormat($dateParser.$format);
        setMap = setMapForFormat($dateParser.$format);
      };

      $dateParser.isValid = function(date) {
        if(angular.isDate(date)) return !isNaN(date.getTime());
        return regex.test(date);
      };

      $dateParser.parse = function(value, baseDate, format) {
        // check for date format special names
        if(format) format = $locale.DATETIME_FORMATS[format] || format;
        if(angular.isDate(value)) value = dateFilter(value, format || $dateParser.$format);
        var formatRegex = format ? regExpForFormat(format) : regex;
        var formatSetMap = format ? setMapForFormat(format) : setMap;
        var matches = formatRegex.exec(value);
        if(!matches) return false;
        // use custom ParseDate object to set parsed values
        var date = baseDate && !isNaN(baseDate.getTime()) ? new ParseDate().fromDate(baseDate) : new ParseDate().fromDate(new Date(1970, 0, 1, 0));
        for(var i = 0; i < matches.length - 1; i++) {
          formatSetMap[i] && formatSetMap[i].call(date, matches[i+1]);
        }
        // convert back to native Date object
        var newDate = date.toDate();

        // check new native Date object for day values overflow
        if (parseInt(date.day, 10) !== newDate.getDate()) {
          return false;
        }

        return newDate;
      };

      $dateParser.getDateForAttribute = function(key, value) {
        var date;

        if(value === 'today') {
          var today = new Date();
          date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (key === 'maxDate' ? 1 : 0), 0, 0, 0, (key === 'minDate' ? 0 : -1));
        } else if(angular.isString(value) && value.match(/^".+"$/)) { // Support {{ dateObj }}
          date = new Date(value.substr(1, value.length - 2));
        } else if(isNumeric(value)) {
          date = new Date(parseInt(value, 10));
        } else if (angular.isString(value) && 0 === value.length) { // Reset date
          date = key === 'minDate' ? -Infinity : +Infinity;
        } else {
          date = new Date(value);
        }

        return date;
      };

      $dateParser.getTimeForAttribute = function(key, value) {
        var time;

        if(value === 'now') {
          time = new Date().setFullYear(1970, 0, 1);
        } else if(angular.isString(value) && value.match(/^".+"$/)) {
          time = new Date(value.substr(1, value.length - 2)).setFullYear(1970, 0, 1);
        } else if(isNumeric(value)) {
          time = new Date(parseInt(value, 10)).setFullYear(1970, 0, 1);
        } else if (angular.isString(value) && 0 === value.length) { // Reset time
          time = key === 'minTime' ? -Infinity : +Infinity;
        } else {
          time = $dateParser.parse(value, new Date(1970, 0, 1, 0));
        }

        return time;
      };

      /* Handle switch to/from daylight saving.
      * Hours may be non-zero on daylight saving cut-over:
      * > 12 when midnight changeover, but then cannot generate
      * midnight datetime, so jump to 1AM, otherwise reset.
      * @param  date  (Date) the date to check
      * @return  (Date) the corrected date
      *
      * __ copied from jquery ui datepicker __
      */
      $dateParser.daylightSavingAdjust = function(date) {
        if (!date) {
          return null;
        }
        date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);
        return date;
      };

      // Private functions

      function setMapForFormat(format) {
        var keys = Object.keys(setFnMap), i;
        var map = [], sortedMap = [];
        // Map to setFn
        var clonedFormat = format;
        for(i = 0; i < keys.length; i++) {
          if(format.split(keys[i]).length > 1) {
            var index = clonedFormat.search(keys[i]);
            format = format.split(keys[i]).join('');
            if(setFnMap[keys[i]]) {
              map[index] = setFnMap[keys[i]];
            }
          }
        }
        // Sort result map
        angular.forEach(map, function(v) {
          // conditional required since angular.forEach broke around v1.2.21
          // related pr: https://github.com/angular/angular.js/pull/8525
          if(v) sortedMap.push(v);
        });
        return sortedMap;
      }

      function escapeReservedSymbols(text) {
        return text.replace(/\//g, '[\\/]').replace('/-/g', '[-]').replace(/\./g, '[.]').replace(/\\s/g, '[\\s]');
      }

      function regExpForFormat(format) {
        var keys = Object.keys(regExpMap), i;

        var re = format;
        // Abstract replaces to avoid collisions
        for(i = 0; i < keys.length; i++) {
          re = re.split(keys[i]).join('${' + i + '}');
        }
        // Replace abstracted values
        for(i = 0; i < keys.length; i++) {
          re = re.split('${' + i + '}').join('(' + regExpMap[keys[i]] + ')');
        }
        format = escapeReservedSymbols(format);

        return new RegExp('^' + re + '$', ['i']);
      }

      $dateParser.init();
      return $dateParser;

    };

    return DateParserFactory;

  }];

}]);

// Source: debounce.js
angular.module('mgcrea.ngStrap.helpers.debounce', [])

// @source jashkenas/underscore
// @url https://github.com/jashkenas/underscore/blob/1.5.2/underscore.js#L693
.factory('debounce', ["$timeout", function($timeout) {
  return function(func, wait, immediate) {
    var timeout = null;
    return function() {
      var context = this,
        args = arguments,
        callNow = immediate && !timeout;
      if(timeout) {
        $timeout.cancel(timeout);
      }
      timeout = $timeout(function later() {
        timeout = null;
        if(!immediate) {
          func.apply(context, args);
        }
      }, wait, false);
      if(callNow) {
        func.apply(context, args);
      }
      return timeout;
    };
  };
}])


// @source jashkenas/underscore
// @url https://github.com/jashkenas/underscore/blob/1.5.2/underscore.js#L661
.factory('throttle', ["$timeout", function($timeout) {
  return function(func, wait, options) {
    var timeout = null;
    options || (options = {});
    return function() {
      var context = this,
        args = arguments;
      if(!timeout) {
        if(options.leading !== false) {
          func.apply(context, args);
        }
        timeout = $timeout(function later() {
          timeout = null;
          if(options.trailing !== false) {
            func.apply(context, args);
          }
        }, wait, false);
      }
    };
  };
}]);

// Source: dimensions.js
angular.module('mgcrea.ngStrap.helpers.dimensions', [])

  .factory('dimensions', ["$document", "$window", function($document, $window) {

    var jqLite = angular.element;
    var fn = {};

    /**
     * Test the element nodeName
     * @param element
     * @param name
     */
    var nodeName = fn.nodeName = function(element, name) {
      return element.nodeName && element.nodeName.toLowerCase() === name.toLowerCase();
    };

    /**
     * Returns the element computed style
     * @param element
     * @param prop
     * @param extra
     */
    fn.css = function(element, prop, extra) {
      var value;
      if (element.currentStyle) { //IE
        value = element.currentStyle[prop];
      } else if (window.getComputedStyle) {
        value = window.getComputedStyle(element)[prop];
      } else {
        value = element.style[prop];
      }
      return extra === true ? parseFloat(value) || 0 : value;
    };

    /**
     * Provides read-only equivalent of jQuery's offset function:
     * @required-by bootstrap-tooltip, bootstrap-affix
     * @url http://api.jquery.com/offset/
     * @param element
     */
    fn.offset = function(element) {
      var boxRect = element.getBoundingClientRect();
      var docElement = element.ownerDocument;
      return {
        width: boxRect.width || element.offsetWidth,
        height: boxRect.height || element.offsetHeight,
        top: boxRect.top + (window.pageYOffset || docElement.documentElement.scrollTop) - (docElement.documentElement.clientTop || 0),
        left: boxRect.left + (window.pageXOffset || docElement.documentElement.scrollLeft) - (docElement.documentElement.clientLeft || 0)
      };
    };

    /**
     * Provides read-only equivalent of jQuery's position function
     * @required-by bootstrap-tooltip, bootstrap-affix
     * @url http://api.jquery.com/offset/
     * @param element
     */
    fn.position = function(element) {

      var offsetParentRect = {top: 0, left: 0},
          offsetParentElement,
          offset;

      // Fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
      if (fn.css(element, 'position') === 'fixed') {

        // We assume that getBoundingClientRect is available when computed position is fixed
        offset = element.getBoundingClientRect();

      } else {

        // Get *real* offsetParentElement
        offsetParentElement = offsetParent(element);

        // Get correct offsets
        offset = fn.offset(element);
        if (!nodeName(offsetParentElement, 'html')) {
          offsetParentRect = fn.offset(offsetParentElement);
        }

        // Add offsetParent borders
        offsetParentRect.top += fn.css(offsetParentElement, 'borderTopWidth', true);
        offsetParentRect.left += fn.css(offsetParentElement, 'borderLeftWidth', true);
      }

      // Subtract parent offsets and element margins
      return {
        width: element.offsetWidth,
        height: element.offsetHeight,
        top: offset.top - offsetParentRect.top - fn.css(element, 'marginTop', true),
        left: offset.left - offsetParentRect.left - fn.css(element, 'marginLeft', true)
      };

    };

    /**
     * Returns the closest, non-statically positioned offsetParent of a given element
     * @required-by fn.position
     * @param element
     */
    var offsetParent = function offsetParentElement(element) {
      var docElement = element.ownerDocument;
      var offsetParent = element.offsetParent || docElement;
      if(nodeName(offsetParent, '#document')) return docElement.documentElement;
      while(offsetParent && !nodeName(offsetParent, 'html') && fn.css(offsetParent, 'position') === 'static') {
        offsetParent = offsetParent.offsetParent;
      }
      return offsetParent || docElement.documentElement;
    };

    /**
     * Provides equivalent of jQuery's height function
     * @required-by bootstrap-affix
     * @url http://api.jquery.com/height/
     * @param element
     * @param outer
     */
    fn.height = function(element, outer) {
      var value = element.offsetHeight;
      if(outer) {
        value += fn.css(element, 'marginTop', true) + fn.css(element, 'marginBottom', true);
      } else {
        value -= fn.css(element, 'paddingTop', true) + fn.css(element, 'paddingBottom', true) + fn.css(element, 'borderTopWidth', true) + fn.css(element, 'borderBottomWidth', true);
      }
      return value;
    };

    /**
     * Provides equivalent of jQuery's width function
     * @required-by bootstrap-affix
     * @url http://api.jquery.com/width/
     * @param element
     * @param outer
     */
    fn.width = function(element, outer) {
      var value = element.offsetWidth;
      if(outer) {
        value += fn.css(element, 'marginLeft', true) + fn.css(element, 'marginRight', true);
      } else {
        value -= fn.css(element, 'paddingLeft', true) + fn.css(element, 'paddingRight', true) + fn.css(element, 'borderLeftWidth', true) + fn.css(element, 'borderRightWidth', true);
      }
      return value;
    };

    return fn;

  }]);

// Source: parse-options.js
angular.module('mgcrea.ngStrap.helpers.parseOptions', [])

  .provider('$parseOptions', function() {

    var defaults = this.defaults = {
      regexp: /^\s*(.*?)(?:\s+as\s+(.*?))?(?:\s+group\s+by\s+(.*))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+(.*?)(?:\s+track\s+by\s+(.*?))?$/
    };

    this.$get = ["$parse", "$q", function($parse, $q) {

      function ParseOptionsFactory(attr, config) {

        var $parseOptions = {};

        // Common vars
        var options = angular.extend({}, defaults, config);
        $parseOptions.$values = [];

        // Private vars
        var match, displayFn, valueName, keyName, groupByFn, valueFn, valuesFn;

        $parseOptions.init = function() {
          $parseOptions.$match = match = attr.match(options.regexp);
          displayFn = $parse(match[2] || match[1]),
          valueName = match[4] || match[6],
          keyName = match[5],
          groupByFn = $parse(match[3] || ''),
          valueFn = $parse(match[2] ? match[1] : valueName),
          valuesFn = $parse(match[7]);
        };

        $parseOptions.valuesFn = function(scope, controller) {
          return $q.when(valuesFn(scope, controller))
          .then(function(values) {
            $parseOptions.$values = values ? parseValues(values, scope) : {};
            return $parseOptions.$values;
          });
        };

        $parseOptions.displayValue = function(modelValue) {
          var scope = {};
          scope[valueName] = modelValue;
          return displayFn(scope);
        };

        // Private functions

        function parseValues(values, scope) {
          return values.map(function(match, index) {
            var locals = {}, label, value;
            locals[valueName] = match;
            label = displayFn(scope, locals);
            value = valueFn(scope, locals);
            return {label: label, value: value, index: index};
          });
        }

        $parseOptions.init();
        return $parseOptions;

      }

      return ParseOptionsFactory;

    }];

  });

// Source: raf.js
(angular.version.minor < 3 && angular.version.dot < 14) && angular.module('ng')

.factory('$$rAF', ["$window", "$timeout", function($window, $timeout) {

  var requestAnimationFrame = $window.requestAnimationFrame ||
                              $window.webkitRequestAnimationFrame ||
                              $window.mozRequestAnimationFrame;

  var cancelAnimationFrame = $window.cancelAnimationFrame ||
                             $window.webkitCancelAnimationFrame ||
                             $window.mozCancelAnimationFrame ||
                             $window.webkitCancelRequestAnimationFrame;

  var rafSupported = !!requestAnimationFrame;
  var raf = rafSupported ?
    function(fn) {
      var id = requestAnimationFrame(fn);
      return function() {
        cancelAnimationFrame(id);
      };
    } :
    function(fn) {
      var timer = $timeout(fn, 16.66, false); // 1000 / 60 = 16.666
      return function() {
        $timeout.cancel(timer);
      };
    };

  raf.supported = rafSupported;

  return raf;

}]);

// .factory('$$animateReflow', function($$rAF, $document) {

//   var bodyEl = $document[0].body;

//   return function(fn) {
//     //the returned function acts as the cancellation function
//     return $$rAF(function() {
//       //the line below will force the browser to perform a repaint
//       //so that all the animated elements within the animation frame
//       //will be properly updated and drawn on screen. This is
//       //required to perform multi-class CSS based animations with
//       //Firefox. DO NOT REMOVE THIS LINE.
//       var a = bodyEl.offsetWidth + 1;
//       fn();
//     });
//   };

// });

// Source: modal.js
angular.module('mgcrea.ngStrap.modal', ['mgcrea.ngStrap.helpers.dimensions'])

  .provider('$modal', function() {

    var defaults = this.defaults = {
      animation: 'am-fade',
      backdropAnimation: 'am-fade',
      prefixClass: 'modal',
      prefixEvent: 'modal',
      placement: 'top',
      template: 'modal/modal.tpl.html',
      contentTemplate: false,
      container: false,
      element: null,
      backdrop: true,
      keyboard: true,
      html: false,
      show: true
    };

    this.$get = ["$window", "$rootScope", "$compile", "$q", "$templateCache", "$http", "$animate", "$timeout", "$sce", "dimensions", function($window, $rootScope, $compile, $q, $templateCache, $http, $animate, $timeout, $sce, dimensions) {

      var forEach = angular.forEach;
      var trim = String.prototype.trim;
      var requestAnimationFrame = $window.requestAnimationFrame || $window.setTimeout;
      var bodyElement = angular.element($window.document.body);
      var htmlReplaceRegExp = /ng-bind="/ig;

      function ModalFactory(config) {

        var $modal = {};

        // Common vars
        var options = $modal.$options = angular.extend({}, defaults, config);
        $modal.$promise = fetchTemplate(options.template);
        var scope = $modal.$scope = options.scope && options.scope.$new() || $rootScope.$new();
        if(!options.element && !options.container) {
          options.container = 'body';
        }

        // store $id to identify the triggering element in events
        // give priority to options.id, otherwise, try to use
        // element id if defined
        $modal.$id = options.id || options.element && options.element.attr('id') || '';

        // Support scope as string options
        forEach(['title', 'content'], function(key) {
          if(options[key]) scope[key] = $sce.trustAsHtml(options[key]);
        });

        // Provide scope helpers
        scope.$hide = function() {
          scope.$$postDigest(function() {
            $modal.hide();
          });
        };
        scope.$show = function() {
          scope.$$postDigest(function() {
            $modal.show();
          });
        };
        scope.$toggle = function() {
          scope.$$postDigest(function() {
            $modal.toggle();
          });
        };
        // Publish isShown as a protected var on scope
        $modal.$isShown = scope.$isShown = false;

        // Support contentTemplate option
        if(options.contentTemplate) {
          $modal.$promise = $modal.$promise.then(function(template) {
            var templateEl = angular.element(template);
            return fetchTemplate(options.contentTemplate)
            .then(function(contentTemplate) {
              var contentEl = findElement('[ng-bind="content"]', templateEl[0]).removeAttr('ng-bind').html(contentTemplate);
              // Drop the default footer as you probably don't want it if you use a custom contentTemplate
              if(!config.template) contentEl.next().remove();
              return templateEl[0].outerHTML;
            });
          });
        }

        // Fetch, compile then initialize modal
        var modalLinker, modalElement;
        var backdropElement = angular.element('<div class="' + options.prefixClass + '-backdrop"/>');
        $modal.$promise.then(function(template) {
          if(angular.isObject(template)) template = template.data;
          if(options.html) template = template.replace(htmlReplaceRegExp, 'ng-bind-html="');
          template = trim.apply(template);
          modalLinker = $compile(template);
          $modal.init();
        });

        $modal.init = function() {

          // Options: show
          if(options.show) {
            scope.$$postDigest(function() {
              $modal.show();
            });
          }

        };

        $modal.destroy = function() {

          // Remove element
          if(modalElement) {
            modalElement.remove();
            modalElement = null;
          }
          if(backdropElement) {
            backdropElement.remove();
            backdropElement = null;
          }

          // Destroy scope
          scope.$destroy();

        };

        $modal.show = function() {
          if($modal.$isShown) return;

          if(scope.$emit(options.prefixEvent + '.show.before', $modal).defaultPrevented) {
            return;
          }
          var parent, after;
          if(angular.isElement(options.container)) {
            parent = options.container;
            after = options.container[0].lastChild ? angular.element(options.container[0].lastChild) : null;
          } else {
            if (options.container) {
              parent = findElement(options.container);
              after = parent[0].lastChild ? angular.element(parent[0].lastChild) : null;
            } else {
              parent = null;
              after = options.element;
            }
          }

          // Fetch a cloned element linked from template
          modalElement = $modal.$element = modalLinker(scope, function(clonedElement, scope) {});

          // Set the initial positioning.
          modalElement.css({display: 'block'}).addClass(options.placement);

          // Options: animation
          if(options.animation) {
            if(options.backdrop) {
              backdropElement.addClass(options.backdropAnimation);
            }
            modalElement.addClass(options.animation);
          }

          if(options.backdrop) {
            $animate.enter(backdropElement, bodyElement, null);
          }
          // Support v1.3+ $animate
          // https://github.com/angular/angular.js/commit/bf0f5502b1bbfddc5cdd2f138efd9188b8c652a9
          var promise = $animate.enter(modalElement, parent, after, enterAnimateCallback);
          if(promise && promise.then) promise.then(enterAnimateCallback);

          $modal.$isShown = scope.$isShown = true;
          safeDigest(scope);
          // Focus once the enter-animation has started
          // Weird PhantomJS bug hack
          var el = modalElement[0];
          requestAnimationFrame(function() {
            el.focus();
          });

          bodyElement.addClass(options.prefixClass + '-open');
          if(options.animation) {
            bodyElement.addClass(options.prefixClass + '-with-' + options.animation);
          }

          // Bind events
          if(options.backdrop) {
            modalElement.on('click', hideOnBackdropClick);
            backdropElement.on('click', hideOnBackdropClick);
            backdropElement.on('wheel', preventEventDefault);
          }
          if(options.keyboard) {
            modalElement.on('keyup', $modal.$onKeyUp);
          }
        };

        function enterAnimateCallback() {
          scope.$emit(options.prefixEvent + '.show', $modal);
        }

        $modal.hide = function() {
          if(!$modal.$isShown) return;

          if(scope.$emit(options.prefixEvent + '.hide.before', $modal).defaultPrevented) {
            return;
          }
          var promise = $animate.leave(modalElement, leaveAnimateCallback);
          // Support v1.3+ $animate
          // https://github.com/angular/angular.js/commit/bf0f5502b1bbfddc5cdd2f138efd9188b8c652a9
          if(promise && promise.then) promise.then(leaveAnimateCallback);

          if(options.backdrop) {
            $animate.leave(backdropElement);
          }
          $modal.$isShown = scope.$isShown = false;
          safeDigest(scope);

          // Unbind events
          if(options.backdrop) {
            modalElement.off('click', hideOnBackdropClick);
            backdropElement.off('click', hideOnBackdropClick);
            backdropElement.off('wheel', preventEventDefault);
          }
          if(options.keyboard) {
            modalElement.off('keyup', $modal.$onKeyUp);
          }
        };

        function leaveAnimateCallback() {
          scope.$emit(options.prefixEvent + '.hide', $modal);
          bodyElement.removeClass(options.prefixClass + '-open');
          if(options.animation) {
            bodyElement.removeClass(options.prefixClass + '-with-' + options.animation);
          }
        }

        $modal.toggle = function() {

          $modal.$isShown ? $modal.hide() : $modal.show();

        };

        $modal.focus = function() {
          modalElement[0].focus();
        };

        // Protected methods

        $modal.$onKeyUp = function(evt) {

          if (evt.which === 27 && $modal.$isShown) {
            $modal.hide();
            evt.stopPropagation();
          }

        };

        // Private methods

        function hideOnBackdropClick(evt) {
          if(evt.target !== evt.currentTarget) return;
          options.backdrop === 'static' ? $modal.focus() : $modal.hide();
        }

        function preventEventDefault(evt) {
          evt.preventDefault();
        }

        return $modal;

      }

      // Helper functions

      function safeDigest(scope) {
        scope.$$phase || (scope.$root && scope.$root.$$phase) || scope.$digest();
      }

      function findElement(query, element) {
        return angular.element((element || document).querySelectorAll(query));
      }

      var fetchPromises = {};
      function fetchTemplate(template) {
        if(fetchPromises[template]) return fetchPromises[template];
        return (fetchPromises[template] = $q.when($templateCache.get(template) || $http.get(template))
        .then(function(res) {
          if(angular.isObject(res)) {
            $templateCache.put(template, res.data);
            return res.data;
          }
          return res;
        }));
      }

      return ModalFactory;

    }];

  })

  .directive('bsModal', ["$window", "$sce", "$modal", function($window, $sce, $modal) {

    return {
      restrict: 'EAC',
      scope: true,
      link: function postLink(scope, element, attr, transclusion) {

        // Directive options
        var options = {scope: scope, element: element, show: false};
        angular.forEach(['template', 'contentTemplate', 'placement', 'backdrop', 'keyboard', 'html', 'container', 'animation', 'id'], function(key) {
          if(angular.isDefined(attr[key])) options[key] = attr[key];
        });

        // Support scope as data-attrs
        angular.forEach(['title', 'content'], function(key) {
          attr[key] && attr.$observe(key, function(newValue, oldValue) {
            scope[key] = $sce.trustAsHtml(newValue);
          });
        });

        // Support scope as an object
        attr.bsModal && scope.$watch(attr.bsModal, function(newValue, oldValue) {
          if(angular.isObject(newValue)) {
            angular.extend(scope, newValue);
          } else {
            scope.content = newValue;
          }
        }, true);

        // Initialize modal
        var modal = $modal(options);

        // Trigger
        element.on(attr.trigger || 'click', modal.toggle);

        // Garbage collection
        scope.$on('$destroy', function() {
          if (modal) modal.destroy();
          options = null;
          modal = null;
        });

      }
    };

  }]);

// Source: navbar.js
angular.module('mgcrea.ngStrap.navbar', [])

  .provider('$navbar', function() {

    var defaults = this.defaults = {
      activeClass: 'active',
      routeAttr: 'data-match-route',
      strict: false
    };

    this.$get = function() {
      return {defaults: defaults};
    };

  })

  .directive('bsNavbar', ["$window", "$location", "$navbar", function($window, $location, $navbar) {

    var defaults = $navbar.defaults;

    return {
      restrict: 'A',
      link: function postLink(scope, element, attr, controller) {

        // Directive options
        var options = angular.copy(defaults);
        angular.forEach(Object.keys(defaults), function(key) {
          if(angular.isDefined(attr[key])) options[key] = attr[key];
        });

        // Watch for the $location
        scope.$watch(function() {

          return $location.path();

        }, function(newValue, oldValue) {

          var liElements = element[0].querySelectorAll('li[' + options.routeAttr + ']');

          angular.forEach(liElements, function(li) {

            var liElement = angular.element(li);
            var pattern = liElement.attr(options.routeAttr).replace('/', '\\/');
            if(options.strict) {
              pattern = '^' + pattern + '$';
            }
            var regexp = new RegExp(pattern, ['i']);

            if(regexp.test(newValue)) {
              liElement.addClass(options.activeClass);
            } else {
              liElement.removeClass(options.activeClass);
            }

          });

        });

      }

    };

  }]);

// Source: popover.js
angular.module('mgcrea.ngStrap.popover', ['mgcrea.ngStrap.tooltip'])

  .provider('$popover', function() {

    var defaults = this.defaults = {
      animation: 'am-fade',
      customClass: '',
      container: false,
      target: false,
      placement: 'right',
      template: 'popover/popover.tpl.html',
      contentTemplate: false,
      trigger: 'click',
      keyboard: true,
      html: false,
      title: '',
      content: '',
      delay: 0,
      autoClose: false
    };

    this.$get = ["$tooltip", function($tooltip) {

      function PopoverFactory(element, config) {

        // Common vars
        var options = angular.extend({}, defaults, config);

        var $popover = $tooltip(element, options);

        // Support scope as string options [/*title, */content]
        if(options.content) {
          $popover.$scope.content = options.content;
        }

        return $popover;

      }

      return PopoverFactory;

    }];

  })

  .directive('bsPopover', ["$window", "$sce", "$popover", function($window, $sce, $popover) {

    var requestAnimationFrame = $window.requestAnimationFrame || $window.setTimeout;

    return {
      restrict: 'EAC',
      scope: true,
      link: function postLink(scope, element, attr) {

        // Directive options
        var options = {scope: scope};
        angular.forEach(['template', 'contentTemplate', 'placement', 'container', 'target', 'delay', 'trigger', 'keyboard', 'html', 'animation', 'customClass', 'autoClose', 'id'], function(key) {
          if(angular.isDefined(attr[key])) options[key] = attr[key];
        });

        // Support scope as data-attrs
        angular.forEach(['title', 'content'], function(key) {
          attr[key] && attr.$observe(key, function(newValue, oldValue) {
            scope[key] = $sce.trustAsHtml(newValue);
            angular.isDefined(oldValue) && requestAnimationFrame(function() {
              popover && popover.$applyPlacement();
            });
          });
        });

        // Support scope as an object
        attr.bsPopover && scope.$watch(attr.bsPopover, function(newValue, oldValue) {
          if(angular.isObject(newValue)) {
            angular.extend(scope, newValue);
          } else {
            scope.content = newValue;
          }
          angular.isDefined(oldValue) && requestAnimationFrame(function() {
            popover && popover.$applyPlacement();
          });
        }, true);

        // Visibility binding support
        attr.bsShow && scope.$watch(attr.bsShow, function(newValue, oldValue) {
          if(!popover || !angular.isDefined(newValue)) return;
          if(angular.isString(newValue)) newValue = !!newValue.match(/true|,?(popover),?/i);
          newValue === true ? popover.show() : popover.hide();
        });

        // Initialize popover
        var popover = $popover(element, options);

        // Garbage collection
        scope.$on('$destroy', function() {
          if (popover) popover.destroy();
          options = null;
          popover = null;
        });

      }
    };

  }]);

// Source: select.js
angular.module('mgcrea.ngStrap.select', ['mgcrea.ngStrap.tooltip', 'mgcrea.ngStrap.helpers.parseOptions'])

  .provider('$select', function() {

    var defaults = this.defaults = {
      animation: 'am-fade',
      prefixClass: 'select',
      prefixEvent: '$select',
      placement: 'bottom-left',
      template: 'select/select.tpl.html',
      trigger: 'focus',
      container: false,
      keyboard: true,
      html: false,
      delay: 0,
      multiple: false,
      allNoneButtons: false,
      sort: true,
      caretHtml: '&nbsp;<span class="caret"></span>',
      placeholder: 'Choose among the following...',
      allText: 'All',
      noneText: 'None',
      maxLength: 3,
      maxLengthHtml: 'selected',
      iconCheckmark: 'glyphicon glyphicon-ok'
    };

    this.$get = ["$window", "$document", "$rootScope", "$tooltip", "$timeout", function($window, $document, $rootScope, $tooltip, $timeout) {

      var bodyEl = angular.element($window.document.body);
      var isNative = /(ip(a|o)d|iphone|android)/ig.test($window.navigator.userAgent);
      var isTouch = ('createTouch' in $window.document) && isNative;

      function SelectFactory(element, controller, config) {

        var $select = {};

        // Common vars
        var options = angular.extend({}, defaults, config);

        $select = $tooltip(element, options);
        var scope = $select.$scope;

        scope.$matches = [];
        scope.$activeIndex = 0;
        scope.$isMultiple = options.multiple;
        scope.$showAllNoneButtons = options.allNoneButtons && options.multiple;
        scope.$iconCheckmark = options.iconCheckmark;
        scope.$allText = options.allText;
        scope.$noneText = options.noneText;

        scope.$activate = function(index) {
          scope.$$postDigest(function() {
            $select.activate(index);
          });
        };

        scope.$select = function(index, evt) {
          scope.$$postDigest(function() {
            $select.select(index);
          });
        };

        scope.$isVisible = function() {
          return $select.$isVisible();
        };

        scope.$isActive = function(index) {
          return $select.$isActive(index);
        };

        scope.$selectAll = function () {
          for (var i = 0; i < scope.$matches.length; i++) {
            if (!scope.$isActive(i)) {
              scope.$select(i);
            }
          }
        };

        scope.$selectNone = function () {
          for (var i = 0; i < scope.$matches.length; i++) {
            if (scope.$isActive(i)) {
              scope.$select(i);
            }
          }
        };

        // Public methods

        $select.update = function(matches) {
          scope.$matches = matches;
          $select.$updateActiveIndex();
        };

        $select.activate = function(index) {
          if(options.multiple) {
            scope.$activeIndex.sort();
            $select.$isActive(index) ? scope.$activeIndex.splice(scope.$activeIndex.indexOf(index), 1) : scope.$activeIndex.push(index);
            if(options.sort) scope.$activeIndex.sort();
          } else {
            scope.$activeIndex = index;
          }
          return scope.$activeIndex;
        };

        $select.select = function(index) {
          var value = scope.$matches[index].value;
          scope.$apply(function() {
            $select.activate(index);
            if(options.multiple) {
              controller.$setViewValue(scope.$activeIndex.map(function(index) {
                return scope.$matches[index].value;
              }));
            } else {
              controller.$setViewValue(value);
              // Hide if single select
              $select.hide();
            }
          });
          // Emit event
          scope.$emit(options.prefixEvent + '.select', value, index, $select);
        };

        // Protected methods

        $select.$updateActiveIndex = function() {
          if(controller.$modelValue && scope.$matches.length) {
            if(options.multiple && angular.isArray(controller.$modelValue)) {
              scope.$activeIndex = controller.$modelValue.map(function(value) {
                return $select.$getIndex(value);
              });
            } else {
              scope.$activeIndex = $select.$getIndex(controller.$modelValue);
            }
          } else if(scope.$activeIndex >= scope.$matches.length) {
            scope.$activeIndex = options.multiple ? [] : 0;
          }
        };

        $select.$isVisible = function() {
          if(!options.minLength || !controller) {
            return scope.$matches.length;
          }
          // minLength support
          return scope.$matches.length && controller.$viewValue.length >= options.minLength;
        };

        $select.$isActive = function(index) {
          if(options.multiple) {
            return scope.$activeIndex.indexOf(index) !== -1;
          } else {
            return scope.$activeIndex === index;
          }
        };

        $select.$getIndex = function(value) {
          var l = scope.$matches.length, i = l;
          if(!l) return;
          for(i = l; i--;) {
            if(scope.$matches[i].value === value) break;
          }
          if(i < 0) return;
          return i;
        };

        $select.$onMouseDown = function(evt) {
          // Prevent blur on mousedown on .dropdown-menu
          evt.preventDefault();
          evt.stopPropagation();
          // Emulate click for mobile devices
          if(isTouch) {
            var targetEl = angular.element(evt.target);
            targetEl.triggerHandler('click');
          }
        };

        $select.$onKeyDown = function(evt) {
          if (!/(9|13|38|40)/.test(evt.keyCode)) return;
          evt.preventDefault();
          evt.stopPropagation();

          // Select with enter
          if(!options.multiple && (evt.keyCode === 13 || evt.keyCode === 9)) {
            return $select.select(scope.$activeIndex);
          }

          // Navigate with keyboard
          if(evt.keyCode === 38 && scope.$activeIndex > 0) scope.$activeIndex--;
          else if(evt.keyCode === 40 && scope.$activeIndex < scope.$matches.length - 1) scope.$activeIndex++;
          else if(angular.isUndefined(scope.$activeIndex)) scope.$activeIndex = 0;
          scope.$digest();
        };

        // Overrides

        var _show = $select.show;
        $select.show = function() {
          _show();
          if(options.multiple) {
            $select.$element.addClass('select-multiple');
          }
          // use timeout to hookup the events to prevent
          // event bubbling from being processed imediately.
          $timeout(function() {
            $select.$element.on(isTouch ? 'touchstart' : 'mousedown', $select.$onMouseDown);
            if(options.keyboard) {
              element.on('keydown', $select.$onKeyDown);
            }
          }, 0, false);
        };

        var _hide = $select.hide;
        $select.hide = function() {
          $select.$element.off(isTouch ? 'touchstart' : 'mousedown', $select.$onMouseDown);
          if(options.keyboard) {
            element.off('keydown', $select.$onKeyDown);
          }
          _hide(true);
        };

        return $select;

      }

      SelectFactory.defaults = defaults;
      return SelectFactory;

    }];

  })

  .directive('bsSelect', ["$window", "$parse", "$q", "$select", "$parseOptions", function($window, $parse, $q, $select, $parseOptions) {

    var defaults = $select.defaults;

    return {
      restrict: 'EAC',
      require: 'ngModel',
      link: function postLink(scope, element, attr, controller) {

        // Directive options
        var options = {scope: scope, placeholder: defaults.placeholder};
        angular.forEach(['placement', 'container', 'delay', 'trigger', 'keyboard', 'html', 'animation', 'template', 'placeholder', 'multiple', 'allNoneButtons', 'maxLength', 'maxLengthHtml', 'allText', 'noneText', 'iconCheckmark', 'autoClose', 'id'], function(key) {
          if(angular.isDefined(attr[key])) options[key] = attr[key];
        });

        // Add support for select markup
        if(element[0].nodeName.toLowerCase() === 'select') {
          var inputEl = element;
          inputEl.css('display', 'none');
          element = angular.element('<button type="button" class="btn btn-default"></button>');
          inputEl.after(element);
        }

        // Build proper ngOptions
        var parsedOptions = $parseOptions(attr.ngOptions);

        // Initialize select
        var select = $select(element, controller, options);

        // Watch ngOptions values before filtering for changes
        var watchedOptions = parsedOptions.$match[7].replace(/\|.+/, '').trim();
        scope.$watch(watchedOptions, function(newValue, oldValue) {
          // console.warn('scope.$watch(%s)', watchedOptions, newValue, oldValue);
          parsedOptions.valuesFn(scope, controller)
          .then(function(values) {
            select.update(values);
            controller.$render();
          });
        }, true);

        // Watch model for changes
        scope.$watch(attr.ngModel, function(newValue, oldValue) {
          // console.warn('scope.$watch(%s)', attr.ngModel, newValue, oldValue);
          select.$updateActiveIndex();
          controller.$render();
        }, true);

        // Model rendering in view
        controller.$render = function () {
          // console.warn('$render', element.attr('ng-model'), 'controller.$modelValue', typeof controller.$modelValue, controller.$modelValue, 'controller.$viewValue', typeof controller.$viewValue, controller.$viewValue);
          var selected, index;
          if(options.multiple && angular.isArray(controller.$modelValue)) {
            selected = controller.$modelValue.map(function(value) {
              index = select.$getIndex(value);
              return angular.isDefined(index) ? select.$scope.$matches[index].label : false;
            }).filter(angular.isDefined);
            if(selected.length > (options.maxLength || defaults.maxLength)) {
              selected = selected.length + ' ' + (options.maxLengthHtml || defaults.maxLengthHtml);
            } else {
              selected = selected.join(', ');
            }
          } else {
            index = select.$getIndex(controller.$modelValue);
            selected = angular.isDefined(index) ? select.$scope.$matches[index].label : false;
          }
          element.html((selected ? selected : options.placeholder) + defaults.caretHtml);
        };

        if(options.multiple){
          controller.$isEmpty = function(value){
            return !value || value.length === 0;
          };
        }

        // Garbage collection
        scope.$on('$destroy', function() {
          if (select) select.destroy();
          options = null;
          select = null;
        });

      }
    };

  }]);

// Source: tab.js
angular.module('mgcrea.ngStrap.tab', [])

  .provider('$tab', function() {

    var defaults = this.defaults = {
      animation: 'am-fade',
      template: 'tab/tab.tpl.html',
      navClass: 'nav-tabs',
      activeClass: 'active'
    };

    var controller = this.controller = function($scope, $element, $attrs) {
      var self = this;

      // Attributes options
      self.$options = angular.copy(defaults);
      angular.forEach(['animation', 'navClass', 'activeClass'], function(key) {
        if(angular.isDefined($attrs[key])) self.$options[key] = $attrs[key];
      });

      // Publish options on scope
      $scope.$navClass = self.$options.navClass;
      $scope.$activeClass = self.$options.activeClass;

      self.$panes = $scope.$panes = [];

      // DEPRECATED: $viewChangeListeners, please use $activePaneChangeListeners
      // Because we deprecated ngModel usage, we rename viewChangeListeners to 
      // activePaneChangeListeners to make more sense.
      self.$activePaneChangeListeners = self.$viewChangeListeners = [];

      self.$push = function(pane) {
        self.$panes.push(pane);
      };

      self.$remove = function(pane) {
        var index = self.$panes.indexOf(pane);
        var activeIndex = self.$panes.$active;

        // remove pane from $panes array
        self.$panes.splice(index, 1);

        if (index < activeIndex) {
          // we removed a pane before the active pane, so we need to 
          // decrement the active pane index
          activeIndex--;
        }
        else if (index === activeIndex && activeIndex === self.$panes.length) {
          // we remove the active pane and it was the one at the end,
          // so select the previous one
          activeIndex--;
        }
        self.$setActive(activeIndex);
      };

      self.$panes.$active = 0;
      self.$setActive = $scope.$setActive = function(value) {
        self.$panes.$active = value;
        self.$activePaneChangeListeners.forEach(function(fn) {
          fn();
        });
      };

    };

    this.$get = function() {
      var $tab = {};
      $tab.defaults = defaults;
      $tab.controller = controller;
      return $tab;
    };

  })

  .directive('bsTabs', ["$window", "$animate", "$tab", "$parse", function($window, $animate, $tab, $parse) {

    var defaults = $tab.defaults;

    return {
      require: ['?ngModel', 'bsTabs'],
      transclude: true,
      scope: true,
      controller: ['$scope', '$element', '$attrs', $tab.controller],
      templateUrl: function(element, attr) {
        return attr.template || defaults.template;
      },
      link: function postLink(scope, element, attrs, controllers) {

        var ngModelCtrl = controllers[0];
        var bsTabsCtrl = controllers[1];

        // DEPRECATED: ngModel, please use bsActivePane
        // 'ngModel' is deprecated bacause if interferes with form validation
        // and status, so avoid using it here.
        if(ngModelCtrl) {
          console.warn('Usage of ngModel is deprecated, please use bsActivePane instead!');

          // Update the modelValue following
          bsTabsCtrl.$activePaneChangeListeners.push(function() {
            ngModelCtrl.$setViewValue(bsTabsCtrl.$panes.$active);
          });

          // modelValue -> $formatters -> viewValue
          ngModelCtrl.$formatters.push(function(modelValue) {
            // console.warn('$formatter("%s"): modelValue=%o (%o)', element.attr('ng-model'), modelValue, typeof modelValue);
            bsTabsCtrl.$setActive(modelValue * 1);
            return modelValue;
          });

        }

        if (attrs.bsActivePane) {
          // adapted from angularjs ngModelController bindings
          // https://github.com/angular/angular.js/blob/v1.3.1/src%2Fng%2Fdirective%2Finput.js#L1730
          var parsedBsActivePane = $parse(attrs.bsActivePane);

          // Update bsActivePane value with change
          bsTabsCtrl.$activePaneChangeListeners.push(function() {
            parsedBsActivePane.assign(scope, bsTabsCtrl.$panes.$active);
          });

          // watch bsActivePane for value changes
          scope.$watch(attrs.bsActivePane, function(newValue, oldValue) {
            bsTabsCtrl.$setActive(newValue * 1);
          }, true);
        }
      }
    };

  }])

  .directive('bsPane', ["$window", "$animate", "$sce", function($window, $animate, $sce) {

    return {
      require: ['^?ngModel', '^bsTabs'],
      scope: true,
      link: function postLink(scope, element, attrs, controllers) {

        var ngModelCtrl = controllers[0];
        var bsTabsCtrl = controllers[1];

        // Add base class
        element.addClass('tab-pane');

        // Observe title attribute for change
        attrs.$observe('title', function(newValue, oldValue) {
          scope.title = $sce.trustAsHtml(newValue);
        });

        // Add animation class
        if(bsTabsCtrl.$options.animation) {
          element.addClass(bsTabsCtrl.$options.animation);
        }

        // Push pane to parent bsTabs controller
        bsTabsCtrl.$push(scope);

        // remove pane from tab controller when pane is destroyed
        scope.$on('$destroy', function() {
          bsTabsCtrl.$remove(scope);
        });

        function render() {
          var index = bsTabsCtrl.$panes.indexOf(scope);
          var active = bsTabsCtrl.$panes.$active;
          $animate[index === active ? 'addClass' : 'removeClass'](element, bsTabsCtrl.$options.activeClass);
        }

        bsTabsCtrl.$activePaneChangeListeners.push(function() {
          render();
        });
        render();

      }
    };

  }]);

// Source: scrollspy.js
angular.module('mgcrea.ngStrap.scrollspy', ['mgcrea.ngStrap.helpers.debounce', 'mgcrea.ngStrap.helpers.dimensions'])

  .provider('$scrollspy', function() {

    // Pool of registered spies
    var spies = this.$$spies = {};

    var defaults = this.defaults = {
      debounce: 150,
      throttle: 100,
      offset: 100
    };

    this.$get = ["$window", "$document", "$rootScope", "dimensions", "debounce", "throttle", function($window, $document, $rootScope, dimensions, debounce, throttle) {

      var windowEl = angular.element($window);
      var docEl = angular.element($document.prop('documentElement'));
      var bodyEl = angular.element($window.document.body);

      // Helper functions

      function nodeName(element, name) {
        return element[0].nodeName && element[0].nodeName.toLowerCase() === name.toLowerCase();
      }

      function ScrollSpyFactory(config) {

        // Common vars
        var options = angular.extend({}, defaults, config);
        if(!options.element) options.element = bodyEl;
        var isWindowSpy = nodeName(options.element, 'body');
        var scrollEl = isWindowSpy ? windowEl : options.element;
        var scrollId = isWindowSpy ? 'window' : options.id;

        // Use existing spy
        if(spies[scrollId]) {
          spies[scrollId].$$count++;
          return spies[scrollId];
        }

        var $scrollspy = {};

        // Private vars
        var unbindViewContentLoaded, unbindIncludeContentLoaded;
        var trackedElements = $scrollspy.$trackedElements = [];
        var sortedElements = [];
        var activeTarget;
        var debouncedCheckPosition;
        var throttledCheckPosition;
        var debouncedCheckOffsets;
        var viewportHeight;
        var scrollTop;

        $scrollspy.init = function() {

          // Setup internal ref counter
          this.$$count = 1;

          // Bind events
          debouncedCheckPosition = debounce(this.checkPosition, options.debounce);
          throttledCheckPosition = throttle(this.checkPosition, options.throttle);
          scrollEl.on('click', this.checkPositionWithEventLoop);
          windowEl.on('resize', debouncedCheckPosition);
          scrollEl.on('scroll', throttledCheckPosition);

          debouncedCheckOffsets = debounce(this.checkOffsets, options.debounce);
          unbindViewContentLoaded = $rootScope.$on('$viewContentLoaded', debouncedCheckOffsets);
          unbindIncludeContentLoaded = $rootScope.$on('$includeContentLoaded', debouncedCheckOffsets);
          debouncedCheckOffsets();

          // Register spy for reuse
          if(scrollId) {
            spies[scrollId] = $scrollspy;
          }

        };

        $scrollspy.destroy = function() {

          // Check internal ref counter
          this.$$count--;
          if(this.$$count > 0) {
            return;
          }

          // Unbind events
          scrollEl.off('click', this.checkPositionWithEventLoop);
          windowEl.off('resize', debouncedCheckPosition);
          scrollEl.off('scroll', throttledCheckPosition);
          unbindViewContentLoaded();
          unbindIncludeContentLoaded();
          if (scrollId) {
            delete spies[scrollId];
          }
        };

        $scrollspy.checkPosition = function() {

          // Not ready yet
          if(!sortedElements.length) return;

          // Calculate the scroll position
          scrollTop = (isWindowSpy ? $window.pageYOffset : scrollEl.prop('scrollTop')) || 0;

          // Calculate the viewport height for use by the components
          viewportHeight = Math.max($window.innerHeight, docEl.prop('clientHeight'));

          // Activate first element if scroll is smaller
          if(scrollTop < sortedElements[0].offsetTop && activeTarget !== sortedElements[0].target) {
            return $scrollspy.$activateElement(sortedElements[0]);
          }

          // Activate proper element
          for (var i = sortedElements.length; i--;) {
            if(angular.isUndefined(sortedElements[i].offsetTop) || sortedElements[i].offsetTop === null) continue;
            if(activeTarget === sortedElements[i].target) continue;
            if(scrollTop < sortedElements[i].offsetTop) continue;
            if(sortedElements[i + 1] && scrollTop > sortedElements[i + 1].offsetTop) continue;
            return $scrollspy.$activateElement(sortedElements[i]);
          }

        };

        $scrollspy.checkPositionWithEventLoop = function() {
          // IE 9 throws an error if we use 'this' instead of '$scrollspy'
          // in this setTimeout call
          setTimeout($scrollspy.checkPosition, 1);
        };

        // Protected methods

        $scrollspy.$activateElement = function(element) {
          if(activeTarget) {
            var activeElement = $scrollspy.$getTrackedElement(activeTarget);
            if(activeElement) {
              activeElement.source.removeClass('active');
              if(nodeName(activeElement.source, 'li') && nodeName(activeElement.source.parent().parent(), 'li')) {
                activeElement.source.parent().parent().removeClass('active');
              }
            }
          }
          activeTarget = element.target;
          element.source.addClass('active');
          if(nodeName(element.source, 'li') && nodeName(element.source.parent().parent(), 'li')) {
            element.source.parent().parent().addClass('active');
          }
        };

        $scrollspy.$getTrackedElement = function(target) {
          return trackedElements.filter(function(obj) {
            return obj.target === target;
          })[0];
        };

        // Track offsets behavior

        $scrollspy.checkOffsets = function() {

          angular.forEach(trackedElements, function(trackedElement) {
            var targetElement = document.querySelector(trackedElement.target);
            trackedElement.offsetTop = targetElement ? dimensions.offset(targetElement).top : null;
            if(options.offset && trackedElement.offsetTop !== null) trackedElement.offsetTop -= options.offset * 1;
          });

          sortedElements = trackedElements
          .filter(function(el) {
            return el.offsetTop !== null;
          })
          .sort(function(a, b) {
            return a.offsetTop - b.offsetTop;
          });

          debouncedCheckPosition();

        };

        $scrollspy.trackElement = function(target, source) {
          trackedElements.push({target: target, source: source});
        };

        $scrollspy.untrackElement = function(target, source) {
          var toDelete;
          for (var i = trackedElements.length; i--;) {
            if(trackedElements[i].target === target && trackedElements[i].source === source) {
              toDelete = i;
              break;
            }
          }
          trackedElements = trackedElements.splice(toDelete, 1);
        };

        $scrollspy.activate = function(i) {
          trackedElements[i].addClass('active');
        };

        // Initialize plugin

        $scrollspy.init();
        return $scrollspy;

      }

      return ScrollSpyFactory;

    }];

  })

  .directive('bsScrollspy', ["$rootScope", "debounce", "dimensions", "$scrollspy", function($rootScope, debounce, dimensions, $scrollspy) {

    return {
      restrict: 'EAC',
      link: function postLink(scope, element, attr) {

        var options = {scope: scope};
        angular.forEach(['offset', 'target'], function(key) {
          if(angular.isDefined(attr[key])) options[key] = attr[key];
        });

        var scrollspy = $scrollspy(options);
        scrollspy.trackElement(options.target, element);

        scope.$on('$destroy', function() {
          if (scrollspy) {
            scrollspy.untrackElement(options.target, element);
            scrollspy.destroy();
          }
          options = null;
          scrollspy = null;
        });

      }
    };

  }])


  .directive('bsScrollspyList', ["$rootScope", "debounce", "dimensions", "$scrollspy", function($rootScope, debounce, dimensions, $scrollspy) {

    return {
      restrict: 'A',
      compile: function postLink(element, attr) {
        var children = element[0].querySelectorAll('li > a[href]');
        angular.forEach(children, function(child) {
          var childEl = angular.element(child);
          childEl.parent().attr('bs-scrollspy', '').attr('data-target', childEl.attr('href'));
        });
      }

    };

  }]);

// Source: timepicker.js
angular.module('mgcrea.ngStrap.timepicker', [
  'mgcrea.ngStrap.helpers.dateParser',
  'mgcrea.ngStrap.helpers.dateFormatter',
  'mgcrea.ngStrap.tooltip'])

  .provider('$timepicker', function() {

    var defaults = this.defaults = {
      animation: 'am-fade',
      prefixClass: 'timepicker',
      placement: 'bottom-left',
      template: 'timepicker/timepicker.tpl.html',
      trigger: 'focus',
      container: false,
      keyboard: true,
      html: false,
      delay: 0,
      // lang: $locale.id,
      useNative: true,
      timeType: 'date',
      timeFormat: 'shortTime',
      modelTimeFormat: null,
      autoclose: false,
      minTime: -Infinity,
      maxTime: +Infinity,
      length: 5,
      hourStep: 1,
      minuteStep: 5,
      iconUp: 'glyphicon glyphicon-chevron-up',
      iconDown: 'glyphicon glyphicon-chevron-down',
      arrowBehavior: 'pager'
    };

    this.$get = ["$window", "$document", "$rootScope", "$sce", "$dateFormatter", "$tooltip", "$timeout", function($window, $document, $rootScope, $sce, $dateFormatter, $tooltip, $timeout) {

      var bodyEl = angular.element($window.document.body);
      var isNative = /(ip(a|o)d|iphone|android)/ig.test($window.navigator.userAgent);
      var isTouch = ('createTouch' in $window.document) && isNative;
      if(!defaults.lang) defaults.lang = $dateFormatter.getDefaultLocale();

      function timepickerFactory(element, controller, config) {

        var $timepicker = $tooltip(element, angular.extend({}, defaults, config));
        var parentScope = config.scope;
        var options = $timepicker.$options;
        var scope = $timepicker.$scope;

        var lang = options.lang;
        var formatDate = function(date, format) {
          return $dateFormatter.formatDate(date, format, lang);
        };

        // View vars

        var selectedIndex = 0;
        var startDate = controller.$dateValue || new Date();
        var viewDate = {hour: startDate.getHours(), meridian: startDate.getHours() < 12, minute: startDate.getMinutes(), second: startDate.getSeconds(), millisecond: startDate.getMilliseconds()};

        var format = $dateFormatter.getDatetimeFormat(options.timeFormat, lang);

        var hoursFormat = $dateFormatter.hoursFormat(format),
          timeSeparator = $dateFormatter.timeSeparator(format),
          minutesFormat = $dateFormatter.minutesFormat(format),
          showAM = $dateFormatter.showAM(format);

        scope.$iconUp = options.iconUp;
        scope.$iconDown = options.iconDown;

        // Scope methods

        scope.$select = function(date, index) {
          $timepicker.select(date, index);
        };
        scope.$moveIndex = function(value, index) {
          $timepicker.$moveIndex(value, index);
        };
        scope.$switchMeridian = function(date) {
          $timepicker.switchMeridian(date);
        };

        // Public methods

        $timepicker.update = function(date) {
          // console.warn('$timepicker.update() newValue=%o', date);
          if(angular.isDate(date) && !isNaN(date.getTime())) {
            $timepicker.$date = date;
            angular.extend(viewDate, {hour: date.getHours(), minute: date.getMinutes(), second: date.getSeconds(), millisecond: date.getMilliseconds()});
            $timepicker.$build();
          } else if(!$timepicker.$isBuilt) {
            $timepicker.$build();
          }
        };

        $timepicker.select = function(date, index, keep) {
          // console.warn('$timepicker.select', date, scope.$mode);
          if(!controller.$dateValue || isNaN(controller.$dateValue.getTime())) controller.$dateValue = new Date(1970, 0, 1);
          if(!angular.isDate(date)) date = new Date(date);
          if(index === 0) controller.$dateValue.setHours(date.getHours());
          else if(index === 1) controller.$dateValue.setMinutes(date.getMinutes());
          controller.$setViewValue(angular.copy(controller.$dateValue));
          controller.$render();
          if(options.autoclose && !keep) {
            $timeout(function() { $timepicker.hide(true); });
          }
        };

        $timepicker.switchMeridian = function(date) {
          if (!controller.$dateValue || isNaN(controller.$dateValue.getTime())) {
            return;
          }
          var hours = (date || controller.$dateValue).getHours();
          controller.$dateValue.setHours(hours < 12 ? hours + 12 : hours - 12);
          controller.$setViewValue(angular.copy(controller.$dateValue));
          controller.$render();
        };

        // Protected methods

        $timepicker.$build = function() {
          // console.warn('$timepicker.$build() viewDate=%o', viewDate);
          var i, midIndex = scope.midIndex = parseInt(options.length / 2, 10);
          var hours = [], hour;
          for(i = 0; i < options.length; i++) {
            hour = new Date(1970, 0, 1, viewDate.hour - (midIndex - i) * options.hourStep);
            hours.push({date: hour, label: formatDate(hour, hoursFormat), selected: $timepicker.$date && $timepicker.$isSelected(hour, 0), disabled: $timepicker.$isDisabled(hour, 0)});
          }
          var minutes = [], minute;
          for(i = 0; i < options.length; i++) {
            minute = new Date(1970, 0, 1, 0, viewDate.minute - (midIndex - i) * options.minuteStep);
            minutes.push({date: minute, label: formatDate(minute, minutesFormat), selected: $timepicker.$date && $timepicker.$isSelected(minute, 1), disabled: $timepicker.$isDisabled(minute, 1)});
          }

          var rows = [];
          for(i = 0; i < options.length; i++) {
            rows.push([hours[i], minutes[i]]);
          }
          scope.rows = rows;
          scope.showAM = showAM;
          scope.isAM = ($timepicker.$date || hours[midIndex].date).getHours() < 12;
          scope.timeSeparator = timeSeparator;
          $timepicker.$isBuilt = true;
        };

        $timepicker.$isSelected = function(date, index) {
          if(!$timepicker.$date) return false;
          else if(index === 0) {
            return date.getHours() === $timepicker.$date.getHours();
          } else if(index === 1) {
            return date.getMinutes() === $timepicker.$date.getMinutes();
          }
        };

        $timepicker.$isDisabled = function(date, index) {
          var selectedTime;
          if(index === 0) {
            selectedTime = date.getTime() + viewDate.minute * 6e4;
          } else if(index === 1) {
            selectedTime = date.getTime() + viewDate.hour * 36e5;
          }
          return selectedTime < options.minTime * 1 || selectedTime > options.maxTime * 1;
        };

        scope.$arrowAction = function (value, index) {
          if (options.arrowBehavior === 'picker') {
            $timepicker.$setTimeByStep(value,index);
          } else {
            $timepicker.$moveIndex(value,index);
          }
        };

        $timepicker.$setTimeByStep = function(value, index) {
          var newDate = new Date($timepicker.$date);
          var hours = newDate.getHours(), hoursLength = formatDate(newDate, hoursFormat).length;
          var minutes = newDate.getMinutes(), minutesLength = formatDate(newDate, minutesFormat).length;
          if (index === 0) {
            newDate.setHours(hours - (parseInt(options.hourStep, 10) * value));
          }
          else {
            newDate.setMinutes(minutes - (parseInt(options.minuteStep, 10) * value));
          }
          $timepicker.select(newDate, index, true);
        };

        $timepicker.$moveIndex = function(value, index) {
          var targetDate;
          if(index === 0) {
            targetDate = new Date(1970, 0, 1, viewDate.hour + (value * options.length), viewDate.minute);
            angular.extend(viewDate, {hour: targetDate.getHours()});
          } else if(index === 1) {
            targetDate = new Date(1970, 0, 1, viewDate.hour, viewDate.minute + (value * options.length * options.minuteStep));
            angular.extend(viewDate, {minute: targetDate.getMinutes()});
          }
          $timepicker.$build();
        };

        $timepicker.$onMouseDown = function(evt) {
          // Prevent blur on mousedown on .dropdown-menu
          if(evt.target.nodeName.toLowerCase() !== 'input') evt.preventDefault();
          evt.stopPropagation();
          // Emulate click for mobile devices
          if(isTouch) {
            var targetEl = angular.element(evt.target);
            if(targetEl[0].nodeName.toLowerCase() !== 'button') {
              targetEl = targetEl.parent();
            }
            targetEl.triggerHandler('click');
          }
        };

        $timepicker.$onKeyDown = function(evt) {
          if (!/(38|37|39|40|13)/.test(evt.keyCode) || evt.shiftKey || evt.altKey) return;
          evt.preventDefault();
          evt.stopPropagation();

          // Close on enter
          if(evt.keyCode === 13) return $timepicker.hide(true);

          // Navigate with keyboard
          var newDate = new Date($timepicker.$date);
          var hours = newDate.getHours(), hoursLength = formatDate(newDate, hoursFormat).length;
          var minutes = newDate.getMinutes(), minutesLength = formatDate(newDate, minutesFormat).length;
          var lateralMove = /(37|39)/.test(evt.keyCode);
          var count = 2 + showAM * 1;

          // Navigate indexes (left, right)
          if (lateralMove) {
            if(evt.keyCode === 37) selectedIndex = selectedIndex < 1 ? count - 1 : selectedIndex - 1;
            else if(evt.keyCode === 39) selectedIndex = selectedIndex < count - 1 ? selectedIndex + 1 : 0;
          }

          // Update values (up, down)
          var selectRange = [0, hoursLength];
          if(selectedIndex === 0) {
            if(evt.keyCode === 38) newDate.setHours(hours - parseInt(options.hourStep, 10));
            else if(evt.keyCode === 40) newDate.setHours(hours + parseInt(options.hourStep, 10));
            // re-calculate hours length because we have changed hours value
            hoursLength = formatDate(newDate, hoursFormat).length;
            selectRange = [0, hoursLength];
          } else if(selectedIndex === 1) {
            if(evt.keyCode === 38) newDate.setMinutes(minutes - parseInt(options.minuteStep, 10));
            else if(evt.keyCode === 40) newDate.setMinutes(minutes + parseInt(options.minuteStep, 10));
            // re-calculate minutes length because we have changes minutes value
            minutesLength = formatDate(newDate, minutesFormat).length;
            selectRange = [hoursLength + 1, hoursLength + 1 + minutesLength];
          } else if(selectedIndex === 2) {
            if(!lateralMove) $timepicker.switchMeridian();
            selectRange = [hoursLength + 1 + minutesLength + 1, hoursLength + 1 + minutesLength + 3];
          }
          $timepicker.select(newDate, selectedIndex, true);
          createSelection(selectRange[0], selectRange[1]);
          parentScope.$digest();
        };

        // Private

        function createSelection(start, end) {
          if(element[0].createTextRange) {
            var selRange = element[0].createTextRange();
            selRange.collapse(true);
            selRange.moveStart('character', start);
            selRange.moveEnd('character', end);
            selRange.select();
          } else if(element[0].setSelectionRange) {
            element[0].setSelectionRange(start, end);
          } else if(angular.isUndefined(element[0].selectionStart)) {
            element[0].selectionStart = start;
            element[0].selectionEnd = end;
          }
        }

        function focusElement() {
          element[0].focus();
        }

        // Overrides

        var _init = $timepicker.init;
        $timepicker.init = function() {
          if(isNative && options.useNative) {
            element.prop('type', 'time');
            element.css('-webkit-appearance', 'textfield');
            return;
          } else if(isTouch) {
            element.prop('type', 'text');
            element.attr('readonly', 'true');
            element.on('click', focusElement);
          }
          _init();
        };

        var _destroy = $timepicker.destroy;
        $timepicker.destroy = function() {
          if(isNative && options.useNative) {
            element.off('click', focusElement);
          }
          _destroy();
        };

        var _show = $timepicker.show;
        $timepicker.show = function() {
          _show();
          // use timeout to hookup the events to prevent
          // event bubbling from being processed imediately.
          $timeout(function() {
            $timepicker.$element.on(isTouch ? 'touchstart' : 'mousedown', $timepicker.$onMouseDown);
            if(options.keyboard) {
              element.on('keydown', $timepicker.$onKeyDown);
            }
          }, 0, false);
        };

        var _hide = $timepicker.hide;
        $timepicker.hide = function(blur) {
          if(!$timepicker.$isShown) return;
          $timepicker.$element.off(isTouch ? 'touchstart' : 'mousedown', $timepicker.$onMouseDown);
          if(options.keyboard) {
            element.off('keydown', $timepicker.$onKeyDown);
          }
          _hide(blur);
        };

        return $timepicker;

      }

      timepickerFactory.defaults = defaults;
      return timepickerFactory;

    }];

  })


  .directive('bsTimepicker', ["$window", "$parse", "$q", "$dateFormatter", "$dateParser", "$timepicker", function($window, $parse, $q, $dateFormatter, $dateParser, $timepicker) {

    var defaults = $timepicker.defaults;
    var isNative = /(ip(a|o)d|iphone|android)/ig.test($window.navigator.userAgent);
    var requestAnimationFrame = $window.requestAnimationFrame || $window.setTimeout;

    return {
      restrict: 'EAC',
      require: 'ngModel',
      link: function postLink(scope, element, attr, controller) {

        // Directive options
        var options = {scope: scope, controller: controller};
        angular.forEach(['placement', 'container', 'delay', 'trigger', 'keyboard', 'html', 'animation', 'template', 'autoclose', 'timeType', 'timeFormat', 'modelTimeFormat', 'useNative', 'hourStep', 'minuteStep', 'length', 'arrowBehavior', 'iconUp', 'iconDown', 'id'], function(key) {
          if(angular.isDefined(attr[key])) options[key] = attr[key];
        });

        // Visibility binding support
        attr.bsShow && scope.$watch(attr.bsShow, function(newValue, oldValue) {
          if(!timepicker || !angular.isDefined(newValue)) return;
          if(angular.isString(newValue)) newValue = !!newValue.match(/true|,?(timepicker),?/i);
          newValue === true ? timepicker.show() : timepicker.hide();
        });

        // Initialize timepicker
        if(isNative && (options.useNative || defaults.useNative)) options.timeFormat = 'HH:mm';
        var timepicker = $timepicker(element, controller, options);
        options = timepicker.$options;

        var lang = options.lang;
        var formatDate = function(date, format) {
          return $dateFormatter.formatDate(date, format, lang);
        };

        // Initialize parser
        var dateParser = $dateParser({format: options.timeFormat, lang: lang});

        // Observe attributes for changes
        angular.forEach(['minTime', 'maxTime'], function(key) {
          // console.warn('attr.$observe(%s)', key, attr[key]);
          angular.isDefined(attr[key]) && attr.$observe(key, function(newValue) {
            timepicker.$options[key] = dateParser.getTimeForAttribute(key, newValue);
            !isNaN(timepicker.$options[key]) && timepicker.$build();
            validateAgainstMinMaxTime(controller.$dateValue);
          });
        });

        // Watch model for changes
        scope.$watch(attr.ngModel, function(newValue, oldValue) {
          // console.warn('scope.$watch(%s)', attr.ngModel, newValue, oldValue, controller.$dateValue);
          timepicker.update(controller.$dateValue);
        }, true);

        function validateAgainstMinMaxTime(parsedTime) {
          if (!angular.isDate(parsedTime)) return;
          var isMinValid = isNaN(options.minTime) || new Date(parsedTime.getTime()).setFullYear(1970, 0, 1) >= options.minTime;
          var isMaxValid = isNaN(options.maxTime) || new Date(parsedTime.getTime()).setFullYear(1970, 0, 1) <= options.maxTime;
          var isValid = isMinValid && isMaxValid;
          controller.$setValidity('date', isValid);
          controller.$setValidity('min', isMinValid);
          controller.$setValidity('max', isMaxValid);
          // Only update the model when we have a valid date
          if(!isValid) {
              return;
          }
          controller.$dateValue = parsedTime;
        }

        // viewValue -> $parsers -> modelValue
        controller.$parsers.unshift(function(viewValue) {
          // console.warn('$parser("%s"): viewValue=%o', element.attr('ng-model'), viewValue);
          // Null values should correctly reset the model value & validity
          if(!viewValue) {
            // BREAKING CHANGE:
            // return null (not undefined) when input value is empty, so angularjs 1.3
            // ngModelController can go ahead and run validators, like ngRequired
            controller.$setValidity('date', true);
            return null;
          }
          var parsedTime = angular.isDate(viewValue) ? viewValue : dateParser.parse(viewValue, controller.$dateValue);
          if(!parsedTime || isNaN(parsedTime.getTime())) {
            controller.$setValidity('date', false);
            // return undefined, causes ngModelController to
            // invalidate model value
            return;
          } else {
            validateAgainstMinMaxTime(parsedTime);
          }
          if(options.timeType === 'string') {
            return formatDate(parsedTime, options.modelTimeFormat || options.timeFormat);
          } else if(options.timeType === 'number') {
            return controller.$dateValue.getTime();
          } else if(options.timeType === 'unix') {
            return controller.$dateValue.getTime() / 1000;
          } else if(options.timeType === 'iso') {
            return controller.$dateValue.toISOString();
          } else {
            return new Date(controller.$dateValue);
          }
        });

        // modelValue -> $formatters -> viewValue
        controller.$formatters.push(function(modelValue) {
          // console.warn('$formatter("%s"): modelValue=%o (%o)', element.attr('ng-model'), modelValue, typeof modelValue);
          var date;
          if(angular.isUndefined(modelValue) || modelValue === null) {
            date = NaN;
          } else if(angular.isDate(modelValue)) {
            date = modelValue;
          } else if(options.timeType === 'string') {
            date = dateParser.parse(modelValue, null, options.modelTimeFormat);
          } else if(options.timeType === 'unix') {
            date = new Date(modelValue * 1000);
          } else {
            date = new Date(modelValue);
          }
          // Setup default value?
          // if(isNaN(date.getTime())) date = new Date(new Date().setMinutes(0) + 36e5);
          controller.$dateValue = date;
          return getTimeFormattedString();
        });

        // viewValue -> element
        controller.$render = function() {
          // console.warn('$render("%s"): viewValue=%o', element.attr('ng-model'), controller.$viewValue);
          element.val(getTimeFormattedString());
        };

        function getTimeFormattedString() {
          return !controller.$dateValue || isNaN(controller.$dateValue.getTime()) ? '' : formatDate(controller.$dateValue, options.timeFormat);
        }

        // Garbage collection
        scope.$on('$destroy', function() {
          if (timepicker) timepicker.destroy();
          options = null;
          timepicker = null;
        });

      }
    };

  }]);

// Source: tooltip.js
angular.module('mgcrea.ngStrap.tooltip', ['mgcrea.ngStrap.helpers.dimensions'])

  .provider('$tooltip', function() {

    var defaults = this.defaults = {
      animation: 'am-fade',
      customClass: '',
      prefixClass: 'tooltip',
      prefixEvent: 'tooltip',
      container: false,
      target: false,
      placement: 'top',
      template: 'tooltip/tooltip.tpl.html',
      contentTemplate: false,
      trigger: 'hover focus',
      keyboard: false,
      html: false,
      show: false,
      title: '',
      type: '',
      delay: 0,
      autoClose: false,
      bsEnabled: true
    };

    this.$get = ["$window", "$rootScope", "$compile", "$q", "$templateCache", "$http", "$animate", "$sce", "dimensions", "$$rAF", "$timeout", function($window, $rootScope, $compile, $q, $templateCache, $http, $animate, $sce, dimensions, $$rAF, $timeout) {

      var trim = String.prototype.trim;
      var isTouch = 'createTouch' in $window.document;
      var htmlReplaceRegExp = /ng-bind="/ig;
      var $body = angular.element($window.document);

      function TooltipFactory(element, config) {

        var $tooltip = {};

        // Common vars
        var nodeName = element[0].nodeName.toLowerCase();
        var options = $tooltip.$options = angular.extend({}, defaults, config);
        $tooltip.$promise = fetchTemplate(options.template);
        var scope = $tooltip.$scope = options.scope && options.scope.$new() || $rootScope.$new();
        if(options.delay && angular.isString(options.delay)) {
          var split = options.delay.split(',').map(parseFloat);
          options.delay = split.length > 1 ? {show: split[0], hide: split[1]} : split[0];
        }

        // store $id to identify the triggering element in events
        // give priority to options.id, otherwise, try to use
        // element id if defined
        $tooltip.$id = options.id || element.attr('id') || '';

        // Support scope as string options
        if(options.title) {
          scope.title = $sce.trustAsHtml(options.title);
        }

        // Provide scope helpers
        scope.$setEnabled = function(isEnabled) {
          scope.$$postDigest(function() {
            $tooltip.setEnabled(isEnabled);
          });
        };
        scope.$hide = function() {
          scope.$$postDigest(function() {
            $tooltip.hide();
          });
        };
        scope.$show = function() {
          scope.$$postDigest(function() {
            $tooltip.show();
          });
        };
        scope.$toggle = function() {
          scope.$$postDigest(function() {
            $tooltip.toggle();
          });
        };
        // Publish isShown as a protected var on scope
        $tooltip.$isShown = scope.$isShown = false;

        // Private vars
        var timeout, hoverState;

        // Support contentTemplate option
        if(options.contentTemplate) {
          $tooltip.$promise = $tooltip.$promise.then(function(template) {
            var templateEl = angular.element(template);
            return fetchTemplate(options.contentTemplate)
            .then(function(contentTemplate) {
              var contentEl = findElement('[ng-bind="content"]', templateEl[0]);
              if(!contentEl.length) contentEl = findElement('[ng-bind="title"]', templateEl[0]);
              contentEl.removeAttr('ng-bind').html(contentTemplate);
              return templateEl[0].outerHTML;
            });
          });
        }

        // Fetch, compile then initialize tooltip
        var tipLinker, tipElement, tipTemplate, tipContainer, tipScope;
        $tooltip.$promise.then(function(template) {
          if(angular.isObject(template)) template = template.data;
          if(options.html) template = template.replace(htmlReplaceRegExp, 'ng-bind-html="');
          template = trim.apply(template);
          tipTemplate = template;
          tipLinker = $compile(template);
          $tooltip.init();
        });

        $tooltip.init = function() {

          // Options: delay
          if (options.delay && angular.isNumber(options.delay)) {
            options.delay = {
              show: options.delay,
              hide: options.delay
            };
          }

          // Replace trigger on touch devices ?
          // if(isTouch && options.trigger === defaults.trigger) {
          //   options.trigger.replace(/hover/g, 'click');
          // }

          // Options : container
          if(options.container === 'self') {
            tipContainer = element;
          } else if(angular.isElement(options.container)) {
            tipContainer = options.container;
          } else if(options.container) {
            tipContainer = findElement(options.container);
          }

          // Options: trigger
          bindTriggerEvents();

          // Options: target
          if(options.target) {
            options.target = angular.isElement(options.target) ? options.target : findElement(options.target);
          }

          // Options: show
          if(options.show) {
            scope.$$postDigest(function() {
              options.trigger === 'focus' ? element[0].focus() : $tooltip.show();
            });
          }

        };

        $tooltip.destroy = function() {

          // Unbind events
          unbindTriggerEvents();

          // Remove element
          destroyTipElement();

          // Destroy scope
          scope.$destroy();

        };

        $tooltip.enter = function() {

          clearTimeout(timeout);
          hoverState = 'in';
          if (!options.delay || !options.delay.show) {
            return $tooltip.show();
          }

          timeout = setTimeout(function() {
            if (hoverState ==='in') $tooltip.show();
          }, options.delay.show);

        };

        $tooltip.show = function() {
          if (!options.bsEnabled || $tooltip.$isShown) return;

          scope.$emit(options.prefixEvent + '.show.before', $tooltip);
          var parent, after;
          if (options.container) {
            parent = tipContainer;
            if (tipContainer[0].lastChild) {
              after = angular.element(tipContainer[0].lastChild);
            } else {
              after = null;
            }
          } else {
            parent = null;
            after = element;
          }


          // Hide any existing tipElement
          if(tipElement) destroyTipElement();
          // Fetch a cloned element linked from template
          tipScope = $tooltip.$scope.$new();
          tipElement = $tooltip.$element = tipLinker(tipScope, function(clonedElement, scope) {});

          // Set the initial positioning.  Make the tooltip invisible
          // so IE doesn't try to focus on it off screen.
          tipElement.css({top: '-9999px', left: '-9999px', display: 'block', visibility: 'hidden'});

          // Options: animation
          if(options.animation) tipElement.addClass(options.animation);
          // Options: type
          if(options.type) tipElement.addClass(options.prefixClass + '-' + options.type);
          // Options: custom classes
          if(options.customClass) tipElement.addClass(options.customClass);

          // Support v1.3+ $animate
          // https://github.com/angular/angular.js/commit/bf0f5502b1bbfddc5cdd2f138efd9188b8c652a9
          var promise = $animate.enter(tipElement, parent, after, enterAnimateCallback);
          if(promise && promise.then) promise.then(enterAnimateCallback);

          $tooltip.$isShown = scope.$isShown = true;
          safeDigest(scope);
          $$rAF(function () {
            $tooltip.$applyPlacement();

            // Once placed, make the tooltip visible
            if(tipElement) tipElement.css({visibility: 'visible'});
          }); // var a = bodyEl.offsetWidth + 1; ?

          // Bind events
          if(options.keyboard) {
            if(options.trigger !== 'focus') {
              $tooltip.focus();
            }
            bindKeyboardEvents();
          }

          if(options.autoClose) {
            bindAutoCloseEvents();
          }

        };

        function enterAnimateCallback() {
          scope.$emit(options.prefixEvent + '.show', $tooltip);
        }

        $tooltip.leave = function() {

          clearTimeout(timeout);
          hoverState = 'out';
          if (!options.delay || !options.delay.hide) {
            return $tooltip.hide();
          }
          timeout = setTimeout(function () {
            if (hoverState === 'out') {
              $tooltip.hide();
            }
          }, options.delay.hide);

        };

        var _blur;
        var _tipToHide;
        $tooltip.hide = function(blur) {

          if(!$tooltip.$isShown) return;
          scope.$emit(options.prefixEvent + '.hide.before', $tooltip);

          // store blur value for leaveAnimateCallback to use
          _blur = blur;

          // store current tipElement reference to use
          // in leaveAnimateCallback
          _tipToHide = tipElement;

          // Support v1.3+ $animate
          // https://github.com/angular/angular.js/commit/bf0f5502b1bbfddc5cdd2f138efd9188b8c652a9
          var promise = $animate.leave(tipElement, leaveAnimateCallback);
          if(promise && promise.then) promise.then(leaveAnimateCallback);

          $tooltip.$isShown = scope.$isShown = false;
          safeDigest(scope);

          // Unbind events
          if(options.keyboard && tipElement !== null) {
            unbindKeyboardEvents();
          }

          if(options.autoClose && tipElement !== null) {
            unbindAutoCloseEvents();
          }
        };

        function leaveAnimateCallback() {
          scope.$emit(options.prefixEvent + '.hide', $tooltip);

          // check if current tipElement still references
          // the same element when hide was called
          if (tipElement === _tipToHide) {
            // Allow to blur the input when hidden, like when pressing enter key
            if(_blur && options.trigger === 'focus') {
              return element[0].blur();
            }

            // clean up child scopes
            destroyTipElement();
          }
        }

        $tooltip.toggle = function() {
          $tooltip.$isShown ? $tooltip.leave() : $tooltip.enter();
        };

        $tooltip.focus = function() {
          tipElement[0].focus();
        };

        $tooltip.setEnabled = function(isEnabled) {
          options.bsEnabled = isEnabled;
        };

        // Protected methods

        $tooltip.$applyPlacement = function() {
          if(!tipElement) return;

          // Determine if we're doing an auto or normal placement
          var placement = options.placement,
              autoToken = /\s?auto?\s?/i,
              autoPlace  = autoToken.test(placement);

          if (autoPlace) {
            placement = placement.replace(autoToken, '') || defaults.placement;
          }

          // Need to add the position class before we get
          // the offsets
          tipElement.addClass(options.placement);

          // Get the position of the target element
          // and the height and width of the tooltip so we can center it.
          var elementPosition = getPosition(),
              tipWidth = tipElement.prop('offsetWidth'),
              tipHeight = tipElement.prop('offsetHeight');

          // If we're auto placing, we need to check the positioning
          if (autoPlace) {
            var originalPlacement = placement;
            var container = options.container ? angular.element(document.querySelector(options.container)) : element.parent();
            var containerPosition = getPosition(container);

            // Determine if the vertical placement
            if (originalPlacement.indexOf('bottom') >= 0 && elementPosition.bottom + tipHeight > containerPosition.bottom) {
              placement = originalPlacement.replace('bottom', 'top');
            } else if (originalPlacement.indexOf('top') >= 0 && elementPosition.top - tipHeight < containerPosition.top) {
              placement = originalPlacement.replace('top', 'bottom');
            }

            // Determine the horizontal placement
            // The exotic placements of left and right are opposite of the standard placements.  Their arrows are put on the left/right
            // and flow in the opposite direction of their placement.
            if ((originalPlacement === 'right' || originalPlacement === 'bottom-left' || originalPlacement === 'top-left') &&
                elementPosition.right + tipWidth > containerPosition.width) {

              placement = originalPlacement === 'right' ? 'left' : placement.replace('left', 'right');
            } else if ((originalPlacement === 'left' || originalPlacement === 'bottom-right' || originalPlacement === 'top-right') &&
                elementPosition.left - tipWidth < containerPosition.left) {

              placement = originalPlacement === 'left' ? 'right' : placement.replace('right', 'left');
            }

            tipElement.removeClass(originalPlacement).addClass(placement);
          }

          // Get the tooltip's top and left coordinates to center it with this directive.
          var tipPosition = getCalculatedOffset(placement, elementPosition, tipWidth, tipHeight);
          applyPlacementCss(tipPosition.top, tipPosition.left);
        };

        $tooltip.$onKeyUp = function(evt) {
          if (evt.which === 27 && $tooltip.$isShown) {
            $tooltip.hide();
            evt.stopPropagation();
          }
        };

        $tooltip.$onFocusKeyUp = function(evt) {
          if (evt.which === 27) {
            element[0].blur();
            evt.stopPropagation();
          }
        };

        $tooltip.$onFocusElementMouseDown = function(evt) {
          evt.preventDefault();
          evt.stopPropagation();
          // Some browsers do not auto-focus buttons (eg. Safari)
          $tooltip.$isShown ? element[0].blur() : element[0].focus();
        };

        // bind/unbind events
        function bindTriggerEvents() {
          var triggers = options.trigger.split(' ');
          angular.forEach(triggers, function(trigger) {
            if(trigger === 'click') {
              element.on('click', $tooltip.toggle);
            } else if(trigger !== 'manual') {
              element.on(trigger === 'hover' ? 'mouseenter' : 'focus', $tooltip.enter);
              element.on(trigger === 'hover' ? 'mouseleave' : 'blur', $tooltip.leave);
              nodeName === 'button' && trigger !== 'hover' && element.on(isTouch ? 'touchstart' : 'mousedown', $tooltip.$onFocusElementMouseDown);
            }
          });
        }

        function unbindTriggerEvents() {
          var triggers = options.trigger.split(' ');
          for (var i = triggers.length; i--;) {
            var trigger = triggers[i];
            if(trigger === 'click') {
              element.off('click', $tooltip.toggle);
            } else if(trigger !== 'manual') {
              element.off(trigger === 'hover' ? 'mouseenter' : 'focus', $tooltip.enter);
              element.off(trigger === 'hover' ? 'mouseleave' : 'blur', $tooltip.leave);
              nodeName === 'button' && trigger !== 'hover' && element.off(isTouch ? 'touchstart' : 'mousedown', $tooltip.$onFocusElementMouseDown);
            }
          }
        }

        function bindKeyboardEvents() {
          if(options.trigger !== 'focus') {
            tipElement.on('keyup', $tooltip.$onKeyUp);
          } else {
            element.on('keyup', $tooltip.$onFocusKeyUp);
          }
        }

        function unbindKeyboardEvents() {
          if(options.trigger !== 'focus') {
            tipElement.off('keyup', $tooltip.$onKeyUp);
          } else {
            element.off('keyup', $tooltip.$onFocusKeyUp);
          }
        }

        var _autoCloseEventsBinded = false;
        function bindAutoCloseEvents() {
          // use timeout to hookup the events to prevent
          // event bubbling from being processed imediately.
          $timeout(function() {
            // Stop propagation when clicking inside tooltip
            tipElement.on('click', stopEventPropagation);

            // Hide when clicking outside tooltip
            $body.on('click', $tooltip.hide);

            _autoCloseEventsBinded = true;
          }, 0, false);
        }

        function unbindAutoCloseEvents() {
          if (_autoCloseEventsBinded) {
            tipElement.off('click', stopEventPropagation);
            $body.off('click', $tooltip.hide);
            _autoCloseEventsBinded = false;
          }
        }

        function stopEventPropagation(event) {
          event.stopPropagation();
        }

        // Private methods

        function getPosition($element) {
          $element = $element || (options.target || element);

          var el = $element[0];

          var elRect = el.getBoundingClientRect();
          if (elRect.width === null) {
            // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
            elRect = angular.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top });
          }

          var elPos;
          if (options.container === 'body') {
            elPos = dimensions.offset(el);
          } else {
            elPos = dimensions.position(el);
          }

          return angular.extend({}, elRect, elPos);
        }

        function getCalculatedOffset(placement, position, actualWidth, actualHeight) {
          var offset;
          var split = placement.split('-');

          switch (split[0]) {
          case 'right':
            offset = {
              top: position.top + position.height / 2 - actualHeight / 2,
              left: position.left + position.width
            };
            break;
          case 'bottom':
            offset = {
              top: position.top + position.height,
              left: position.left + position.width / 2 - actualWidth / 2
            };
            break;
          case 'left':
            offset = {
              top: position.top + position.height / 2 - actualHeight / 2,
              left: position.left - actualWidth
            };
            break;
          default:
            offset = {
              top: position.top - actualHeight,
              left: position.left + position.width / 2 - actualWidth / 2
            };
            break;
          }

          if(!split[1]) {
            return offset;
          }

          // Add support for corners @todo css
          if(split[0] === 'top' || split[0] === 'bottom') {
            switch (split[1]) {
            case 'left':
              offset.left = position.left;
              break;
            case 'right':
              offset.left =  position.left + position.width - actualWidth;
            }
          } else if(split[0] === 'left' || split[0] === 'right') {
            switch (split[1]) {
            case 'top':
              offset.top = position.top - actualHeight;
              break;
            case 'bottom':
              offset.top = position.top + position.height;
            }
          }

          return offset;
        }

        function applyPlacementCss(top, left) {
          tipElement.css({ top: top + 'px', left: left + 'px' });
        }

        function destroyTipElement() {
          // Cancel pending callbacks
          clearTimeout(timeout);

          if($tooltip.$isShown && tipElement !== null) {
            if(options.autoClose) {
              unbindAutoCloseEvents();
            }

            if(options.keyboard) {
              unbindKeyboardEvents();
            }
          }

          if(tipScope) {
            tipScope.$destroy();
            tipScope = null;
          }

          if(tipElement) {
            tipElement.remove();
            tipElement = $tooltip.$element = null;
          }
        }

        return $tooltip;

      }

      // Helper functions

      function safeDigest(scope) {
        scope.$$phase || (scope.$root && scope.$root.$$phase) || scope.$digest();
      }

      function findElement(query, element) {
        return angular.element((element || document).querySelectorAll(query));
      }

      var fetchPromises = {};
      function fetchTemplate(template) {
        if(fetchPromises[template]) return fetchPromises[template];
        return (fetchPromises[template] = $q.when($templateCache.get(template) || $http.get(template))
        .then(function(res) {
          if(angular.isObject(res)) {
            $templateCache.put(template, res.data);
            return res.data;
          }
          return res;
        }));
      }

      return TooltipFactory;

    }];

  })

  .directive('bsTooltip', ["$window", "$location", "$sce", "$tooltip", "$$rAF", function($window, $location, $sce, $tooltip, $$rAF) {

    return {
      restrict: 'EAC',
      scope: true,
      link: function postLink(scope, element, attr, transclusion) {

        // Directive options
        var options = {scope: scope};
        angular.forEach(['template', 'contentTemplate', 'placement', 'container', 'target', 'delay', 'trigger', 'keyboard', 'html', 'animation', 'backdropAnimation', 'type', 'customClass', 'id'], function(key) {
          if(angular.isDefined(attr[key])) options[key] = attr[key];
        });

        // overwrite inherited title value when no value specified
        // fix for angular 1.3.1 531a8de72c439d8ddd064874bf364c00cedabb11
        if (!scope.hasOwnProperty('title')){
          scope.title = '';
        }

        // Observe scope attributes for change
        attr.$observe('title', function(newValue) {
          if (angular.isDefined(newValue) || !scope.hasOwnProperty('title')) {
            var oldValue = scope.title;
            scope.title = $sce.trustAsHtml(newValue);
            angular.isDefined(oldValue) && $$rAF(function() {
              tooltip && tooltip.$applyPlacement();
            });
          }
        });

        // Support scope as an object
        attr.bsTooltip && scope.$watch(attr.bsTooltip, function(newValue, oldValue) {
          if(angular.isObject(newValue)) {
            angular.extend(scope, newValue);
          } else {
            scope.title = newValue;
          }
          angular.isDefined(oldValue) && $$rAF(function() {
            tooltip && tooltip.$applyPlacement();
          });
        }, true);

        // Visibility binding support
        attr.bsShow && scope.$watch(attr.bsShow, function(newValue, oldValue) {
          if(!tooltip || !angular.isDefined(newValue)) return;
          if(angular.isString(newValue)) newValue = !!newValue.match(/true|,?(tooltip),?/i);
          newValue === true ? tooltip.show() : tooltip.hide();
        });

        // Enabled binding support
        attr.bsEnabled && scope.$watch(attr.bsEnabled, function(newValue, oldValue) {
          // console.warn('scope.$watch(%s)', attr.bsEnabled, newValue, oldValue);
          if(!tooltip || !angular.isDefined(newValue)) return;
          if(angular.isString(newValue)) newValue = !!newValue.match(/true|1|,?(tooltip),?/i);
          newValue === false ? tooltip.setEnabled(false) : tooltip.setEnabled(true);
        });

        // Initialize popover
        var tooltip = $tooltip(element, options);

        // Garbage collection
        scope.$on('$destroy', function() {
          if(tooltip) tooltip.destroy();
          options = null;
          tooltip = null;
        });

      }
    };

  }]);

// Source: typeahead.js
angular.module('mgcrea.ngStrap.typeahead', ['mgcrea.ngStrap.tooltip', 'mgcrea.ngStrap.helpers.parseOptions'])

  .provider('$typeahead', function() {

    var defaults = this.defaults = {
      animation: 'am-fade',
      prefixClass: 'typeahead',
      prefixEvent: '$typeahead',
      placement: 'bottom-left',
      template: 'typeahead/typeahead.tpl.html',
      trigger: 'focus',
      container: false,
      keyboard: true,
      html: false,
      delay: 0,
      minLength: 1,
      filter: 'filter',
      limit: 6,
      comparator: ''
    };

    this.$get = ["$window", "$rootScope", "$tooltip", "$timeout", function($window, $rootScope, $tooltip, $timeout) {

      var bodyEl = angular.element($window.document.body);

      function TypeaheadFactory(element, controller, config) {

        var $typeahead = {};

        // Common vars
        var options = angular.extend({}, defaults, config);

        $typeahead = $tooltip(element, options);
        var parentScope = config.scope;
        var scope = $typeahead.$scope;

        scope.$resetMatches = function(){
          scope.$matches = [];
          scope.$activeIndex = 0;
        };
        scope.$resetMatches();

        scope.$activate = function(index) {
          scope.$$postDigest(function() {
            $typeahead.activate(index);
          });
        };

        scope.$select = function(index, evt) {
          scope.$$postDigest(function() {
            $typeahead.select(index);
          });
        };

        scope.$isVisible = function() {
          return $typeahead.$isVisible();
        };

        // Public methods

        $typeahead.update = function(matches) {
          scope.$matches = matches;
          if(scope.$activeIndex >= matches.length) {
            scope.$activeIndex = 0;
          }
        };

        $typeahead.activate = function(index) {
          scope.$activeIndex = index;
        };

        $typeahead.select = function(index) {
          var value = scope.$matches[index].value;
          // console.log('$setViewValue', value);
          controller.$setViewValue(value);
          controller.$render();
          scope.$resetMatches();
          if(parentScope) parentScope.$digest();
          // Emit event
          scope.$emit(options.prefixEvent + '.select', value, index, $typeahead);
        };

        // Protected methods

        $typeahead.$isVisible = function() {
          if(!options.minLength || !controller) {
            return !!scope.$matches.length;
          }
          // minLength support
          return scope.$matches.length && angular.isString(controller.$viewValue) && controller.$viewValue.length >= options.minLength;
        };

        $typeahead.$getIndex = function(value) {
          var l = scope.$matches.length, i = l;
          if(!l) return;
          for(i = l; i--;) {
            if(scope.$matches[i].value === value) break;
          }
          if(i < 0) return;
          return i;
        };

        $typeahead.$onMouseDown = function(evt) {
          // Prevent blur on mousedown
          evt.preventDefault();
          evt.stopPropagation();
        };

        $typeahead.$onKeyDown = function(evt) {
          if(!/(38|40|13)/.test(evt.keyCode)) return;

          // Let ngSubmit pass if the typeahead tip is hidden
          if($typeahead.$isVisible()) {
            evt.preventDefault();
            evt.stopPropagation();
          }

          // Select with enter
          if(evt.keyCode === 13 && scope.$matches.length) {
            $typeahead.select(scope.$activeIndex);
          }

          // Navigate with keyboard
          else if(evt.keyCode === 38 && scope.$activeIndex > 0) scope.$activeIndex--;
          else if(evt.keyCode === 40 && scope.$activeIndex < scope.$matches.length - 1) scope.$activeIndex++;
          else if(angular.isUndefined(scope.$activeIndex)) scope.$activeIndex = 0;
          scope.$digest();
        };

        // Overrides

        var show = $typeahead.show;
        $typeahead.show = function() {
          show();
          // use timeout to hookup the events to prevent
          // event bubbling from being processed imediately.
          $timeout(function() {
            $typeahead.$element.on('mousedown', $typeahead.$onMouseDown);
            if(options.keyboard) {
              element.on('keydown', $typeahead.$onKeyDown);
            }
          }, 0, false);
        };

        var hide = $typeahead.hide;
        $typeahead.hide = function() {
          $typeahead.$element.off('mousedown', $typeahead.$onMouseDown);
          if(options.keyboard) {
            element.off('keydown', $typeahead.$onKeyDown);
          }
          hide();
        };

        return $typeahead;

      }

      TypeaheadFactory.defaults = defaults;
      return TypeaheadFactory;

    }];

  })

  .directive('bsTypeahead', ["$window", "$parse", "$q", "$typeahead", "$parseOptions", function($window, $parse, $q, $typeahead, $parseOptions) {

    var defaults = $typeahead.defaults;

    return {
      restrict: 'EAC',
      require: 'ngModel',
      link: function postLink(scope, element, attr, controller) {

        // Directive options
        var options = {scope: scope};
        angular.forEach(['placement', 'container', 'delay', 'trigger', 'keyboard', 'html', 'animation', 'template', 'filter', 'limit', 'minLength', 'watchOptions', 'selectMode', 'comparator', 'id'], function(key) {
          if(angular.isDefined(attr[key])) options[key] = attr[key];
        });

        // Build proper ngOptions
        var filter = options.filter || defaults.filter;
        var limit = options.limit || defaults.limit;
        var comparator = options.comparator || defaults.comparator;

        var ngOptions = attr.ngOptions;
        if(filter) ngOptions += ' | ' + filter + ':$viewValue';
        if (comparator) ngOptions += ':' + comparator;
        if(limit) ngOptions += ' | limitTo:' + limit;
        var parsedOptions = $parseOptions(ngOptions);

        // Initialize typeahead
        var typeahead = $typeahead(element, controller, options);

        // Watch options on demand
        if(options.watchOptions) {
          // Watch ngOptions values before filtering for changes, drop function calls
          var watchedOptions = parsedOptions.$match[7].replace(/\|.+/, '').replace(/\(.*\)/g, '').trim();
          scope.$watch(watchedOptions, function (newValue, oldValue) {
            // console.warn('scope.$watch(%s)', watchedOptions, newValue, oldValue);
            parsedOptions.valuesFn(scope, controller).then(function (values) {
              typeahead.update(values);
              controller.$render();
            });
          }, true);
        }

        // Watch model for changes
        scope.$watch(attr.ngModel, function(newValue, oldValue) {
          // console.warn('$watch', element.attr('ng-model'), newValue);
          scope.$modelValue = newValue; // Publish modelValue on scope for custom templates
          parsedOptions.valuesFn(scope, controller)
          .then(function(values) {
            // Prevent input with no future prospect if selectMode is truthy
            // @TODO test selectMode
            if(options.selectMode && !values.length && newValue.length > 0) {
              controller.$setViewValue(controller.$viewValue.substring(0, controller.$viewValue.length - 1));
              return;
            }
            if(values.length > limit) values = values.slice(0, limit);
            var isVisible = typeahead.$isVisible();
            isVisible && typeahead.update(values);
            // Do not re-queue an update if a correct value has been selected
            if(values.length === 1 && values[0].value === newValue) return;
            !isVisible && typeahead.update(values);
            // Queue a new rendering that will leverage collection loading
            controller.$render();
          });
        });

        // modelValue -> $formatters -> viewValue
        controller.$formatters.push(function(modelValue) {
          // console.warn('$formatter("%s"): modelValue=%o (%o)', element.attr('ng-model'), modelValue, typeof modelValue);
          var displayValue = parsedOptions.displayValue(modelValue);
          return displayValue === undefined ? '' : displayValue;
        });

        // Model rendering in view
        controller.$render = function () {
          // console.warn('$render', element.attr('ng-model'), 'controller.$modelValue', typeof controller.$modelValue, controller.$modelValue, 'controller.$viewValue', typeof controller.$viewValue, controller.$viewValue);
          if(controller.$isEmpty(controller.$viewValue)) return element.val('');
          var index = typeahead.$getIndex(controller.$modelValue);
          var selected = angular.isDefined(index) ? typeahead.$scope.$matches[index].label : controller.$viewValue;
          selected = angular.isObject(selected) ? parsedOptions.displayValue(selected) : selected;
          element.val(selected ? selected.toString().replace(/<(?:.|\n)*?>/gm, '').trim() : '');
        };

        // Garbage collection
        scope.$on('$destroy', function() {
          if (typeahead) typeahead.destroy();
          options = null;
          typeahead = null;
        });

      }
    };

  }]);

})(window, document);


/***/ },

/***/ "../node_modules/angular-strap/src/datepicker/datepicker.tpl.html":
/***/ function(module, exports) {

module.exports = "<div class=\"dropdown-menu datepicker\" ng-class=\"'datepicker-mode-' + $mode\" style=max-width:320px>\n<table style=table-layout:fixed;height:100%;width:100%>\n  <thead>\n    <tr class=text-center>\n      <th>\n        <button tabindex=-1 type=button class=\"btn btn-default pull-left\" ng-click=$selectPane(-1)>\n          <i class={{$iconLeft}}></i>\n        </button>\n      </th>\n      <th colspan=\"{{ rows[0].length - 2 }}\">\n        <button tabindex=-1 type=button class=\"btn btn-default btn-block text-strong\" ng-click=$toggleMode()>\n          <strong style=text-transform:capitalize ng-bind=title></strong>\n        </button>\n      </th>\n      <th>\n        <button tabindex=-1 type=button class=\"btn btn-default pull-right\" ng-click=$selectPane(+1)>\n          <i class={{$iconRight}}></i>\n        </button>\n      </th>\n    </tr>\n    <tr ng-show=showLabels ng-bind-html=labels></tr>\n  </thead>\n  <tbody>\n    <tr ng-repeat=\"(i, row) in rows\" height=\"{{ 100 / rows.length }}%\">\n      <td class=text-center ng-repeat=\"(j, el) in row\">\n        <button tabindex=-1 type=button class=\"btn btn-default\" style=width:100% ng-class=\"{'btn-primary': el.selected, 'btn-info btn-today': el.isToday && !el.selected}\" ng-click=$select(el.date) ng-disabled=el.disabled>\n          <span ng-class=\"{'text-muted': el.muted}\" ng-bind=el.label></span>\n        </button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n</div>\n";

/***/ },

/***/ "../node_modules/file-loader/index.js?name=assets/aside.html!./modules/docs/templates/aside.inc":
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "assets/aside.html";

/***/ },

/***/ "../node_modules/file-loader/index.js?name=assets/config/[name].[ext]!./modules/docs/assets/config/docsConfig.json":
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "assets/config/docsConfig.json";

/***/ },

/***/ "../node_modules/highlightjs/styles/github.css":
/***/ function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ },

/***/ "../node_modules/json-loader/index.js!./modules/docs/assets/language/enAU.json":
/***/ function(module, exports) {

module.exports = {
	"FIELD_ERROR": {
		"TEMPLATE": {
			"REQUIRED": "Please enter {{pronoun}} {{fieldLabel}}."
		},
		"NAME_REQUIRED": "@:ERROR.TEMPLATE.REQUIRED",
		"TITLE_REQUIRED": "@:ERROR.TEMPLATE.REQUIRED",
		"TEXT_ERROR": " Text error from translation file."
	},
	"FIELD": {
		"TITLE": "Title (from translation file)",
		"LABEL": "Label (from translation file)",
		"LABEL_SUFFIX": "40 chars max (from translation file)"
	},
	"OTHER": {
		"HINT": "This is a hint from the translation file",
		"PLACEHOLDER": "Select an item from the translation file"
	}
};

/***/ },

/***/ "./modules/common/Utility.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);


var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLib.common.utility', []);

/* harmony default export */ exports["a"] = mod.name;

mod.constant('ngFormLibDateUtil', {
  convertDate: function convertDate(dateStr, newSep) {
    // Converts a date between dd/mm/yyyy and yyyy-mm-dd
    if (!dateStr || !newSep || !(newSep === '/' || newSep === '-')) {
      return dateStr;
    }

    // Choose a separator string that is the 'opposite' of the desired separator
    var oldSep = newSep === '/' ? '-' : '/';
    var parts = dateStr.split(oldSep);

    // if we get a dodgy date OR you tried to convert a date that was already in the correct format, return the input
    if (isNaN(parts.join('')) || parts.length !== 3) {
      return dateStr;
    }

    // Swap the year and day parts around
    return parts[2] + newSep + parts[1] + newSep + parts[0];
  },
  formatDay: function formatDay(dayOrDate, month, year) {
    var dd = dayOrDate;
    var mm = month;
    var yyyy = year;

    if (dayOrDate.getUTCDay) {
      dd = dayOrDate.getDate();
      mm = dayOrDate.getMonth() + 1; // January is 0!`
      yyyy = dayOrDate.getFullYear();
    }
    return (dd < 10 ? '0' + dd : dd) + '/' + (mm < 10 ? '0' + mm : mm) + '/' + yyyy;
  },
  dateAdd: function dateAdd(dateStr, numDays) {
    // Return a modified date in ISO format
    var myDate = this.getDate(dateStr);

    myDate.setDate(myDate.getDate() + numDays);

    return this.formatDay(myDate);
  },
  getToday: function getToday(optionalDate) {
    return this.formatDay(optionalDate || new Date());
  },
  isISODate: function isISODate(dateStr) {
    return typeof dateStr === 'string' && dateStr.indexOf('-') > 0;
  },
  getDate: function getDate(dateStr) {
    if (!this.isISODate(dateStr)) {
      dateStr = this.convertDate(dateStr, '-');
    }
    return new Date(dateStr);
  },
  monthsBetween: function monthsBetween(date1, date2) {
    return date2.getMonth() - date1.getMonth() + 12 * (date2.getFullYear() - date1.getFullYear()); // eslint-disable-line no-extra-parens
  }
});

mod.constant('ngFormLibStringUtil', function () {
  var trimRegExp = /^\s+|\s+$/g;

  return {
    trim: function trim(text) {
      if (typeof text === 'string') {
        return text.replace(trimRegExp, '');
      }
      return text;
    }
  };
}());

mod.constant('ngFormLibNumberUtil', function () {
  var isDigitsRegExp = /^\d+$/;

  return {
    isDigits: function isDigits(text) {
      return isDigitsRegExp.test(text);
    }
  };
}());

mod.constant('ngFormLibObjectUtil', {
  getUniqueId: function getUniqueId() {
    return ('' + new Date().getTime() + Math.random()).replace(/\./, '');
  },
  toArray: function toArray(obj) {
    var arr = [];

    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        arr[arr.length] = { key: i, value: obj[i] };
      }
    }
    arr.sort(function compare(a, b) {
      return a.key < b.key;
    });
    return arr;
  }
});

/***/ },

/***/ "./modules/docs/docFixtures.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ngFormLib_controls_common_docs_formControlsCommon_docs__ = __webpack_require__("./modules/ngFormLib/controls/common/docs/formControlsCommon.docs.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ngFormLib_controls_common_docs_formControlsCommonProperties_docs__ = __webpack_require__("./modules/ngFormLib/controls/common/docs/formControlsCommonProperties.docs.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ngFormLib_controls_common_docs_formControlsDemos_docs__ = __webpack_require__("./modules/ngFormLib/controls/common/docs/formControlsDemos.docs.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ngFormLib_controls_common_docs_formControlService_docs__ = __webpack_require__("./modules/ngFormLib/controls/common/docs/formControlService.docs.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ngFormLib_policy_docs_formPolicy_docs__ = __webpack_require__("./modules/ngFormLib/policy/docs/formPolicy.docs.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ngFormLib_controls_formSubmit_docs_formSubmit_docs__ = __webpack_require__("./modules/ngFormLib/controls/formSubmit/docs/formSubmit.docs.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ngFormLib_controls_formReset_docs_formReset_docs__ = __webpack_require__("./modules/ngFormLib/controls/formReset/docs/formReset.docs.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ngFormLib_controls_formInput_docs_formInput_docs__ = __webpack_require__("./modules/ngFormLib/controls/formInput/docs/formInput.docs.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ngFormLib_controls_formCheckbox_docs_formCheckbox_docs__ = __webpack_require__("./modules/ngFormLib/controls/formCheckbox/docs/formCheckbox.docs.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ngFormLib_controls_formRadioButton_docs_formRadioButton_docs__ = __webpack_require__("./modules/ngFormLib/controls/formRadioButton/docs/formRadioButton.docs.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__ngFormLib_controls_formSelect_docs_formSelect_docs__ = __webpack_require__("./modules/ngFormLib/controls/formSelect/docs/formSelect.docs.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__ngFormLib_controls_formDate_docs_formDate_docs__ = __webpack_require__("./modules/ngFormLib/controls/formDate/docs/formDate.docs.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__ngFormLib_controls_errorMessageContainer_docs_errorMessageContainer_docs__ = __webpack_require__("./modules/ngFormLib/controls/errorMessageContainer/docs/errorMessageContainer.docs.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__ngFormLib_controls_requiredMarker_docs_requiredMarker_docs__ = __webpack_require__("./modules/ngFormLib/controls/requiredMarker/docs/requiredMarker.docs.js");


// import all of the documentation JS files
// There should be a nicer way to do this, but this won't change very often...















var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLibDocs.docs.fixtures', [__WEBPACK_IMPORTED_MODULE_1__ngFormLib_controls_common_docs_formControlsCommon_docs__["a" /* default */], __WEBPACK_IMPORTED_MODULE_2__ngFormLib_controls_common_docs_formControlsCommonProperties_docs__["a" /* default */], __WEBPACK_IMPORTED_MODULE_3__ngFormLib_controls_common_docs_formControlsDemos_docs__["a" /* default */], __WEBPACK_IMPORTED_MODULE_4__ngFormLib_controls_common_docs_formControlService_docs__["a" /* default */], __WEBPACK_IMPORTED_MODULE_5__ngFormLib_policy_docs_formPolicy_docs__["a" /* default */], __WEBPACK_IMPORTED_MODULE_7__ngFormLib_controls_formReset_docs_formReset_docs__["a" /* default */], __WEBPACK_IMPORTED_MODULE_6__ngFormLib_controls_formSubmit_docs_formSubmit_docs__["a" /* default */], __WEBPACK_IMPORTED_MODULE_8__ngFormLib_controls_formInput_docs_formInput_docs__["a" /* default */], __WEBPACK_IMPORTED_MODULE_9__ngFormLib_controls_formCheckbox_docs_formCheckbox_docs__["a" /* default */], __WEBPACK_IMPORTED_MODULE_10__ngFormLib_controls_formRadioButton_docs_formRadioButton_docs__["a" /* default */], __WEBPACK_IMPORTED_MODULE_11__ngFormLib_controls_formSelect_docs_formSelect_docs__["a" /* default */], __WEBPACK_IMPORTED_MODULE_12__ngFormLib_controls_formDate_docs_formDate_docs__["a" /* default */], __WEBPACK_IMPORTED_MODULE_13__ngFormLib_controls_errorMessageContainer_docs_errorMessageContainer_docs__["a" /* default */], __WEBPACK_IMPORTED_MODULE_14__ngFormLib_controls_requiredMarker_docs_requiredMarker_docs__["a" /* default */]]);

/* harmony default export */ exports["a"] = mod.name;

/***/ },

/***/ "./modules/docs/docs.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angular_animate__ = __webpack_require__("../node_modules/angular-animate/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angular_animate___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_angular_animate__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_angular_strap__ = __webpack_require__("../node_modules/angular-strap/dist/angular-strap.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_angular_strap___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_angular_strap__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_highlightjs_highlight_pack_js__ = __webpack_require__("../node_modules/highlightjs/highlight.pack.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_highlightjs_highlight_pack_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_highlightjs_highlight_pack_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ngFormLib__ = __webpack_require__("./modules/ngFormLib/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_angular_translate__ = __webpack_require__("../node_modules/angular-translate/dist/angular-translate.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_angular_translate___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_angular_translate__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__docFixtures__ = __webpack_require__("./modules/docs/docFixtures.js");

 // Allows animations to run
 // No export, currently




// import all of the documentation JS files


var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLibDocs.docs', ['mgcrea.ngStrap', __WEBPACK_IMPORTED_MODULE_4__ngFormLib__["ngFormLib"], __WEBPACK_IMPORTED_MODULE_4__ngFormLib__["defaultPolicies"], __WEBPACK_IMPORTED_MODULE_1_angular_animate___default.a, __WEBPACK_IMPORTED_MODULE_5_angular_translate___default.a,

// require ALL of the docs /demo components
__WEBPACK_IMPORTED_MODULE_6__docFixtures__["a" /* default */]]);

/* harmony default export */ exports["a"] = mod.name;

// Needed to bind to HTML and compile it when it is loaded
mod.directive('bindCompile', ['$compile', function ($compile) {
  return {
    restrict: 'A',
    replace: true,
    link: function link(scope, element, attrs) {
      scope.$watch(attrs.bindCompile, function (html) {
        element[0].innerHTML = html;
        $compile(element.contents())(scope);
      });
    }
  };
}]);

mod.config(['$locationProvider', function ($locationProvider) {
  // configure html5 to get links working on jsfiddle
  $locationProvider.html5Mode(false);
}]);

mod.config(['$anchorScrollProvider', function ($anchorScrollProvider) {
  $anchorScrollProvider.disableAutoScrolling();
}]);

mod.config(['$translateProvider', function ($translateProvider) {
  var translations = __webpack_require__("../node_modules/json-loader/index.js!./modules/docs/assets/language/enAU.json");

  $translateProvider.translations('enAU', translations);
  $translateProvider.preferredLanguage('enAU');
  $translateProvider.useSanitizeValueStrategy(null);
}]);

// Set the field-error-focus-scroll-position, to allow for the website's fixed header
mod.config(['formPolicyBehaviourOnStateChangeProvider', function (stateChangeBehavePolicy) {
  stateChangeBehavePolicy.config.fieldFocusScrollOffset = 80;
}]);

mod.config(['formPolicyAccessibilityBehaviourProvider', 'formPolicyAccessibilityLibrary', function (a11yPolicy, lib) {
  // Configure the formPolicyAccessibilityBehaviour to use the short-error version of the onErrorChangeBehaviour
  a11yPolicy.config.onErrorChangeBehaviour = lib.createShortErrorDescription;
}]);

// mod.config(['formPolicyCheckForStateChangesProvider', 'formPolicyCheckForStateChangesLibrary', function(statePolicy, lib) {
//  // DEMO: Check for errors as soon as the control is changed
//  statePolicy.config.checker = lib.onChange;
// }]);

// mod.config(['formPolicyStateDefinitionsProvider', 'formPolicyErrorDefinitionLibrary', function(stateDefs, errorLib) {
//  // DEMO: Show errors immediately
//  stateDefs.config.states.error = errorLib.immediately;
// }]);


mod.controller('MainController', ['$http', function Controller($http) {
  var vm = this; // view-model

  // Fetch the documentation config and store it on the rootScope (for laughs :)
  var fileName = __webpack_require__("../node_modules/file-loader/index.js?name=assets/config/[name].[ext]!./modules/docs/assets/config/docsConfig.json");

  $http.get(fileName).then(function (result) {
    vm.DOC_CONFIG = result.data;
    vm.REPO_HOST = result.data.repository.host;
    vm.REPO = vm.REPO_HOST + result.data.repository.branch;
    vm.VERSION = result.data.version;
  });
}]);

mod.directive('docsComponent', [function () {
  return {
    restrict: 'A', // IE8 support
    controller: 'MainController',
    controllerAs: 'mainCtrl',
    template: __webpack_require__("./modules/docs/templates/docs-component.html")
  };
}]);

mod.directive('docsNavbar', [function () {
  __webpack_require__("../node_modules/file-loader/index.js?name=assets/aside.html!./modules/docs/templates/aside.inc"); // If the file is called *.html, it gets wrapped inside a JS module. This gives us just the HTML
  return {
    restrict: 'A', // IE8 support
    template: __webpack_require__("./modules/docs/templates/navbar.html")
  };
}]);

mod.directive('docsHeader', [function () {
  return {
    restrict: 'A', // IE8 support
    template: __webpack_require__("./modules/docs/templates/header.html")
  };
}]);

mod.directive('docsFooter', [function () {
  return {
    restrict: 'A', // IE8 support
    template: __webpack_require__("./modules/docs/templates/footer.html")
  };
}]);

mod.directive('docsAffixedSidenav', [function () {
  return {
    restrict: 'A', // IE8 support
    template: __webpack_require__("./modules/docs/templates/affixed-sidenav.html")
  };
}]);

mod.directive('docsSidenav', [function () {
  return {
    restrict: 'A', // IE8 support
    template: __webpack_require__("./modules/docs/templates/sidenav.html")
  };
}]);

mod.directive('docsGettingStarted', [function () {
  return {
    restrict: 'A', // IE8 support
    template: __webpack_require__("./modules/docs/templates/getting-started.html")
  };
}]);

// These directives are purely needed for documentation purposes
mod.directive('code', function () {
  return { restrict: 'E', terminal: true };
});

mod.directive('appendSource', ['$compile', 'indent', function ($compile, indent) {
  return {
    compile: function compile(element, attr) {
      // Directive options
      var options = { placement: 'after' };

      __WEBPACK_IMPORTED_MODULE_0_angular___default.a.forEach(['placement', 'hlClass'], function (key) {
        if (__WEBPACK_IMPORTED_MODULE_0_angular___default.a.isDefined(attr[key])) {
          options[key] = attr[key];
        }
      });

      var hlElement = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.element('<div class="highlight" ng-non-bindable><pre><code class="html" style="margin:0"></code></pre></div>');
      var codeElement = hlElement.children('pre').children('code');
      var elementHtml = indent(element.html());

      codeElement.text(elementHtml);
      if (options.hlClass) {
        codeElement.addClass(options.hlClass);
      }
      element[options.placement](hlElement);
      __WEBPACK_IMPORTED_MODULE_3_highlightjs_highlight_pack_js___default.a.highlightBlock(codeElement[0]);
    }
  };
}]);

mod.directive('highlightBlock', ['indent', function (indent) {
  return {
    compile: function compile(element) {
      element.html(indent(element.html()));
      return function postLink(scope, element) {
        __WEBPACK_IMPORTED_MODULE_3_highlightjs_highlight_pack_js___default.a.highlightBlock(element[0]);
      };
    }
  };
}]);

mod.value('indent', function (text, spaces) {
  if (!text) {
    return text;
  }
  var lines = text.split(/\r?\n/);
  var prefix = '      '.substr(0, spaces || 0);
  var i = void 0;

  // Remove any leading blank lines
  while (lines.length && lines[0].match(/^\s*$/)) {
    lines.shift();
  }
  // Remove any trailing blank lines
  while (lines.length && lines[lines.length - 1].match(/^\s*$/)) {
    lines.pop();
  }
  // Calculate proper indent
  var minIndent = 999;

  for (i = 0; i < lines.length; i++) {
    var line = lines[0];
    var indent = line.match(/^\s*/)[0];

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
mod.directive('ahref', ['$location', '$document', 'scrollContainerAPI', 'duScrollDuration', function ($location, $document, scrollContainerAPI, duScrollDuration) {
  return {
    restrict: 'A',
    link: function link(scope, element, attrs) {
      element.on('click', function () {
        // The anchor reference should be valid
        var ahref = attrs.ahref;

        if (!ahref || ahref.indexOf('#') === -1) {
          return;
        }
        var elemId = ahref.replace(/.*(?=#[^\s]+$)/, '').substring(1);

        // Only add the scroll to the history if directed to
        if (attrs.useHash) {
          $location.hash(elemId); // Change the URL
          scope.$apply();
        }
        var target = $document[0].getElementById(elemId);

        if (!target || !target.getBoundingClientRect) {
          return;
        }

        var offset = parseInt(attrs.scrollOffset || 0) + (attrs.scrollBottom === 'true' ? -target.offsetHeight : 0);
        var duration = attrs.duration ? parseInt(attrs.duration, 10) : duScrollDuration;
        var container = scrollContainerAPI.getContainer(scope);

        container.scrollToElement(__WEBPACK_IMPORTED_MODULE_0_angular___default.a.element(target), isNaN(offset) ? 0 : offset, isNaN(duration) ? 0 : duration);
      });
    }
  };
}]);

/***/ },

/***/ "./modules/docs/index.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__docs__ = __webpack_require__("./modules/docs/docs.js");



var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLibDocs', [__WEBPACK_IMPORTED_MODULE_1__docs__["a" /* default */]]);

/* harmony default export */ exports["default"] = mod.name;

/***/ },

/***/ "./modules/docs/styles/docs.styl":
/***/ function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ },

/***/ "./modules/docs/templates/affixed-sidenav.html":
/***/ function(module, exports) {

module.exports = "<div class=\"bs-sidebar hidden-print\" role=complementary data-offset-top=-100 bs-affix bs-scrollspy-list docs-sidenav></div>\n";

/***/ },

/***/ "./modules/docs/templates/docs-component.html":
/***/ function(module, exports) {

module.exports = "<div docs-navbar></div>\n<div docs-header></div>\n\n<div role=content>\n  <div class=container>\n    <main role=main class=main>\n\n      <div class=row>\n        <div class=\"col-md-2 hidden-sm hidden-xs\">\n          <div docs-affixed-sidenav></div>\n        </div>\n        <div class=col-md-10>\n          <div docs-getting-started></div>\n          <div id=directives>\n            <div ng-repeat=\"menuContent in mainCtrl.DOC_CONFIG.sitemap\" bind-compile=menuContent.template></div>\n          </div>\n          <div docs-footer></div>\n        </div>\n      </div>\n    </main>\n  </div>\n</div>\n";

/***/ },

/***/ "./modules/docs/templates/footer.html":
/***/ function(module, exports) {

module.exports = "<footer class=bs-footer>\n  <p class=pull-right><a href=#>Back to top</a></p>\n  <p>Documentation based upon <a href=http://http://mgcrea.github.io/angular-strap target=_blank>AngularStrap</a> created by <a href=\"//plus.google.com/+OlivierLouvignes/posts?rel=author\" target=_blank>Olivier Louvignes</a>.</p>\n  <p>Using <a href=http://twitter.github.com/bootstrap target=_blank>Twitter Bootstrap</a> and the <a href=css/doc.css target=_blank>Bootstrap's docs styles</a> designed and built by <a href=http://twitter.com/mdo target=_blank>@mdo</a> and <a href=http://twitter.com/fat target=_blank>@fat</a>.</p>\n  <p>Code licensed under <a href={{mainCtrl.REPO}}LICENSE.md target=_blank>The MIT License</a>, documentation under <a href=http://creativecommons.org/licenses/by/3.0/ >CC BY 3.0</a>.</p>\n  <ul class=footer-links>\n    <li><a href=\"{{mainCtrl.REPO_HOST}}issues?state=open\">Issues</a>\n    </li>\n    <li class=muted>·</li>\n    <li><a href={{mainCtrl.REPO_HOST}}wiki>Roadmap and changelog</a>\n    </li>\n    <li class=muted>·</li>\n      <li><a href={{mainCtrl.REPO_HOST}}releases>Releases</a>\n    </li>\n  </ul>\n</footer>\n";

/***/ },

/***/ "./modules/docs/templates/getting-started.html":
/***/ function(module, exports) {

module.exports = "<div class=bs-docs-section>\n\n  <div class=page-header>\n    <h1 id=gettingStarted>Getting started <a class=small href={{mainCtrl.REPO}}readme.md target=_blank>readme.md</a>\n    </h1>\n    <code>ngFormLib</code>\n  </div>\n\n  <div class=\"callout callout-info\">\n    <h4 id=project-history>About the project</h4>\n    <p>Angular Form Library is a set of Angular components that allow you to configure how form validation works across your entire site,\n      plus a set of accessibility-aware input controls that are easy to integrate into your AngularJS 1.2+ application.</p>\n    <p>Designed with Bootstrap CSS styles and markup in mind, Angular Form Library can be easily customised to work with your existing\n      CSS and form markup.</p>\n  </div>\n\n  <h2 id=project-quickstart>Quick Start</h2>\n  <p>Install and manage Angular Form Library with NPM.</p>\n  <div class=highlight>\n    <pre>\n      <code class=bash highlight-block>\n        $ npm install angular-form-lib --save\n      </code>\n    </pre>\n  </div>\n\n  <div class=\"callout callout-warning\">\n    <h4>Dependencies</h4>\n    <p>Angular Form Library has a dependency on <strong>Angular 1.2+</strong> and <code>angular-scroll</code>.\n       You <strong>must</strong> load Angular 1.2+ and <code>angular-scroll</code> yourself.</p>\n    <p>Additionally, <code>angular-translate</code> are optional dependencies which will be used if loaded.\n      Angular Scroll provides smooth-scrolling to an element that receives focus (such as the first error-field in a form). Angular Translate\n      allows strings to be loaded from resource files, which can help standardise error messages.</p>\n  </div>\n\n\n  <p>Inject the <code>ngFormLib</code>module into your Angular application.</p>\n  <div class=highlight>\n    <pre>\n      <code class=javascript highlight-block>\n        // ES5\n        angular.module('myApp', ['ngFormLib']);\n\n        // ES6 / Webpack\n        import {ngFormLib} from 'angular-form-lib';\n\n        const app = angular.module('myApp', [ngFormLib]);\n      </code>\n    </pre>\n  </div>\n\n  <p>Typically you would load both the module and the default policies into your application:</p>\n  <div class=highlight>\n    <pre>\n      <code class=javascript highlight-block>\n        // ES5\n        angular.module('myApp', [\n          'ngFormLib',\n          'duScroll',   // Scrolling behaviour for when the state changes to an error and we wish to focus the field\n          'ngFormLib.policy.behaviourOnStateChange',\n          'ngFormLib.policy.checkForStateChanges',\n          'ngFormLib.policy.stateDefinitions',\n          'pascalprecht.translate'    // Adds translation support, which will be used for certain properties when available\n        ]);\n\n        // ES6 / Webpack\n        import {ngFormLib, defaultPolicies} from 'angular-form-lib';\n        import 'angular-scroll';   // Scrolling behaviour for when the state changes to an error and we wish to focus the field\n        import ngTranslate from 'angular-translate';\n\n        const app = angular.module('myApp', ['duScroll', ngTranslate, ngFormLib, defaultPolicies]);\n      </code>\n    </pre>\n  </div>\n\n\n  <div class=\"callout callout-info\">\n    <h4>Custom builds</h4>\n    <p>Angular Form Library provides independently built modules that can be loaded separately:</p>\n    <div class=highlight>\n      <pre>\n        <code class=javascript highlight-block>\n          angular.module('myApp', [ 'ngFormLib.policy', 'ngFormLib.controls.formInput']);\n        </code>\n      </pre>\n    </div>\n  </div>\n\n  <div class=\"callout callout-info\">\n    <h4>Message translation</h4>\n    <p>Angular Form Library will optionally use the <code>pascalprecht.translate</code> module and the <code>$translate.instant()</code> method\n      to perform translation of error messages, placeholder text, field hints and labels,\n      if the module has been loaded. See <a href=http://angular-translate.github.io/ >Angular Translate</a>.</p>\n  </div>\n\n  <h2 id=project-contribute>Contributing</h2>\n  <div class=highlight>\n    <pre>\n      <code class=bash highlight-block>\n        // Fork https://github.com/odecee/angular-form-lib.git on Github\n        mkdir {newDir}\n        cd {newDir}\n        git clone {your forked repo}\n        npm i commitizen -g   // Install commitizen to help generate conventional commit messages\n        npm i\n\n        // Serve and watch docs, ideal to develop\n        $ npm start\n        // Continuous integration\n        $ npm test\n        // Build Angular Form Library and serve documentation site\n        $ npm build:serve\n\n        // Make some changes then commit them\n        git add.\n        git cz\n        // Then create pull request with your changes, push to GitHub, get feedback, rinse, repeat, merge.\n      </code>\n    </pre>\n  </div>\n\n\n</div>\n";

/***/ },

/***/ "./modules/docs/templates/header.html":
/***/ function(module, exports) {

module.exports = "<div class=bs-header id=content>\n  <div class=container>\n    <div class=col-md-9>\n      <h1>Angular Form Library</h1>\n      <p>AngularJS 1.2+ directives for controlling form behaviour using policies with accessible form controls.</p>\n    </div>\n    <div class=\"bs-docs-social col-md-3\">\n      <ul>\n        <li class=github-btn>\n          <iframe src=\"//ghbtns.com/github-btn.html?user=odecee&repo=angular-form-lib&type=watch&count=true\" allowtransparency=true frameborder=0 scrolling=0 width=100 height=20></iframe>\n        </li>\n        <li class=github-btn>\n          <iframe src=\"//ghbtns.com/github-btn.html?user=odecee&repo=angular-form-lib&type=fork&count=true\" allowtransparency=true frameborder=0 scrolling=0 width=100 height=20></iframe>\n        </li>\n        <li class=github-btn>\n          <iframe src=\"//ghbtns.com/github-btn.html?user=odecee&type=follow&count=true\" allowtransparency=true frameborder=0 scrolling=0 width=160 height=20></iframe>\n        </li>\n        <li class=twitter-btn>\n          <a href=//twitter.com/share class=twitter-share-button data-url=http://odecee.github.io/angular-form-lib data-text=\"Angular Form Library - AngularJS 1.2+ directives for controlling form behaviour using policies with accessible form controls.\" data-related=u_glow></a>\n        </li>\n        <li>\n          <div class=g-plusone data-size=medium data-href=http://odecee.github.io/angular-form-lib></div>\n        </li>\n      </ul>\n    </div>\n  </div>\n</div>\n";

/***/ },

/***/ "./modules/docs/templates/navbar.html":
/***/ function(module, exports) {

module.exports = "<header class=\"navbar navbar-inverse navbar-fixed-top bs-docs-nav\" role=banner>\n  <div class=container>\n    <div class=navbar-header>\n      <button class=navbar-toggle type=button data-template=assets/aside.html data-animation=am-fade-and-slide-left data-placement=left title=Menu data-container=body bs-aside>\n        <span class=sr-only>Toggle navigation</span>\n        <span class=icon-bar></span>\n        <span class=icon-bar></span>\n        <span class=icon-bar></span>\n      </button>\n      <a href=./ class=navbar-brand>Angular Form Library</a>\n    </div>\n    <nav class=\"collapse navbar-collapse bs-navbar-collapse\" role=navigation>\n      <ul class=\"nav navbar-nav\">\n        <li>\n          <a ahref=#gettingStarted use-hash=true scroll-offset=50>Top</a>\n        </li>\n      </ul>\n      <ul class=\"nav navbar-nav navbar-right\">\n        <li>\n          <a class=github-badge href=//travis-ci.org/odecee/angular-form-lib target=_blank>\n            \n          </a>\n        </li>\n        <li>\n          <a class=github-badge href=//codeclimate.com/github/odecee/angular-form-lib target=_blank>\n            \n          </a>\n        </li>\n        <li>\n          <a href={{mainCtrl.REPO_HOST}} target=_blank>\n            <i class=\"fa fa-github\"></i>&nbsp;GitHub\n          </a>\n        </li>\n        \n        <li>\n          <a href={{mainCtrl.REPO_HOST}}releases target=_blank>\n            <i class=\"fa fa-download\"></i>&nbsp;v<span ng-bind=mainCtrl.VERSION></span>\n          </a>\n        </li>\n      </ul>\n    </nav>\n  </div>\n</header>\n";

/***/ },

/***/ "./modules/docs/templates/sidenav.html":
/***/ function(module, exports) {

module.exports = "<ul class=\"nav bs-sidenav\" ng-if=mainCtrl.DOC_CONFIG.sitemap>\n  <li bs-scrollspy data-target=#gettingStarted>\n    <a ahref=#gettingStarted use-hash=true scroll-offset=50>Getting started</a>\n  </li>\n\n  <hr style=\"margin:2px 0\">\n\n  <li ng-repeat=\"menuItem in mainCtrl.DOC_CONFIG.sitemap\" bs-scrollspy data-target={{menuItem.href}} data-offset=50>\n    <a ahref={{menuItem.href}} use-hash=true scroll-offset=50>{{menuItem.title}}</a>\n    <ul class=nav>\n      <li ng-repeat=\"subMenuItem in menuItem.subSection\" bs-scrollspy data-target={{subMenuItem.href}} data-offset=50><a ahref={{subMenuItem.href}} use-hash=true scroll-offset=50>{{subMenuItem.title}}</a></li>\n    </ul>\n    <hr ng-if=menuItem.separateAfter style=\"margin:2px 0\">\n  </li>\n</ul>\n";

/***/ },

/***/ "./modules/ngFormLib/controls/common/FieldErrorController.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__FormControlService__ = __webpack_require__("./modules/ngFormLib/controls/common/FormControlService.js");



var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLib.controls.common.fieldErrorController', [__WEBPACK_IMPORTED_MODULE_1__FormControlService__["a" /* default */]]);

/* harmony default export */ exports["a"] = mod.name;

/**
 * The Field Error Controller directive is designed to indicate to the browser when the field is in error
 *  and what the errors are. It applies the form-policy for showing errors
 *
 * It works in tandem with the form controller (and FormPolicy.js) to identify when a form-element has an error, and decorates
 *  the element accordingly.
 *
 * It also toggles the fieldController.fieldState flag, based on the form policy provided
 *
 */

// INPUT:
//  <input ... field-error-controller></input>

// OUTPUT:
//  <input ... aria-invalid="false/true" aria-describedby="fieldId-errors">


mod.directive('fieldErrorController', ['formControlService', '$timeout', function (formControlService, $timeout) {
  function setupCanShowErrorPropertyOnNgModelController(scope, formController, ngModelController, element, name) {
    // Using the form policy, determine when to show errors for this field
    var formPolicy = formController._policy;
    var formName = formController.$name;
    var fieldName = formName + '["' + name + '"]';
    var stateConditions = formPolicy.stateDefinitions.create(formName, fieldName);

    formPolicy.checkForStateChanges(formController._scope, element, name, stateConditions, ngModelController, formController);
  }

  return {
    restrict: 'AE',
    require: ['?ngModel', '?^form', '?^formGroup'], // Require the formController controller somewhere in the parent hierarchy
    replace: true,
    link: function link(scope, element, attr, controllers) {
      var ngModelController = controllers[0];
      var formController = controllers[1];
      var formGroupElement = (controllers[2] || {}).$element || element; // This looks for a parent directive called formGroup, which has a controller, which has an $element property
      var name = attr.name;

      if (formController) {
        var formName = formController.$name;
        var stateChangeBehaviour = formController._applyFormBehaviourOnStateChangePolicy; // returns a function which encapsulates the form policy rules for the behaviour to apply when errors show

        if (ngModelController) {
          setupCanShowErrorPropertyOnNgModelController(scope, formController, ngModelController, element, name);
        }

        // When the error-showing flag changes, update the field style
        formController._scope.$watch(formName + '["' + name + '"].fieldState', function (fieldState) {
          // fieldState is set to '' when the form is reset. So must respond to that too.
          stateChangeBehaviour.applyBehaviour(element, fieldState, false, formName, name, formGroupElement);
        });

        // Listen to form-submit events, to determine what to focus on too
        scope.$on('event:FormSubmitAttempted', function () {
          // Make sure that the field-level watchers have a chance to fire first, so use a timeout
          $timeout(function () {
            return stateChangeBehaviour.applyBehaviour(element, ngModelController.fieldState, true, formName, name, formGroupElement);
          }, 1);
        });
      }
    }
  };
}]);

// This directive wraps all of the form elements and binds the universe together.
// It MUST be used as a class as the form focus behaviour references '.form-control .ng-invalid' when finding controls to focus
mod.directive('formGroup', [function () {
  return {
    restrict: 'C',
    controller: ['$scope', '$element', function Controller($scope, $element) {
      this.$element = $element;
    }]
  };
}]);

/***/ },

/***/ "./modules/ngFormLib/controls/common/FormControlService.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_Utility__ = __webpack_require__("./modules/common/Utility.js");



var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLib.controls.common.formControlService', [__WEBPACK_IMPORTED_MODULE_1__common_Utility__["a" /* default */]]);

/* harmony default export */ exports["a"] = mod.name;

// Workaround for bug #1404
// https://github.com/angular/angular.js/issues/1404
// Source: http://plnkr.co/edit/hSMzWC?p=preview
// Not so great for IE8, but necessary for using radio buttons inside of dynamic forms (ng-repeat)
mod.config(['$provide', function ($provide) {
  $provide.decorator('ngModelDirective', ['$delegate', function ($delegate) {
    var ngModel = $delegate[0];
    var controller = ngModel.controller;

    ngModel.controller = ['$scope', '$element', '$attrs', '$injector', function Controller(scope, element, attrs, $injector) {
      var $interpolate = $injector.get('$interpolate');

      attrs.$set('name', $interpolate(attrs.name || '')(scope));
      $injector.invoke(controller, this, {
        '$scope': scope,
        '$element': element,
        '$attrs': attrs
      });
    }];
    return $delegate;
  }]);
  $provide.decorator('formDirective', ['$delegate', function ($delegate) {
    var form = $delegate[0];
    var controller = form.controller;

    form.controller = ['$scope', '$element', '$attrs', '$injector', function Controller(scope, element, attrs, $injector) {
      var $interpolate = $injector.get('$interpolate');

      attrs.$set('name', $interpolate(attrs.name || attrs.ngForm || '')(scope));
      $injector.invoke(controller, this, {
        '$scope': scope,
        '$element': element,
        '$attrs': attrs
      });
    }];
    return $delegate;
  }]);
}]);

// Shared code for the accessible controls
mod.provider('formControlService', function Provider() {
  var self = this;
  var counter = 0; // Private variable

  //
  self.defaults = {
    idPrefix: 'fpFld',
    inputGroupButtonTemplateFunction: function inputGroupButtonTemplateFunction(val, handler) {
      return '<button type="button" class="btn btn-default" ' + (handler ? 'ng-click="' + handler + '"' : '') + '>' + val + '</button>';
    },
    templates: {
      formCheckbox: {
        template: 'ngFormLib/template/formCheckbox.html'
      },
      formDate: {
        template: 'ngFormLib/template/formDate.html'
      },
      formInput: {
        template: 'ngFormLib/template/formInput.html'
      },
      formRadioButton: {
        template: 'ngFormLib/template/formRadioButton.html'
      },
      formSelect: {
        template: 'ngFormLib/template/formSelect.html'
      },
      requiredMarker: {
        template: 'ngFormLib/template/requiredMarker.html'
      }
    }
  };

  this.$get = ['ngFormLibStringUtil', '$injector', function (StringUtil, $injector) {
    var translator = void 0;

    try {
      translator = $injector.get('$translate').instant;
    } catch (e) {
      translator = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.identity;
    }

    var service = {
      defaults: self.defaults,

      buildDirective: function buildDirective(params) {
        var directive = {
          restrict: 'AE',
          replace: true,
          transclude: true,
          compile: function compile(tElement, tAttr) {
            service.validateComponentStructure(params.controlName, tElement, params.expectedTemplateElements, tAttr, params.expectedAttributes);

            // For items that are inside repeaters, if more than one element has the same id, the checkbox stops working.
            // By using an attribute that is not called 'id', we can avoid this issue
            var id = tAttr.uid || service.getUniqueFieldId();
            var name = tAttr.name || id; // Doing this *will* break radio buttons, but they SHOULD provide a name anyway (for their own good)
            var inputElem = tElement.find(params.inputElementName || 'input');
            var labelElem = tElement.find('label');
            var required = service.getRequiredAttribute(tAttr.required);

            service.decorateLabel(labelElem, required, id, tAttr.labelClass, tAttr.hideLabel, tAttr.hideRequiredIndicator, tAttr.labelSuffix);
            inputElem = service.decorateInputField(inputElem, tElement, tAttr, id, name, required);

            // Do component-specific config last
            params.configFn(tElement, tAttr, id, name, inputElem, labelElem);

            // Clean up special attributes (to make HTML look nicer)
            tElement.removeAttr('uid').removeAttr('name').removeAttr('label').removeAttr('required').removeAttr('field-hint').removeAttr('input-type').removeAttr('hide-label').removeAttr('hideRequiredIndicator').removeAttr('label-class').removeAttr('field-errors').removeAttr('text-errors');
          },
          templateUrl: function templateUrl(element, attr) {
            // Check the element for a "template" attribute, which allows customisation-per-control. Otherwise, use the control-wide template.
            return attr.template || service.getHTMLTemplate(element, params.controlName);
          }
        };

        return directive;
      },

      getUniqueFieldId: function getUniqueFieldId() {
        return '' + self.defaults.idPrefix + counter++;
      },

      getHTMLTemplate: function getHTMLTemplate(element, type) {
        // Allow different templates to be applied for different form-styles (eg for horizontal forms, inline forms, "normal" forms).
        // This is an advanced feature that most users will not need.
        // E.g.: self.defaults.templates['select']['form-inline'] = 'path/to/your/custom/template.html'

        // Check this element's parent-form-element-classes to see if they match. First match, wins.
        var parentFormClasses = (element.inheritedData('formElementClasses') || '').split(' ');
        var result = self.defaults.templates[type].template; // The default template, if nothing else is specified.

        for (var i = 0; i < parentFormClasses.length; i++) {
          var template = self.defaults.templates[type][parentFormClasses[i]];

          if (template) {
            result = template;
            break;
          }
        }

        return result;
      },

      addToAttribute: function addToAttribute(element, attributeName, value) {
        var existingValues = element.attr(attributeName) || '';

        // Don't add the same attribute value - remove it first before adding it back
        if (existingValues.split(' ').indexOf(value) === -1) {
          element.attr(attributeName, existingValues + (existingValues ? ' ' : '') + value);
        }
      },

      removeFromAttribute: function removeFromAttribute(element, attributeName, value) {
        // Borrowed this statement from Angular.js
        var newValue = StringUtil.trim((' ' + (element.attr(attributeName) || '') + ' ').replace(/[\n\t]/g, ' ').replace(' ' + StringUtil.trim(value) + ' ', ' '));

        // Remove the attribute if it is empty
        if (newValue === '') {
          element.removeAttr(attributeName);
        } else {
          element.attr(attributeName, newValue);
        }
      },

      getRequiredAttribute: function getRequiredAttribute(required) {
        // When we set required="true" on a parent directive (like on-off-button), inputElem.attr('required', 'true')
        // becomes <input required="required" due to browser interference. So detect this case, and replace it with "true"
        // In v1.3, required="true" becomes required="".
        if (required === 'required' || required === '' || required === 'true') {
          return 'true';
        } else if (required === undefined) {
          return 'false';
        }
        return required;
      },

      addLabelText: function addLabelText(labelElem, labelText) {
        labelElem.prepend(service.translate(labelText));
      },

      addInputGroup: function addInputGroup(inputElem, attr) {
        var inputGroupMapping = [{ inputAttr: 'inputPrefix', className: 'input-group-addon', attachFn: 'prepend', clickHandler: '', content: function content(val) {
            return val;
          } }, { inputAttr: 'inputSuffix', className: 'input-group-addon', attachFn: 'append', clickHandler: '', content: function content(val) {
            return val;
          } }, { inputAttr: 'inputButtonPrefix', className: 'input-group-btn', attachFn: 'prepend', clickHandler: 'inputButtonPrefixClick', content: self.defaults.inputGroupButtonTemplateFunction }, { inputAttr: 'inputButtonSuffix', className: 'input-group-btn', attachFn: 'append', clickHandler: 'inputButtonSuffixClick', content: self.defaults.inputGroupButtonTemplateFunction }];
        var contentToAppend = [];

        inputGroupMapping.forEach(function (igConfig) {
          if (attr[igConfig.inputAttr]) {
            contentToAppend.push({
              attachFn: igConfig.attachFn,
              html: '<span class="' + igConfig.className + '">' + igConfig.content(attr[igConfig.inputAttr], attr[igConfig.clickHandler]) + '</span>'
            });
          }
        });

        if (contentToAppend.length) {
          inputElem.wrap('<div class="input-group">'); // This should be the 'control-row' element
          var wrapper = inputElem.parent();

          contentToAppend.forEach(function (content) {
            return wrapper[content.attachFn](content.html);
          });
        }

        return !!contentToAppend.length;
      },

      decorateLabel: function decorateLabel(labelElem, required, id, labelClass, hideLabelExpr, hideRequiredIndicator, labelSuffix) {
        if (id) {
          labelElem.attr('for', id);
        }
        if (labelClass) {
          labelElem.addClass(labelClass);
        }
        if (hideLabelExpr) {
          labelElem.attr('ng-class', '{\'sr-only\': ' + hideLabelExpr + '}');
        }
        // Some labels have suffix text - text that helps with describing the label, but isn't really the label text.
        // E.g. Amount ($AUD)
        if (labelSuffix) {
          labelElem.append('&nbsp;' + service.translate(labelSuffix));
        }

        if (!hideRequiredIndicator) {
          labelElem.append('<span required-marker hide="!(' + required + ')"></span>');
        }
      },

      decorateInputField: function decorateInputField(inputElem, hostElement, attr, id, name, required) {
        if (attr.inputType) {
          // inputElem.attr('type', attr.inputType); // THIS WILL NOT WORK ON IE8!
          // Instead, we must replace the entire node with the only property which SHOULD exist on the template: 'class'
          inputElem.replaceWith('<input type="' + attr.inputType + '" class="' + inputElem.attr('class') + '">');
          inputElem = hostElement.find('input');
        }

        inputElem.attr('id', id);

        // Allow the name to be interpolated
        inputElem.attr('name', name);

        // Apply all of the ff-* attributes to the input element. Use the original attribute names
        // attr.$attr contains the snake-case names e.g. 'form-field' vs camel case 'formField'
        for (var a in attr.$attr) {
          if (a.indexOf('ff') === 0) {
            // Don't search for 'ff-' as the '-' has been replaced with camel case now
            var origAttrName = attr.$attr[a].substr(3);

            if (origAttrName === 'class') {
              inputElem.addClass(attr[a]);

              // Special case for type property. It *must* be read-only. Therefore, don't write it to the element
              // See http://stackoverflow.com/questions/8378563/why-cant-i-change-the-type-of-an-input-element-to-submit
            } else if (origAttrName !== 'type') {
              inputElem.attr(origAttrName, attr[a]);
            }

            // Remove all attributes off the host element
            hostElement.removeAttr(attr.$attr[a]);
          }
        }

        inputElem.attr('ng-required', required);
        return inputElem;
      },

      createErrorFeatures: function createErrorFeatures(parentElement, inputElement, name, fieldLabel, fieldErrors, textErrors) {
        if (fieldErrors || textErrors) {
          // Add an fieldErrorControllers attribute to the element, to hook-up the error features
          inputElement.attr('field-error-controller', '');

          var fieldLabelStr = fieldLabel ? ' field-label="' + fieldLabel + '"' : '';
          var errorContainerElem = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.element('<div error-container field-name="' + name + '"' + fieldLabelStr + '></div>');

          if (fieldErrors) {
            errorContainerElem.attr('field-errors', fieldErrors);
          }
          if (textErrors) {
            errorContainerElem.attr('text-errors', textErrors);
          }
          parentElement.append(errorContainerElem);
        }
      },

      createFieldHint: function createFieldHint(hostElement, inputElement, fieldHint, fieldHintId, fieldHintDisplay) {
        var hintElement = void 0;

        if (fieldHint) {
          var hintText = service.translate(fieldHint);

          // If we have a field hint, add that as well
          if (fieldHintDisplay) {
            // If a field hint display rule exists, implement.
            hintElement = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.element('<p ng-if="' + fieldHintDisplay + '" class="help-block" id="' + fieldHintId + '">' + hintText + '</p>');
          } else {
            hintElement = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.element('<p class="help-block" id="' + fieldHintId + '">' + hintText + '</p>');
          }
          hostElement.append(hintElement);
          inputElement.attr('aria-describedby', fieldHintId);
        }
      },

      buildNgClassExpression: function buildNgClassExpression(inputElem, targetElem) {
        // If the inputElem has an ngModel and/or ngChecked attribute, create the ng-class attribute
        // todo.. test checkbox implementation
        var modelStr = inputElem.attr('ng-model');
        var checkedStr = inputElem.attr('ng-checked');
        var disabledStr = inputElem.attr('ng-disabled');
        var value = inputElem.attr('value'); // a string - used for Radio buttons
        var ngValue = inputElem.attr('ng-value'); // an expression - used for Radio buttons
        var ngTrueValue = inputElem.attr('ng-true-value');

        if (modelStr) {
          if (ngValue || ngTrueValue) {
            modelStr += ' === ' + (ngValue || ngTrueValue);
          } else if (value) {
            // The value is ALWAYS a string
            modelStr += ' === \'' + value + '\'';
          } else {
            modelStr += ' === true'; // For checkboxes, in the absence of ng-true-value
          }
        }

        if (modelStr && checkedStr) {
          modelStr += ' || ' + checkedStr;
        } else if (checkedStr) {
          modelStr = checkedStr;
        }

        if (modelStr && disabledStr) {
          targetElem.attr('ng-class', '{\'checked\': ' + modelStr + ', \'disabled\': ' + disabledStr + '}');
        } else if (modelStr) {
          targetElem.attr('ng-class', '{\'checked\': ' + modelStr + '}');
        }
      },

      translate: function translate(str, interpolatedParams) {
        return translator(str || '', interpolatedParams);
      },

      validateComponentStructure: function validateComponentStructure(componentName, element, requiredElements, attr, requiredAttributes) {
        for (var i = 0; i < requiredElements.length; i++) {
          if (!element.find(requiredElements[i])) {
            throw new Error('The ' + componentName + ' component template requires a ' + requiredElements[i] + ' element.');
          }
        }

        for (var j = 0; j < requiredAttributes.length; j++) {
          if (!attr[requiredAttributes[j]]) {
            throw new Error('The ' + componentName + ' component requires a ' + requiredAttributes[j] + ' attribute.');
          }
        }
      }

    };

    return service;
  }];
});

/***/ },

/***/ "./modules/ngFormLib/controls/common/docs/formControlService.docs.html":
/***/ function(module, exports) {

module.exports = "<div class=bs-docs-section ng-controller=\"FormControlServiceDemoCtrl as ctrl\">\n\n  <div class=page-header>\n    <h1 id=formControlService>Form Control Service <a class=small href={{mainCtrl.REPO}}src/modules/ngFormLib/controls/common/FormControlService.js target=_blank>FormControlService.js</a>\n    </h1>\n    <code>ngFormLib.controls.common.formControlService</code>\n  </div>\n\n  <p>The Form Control Service service provides common functions used by the form controls, and allows default values for the form controls to be changed from a central place.</p>\n\n  <div class=\"callout callout-danger\">\n    <h4>Plugin dependency</h4>\n    <p>The Form Control Service requires the <a ahref=#requiredMarker>RequiredMarker module</a> and the <a href={{mainCtrl.REPO}}src/modules/common target=_blank>ngFormLib.common.utility</a> module to be loaded.</p>\n  </div>\n\n  <h2 id=formControlServiceOptions>Options</h2>\n\n  <p>Options can be configured like so:</p>\n  <div class=highlight>\n    <pre><code class=js highlight-block>angular.module('myApp', ['ngFormLib'])\n  .config(['FormControlServiceProvider', function(FormControlServiceProvider) {\n      FormControlServiceProvider.defaults.select.template = 'path/to/my/template.html'\n  }])</code></pre>\n  </div>\n\n  <div class=table-responsive>\n    <table class=\"table table-bordered table-striped\">\n      <thead>\n        <tr>\n          <th style=width:100px>Name</th>\n          <th style=width:100px>Type</th>\n          <th style=width:50px>Default</th>\n          <th>Description</th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr>\n          <td>idPrefix</td>\n          <td>String</td>\n          <td>fpFld</td>\n          <td>The prefix string for generated form-control id values. Generated <code>id</code> values are used\n          when the form-control does not have it's own <code>cid</code> attribute with a non-empty value</td>\n        </tr>\n        <tr>\n          <td>formCheckbox.template</td>\n          <td>URL</td>\n          <td>ngFormLib/controls/formCheckbox/ template/FormCheckboxTemplate.html</td>\n          <td>Template for the <a ahref=#formCheckbox>Form Checkbox</a> control</td>\n        </tr>\n        <tr>\n          <td>formDate.template</td>\n          <td>URL</td>\n          <td>ngFormLib/controls/formDate/ template/FormDateTemplate.html</td>\n          <td>Template for the <a ahref=#formDate>Form Date</a> control</td>\n        </tr>\n        <tr>\n          <td>formInput.template</td>\n          <td>String</td>\n          <td>&lt;div class=\"form-group\"&gt;&lt;label class=\"control-label\"&gt;&lt;/label&gt;&lt;div class=\"control-row\"&gt;&lt;input #type# class=\"form-control\"&gt;&lt;span ng-transclude&gt;&lt;/span&gt;&lt;/div&gt;&lt;/div&gt;</td>\n          <td>Template for the <a ahref=#formInput>Form Input</a> control. <br>\n          <strong>Note:</strong> The <code>#type#</code> string is replaced with the input's type (text|tel|number|...) prior to the template\n          being compiled. This is due to the <code>type</code> attribute being read-only on an <code>input</code> element (see <a href=http://stackoverflow.com/questions/8378563/why-cant-i-change-the-type-of-an-input-element-to-submit target=_blank>here</a>)</td>\n        </tr>\n        <tr>\n          <td>formRadioButton.template</td>\n          <td>URL</td>\n          <td>ngFormLib/controls/formRadioButton/ template/FormRadioButtonTemplate.html</td>\n          <td>Template for the <a ahref=#formRadioButton>Form RadioButton</a> control</td>\n        </tr>\n        <tr>\n          <td>formSelect.template</td>\n          <td>URL</td>\n          <td>ngFormLib/controls/formSelect/ template/FormSelectTemplate.html</td>\n          <td>Template for the <a ahref=#formSelect>Form Select</a> control</td>\n        </tr>\n        <tr>\n          <td>requiredMarker.template</td>\n          <td>URL</td>\n          <td>ngFormLib/controls/requiredMarker/ template/RequiredMarker.html</td>\n          <td>Template for the <a ahref=#requiredMarker>Required Marker</a> control</td>\n        </tr>\n      </tbody>\n    </table>\n  </div>\n</div>\n";

/***/ },

/***/ "./modules/ngFormLib/controls/common/docs/formControlService.docs.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);


var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLibDocs.controls.common.docs.formControlService', []);

/* harmony default export */ exports["a"] = mod.name;

mod.directive('formControlServiceDocs', function () {
  return {
    restrict: 'A',
    controller: 'FormControlServiceDemoCtrl',
    template: __webpack_require__("./modules/ngFormLib/controls/common/docs/formControlService.docs.html")
  };
});

mod.controller('FormControlServiceDemoCtrl', function Controller() {
  // var vm = this;
  //
  // vm.titleData = [
  //   {label: 'Dr'},
  //   {label: 'Mr'},
  //   {label: 'Ms'}
  // ];
});

/***/ },

/***/ "./modules/ngFormLib/controls/common/docs/formControlsCommon.docs.html":
/***/ function(module, exports) {

module.exports = "<div class=bs-docs-section>\n\n  <div class=page-header>\n    <h1 id=formControls>Form Controls <a class=small href={{mainCtrl.REPO}}src/modules/ngFormLib/controls/common/ target=_blank>Form Controls Common</a>\n    </h1>\n    <code>ngFormLib.controls.common</code>\n  </div>\n\n  <p>The Form Controls Common module provides common functions used by the form controls, and allows default values for the form controls to be changed from a central place.</p>\n\n  <h2 id=formControlsCommonOptions>Common Control Options</h2>\n\n  <p>The following options are available for <code>form-checkbox</code>, <code>form-input</code>, <code>form-radio-button</code> and <code>form-select</code>:</p>\n\n  <div class=table-responsive>\n    <table class=\"table table-bordered table-striped\">\n      <thead>\n      <tr>\n        <th style=width:100px>Name</th>\n        <th style=width:100px>Type</th>\n        <th style=width:50px>Default</th>\n        <th>Description</th>\n      </tr>\n      </thead>\n      <tbody form-controls-common-properties-docs></tbody>\n    </table>\n  </div>\n</div>\n";

/***/ },

/***/ "./modules/ngFormLib/controls/common/docs/formControlsCommon.docs.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);


var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLibDocs.controls.common.docs.formControlsCommon', []);

/* harmony default export */ exports["a"] = mod.name;

mod.directive('formControlsCommonDocs', function () {
  return {
    restrict: 'A',
    template: __webpack_require__("./modules/ngFormLib/controls/common/docs/formControlsCommon.docs.html")
  };
});

/***/ },

/***/ "./modules/ngFormLib/controls/common/docs/formControlsCommonProperties.docs.html":
/***/ function(module, exports) {

module.exports = "<tr>\n  <td>uid</td>\n  <td>string</td>\n  <td>generated</td>\n  <td>The control's unique identifier, which is used in the <code>id=\"...\"</code> attribute on the control and to link the label to the form field element.\n    When the form field is inside a repeater, use a variable like <code>uid=\"...{{$index}}\"</code>, so that the control\n    has a page-unique id, which is required to make the control fully accessible.\n    <strong>If the <code>uid</code> is not specified, one will be generated by the formControlService.</strong>\n  </td>\n</tr>\n<tr>\n  <td>name</td>\n  <td>string</td>\n  <td>generated</td>\n  <td>The name of the element, which is used to make form-validation work correctly.\n    Only use an <code>{{interpolationExpression}}</code> inside this attribute when using <code>form-radio</code> buttons inside\n    <code>ng-form</code> inside <code>ng-repeat</code> (<a ahref=formDemo4>see example</a>).\n    <strong>If the <code>name</code> is not specified, one will be generated by the formControlService using the <code>uid</code>.</strong>\n    <p><strong class=text-danger><code>form-radio</code> controls that are inside a radio-button-group MUST specify this attribute explicitly for the grouping-behaviour to work!</strong></p>\n  </td>\n</tr>\n\n<tr>\n  <td>required</td>\n  <td>expression</td>\n  <td>false</td>\n  <td>An expression that determines the value of <code>ng-required</code> and the required indicator on the <code>&lt;label&gt;</code></td>\n</tr>\n<tr>\n  <td>hide-required-indicator</td>\n  <td>expression</td>\n  <td>false</td>\n  <td>An expression that determines whether to show or hide the required indicator</td>\n</tr>\n<tr>\n  <td>label-class</td>\n  <td>CSS class list</td>\n  <td></td>\n  <td>Optional list of CSS classes to apply to the <code>label</code> element</td>\n</tr>\n<tr>\n  <td>label-suffix</td>\n  <td>string</td>\n  <td></td>\n  <td>Optional text to append to a label, but is not displayed when an error message uses the <code>fieldLabel</code> variable.\n    This property is useful to convey formatting information about the field inside the field label, without that information\n    appearing in any error messages.\n  </td>\n</tr>\n\n<tr>\n  <td>hide-label</td>\n  <td>expression</td>\n  <td>false</td>\n  <td>An expression that determines whether to show or hide the label.</td>\n</tr>\n<tr>\n  <td>field-errors</td>\n  <td>object</td>\n  <td></td>\n  <td>A key-value pair object linking an error to a message. The value can be a language-resource-key if `angular-translate` is loaded.</td>\n</tr>\n<tr>\n  <td>text-errors</td>\n  <td>array</td>\n  <td></td>\n  <td>An array of scope-properties to watch for \"truthiness\". E.g. For `text-errors=\"['scopeProp']\"`, the text-value of `scope.scopeProp` will be\n    displayed when the value is \"truthy\" (typically a non empty string).\n    This property is useful for handling error messages returned from calling APIs.\n    The scope value can be a language-resource-key if <code>angular-translate</code> is loaded.</td>\n</tr>\n<tr>\n  <td>ff-ng-model</td>\n  <td>expression</td>\n  <td></td>\n  <td><strong>Required</strong> - the AngularJS <code>ngModel</code> directive, which is applied to the <code>select</code> element.</td>\n</tr>\n<tr>\n  <td>ff-*</td>\n  <td>*</td>\n  <td></td>\n  <td>Additional attributes/directives that are copied onto the <strong>input/select element</strong> can be specified using by prefixing them with <code>ff-</code>. For example <code>ff-size=\"3\"</code>\n    would be compiled to <code>size=\"3\"</code> on the <code>input</code>/<code>select</code> element.</td>\n</tr>\n<tr>\n  <td>template</td>\n  <td>URL</td>\n  <td>See <a ahref=#formControlServiceOptions>Form Controls Service options</a></td>\n  <td>The HTML template to use for the control. The default value can be overridden on the element, or globally by setting the default value in the <a ahref=#formControlService>FormControlService</a></td>\n</tr>\n";

/***/ },

/***/ "./modules/ngFormLib/controls/common/docs/formControlsCommonProperties.docs.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);


var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLibDocs.controls.common.docs.formControlsCommonProperties', []);

/* harmony default export */ exports["a"] = mod.name;

mod.directive('formControlsCommonPropertiesDocs', function () {
  return {
    restrict: 'A',
    template: __webpack_require__("./modules/ngFormLib/controls/common/docs/formControlsCommonProperties.docs.html")
  };
});

/***/ },

/***/ "./modules/ngFormLib/controls/common/docs/formControlsDemos.docs.html":
/***/ function(module, exports) {

module.exports = "<div class=bs-docs-section ng-controller=\"FormControlsDemosController as ctrl\">\n\n  <div class=page-header>\n    <h1 id=formDemos>Demos</h1>\n  </div>\n\n  <h2 id=formDemo1>Standard form</h2>\n  <div class=bs-example style=padding-bottom:24px append-source>\n\n    <form name=formDemo1 class=form novalidate form-submit=\"\">\n      <fieldset>\n        \n        <div class=form-group>\n          <label class=control-label for=formDemo1_fldTitle>Title</label>\n          <div class=control-row>\n            <select id=formDemo1_fldTitle name=formDemo1_fldTitle ng-model=ctrl.formDemo1.title ng-options=\"item.label for item in ctrl.titleData track by item.label\" class=form-control ng-required=true field-error-controller></select>\n          </div>\n          <div error-container field-name=formDemo1_fldTitle field-errors=\"{required: 'Please select a title'}\"></div>\n        </div>\n\n        \n        <div form-input uid=formDemo1-fieldName-with-hypens label=Name label-suffix=\"(40 chars)\" required=true input-type=text ff-ng-model=ctrl.formDemo1.name ff-maxlength=40 ff-ng-pattern=\"/^[a-zA-Z0-9 \\-.']+$/\" field-errors=\"{required: 'FIELD_ERROR.TEMPLATE.REQUIRED', pattern: 'Please enter a valid last name'}\"></div>\n\n        <div form-checkbox uid=formDemo1_fld3 name=formDemo1_fld3 required=true ff-ng-model=ctrl.formDemo1.fld1_3 field-errors=\"{required: 'You must agree'}\">You are required to agree to this</div>\n\n        <div form-input uid=formDemo1-with.dots label=Income required=true input-type=text input-prefix=$ input-suffix=\"per month\" ff-ng-model=ctrl.formDemo1.fld4 field-errors=\"{required: 'Income is required'}\"></div>\n\n        <fieldset class=\"form-group form-group-radio\">\n          <div ng-repeat=\"item in ctrl.titleData\">\n            <div form-radio-button uid=formDemo1_fld{{$index}} name=formDemo1_group1 ff-ng-model=ctrl.formDemo1.group1 ff-ng-value=$index required=true>{{item.label}}</div>\n          </div>\n          <div error-container field-name=formDemo1_group1 field-errors=\"{required: 'Please select one of the above options'}\"></div>\n        </fieldset>\n\n        <button type=submit class=\"btn btn-primary\">Submit</button>\n        <button type=button class=btn form-reset=ctrl.formDemo1>Reset</button>\n      </fieldset>\n    </form>\n  </div>\n\n  <h2 id=formDemo2>Horizontal Form</h2>\n\n  <p>This form takes advantage of the default control-templates' HTML structure to render the controls inside a form with <code>class=\"form-horizontal\"</code>\n    as expected within Bootstrap. See the <a href=/css/sampleFormStyle.css target=_blank>sample style sheet</a> to see how to do this.</p>\n\n  <div class=bs-example style=padding-bottom:24px append-source>\n    <form name=formDemo2 class=\"form form-horizontal\" novalidate form-submit=\"\">\n      <fieldset>\n\n        <div form-input uid=formDemo2_fld1 name=formDemo2_fld1 label=\"Nick Name\" required=true input-type=text ff-ng-model=ctrl.formDemo2.name ff-maxlength=40 ff-ng-pattern=\"/^[a-zA-Z0-9 \\-.']+$/\" field-errors=\"{required: 'Last name is required', pattern: 'Please enter a valid last name'}\"></div>\n\n        <div form-select uid=formDemo2_fld2-weird.title label=\"Common field\" required=true ff-ng-model=ctrl.formDemo2.fld2 ff-ng-options=\"item.label for item in ctrl.titleData track by item.label\" field-errors=\"{required: 'Title is required'}\"></div>\n\n        <div form-checkbox uid=formDemo2_fld3 name=formDemo2_fld3 required=true ff-ng-model=ctrl.formDemo2.fld2_3 field-errors=\"{required: 'You must agree'}\">You are required to agree to this</div>\n\n        <div form-input uid=formDemo2_fld4 label=Income required=true input-type=text input-prefix=$ input-suffix=\"per month\" ff-ng-model=ctrl.formDemo2.fld4 field-errors=\"{required: 'Income is required'}\"></div>\n\n        <fieldset class=\"form-group form-group-radio\">\n          <div ng-repeat=\"item in ctrl.titleData\">\n            <div form-radio-button uid=formDemo2_rbfld{{$index}} name=formDemo2_group1 ff-ng-model=ctrl.formDemo2.group1 ff-ng-value=$index required=true hide-required-indicator=true>{{item.label}}</div>\n          </div>\n          <div error-container field-name=formDemo2_group1 field-errors=\"{required: 'Please select one of the above options'}\"></div>\n        </fieldset>\n\n        <div class=button-row>\n          <button type=submit class=\"btn btn-primary\">Submit</button>\n          <button type=button class=btn form-reset=ctrl.formDemo2>Reset</button>\n        </div>\n      </fieldset>\n    </form>\n  </div>\n\n  <h2 id=formDemo3>Inline Form</h2>\n  <p>This form takes advantage of the default control-templates' HTML structure to render the controls inside a form with <code>class=\"form-inline\"</code>\n    as expected within Bootstrap. See the <a href=/css/sampleFormStyle.css target=_blank>sample style sheet</a> to see how to do this.</p>\n\n  <div class=bs-example style=padding-bottom:24px append-source>\n    <form name=formDemo3 class=\"form form-inline\" novalidate form-submit=\"\">\n      <fieldset>\n\n        <div form-input uid=formDemo3_fld1 name=formDemo3_fld1 label=\"Nick Name\" hide-label=true required=true input-type=text ff-ng-model=ctrl.formDemo3.fld1 ff-maxlength=40 ff-ng-pattern=\"/^[a-zA-Z0-9 \\-.']+$/\" ff-placeholder=\"Enter Nick Name\" field-errors=\"{required: 'Last name is required', pattern: 'Please enter a valid last name'}\"></div>\n\n        <div form-input uid=formDemo3_fld4 label=Income hide-label=true required=true ff-style=width:40px input-type=text input-prefix=$ ff-ng-model=ctrl.formDemo3.fld4 field-errors=\"{required: 'Income is required'}\"></div>\n\n        <div form-select uid=formDemo3_fld2 name=formDemo3_fld2 label=\"Common field\" hide-label=true required=true ff-ng-model=ctrl.formDemo3.fld2 ff-ng-options=\"item.label for item in ctrl.titleData track by item.label\" placeholder=\"Enter Title\" field-errors=\"{required: 'Title is required'}\"></div>\n\n        <div form-checkbox uid=formDemo3_fld3 name=formDemo3_fld3 required=true ff-ng-model=ctrl.formDemo3.fld3 hide-required-indicator=true field-errors=\"{required: 'You must agree'}\">I agree</div>\n\n        <fieldset class=\"form-group form-group-radio\">\n          <span ng-repeat=\"item in ctrl.titleData\">\n            <div form-radio-button uid=formDemo3_fld{{$index}} name=formDemo3_group1 ff-ng-model=ctrl.formDemo3.group1 ff-ng-value=$index required=true hide-required-indicator=true>{{item.label}}</div>\n          </span>\n          <div error-container field-name=formDemo3_group1 field-errors=\"{required: 'Please select one of the above options'}\"></div>\n        </fieldset>\n\n        <button type=submit class=\"btn btn-primary\">Submit</button>\n        <button type=button class=btn form-reset=ctrl.formDemo3>Reset</button>\n      </fieldset>\n    </form>\n  </div>\n\n  <h2 id=formDemo4>Form with repeating sections</h2>\n\n  <p>This is probably as complex as it gets - a horizontal-form with a repeating inline-form.</p>\n\n  <div class=bs-example style=padding-bottom:24px append-source>\n    <style>[name=formDemo4] .form-inline .form-group{margin-right:0}[name=formDemo4] .form-inline .control-label{display:none}[name=formDemo4] .form-inline .control-row{width:auto;padding:0;margin-left:15px}[name=formDemo4] .form-inline .form-group-checkbox,[name=formDemo4] .form-inline .form-group-radio{margin-left:0;width:auto;float:none}[name=formDemo4] .form-inline .btn{margin-bottom:15px}</style>\n    <form name=formDemo4 class=\"form form-horizontal\" novalidate form-submit=\"\">\n      <fieldset>\n\n        <div form-input uid=formDemo4_fld1 name=formDemo4_fld1 label=\"Last Name\" required=true input-type=text ff-ng-model=ctrl.formDemo4.name ff-maxlength=40 field-errors=\"{required: 'Last name is required'}\"></div>\n\n        <div form-select uid=formDemo4_fld2 name=formDemo4_fld2 label=Type required=true placeholder=\"Select Title\" ff-ng-model=ctrl.formDemo4.title ff-ng-options=\"item.label for item in ctrl.titleData track by item.label\" field-errors=\"{required: 'Title is required'}\"></div>\n\n        <div class=form-group>\n          <label class=control-label>Education History</label>\n\n          <div class=control-row>\n            <div ng-repeat=\"school in ctrl.formDemo4.education\" class=\"form form-inline\" ng-init=\"schoolIndex = $index\">\n              <div ng-form=formDemo4_subform>\n                <div form-input uid=formDemo4_subform{{$index}}_fld1 name=formDemo4_subform_fld1 label=School hide-label=true required=true input-type=text ff-placeholder=\"School Name\" ff-ng-model=school.name ff-maxlength=30 ff-style=\"width: 100px\" field-errors=\"{required: 'School name is required'}\"></div>\n\n                <div form-input uid=formDemo4_subform{{$index}}_fld4 label=Income hide-label=true required=true ff-style=width:40px input-type=text input-prefix=$ ff-ng-model=school.income field-errors=\"{required: 'Income is required'}\"></div>\n\n                <div form-select uid=formDemo4_subform{{$index}}_fld2 name=formDemo4_subform_fld2 label=Type hide-label=true required=true placeholder=\"School Type\" ff-ng-model=school.type ff-ng-options=\"item.label for item in ctrl.schoolData track by item.label\" field-errors=\"{required: 'Type is required'}\"></div>\n\n                <div form-checkbox uid=formDemo4_subform{{$index}}_fld3 name=formDemo4_subform_fld3 required=true ff-ng-model=school.isCoEd field-errors=\"{required: 'Uniforms are required'}\">Uniform</div>\n\n\n                <fieldset class=\"form-group form-group-radio\">\n                  <span ng-repeat=\"item in ctrl.titleData\">\n                    <div form-radio-button uid=formDemo4_subform{{schoolIndex}}_fld4_{{$index}} name=formDemo4_subform_group{{schoolIndex}} ff-ng-model=school.title ff-ng-value=$index required=true hide-required-indicator=true>{{item.label}}</div>\n                  </span>\n                  <div error-container field-name=formDemo4_subform_group{{schoolIndex}} field-errors=\"{required: 'Please select an option'}\"></div>\n                </fieldset>\n\n                <button type=button class=\"btn btn-success\" ng-click=ctrl.addSchool() ng-if=$last>+</button>\n\n              </div>\n            </div>\n          </div>\n        </div>\n\n\n        <div class=button-row>\n          <button type=submit class=\"btn btn-primary\">Submit</button>\n          <button type=button class=btn form-reset=ctrl.formDemo4>Reset</button>\n        </div>\n      </fieldset>\n    </form>\n  </div>\n\n  <h2 id=formDemo5>Child forms that are conditionally shown</h2>\n\n  <div class=\"callout callout-info\">\n    <h4>Focus management</h4>\n    <p>The default <code>behaviourOnStateChange</code> policy correctly sets the focus to the top-most field that contains an error, making it easy for users to find and fix the problem.</p>\n  </div>\n\n  <div class=\"callout callout-warning\">\n    <h4><code>ng-if</code> versus <code>ng-show/ng-hide</code></h4>\n    <p>Use <code>ng-if</code> instead of <code>ng-show/ng-hide</code> when dynamically showing form elements. <code>ng-show/hide</code> keeps the form field in the DOM\n    which means that the <code>ngModelController</code> of each hidden field is <strong>still attached to the <code>ngModelController</code> of the form</strong>. This\n    causes problems when trying to submit the form, as the form will contain an error, but the field with the error is not visible!</p>\n\n    <p>Using <code>ng-if</code> prevents this issue from occurring, as <code>ng-if</code> removes the hidden form elements from the DOM,\n    which detaches them from the form's <code>ngModelController</code>.</p>\n  </div>\n\n  <div class=bs-example style=padding-bottom:24px append-source>\n    <form name=formDemo5 class=form novalidate form-submit=ctrl.submit()>\n      <fieldset>\n\n        <div form-checkbox uid=formDemo5_toggle name=formDemo5_toggle ff-ng-model=ctrl.toggleChildForm><strong>Toggle child form</strong></div>\n\n        \n        <div class=form-group>\n          <label class=control-label for=formDemo5_fldTitle>Title</label>\n          <div class=control-row>\n            <select id=formDemo5_fldTitle name=formDemo5_fldTitle ng-model=ctrl.formDemo5.title ng-options=\"item.label for item in ctrl.titleData track by item.label\" class=form-control ng-required=true field-error-controller></select>\n          </div>\n          <div error-container field-name=formDemo5_fldTitle field-errors=\"{required: 'Please select a title'}\"></div>\n        </div>\n\n        <div form-checkbox uid=formDemo5_fld3 name=formDemo5_fld3 required=true ff-ng-model=ctrl.formDemo5.fld1_3 field-errors=\"{required: 'You must agree'}\">You are required to agree to this</div>\n\n        <ng-form name=formDemo5_subform ng-if=!ctrl.toggleChildForm>\n          <div form-input uid=formDemo5_fld4 label=Income required=true input-type=text input-prefix=$ input-suffix=\"per month\" ff-ng-model=ctrl.formDemo5.fld4 field-errors=\"{required: 'Income is required'}\"></div>\n        </ng-form>\n\n        \n        <div form-input uid=formDemo5_fldName name=formDemo5_fldName label=Name label-suffix=\"(40 chars)\" required=true input-type=text ff-ng-model=ctrl.formDemo5.name ff-maxlength=40 ff-ng-pattern=\"/^[a-zA-Z0-9 \\-.']+$/\" field-errors=\"{required: 'FIELD_ERROR.TEMPLATE.REQUIRED', pattern: 'Please enter a valid last name'}\"></div>\n\n        <fieldset class=\"form-group form-group-radio\">\n          <div ng-repeat=\"item in ctrl.titleData\">\n            <div form-radio-button uid=formDemo5_fld{{$index}} name=formDemo5_group1 ff-ng-model=ctrl.formDemo5.group1 ff-ng-value=$index required=true>{{item.label}}</div>\n          </div>\n          <div error-container field-name=formDemo5_group1 field-errors=\"{required: 'Please select one of the above options'}\"></div>\n        </fieldset>\n\n        <button type=submit class=\"btn btn-primary\">Submit</button>\n        <button type=button class=btn form-reset=ctrl.formDemo5>Reset</button>\n      </fieldset>\n    </form>\n  </div>\n\n</div>\n";

/***/ },

/***/ "./modules/ngFormLib/controls/common/docs/formControlsDemos.docs.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);


var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLibDocs.controls.common.docs.formControlsDemos', []);

/* harmony default export */ exports["a"] = mod.name;

mod.directive('formControlsDemosDocs', function () {
  return {
    restrict: 'A',
    controller: 'FormControlsDemosController',
    template: __webpack_require__("./modules/ngFormLib/controls/common/docs/formControlsDemos.docs.html")
  };
});

mod.controller('FormControlsDemosController', function Controller() {
  var vm = this;

  vm.titleData = [{ label: 'Dr' }, { label: 'Mr' }, { label: 'Ms' }];

  vm.schoolData = [{ label: 'Primary' }, { label: 'Secondary' }, { label: 'Tertiary' }];

  vm.formDemo4 = {
    name: '',
    education: [{
      name: 'Melbourne High School',
      type: vm.schoolData[1]
    }, {
      name: undefined,
      type: undefined
    }]
  };

  vm.addSchool = function () {
    vm.formDemo4.education.push({ name: '', type: undefined });
  };

  vm.submit = function () {
    alert('Submitted');
  };
});

/***/ },

/***/ "./modules/ngFormLib/controls/common/index.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__FieldErrorController__ = __webpack_require__("./modules/ngFormLib/controls/common/FieldErrorController.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__FormControlService__ = __webpack_require__("./modules/ngFormLib/controls/common/FormControlService.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__requiredMarker_RequiredMarker__ = __webpack_require__("./modules/ngFormLib/controls/requiredMarker/RequiredMarker.js");



 // TODO: Not sure why this is here

var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLib.controls.common', [__WEBPACK_IMPORTED_MODULE_1__FieldErrorController__["a" /* default */], __WEBPACK_IMPORTED_MODULE_2__FormControlService__["a" /* default */], __WEBPACK_IMPORTED_MODULE_3__requiredMarker_RequiredMarker__["a" /* default */]]);

/* harmony default export */ exports["a"] = mod.name;

/***/ },

/***/ "./modules/ngFormLib/controls/errorMessageContainer/ErrorMessageContainer.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_FormControlService__ = __webpack_require__("./modules/ngFormLib/controls/common/FormControlService.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__policy_stateDefinitions_PolicyStateDefinitions__ = __webpack_require__("./modules/ngFormLib/policy/stateDefinitions/PolicyStateDefinitions.js");




var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLib.controls.errorMessageContainer', [__WEBPACK_IMPORTED_MODULE_1__common_FormControlService__["a" /* default */]]);

/* harmony default export */ exports["a"] = mod.name;

/*
 * This directive is really a FIELD error message container - it is designed to work with fields exclusively
 */
mod.directive('errorContainer', ['$compile', 'formControlService', function ($compile, formControlService) {
  function ErrorController(ariaElement, a11yPolicy) {
    var errors = {};

    return {
      addError: function addError(errorType, errorMessage, fieldLabel) {
        errors[errorType] = translateError(errorMessage, fieldLabel);
      },
      removeError: function removeError(errorType) {
        return delete errors[errorType];
      },
      updateAriaErrorElement: function updateAriaErrorElement() {
        return a11yPolicy.onErrorChangeBehaviour(ariaElement, errors);
      }
    };
  }

  function translateError(errorMessage, fieldLabel) {
    var firstLetterIsAVowel = fieldLabel ? 'aeiou'.indexOf(fieldLabel[0].toLowerCase() !== -1) : undefined;

    return formControlService.translate(errorMessage, { pronoun: firstLetterIsAVowel ? 'an' : 'a', fieldLabel: fieldLabel });
  }

  function generateErrorTag(errorType, errorText, fieldLabel) {
    return '<div class="text-error ec2-' + errorType + '"><span class="text-error-wrap">' + translateError(errorText, fieldLabel) + '</span></div>';
  }

  /*
   * Handle the field-based error messages
   */
  function toggleErrorVisibilityOnError(errorController, formController, scope, element, watchExpr, errorType, errorText, fieldLabel) {
    // console.log('watchExpr = ' + watchExpr);
    formController._scope.$watch(watchExpr, function (newValue) {
      if (newValue) {
        // The error text could contain an interpolation string, so we need to compile it
        var val = $compile(generateErrorTag(errorType, errorText, fieldLabel))(scope);

        element.append(val);
        errorController.addError(errorType, errorText, fieldLabel);
      } else {
        removeErrorMessage(errorController, formController, element, errorType);
      }
      errorController.updateAriaErrorElement();
    });
  }

  function removeErrorMessage(controller, formController, element, errorType) {
    // find the div with our special class, then remove it
    var divs = element.find('div');

    for (var len = divs.length, i = len - 1; i > -1; i--) {
      if (divs.eq(i).hasClass('ec2-' + errorType)) {
        divs.eq(i).remove();
      }
    }
    controller.removeError(errorType);
  }

  /*
   * Handle text errors. Text errors are associated with a scope, rather than with a field.
   * This means we can clear them from the scope when the field-they-are-associated-with is changed.
   */
  function toggleErrorVisibilityForTextError(errorController, formController, fieldController, scope, element, watchExpr, fieldLabel) {
    // console.log('Watching error: ' + watchExpr);

    formController._scope.$watch(watchExpr, function (newValue) {
      // Update the validity of the field's "watchExpr" error-key to match the value of the errorText
      fieldController.$setValidity(watchExpr, !newValue);

      // Remove the old error message for this same errorType first, in cases where the error message is changing.
      removeErrorMessage(errorController, formController, element, watchExpr);
      if (newValue) {
        // No need to compile the error message as we already have its value
        element.append(generateErrorTag(watchExpr, newValue, fieldLabel));

        errorController.addError(watchExpr, newValue, fieldLabel);
        // Turn the border red by sending a 'form-submit-attempted' event
        formController.setSubmitted(true);
      }
      errorController.updateAriaErrorElement();
    });

    // When the field changes, clear the errorText value
    fieldController.$viewChangeListeners.push(function () {
      if (scope.$eval(watchExpr)) {
        scope.$eval(watchExpr + ' = null');
      }
    });
  }

  return {
    restrict: 'AE',
    require: ['^form'], // Require the formController controller somewhere in the parent hierarchy (mandatory for field-errors)
    template: '<div class="container-error"></div>',
    replace: true,
    link: function link(scope, element, attr, controllers) {
      var fieldName = attr.fieldName;
      var fieldLabel = attr.fieldLabel || '';
      var formController = controllers[0];
      var formName = formController.$name;
      var formField = formName + '["' + fieldName + '"]';
      var fieldErrors = scope.$eval(attr.fieldErrors || []); // You can escape interpolation brackets inside strings by doing  \{\{   - wow!
      var textErrors = scope.$eval(attr.textErrors || []);

      element.attr('id', formName + '-' + fieldName + '-errors');

      // Get a reference to the form policy
      var a11yPolicy = formController._policy.accessibilityBehaviour;
      var ariaElement = a11yPolicy.createAriaErrorElement(formName, fieldName);
      var errorController = new ErrorController(ariaElement, a11yPolicy); // This controller contains state pertaining to this error container instance. Not a shareable controller across multiple instances.

      element.append(ariaElement);

      for (var error in fieldErrors) {
        if (fieldErrors.hasOwnProperty(error)) {
          var errorShowCondition = formField + '.fieldState === "' + __WEBPACK_IMPORTED_MODULE_2__policy_stateDefinitions_PolicyStateDefinitions__["b" /* ERROR_STATE */] + '" && ' + formField + '.$error.' + error;

          toggleErrorVisibilityOnError(errorController, formController, scope, element, errorShowCondition, error, fieldErrors[error], fieldLabel);
        }
      }

      // Watch formController[fieldName] - it may not have loaded yet. When it loads, call the main function.
      if (textErrors) {
        // console.log('textErrors: ' + textErrors + ', fieldName = ' + fieldName);
        var fieldWatcher = scope.$watch(function () {
          return formController[fieldName];
        }, function (newValue) {
          if (newValue) {
            fieldWatcher(); // Cancel the watcher

            // Do the actual thing you planned to do...
            for (var item in textErrors) {
              if (textErrors.hasOwnProperty(item)) {
                toggleErrorVisibilityForTextError(errorController, formController, formController[fieldName], scope, element, textErrors[item], fieldLabel);
              }
            }
          }
        });
      }

      element.removeAttr('error-container').removeAttr('field-name').removeAttr('field-errors').removeAttr('text-errors');
    }
  };
}]);

/***/ },

/***/ "./modules/ngFormLib/controls/errorMessageContainer/docs/errorMessageContainer.docs.html":
/***/ function(module, exports) {

module.exports = "<div class=bs-docs-section ng-controller=\"ErrorMessageContainerDemoController as ctrl\">\n\n  <div class=page-header>\n    <h1 id=errorMessageContainer>Error Message Container <a class=small href={{mainCtrl.REPO}}src/modules/ngFormLib/controls/errorMessageContainer/ErrorMessageContainer.js target=_blank>ErrorMessageContainer.js</a>\n    </h1>\n    <code>ngFormLib.controls.errorMessageContainer</code>\n  </div>\n\n  <p>The Error Message Container is a directive which shows & hides error messages based on the parent-form's policy and the corresponding input-field's state.\n    It links the error message(s) to the field using ARIA attributes. This increases the accessibility of form-elements quite a bit.</p>\n\n  <div class=\"callout callout-info\">\n    <h4>Message translation</h4>\n    <p>Error Message Controller will optionally use the <code>pascalprecht.translate</code> module and the <code>$translate.instant()</code> method to perform translation of error messages,\n      if it has been loaded. See <a href=http://angular-translate.github.io/ >Angular Translate</a>.</p>\n  </div>\n\n  <p>Error messages typically have a consistent grammer.\n    <a href=http://angular-translate.github.io/ >Angular Translate</a> makes it really easy to provide consistent error\n    syntax for the error messages across your application, with the bonus of providing multi-language support as well.\n    However, you can still use this directive without configuring Angular Translate - the error message strings will be rendered as-is.\n  </p>\n\n  <h2 id=errorMessageContainerExamples>Examples</h2>\n  <p><code>error-message-container</code> was designed to be used by the form controls in this library. However, it is possible to use\n  this directive without using the form controls. A good use case is when dealing with a collection of <code>form-radio-button</code> elements where there is no initial selection, but a selection is required</p>\n  <p>Use <code>error-message-container</code> to show an error message when a validation error occurs.</p>\n\n  <h3>Live demo</h3>\n\n  <div class=bs-example style=padding-bottom:24px append-source>\n\n    <form name=errMsgDemo class=form novalidate>\n      <fieldset>\n        <div class=form-group>\n          <label class=control-label for=errMsgDemo_fldTitle>Title</label>\n          <div class=control-row>\n            <select id=errMsgDemo_fldTitle name=errMsgDemo_fldTitle ng-model=ctrl.errMsgDemo.title ng-options=\"item.label for item in ctrl.titleData track by item.label\" class=form-control ng-required=true field-error-controller></select>\n          </div>\n          <div error-container field-name=errMsgDemo_fldTitle field-errors=\"{required: 'Please select a title'}\"></div>\n        </div>\n\n        <div class=form-group>\n          <label class=control-label for=errMsgDemo_fldName>Name</label>\n          <div class=control-row>\n            <input type=text id=errMsgDemo_fldName name=errMsgDemo_fldName ng-model=ctrl.errMsgDemo.name class=form-control ng-required=true field-error-controller>\n          </div>\n          <div error-container field-name=errMsgDemo_fldName field-label=\"custom error label\" field-errors=\"{required: 'FIELD_ERROR.TEMPLATE.REQUIRED'}\" text-errors=\"['ctrl.myTextError', 'ctrl.translationKey']\"></div>\n        </div>\n\n        <div form-input uid=errMsgDemo_fldName2 label=FIELD.LABEL label-suffix=FIELD.LABEL_SUFFIX required=true input-type=text ff-ng-model=ctrl.formDemo1.name ff-maxlength=40 ff-ng-pattern=\"/^[a-zA-Z0-9 \\-.']+$/\" field-errors=\"{required: 'FIELD_ERROR.TEMPLATE.REQUIRED', pattern: 'Please enter a valid last name'}\"></div>\n\n      </fieldset>\n\n      <button type=submit class=\"btn btn-primary\" form-submit=\"\">Submit</button>\n      <button type=button class=btn form-reset=ctrl.errMsgDemo>Reset</button>\n      <div tabindex=0 class=btn ng-click=ctrl.toggleTextError()>Toggle text error</div>\n    </form>\n  </div>\n\n  <h2 id=errorMessageContainerUsage>Usage</h2>\n  <p>Add the <code>error-message-container</code> directive to any element, or use one of the form controls (above) which uses <code>error-message-container</code> already.</p>\n\n  <h3>Options</h3>\n  <p>Options can be passed via attributes on the directive.</p>\n  <div class=table-responsive>\n    <table class=\"table table-bordered table-striped\">\n      <thead>\n      <tr>\n        <th style=width:100px>Name</th>\n        <th style=width:100px>Type</th>\n        <th style=width:50px>Default</th>\n        <th>Description</th>\n      </tr>\n      </thead>\n      <tbody>\n        <tr>\n          <td>field-name</td>\n          <td>string</td>\n          <td></td>\n          <td>The reference to a form-control. The must match the <code>name</code> attribute of the form-control. This property allows the directive to watch the form control and show errors for that form control.</td>\n        </tr>\n        <tr>\n          <td>field-label</td>\n          <td>string</td>\n          <td></td>\n          <td>The label to display when a translated-error message contains <code>{{fieldLabel}}</code>. Relies on the use of the translation service to specify error messages as translation IDs.</td>\n        </tr>\n        <tr>\n          <td>field-errors</td>\n          <td>object</td>\n          <td></td>\n          <td>A key-value pair object linking an error to a message. The value can be a language-resource-key if `angular-translate` is loaded.</td>\n        </tr>\n        <tr>\n          <td>text-errors</td>\n          <td>array</td>\n          <td></td>\n          <td>An array of scope-properties to watch for \"truthiness\". E.g. For `text-errors=\"['scopeProp']\"`, the text-value of `scope.scopeProp` will be\n            displayed when the value is \"truthy\" (typically a non empty string).\n            This property is useful for handling error messages returned from calling APIs.\n            The scope value can be a language-resource-key if <code>angular-translate</code> is loaded.</td>\n        </tr>\n      </tbody>\n    </table>\n  </div>\n</div>\n";

/***/ },

/***/ "./modules/ngFormLib/controls/errorMessageContainer/docs/errorMessageContainer.docs.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);


var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLibDocs.controls.errorMessageContainer.docs.errorMessageContainer', []);

/* harmony default export */ exports["a"] = mod.name;

mod.directive('errorMessageContainerDocs', function () {
  return {
    restrict: 'A',
    controller: 'ErrorMessageContainerDemoController',
    template: __webpack_require__("./modules/ngFormLib/controls/errorMessageContainer/docs/errorMessageContainer.docs.html")
  };
});

mod.controller('ErrorMessageContainerDemoController', function Controller() {
  var vm = this;

  vm.titleData = [{ label: 'Dr' }, { label: 'Mr' }, { label: 'Ms' }];

  vm.toggleTextError = function () {
    vm.myTextError = vm.myTextError ? '' : 'My text error. ';
    vm.translationKey = vm.translationKey ? '' : 'FIELD_ERROR.TEXT_ERROR';
  };
});

/***/ },

/***/ "./modules/ngFormLib/controls/formCheckbox/FormCheckbox.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_index__ = __webpack_require__("./modules/ngFormLib/controls/common/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__errorMessageContainer_ErrorMessageContainer__ = __webpack_require__("./modules/ngFormLib/controls/errorMessageContainer/ErrorMessageContainer.js");




var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLib.controls.formCheckbox', [__WEBPACK_IMPORTED_MODULE_1__common_index__["a" /* default */], __WEBPACK_IMPORTED_MODULE_2__errorMessageContainer_ErrorMessageContainer__["a" /* default */]]);

/* harmony default export */ exports["a"] = mod.name;

// INPUT:
//  <form-checkbox id="id" name="name" required="{{expression}}"
//      ff-class="span12" ff-ng-model="application.contentType" ff-value="software" ff-aria-label="Software"
//        ff-ng-click="doSomething()"
//      field-errors="{required: 'Please select'}"
//      text-errors="['wrong value']"
//      >My label with <a href="http://www.google.com/">HTML bits</a> in it</form-checkbox>

// OUTPUT:


mod.directive('formCheckbox', ['formControlService', function (formControlService) {
  return formControlService.buildDirective({
    controlName: 'formCheckbox',
    expectedTemplateElements: ['input', 'label', 'div'],
    expectedAttributes: [],
    configFn: function configFn(tElement, tAttr, id, name, inputElem) {
      formControlService.createErrorFeatures(tElement, inputElem, name, '', tAttr.fieldErrors, tAttr.textErrors);
      formControlService.buildNgClassExpression(inputElem, inputElem); // Put the ng-class onto the input element itself, as this makes styling easier
    }
  });
}]);

// Populate the template cache with the default template
mod.run(['$templateCache', function ($templateCache) {
  $templateCache.put('ngFormLib/template/formCheckbox.html', __webpack_require__("./modules/ngFormLib/controls/formCheckbox/template/FormCheckboxTemplate.html"));
}]);

/***/ },

/***/ "./modules/ngFormLib/controls/formCheckbox/docs/formCheckbox.docs.html":
/***/ function(module, exports) {

module.exports = "<div class=bs-docs-section ng-controller=\"FormCheckboxDemoController as ctrl\">\n\n  <div class=page-header>\n    <h1 id=formCheckbox>Form Checkbox <a class=small href={{mainCtrl.REPO}}src/modules/ngFormLib/controls/formCheckbox/FormCheckbox.js target=_blank>FormCheckbox.js</a>\n    </h1>\n    <code>ngFormLib.controls.formCheckbox</code>\n  </div>\n\n  <p>The Form Checkbox directive acts like a macro in that it expands into a <code>&lt;label&gt;</code>,<code>&lt;input type=\"checkbox\"&gt;</code> and some auxillary HTML elements, but does change the <code>$scope</code> of those elements.</p>\n\n  <p>It works this way because the elements are inter-related. For example, when the <code>required</code> attribute is set to <code>true</code>\n    the <code>&lt;label&gt;</code> element is changed so that a required-indicator-CSS-class is applied to the element.\n  </p>\n\n  <div class=\"callout callout-danger\">\n    <h4>Plugin dependency</h4>\n    <p>FormCheckbox requires the <a ahref=#formControlService use-hash=true scroll-offset=50>FormControlService module</a>, the <a ahref=#fieldErrorController>field error controller module</a>\n      , the <a ahref=#errorMessageContainer>error message container module</a> and the <a href={{mainCtrl.REPO}}src/modules/ngFormLib/controls/formCheckbox/template/FormCheckboxTemplate.html target=_blank>FormCheckboxTemplate.html</a> template to be loaded.</p>\n  </div>\n\n  <h2 id=formCheckboxExamples>Examples</h2>\n  <p>Use <code>form-checkbox</code> to create a complete HTML structure containing a <code>label</code> and <code>input type=\"checkbox\"</code> element that reacts to the error state of the field.</p>\n\n  <h3>Live demo</h3>\n\n  <div class=bs-example style=padding-bottom:24px append-source>\n\n    \n    <form name=formCheckbox1 class=form novalidate form-submit>\n\n      <div form-checkbox uid=formCheckbox1_fld1 name=formCheckbox1_fld1 required=true ff-ng-model=ctrl.data.fld1 field-errors=\"{required: 'You must agree'}\">You are required to agree to this</div>\n\n      <div form-checkbox uid=formCheckbox1_fld2 name=formCheckbox1_fld2 ff-ng-model=ctrl.data.fld2 ff-ng-true-value=\"'dog'\" ff-ng-false-value=\"'cat'\">Optional Checkbox with value: {{ctrl.data.fld2}}</div>\n\n      <div form-checkbox uid=formCheckbox1_fld3 name=formCheckbox1_fld3 class=image-checkbox required=true field-errors=\"{required: 'You must agree'}\" ff-ng-model=ctrl.data.fld3>Styled accessible checkbox</div>\n\n      <div form-checkbox uid=formCheckbox1_fld4 name=formCheckbox1_fld4 class=image-checkbox ff-ng-disabled=ctrl.data.fld3 ff-ng-model=ctrl.data.fld4>Occassionally disabled checkbox</div>\n\n      <button type=submit class=\"btn btn-primary\">Submit button</button>\n    </form>\n\n  </div>\n\n  <h2 id=formCheckboxUsage>Usage</h2>\n  <p>Add the <code>form-check</code> directive to an element, and supply a label as the content of the element (see example above).</p>\n\n  <h3>Options</h3>\n  <p>Options can be passed via attributes on the directive.</p>\n  <div class=table-responsive>\n    <table class=\"table table-bordered table-striped\">\n      <thead>\n        <tr>\n          <th style=width:100px>Name</th>\n          <th style=width:100px>Type</th>\n          <th style=width:50px>Default</th>\n          <th>Description</th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr>\n          <td>ff-ng-true-value</td>\n          <td>expression</td>\n          <td></td>\n          <td>The value to use in the model-value when the checkbox is checked.</td>\n        </tr>\n        <tr>\n          <td>ff-ng-false-value</td>\n          <td>expression</td>\n          <td></td>\n          <td>The value to use in the model-value when the checkbox is not checked.</td>\n        </tr>\n      </tbody>\n      <tbody form-controls-common-properties-docs></tbody>\n    </table>\n  </div>\n</div>\n";

/***/ },

/***/ "./modules/ngFormLib/controls/formCheckbox/docs/formCheckbox.docs.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);


var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLibDocs.controls.formCheckbox.docs.formCheckbox', []);

/* harmony default export */ exports["a"] = mod.name;

mod.directive('formCheckboxDocs', function () {
  return {
    restrict: 'A',
    controller: 'FormCheckboxDemoController',
    template: __webpack_require__("./modules/ngFormLib/controls/formCheckbox/docs/formCheckbox.docs.html")
  };
});

mod.controller('FormCheckboxDemoController', function Controller() {
  var vm = this;

  vm.titleData = [{ label: 'Dr' }, { label: 'Mr' }, { label: 'Ms' }];
});

/***/ },

/***/ "./modules/ngFormLib/controls/formCheckbox/template/FormCheckboxTemplate.html":
/***/ function(module, exports) {

module.exports = "<div class=\"form-group form-group-checkbox\">\n\t<div class=checkbox>\n\t\t<input type=checkbox field-error-controller>\n\t\t<label><span ng-transclude></span></label>\n\t</div>\n</div>\n";

/***/ },

/***/ "./modules/ngFormLib/controls/formDate/FormDate.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common__ = __webpack_require__("./modules/ngFormLib/controls/common/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__errorMessageContainer_ErrorMessageContainer__ = __webpack_require__("./modules/ngFormLib/controls/errorMessageContainer/ErrorMessageContainer.js");




var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLib.controls.formDate', [__WEBPACK_IMPORTED_MODULE_1__common__["a" /* default */], __WEBPACK_IMPORTED_MODULE_2__errorMessageContainer_ErrorMessageContainer__["a" /* default */]]);

/* harmony default export */ exports["a"] = mod.name;

// INPUT:
//    <div form-date id="toDate" name="toDate" label="To date" hide-label="true"
//    ff-ng-model="acctCtrl.search.toDate" ff-max-date="today" ff-bs-show="acctCtrl.datePickers.datePickerTo"
//    ff-ng-blur="acctCtrl.toggleDatePicker('datePickerTo', true)"
//    ff-ng-focus="acctCtrl.toggleDatePicker('datePickerFrom', true)"
//    ff-class="form-control input-beta input-date"
//    field-errors="{date: 'ERROR.DATE_INVALID'}" >
//      <i class="calendar" ng-click="acctCtrl.toggleDatePicker('datePickerTo')"></i>
//    </div>


mod.directive('formDate', ['formControlService', function (formControlService) {
  return formControlService.buildDirective({
    controlName: 'formDate',
    expectedTemplateElements: ['input', 'label'],
    expectedAttributes: ['label'],
    configFn: function configFn(tElement, tAttr, id, name, inputElem, labelElem) {
      formControlService.addLabelText(labelElem, tAttr.label);
      addPlaceholder(inputElem, formControlService.translate(tAttr.placeholder)); // Do this to be API-compatible with the form-select control. ff-placeholder is still supported. Use one or the other.

      // If the user wants to use addons (either text or buttons), change the DOM
      var hasInputGroup = formControlService.addInputGroup(inputElem, tAttr);
      var parentElemForErrors = hasInputGroup ? inputElem.parent().parent() : inputElem.parent();

      formControlService.createFieldHint(tElement, inputElem, tAttr.fieldHint, id + '-hint', tAttr.fieldHintDisplay);
      formControlService.createErrorFeatures(parentElemForErrors, inputElem, name, tAttr.label, tAttr.fieldErrors, tAttr.textErrors);
    }
  });
}]);

// Populate the template cache with the default template
mod.run(['$templateCache', function ($templateCache) {
  $templateCache.put('ngFormLib/template/formDate.html', __webpack_require__("./modules/ngFormLib/controls/formDate/template/FormDateInputTemplate.html"));
  try {
    $templateCache.put('datepicker/datepicker.tpl.html', __webpack_require__("../node_modules/angular-strap/src/datepicker/datepicker.tpl.html"));
  } catch (err) {
    console.debug('angular-strap/src/datepicker/datepicker.tpl.html is not available for the formDate control');
  }
}]);

function addPlaceholder(inputElem, placeholderText) {
  if (placeholderText) {
    inputElem.attr('placeholder', placeholderText);
  }
}

mod.directive('formDateFormat', ['ngFormLibDateUtil', function (DateUtil) {
  // All dates greater than AD 0 and less than AD 10000 in dd/mm/yyyy format
  // RegEx behaves oddly if /g is uses in Regexp.test() situations
  var dateRegEx = /^(((0[1-9]|[12][0-9]|3[01])([\/])(0[13578]|10|12)([\/])(\d{4}))|(([0][1-9]|[12][0-9]|30)([\/])(0[469]|11)([\/])(\d{4}))|((0[1-9]|1[0-9]|2[0-8])([\/])(02)([\/])(\d{4}))|((29)(\/)(02)([\/])([02468][048]00))|((29)([\/])(02)([\/])([13579][26]00))|((29)([\/])(02)([\/])([0-9][0-9][0][48]))|((29)([\/])(02)([\/])([0-9][0-9][2468][048]))|((29)([\/])(02)([\/])([0-9][0-9][13579][26])))$/;

  return {
    require: 'ngModel',
    priority: 150, // Higher priority than ui-mask (100), so the postLink function runs last
    link: function link(scope, elem, attrs, ctrl) {
      function resetValidators() {
        ctrl.$setValidity('dateFormat', true);
        ctrl.$setValidity('minDate', true); // Turn off the error if the date format isn't valid
        ctrl.$setValidity('maxDate', true); // Turn off the error if the date format isn't valid
      }

      ctrl.$parsers.unshift(function (viewValue) {
        // If viewValue or modelValue is undefined or null, jump out
        if (!viewValue) {
          resetValidators();
          return viewValue;
        }

        if (viewValue.getTime) {
          // Convert the date value to a date string
          viewValue = DateUtil.formatDay(viewValue);
        }

        // If viewValue is a string of 8 digits, then convert it to dd/dd/dddd first
        if (viewValue.length === 8 && !isNaN(viewValue * 1)) {
          viewValue = viewValue.substr(0, 2) + '/' + viewValue.substr(2, 2) + '/' + viewValue.substr(4);
        }

        // Check that it is a valid date
        var dateFormatValid = dateRegEx.test(viewValue) || typeof viewValue === 'undefined' || !viewValue;

        ctrl.$setValidity('dateFormat', dateFormatValid);

        // console.log('dateInput: ' + viewValue + ', ' + ctrl.$modelValue);

        // If the date is valid
        if (dateFormatValid && viewValue) {
          var fieldDate = DateUtil.getDate(viewValue);

          // and there is a min date, check if the value is greater than the min date
          if (attrs.minDate) {
            var minDate = DateUtil.getDate(attrs.minDate);

            ctrl.$setValidity('minDate', fieldDate.getTime() >= minDate.getTime());
          } else {
            ctrl.$setValidity('minDate', true);
          }
          // and there is a max date, check if the value is less than the max date
          if (attrs.maxDate) {
            var maxDate = void 0;

            if (attrs.maxDate === 'today') {
              maxDate = DateUtil.getDate(DateUtil.getToday());
            } else {
              maxDate = DateUtil.getDate(attrs.maxDate);
            }

            ctrl.$setValidity('maxDate', fieldDate.getTime() <= maxDate.getTime());
          } else {
            ctrl.$setValidity('maxDate', true);
          }
        } else {
          ctrl.$setValidity('minDate', true); // Turn off the error if the date format isn't valid
          ctrl.$setValidity('maxDate', true); // Turn off the error if the date format isn't valid
        }
        return viewValue;
      });

      ctrl.$viewChangeListeners.push(function () {
        // If there is a date-change attribute, execute it when the control is valid
        if (attrs.dateChange && ctrl.$valid) {
          scope.$eval(attrs.dateChange);
        }
      });
    }
  };
}]);

/***/ },

/***/ "./modules/ngFormLib/controls/formDate/docs/formDate.docs.html":
/***/ function(module, exports) {

module.exports = "<div class=bs-docs-section ng-controller=\"FormDateDocsController as ctrl\">\n\n  <div class=page-header>\n    <h1 id=formDate>Form Date <a class=small href={{mainCtrl.REPO}}src/modules/ngFormLib/controls/formDate/formDate.js target=_blank>FormDate.js</a>\n    </h1>\n    <code>ngFormLib.controls.formDate</code>\n  </div>\n\n  <p>Same as the Form Input directive, but with additional date validation. The date validation is DD/MM/YYYY-centric. Feel free to refactor it to be more international-friendly.</p>\n\n  <div class=\"callout callout-danger\">\n    <h4>Plugin dependency</h4>\n    <p>Form Date requires the <a ahref=#formControlService use-hash=true scroll-offset=50>FormControlService module</a>, the <a href=#fieldErrorController>field error controller module</a>\n      , the <a ahref=#errorMessageContainer>error message container module</a> and the <a href={{mainCtrl.REPO}}src/modules/ngFormLib/controls/formDate/template/FormDateInputTemplate.html target=_blank>FormDateInputTemplate.html</a> template to be loaded.\n      Additionally, if the <code>mgcrea.ngStrap.datepicker</code> module is loaded (as part of <a href=http://http://mgcrea.github.io/angular-strap target=_blank>AngularStrap</a>, then a calendar control will be displayed.\n      See the <a href=http://mgcrea.github.io/angular-strap/#/datepickers>Date Picker API</a> for more options.\n    </p>\n  </div>\n\n  <h2 id=formDateExamples>Examples</h2>\n  <p>Use <code>form-date</code> to create a complete HTML structure containing a <code>label</code> and <code>input</code> element that reacts to the state of the field.</p>\n\n  <h3>Live demo</h3>\n\n  <div class=bs-example style=padding-bottom:24px append-source>\n\n    \n    <form name=formDate1 class=form novalidate form-submit>\n\n      <div form-date uid=formDate1_fld1 label=\"Date field\" required=true ff-ng-model=ctrl.date1 field-hint=OTHER.HINT ff-min-date=07/07/2010 ff-max-date=today ff-date-type=string ff-date-format=dd/MM/yyyy ff-model-date-format=dd/MM/yyyy field-errors=\"{required: 'Date is required', dateFormat: 'Date must be correct format',\n            minDate: 'Must be greater than 07/07/2010', maxDate: 'Date must not be greater than today'}\"></div>\n\n      <div>{{ctrl.date1}}</div>\n\n      <button type=submit class=\"btn btn-primary\">Submit button</button>\n    </form>\n\n  </div>\n\n  <h2 id=formDateUsage>Usage</h2>\n  <p>Add the <code>form-date</code> directive to an element.</p>\n\n  <h3>Options</h3>\n  <p>Options can be passed via attributes on the directive.</p>\n  <div class=table-responsive>\n    <table class=\"table table-bordered table-striped\">\n      <thead>\n        <tr>\n          <th style=width:100px>Name</th>\n          <th style=width:100px>Type</th>\n          <th style=width:50px>Default</th>\n          <th>Description</th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr>\n          <td>ff-min-date</td>\n          <td>string</td>\n          <td></td>\n          <td>Minimum valid date. A string representation of a date in dd/mm/yyyy format, or the string 'today'</td>\n        </tr>\n        <tr>\n          <td>ff-max-date</td>\n          <td>string</td>\n          <td></td>\n          <td>Maximum valid date. A string representation of a date in dd/mm/yyyy format, or the string 'today'</td>\n        </tr>\n        <tr>\n          <td>field-hint</td>\n          <td>string</td>\n          <td></td>\n          <td>Text that is related to the field but is not the field's label. Often used to provide additional information about the field. This string can be a language-resource-key.</td>\n        </tr>\n      </tbody>\n      <tbody form-controls-common-properties-docs></tbody>\n    </table>\n  </div>\n</div>\n";

/***/ },

/***/ "./modules/ngFormLib/controls/formDate/docs/formDate.docs.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common__ = __webpack_require__("./modules/ngFormLib/controls/common/index.js");



var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLibDocs.controls.formDate.docs.formDate', [__WEBPACK_IMPORTED_MODULE_1__common__["a" /* default */]]);

/* harmony default export */ exports["a"] = mod.name;

mod.directive('formDateDocs', function () {
  return {
    restrict: 'A',
    controller: 'FormDateDocsController',
    template: __webpack_require__("./modules/ngFormLib/controls/formDate/docs/formDate.docs.html")
  };
});

mod.controller('FormDateDocsController', ['ngFormLibDateUtil', function Controller(DateUtil) {
  this.date1 = DateUtil.getToday();
}]);

/***/ },

/***/ "./modules/ngFormLib/controls/formDate/template/FormDateInputTemplate.html":
/***/ function(module, exports) {

module.exports = "<div class=form-group><label class=control-label></label><div class=control-row><input type=text class=form-control maxlength=10 placeholder=dd/mm/yyyy bs-datepicker form-date-format mask-date-digits><span ng-transclude></span></div></div>\n";

/***/ },

/***/ "./modules/ngFormLib/controls/formInput/FormInput.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common__ = __webpack_require__("./modules/ngFormLib/controls/common/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__errorMessageContainer_ErrorMessageContainer__ = __webpack_require__("./modules/ngFormLib/controls/errorMessageContainer/ErrorMessageContainer.js");




var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLib.controls.formInput', [__WEBPACK_IMPORTED_MODULE_1__common__["a" /* default */], __WEBPACK_IMPORTED_MODULE_2__errorMessageContainer_ErrorMessageContainer__["a" /* default */]]);

/* harmony default export */ exports["a"] = mod.name;

// INPUT:
//  <form-input id="" name="" label="Last name" required="{{expression}}"
//      ff-class="span12" input-type="text|tel|email" ff-ng-model="application.lastName"
//      ff-maxlength="40" ff-ng-pattern="/^[a-zA-Z0-9 \-.']+$/"
//      field-hint="This must be the last name of the person who originally applied for the service."
//      field-errors="{required: 'Please enter a valid last name', pattern: 'Please enter a valid last name'}"
//      text-errors="['data.errors.']"
//      content-class="span3"
//      >My content</form-input>

// OUTPUT:


mod.directive('formInput', ['formControlService', function (formControlService) {
  return formControlService.buildDirective({
    controlName: 'formInput',
    expectedTemplateElements: ['input', 'label'],
    expectedAttributes: ['label', 'inputType'],
    configFn: function configFn(tElement, tAttr, id, name, inputElem, labelElem) {
      formControlService.addLabelText(labelElem, tAttr.label);
      addPlaceholder(inputElem, formControlService.translate(tAttr.placeholder)); // Do this to be API-compatible with the form-select control. ff-placeholder is still supported. Use one or the other.

      // If the user wants to use addons (either text or buttons), change the DOM
      var hasInputGroup = formControlService.addInputGroup(inputElem, tAttr);
      var parentElemForErrors = hasInputGroup ? inputElem.parent().parent() : inputElem.parent();

      formControlService.createFieldHint(tElement, inputElem, tAttr.fieldHint, id + '-hint', tAttr.fieldHintDisplay);
      formControlService.createErrorFeatures(parentElemForErrors, inputElem, name, tAttr.label, tAttr.fieldErrors, tAttr.textErrors);
    }
  });
}]);

// Populate the template cache with the default template
mod.run(['$templateCache', function ($templateCache) {
  $templateCache.put('ngFormLib/template/formInput.html', __webpack_require__("./modules/ngFormLib/controls/formInput/template/FormInputTemplate.html"));
}]);

function addPlaceholder(inputElem, placeholderText) {
  if (placeholderText) {
    inputElem.attr('placeholder', placeholderText);
  }
}

/***/ },

/***/ "./modules/ngFormLib/controls/formInput/docs/formInput.docs.html":
/***/ function(module, exports) {

module.exports = "<div class=bs-docs-section>\n\n  <div class=page-header>\n    <h1 id=formInput>Form Input <a class=small href={{mainCtrl.REPO}}src/modules/ngFormLib/controls/formInput/FormInput.js target=_blank>FormInput.js</a>\n    </h1>\n    <code>ngFormLib.controls.formInput</code>\n  </div>\n\n  <p>The Form Input directive acts like a macro in that it expands into a <code>&lt;label&gt;</code><code>&lt;input&gt;</code> and some auxillary HTML elements, but does change the <code>$scope</code> of those elements.</p>\n\n  <p>It works this way because the elements are inter-related. For example, when the <code>required</code> attribute is set to <code>true</code>\n    the <code>&lt;label&gt;</code> element is changed so that a required-indicator-CSS-class is applied to the element.\n  </p>\n\n  <div class=\"callout callout-danger\">\n    <h4>Plugin dependency</h4>\n    <p>Form Input requires the <a ahref=#formControlService use-hash=true scroll-offset=50>FormControlService module</a>, the <a href=#fieldErrorController>field error controller module</a>\n      , the <a ahref=#errorMessageContainer>error message container module</a> to be loaded.</p>\n  </div>\n\n  <h2 id=formInputExamples>Examples</h2>\n  <p>Use <code>form-input</code> to create a complete HTML structure containing a <code>label</code> and <code>select</code> element that reacts to the error state of the field.</p>\n\n  <h3>Live demo</h3>\n\n  <div class=bs-example style=padding-bottom:24px append-source>\n\n    \n    <form name=formInput1 class=form novalidate form-submit>\n\n      <div form-input uid=formInput1_fld1 name=formInput1_fld1 label=\"Text type field\" required=true input-type=text ff-ng-model=ctrl.formInput1.fld1 field-hint=\"{{'OTHER.HINT' | translate}}\" field-errors=\"{required: 'Title is required'}\" placeholder=\"Placeholder text\"></div>\n\n      <div form-input uid=formInput1_fld2 name=formInput1_fld2 label=\"Date type field\" required=false input-type=date ff-ng-model=ctrl.formInput1.fld2></div>\n\n      <div form-input uid=formInput1_fld3 name=formInput1_fld3 label=Income required=true input-type=text ff-ng-model=ctrl.formInput1.fld3 input-prefix=$ input-button-suffix=\"per month\" input-button-suffix-click=$ctrl.igbSuffixHandler() field-errors=\"{required: 'Income is required'}\"></div>\n\n      \n      <div form-input label=\"Generated id field\" required=true input-type=text ff-ng-model=ctrl.formInput1.fld4 placeholder=\"This field has a generated name and id\" input-button-prefix=$ input-button-prefix-click=$ctrl.igbPrefixHandler() input-suffix=\"per month\" field-errors=\"{required: 'FIELD_ERROR.TEMPLATE.REQUIRED'}\"></div>\n\n      <button type=submit class=\"btn btn-primary\">Submit button</button>\n    </form>\n\n  </div>\n\n  <h2 id=formInputUsage>Usage</h2>\n  <p>Add the <code>form-input</code> directive to an element.</p>\n\n  <h3>Options</h3>\n  <p>Options can be passed via attributes on the directive.</p>\n  <div class=table-responsive>\n    <table class=\"table table-bordered table-striped\">\n      <thead>\n        <tr>\n          <th style=width:100px>Name</th>\n          <th style=width:100px>Type</th>\n          <th style=width:50px>Default</th>\n          <th>Description</th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr>\n          <td>field-hint</td>\n          <td>string</td>\n          <td></td>\n          <td>Text that is related to the field but is not the field's label. Often used to provide additional information about the field.</td>\n        </tr>\n        <tr>\n          <td>input-button-prefix</td>\n          <td>string</td>\n          <td></td>\n          <td>Creates a Bootstrap <a href=http://getbootstrap.com/components/#input-groups-buttons target=_blank>input group button</a> at the front of an input control.\n            To handle the button click, call a controller/scope function inside of the `input-button-prefix-click` attribute (see example above).\n          </td>\n        </tr>\n        <tr>\n          <td>input-button-suffix</td>\n          <td>string</td>\n          <td></td>\n          <td>Creates a Bootstrap <a href=http://getbootstrap.com/components/#input-groups-buttons target=_blank>input group button</a> at the end of an input control.\n            To handle the button click, call a controller/scope function inside of the `input-button-suffix-click` attribute (see example above).\n          </td>\n        </tr>\n        <tr>\n          <td>input-prefix</td>\n          <td>string</td>\n          <td></td>\n          <td>Creates a Bootstrap <a href=http://getbootstrap.com/components/#input-groups target=_blank>input group</a> around the input\n            element and displays the <strong>input-prefix</strong> string inside a <code>&lt;span class=\"input-group-addon\"&gt;&lt;/span&gt;</code> element, which appears <strong>before</strong> the <code>input</code> element.\n          </td>\n        </tr>\n        <tr>\n          <td>input-suffix</td>\n          <td>string</td>\n          <td></td>\n          <td>Creates a Bootstrap <a href=http://getbootstrap.com/components/#input-groups target=_blank>input group</a> around the input\n            element and displays the <strong>input-suffix</strong> string inside a <code>&lt;span class=\"input-group-addon\"&gt;&lt;/span&gt;</code> element, which appears <strong>after</strong> the <code>input</code> element.\n          </td>\n        </tr>\n        <tr>\n          <td>placeholder</td>\n          <td>string</td>\n          <td></td>\n          <td>Placeholder text that appears inside the input element when there is no existing value. Alias for <code>ff-placeholder</code>.</td>\n        </tr>\n      </tbody>\n      <tbody form-controls-common-properties-docs></tbody>\n    </table>\n  </div>\n</div>\n";

/***/ },

/***/ "./modules/ngFormLib/controls/formInput/docs/formInput.docs.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);


var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLibDocs.controls.formInput.docs.formInput', []);

/* harmony default export */ exports["a"] = mod.name;

mod.directive('formInputDocs', function () {
  var prefixCount = 0;
  var suffixCount = 0;

  return {
    restrict: 'A',
    template: __webpack_require__("./modules/ngFormLib/controls/formInput/docs/formInput.docs.html"),
    controller: function controller() {
      this.igbPrefixHandler = function () {
        return window.alert('input group button prefix clicked ' + ++prefixCount + ' times');
      };
      this.igbSuffixHandler = function () {
        return window.alert('input group button suffix clicked ' + ++suffixCount + ' times');
      };
    },
    controllerAs: '$ctrl'
  };
});

/***/ },

/***/ "./modules/ngFormLib/controls/formInput/template/FormInputTemplate.html":
/***/ function(module, exports) {

module.exports = "<div class=form-group><label class=control-label></label><div class=control-row><input class=form-control><span ng-transclude></span></div></div>\n";

/***/ },

/***/ "./modules/ngFormLib/controls/formRadioButton/FormRadioButton.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common__ = __webpack_require__("./modules/ngFormLib/controls/common/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__errorMessageContainer_ErrorMessageContainer__ = __webpack_require__("./modules/ngFormLib/controls/errorMessageContainer/ErrorMessageContainer.js");




var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLib.controls.formRadioButton', [__WEBPACK_IMPORTED_MODULE_1__common__["a" /* default */], __WEBPACK_IMPORTED_MODULE_2__errorMessageContainer_ErrorMessageContainer__["a" /* default */]]);

/* harmony default export */ exports["a"] = mod.name;

// INPUT:
//  <form-radio-button uid="fld" name="name" aria-label="Book Type" label-class="btn btn-toggle"
//    ff-class="someCSS" ff-ng-model="application.bookType" ff-value="Fiction" ng-click="loadFiction()" class="span6">
//     <icon class="icon-fiction"></icon>Fiction
//  </form-radio-button>

// OUTPUT:

mod.directive('formRadioButton', ['formControlService', function (formControlService) {
  return formControlService.buildDirective({
    controlName: 'formRadioButton',
    expectedTemplateElements: ['input', 'label', 'div'],
    expectedAttributes: [], // The template should NOT have a form-group element inside it, as this has to be specified externally (due to the group-nature of radio buttons)
    configFn: function configFn(tElement, tAttr, id, name, inputElem) {
      // Move the class attribute from the outer-DIV to the radio-button DIV (special case)
      var rbDiv = tElement.find('div');

      rbDiv.addClass(tElement.attr('class'));
      tElement.removeAttr('class');

      formControlService.createErrorFeatures(tElement, inputElem, name, '', tAttr.fieldErrors, tAttr.textErrors);
      formControlService.buildNgClassExpression(inputElem, inputElem); // Put the ng-class onto the input element itself, as this makes styling easier
    }
  });
}]);

// Populate the template cache with the default template
mod.run(['$templateCache', function ($templateCache) {
  $templateCache.put('ngFormLib/template/formRadioButton.html', __webpack_require__("./modules/ngFormLib/controls/formRadioButton/template/FormRadioButtonTemplate.html"));
}]);

/***/ },

/***/ "./modules/ngFormLib/controls/formRadioButton/docs/formRadioButton.docs.html":
/***/ function(module, exports) {

module.exports = "<div class=bs-docs-section ng-controller=\"FormRadioButtonDemoController as ctrl\">\n\n  <div class=page-header>\n    <h1 id=formRadioButton>Form RadioButton <a class=small href={{mainCtrl.REPO}}src/modules/ngFormLib/controls/formRadioButton/FormRadioButton.js target=_blank>FormRadioButton.js</a>\n    </h1>\n    <code>ngFormLib.controls.formRadioButton</code>\n  </div>\n\n  <p>Form RadioButton is a directive that is a wrapper for a <code>label</code>,<code>input type=\"radio\"</code> and some auxillary HTML elements, designed to work within Bootstrap form-structures.</p>\n\n  <p>It works this way because the <code>label</code>,<code>input type=\"radio\"</code> and error-display elements are inter-related.\n    For example, when the <code>required</code> attribute is set to <code>true</code>\n    the <code>&lt;label&gt;</code> element is changed so that a required-indicator-CSS-class is applied to the element.\n  </p>\n\n  <div class=\"callout callout-danger\">\n    <h4>Plugin dependency</h4>\n    <p>Form RadioButton requires the <a ahref=#formControlService use-hash=true scroll-offset=50>FormControlService module</a>, the <a ahref=#fieldErrorController>field error controller module</a>\n      , the <a ahref=#errorMessageContainer>error message container module</a> and the\n      <a href={{mainCtrl.REPO}}src/modules/ngFormLib/controls/formRadioButton/template/formRadioButtonTemplate.html target=_blank>FormRadioButtonTemplate.html</a> template to be loaded.</p>\n  </div>\n\n  <h2 id=formRadioButtonExamples>Examples</h2>\n  <p>Use <code>form-radio-button</code> to create a complete HTML structure containing a <code>label</code> and <code>input type=\"radio\"</code> element that reacts to the state of the field.</p>\n\n  <h3>Live demo</h3>\n\n  <div class=bs-example style=padding-bottom:24px append-source>\n\n    \n    <form name=formRadio1 class=form novalidate form-submit>\n\n      \n      <fieldset class=\"form-group form-group-radio\">\n        <div ng-repeat=\"item in ctrl.titleData\">\n          <div form-radio-button uid=formRadio1_fld{{$index}} name=formRadio1_group1 ff-ng-model=ctrl.data.radioVal1 ff-ng-value=$index required=true hide-required-indicator>{{item.label}}</div>\n        </div>\n        <div error-container field-name=formRadio1_group1 field-errors=\"{required: 'Please select one of the above options'}\"></div>\n      </fieldset>\n\n      <p>Selected value: {{ctrl.data1.radioVal1}}</p>\n\n      \n      <fieldset class=\"form-group form-group-radio\">\n        <div ng-repeat=\"item in ctrl.titleData\">\n          <div form-radio-button uid=formRadio1_fld2{{$index}} name=formRadio1_group2 ff-ng-model=ctrl.data.radioVal2 ff-ng-value=$index>{{item.label}}</div>\n        </div>\n      </fieldset>\n\n      <button type=submit class=\"btn btn-primary\">Submit</button>\n      <button type=button class=btn form-reset=ctrl.data>Reset</button>\n    </form>\n\n  </div>\n\n  <h2 id=formRadioButtonUsage>Usage</h2>\n  <p>Add the <code>form-radio-button</code> directive to an element, and supply a label as the content of the element (see example above).</p>\n\n  <h3>Options</h3>\n  <p>Options can be passed via attributes on the directive.</p>\n  <div class=table-responsive>\n    <table class=\"table table-bordered table-striped\">\n      <thead>\n      <tr>\n        <th style=width:100px>Name</th>\n        <th style=width:100px>Type</th>\n        <th style=width:50px>Default</th>\n        <th>Description</th>\n      </tr>\n      </thead>\n      <tbody>\n      <tr>\n        <td>ff-ng-value</td>\n        <td>expression</td>\n        <td></td>\n        <td>The value to use in the model-value when the radio-button is selected.</td>\n      </tr>\n      </tbody>\n      <tbody form-controls-common-properties-docs></tbody>\n    </table>\n  </div>\n</div>\n";

/***/ },

/***/ "./modules/ngFormLib/controls/formRadioButton/docs/formRadioButton.docs.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);


var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLibDocs.controls.formRadioButton.docs.formRadioButton', []);

/* harmony default export */ exports["a"] = mod.name;

mod.directive('formRadioButtonDocs', function () {
  return {
    restrict: 'A',
    controller: 'FormRadioButtonDemoController',
    template: __webpack_require__("./modules/ngFormLib/controls/formRadioButton/docs/formRadioButton.docs.html")
  };
});

mod.controller('FormRadioButtonDemoController', function Controller() {
  var vm = this;

  vm.titleData = [{ label: 'Amazing Spiderman, The' }, { label: 'Batman' }, { label: 'Catwoman' }];

  vm.data = {
    radioVal2: 2 };
});

/***/ },

/***/ "./modules/ngFormLib/controls/formRadioButton/template/FormRadioButtonTemplate.html":
/***/ function(module, exports) {

module.exports = "<div>\n\t<div class=radio>\n\t\t<input type=radio field-error-controller>\n\t\t<label><span ng-transclude></span></label>\n\t</div>\n</div>\n";

/***/ },

/***/ "./modules/ngFormLib/controls/formReset/FormReset.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);


var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLib.controls.formReset', []);

/* harmony default export */ exports["a"] = mod.name;

mod.directive('formReset', ['$parse', function ($parse) {
  function resetFieldState(controlMap) {
    // Loops through the controlMap and reset's each field's state
    for (var item in controlMap) {
      if (controlMap.hasOwnProperty(item)) {
        var controlList = controlMap[item];

        for (var j = 0, jLen = controlList.length; j < jLen; j++) {
          controlList[j].controller.fieldState = '';
        }
      }
    }
  }

  return {
    restrict: 'A',
    require: '^form',
    link: function link(scope, element, attr, controller) {
      var ngModelGet = $parse(attr.formReset);
      var ngModelSet = ngModelGet.assign;

      if (!ngModelSet) {
        throw Error('formReset requires an assignable scope-expression. "' + attr.formReset + '" is un-assignable.');
      }

      // Get a copy of the data as soon as the directive is created, which is after the scope/controller has been initialised (safe)
      var originalData = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.copy(ngModelGet(scope));

      element.on('click', function () {
        if (typeof controller.setSubmitted === 'function') {
          controller.setSubmitted(false);
        }
        // Use a *copy* of the original data, as we don't want originalData to be modified by subsequent changes to the model by the form controls
        ngModelSet(scope, __WEBPACK_IMPORTED_MODULE_0_angular___default.a.copy(originalData));
        resetFieldState(controller._controls || {});
        controller.$setPristine();

        scope.$emit('event:FormReset');
        scope.$digest();
      });
    }
  };
}]);

/***/ },

/***/ "./modules/ngFormLib/controls/formReset/docs/formReset.docs.html":
/***/ function(module, exports) {

module.exports = "<div class=bs-docs-section ng-controller=\"FormResetDemoController as ctrl\">\n\n  <div class=page-header>\n    <h1 id=formReset>Form Reset <a class=small href={{mainCtrl.REPO}}src/modules/ngFormLib/controls/formReset/FormReset.js target=_blank>FormReset.js</a>\n    </h1>\n    <code>ngFormLib.controls.formReset</code>\n  </div>\n\n  <p>Form Reset is a directive which resets each form-field to it's initial state, by copying the initial state of the form's data-model.<br/>\n    This requires every form controls' <code>ng-model</code> expression to refer to a common scope-object.\n  </p>\n\n  <h2 id=formResetExamples>Examples</h2>\n  <p>Add <code>form-reset</code> directive to any <code>button</code> element inside a form.</p>\n\n  <h3>Live demo</h3>\n\n  <div class=bs-example style=padding-bottom:24px append-source>\n\n    <form name=formReset class=form novalidate form-submit=ctrl.callWhenValid()>\n\n      <div form-input uid=formReset_fldName name=formReset_fldName label=Name required=true input-type=text ff-ng-model=ctrl.data.name ff-maxlength=40 ff-ng-pattern=\"/^[a-zA-Z0-9 \\-.']+$/\" field-errors=\"{required: 'Last name is required', pattern: 'Please enter a valid last name'}\"></div>\n\n      <div form-input uid=formReset_fldNickName name=formReset_fldNickName label=\"Nick Name\" required=true input-type=text ff-ng-model=ctrl.data.nickName ff-maxlength=40 ff-ng-pattern=\"/^[a-zA-Z0-9 \\-.']+$/\" field-errors=\"{required: 'Nick name is required', pattern: 'Please enter a valid last name'}\"></div>\n\n      <div form-select uid=formReset_fldTitle name=formReset_fldTitle label=\"Title with default value\" required=true ff-ng-model=ctrl.data.title ff-ng-options=\"item.label for item in ctrl.titleData track by item.label\" field-errors=\"{required: 'Title is required'}\"></div>\n\n      <div form-select uid=formReset_fldTitle2 name=formReset_fldTitle2 label=\"Title with no default value\" required=true ff-ng-model=ctrl.data.title2 ff-ng-options=\"item.label for item in ctrl.titleData track by item.label\" field-errors=\"{required: 'Title is required'}\"></div>\n\n      <div form-select uid=formReset_fldTitle3 name=formReset_fldTitle3 label=\"Title with placeholder\" required=true placeholder=\"Select title\" ff-ng-model=ctrl.data.title3 ff-ng-options=\"item.label for item in ctrl.titleData track by item.label\" field-errors=\"{required: 'Title is required'}\"></div>\n\n      <button type=submit class=\"btn btn-primary\">Submit button</button>\n      <button type=button class=btn form-reset=ctrl.data>Reset</button>\n    </form>\n\n  </div>\n\n  <div class=\"callout callout-danger\">\n    <h4>ngOptions <strong>must</strong> use 'track by'</h4>\n    <p>Due to the way <code>form-reset</code> works (copying the data-object used by the controls, then changing the data-object back to the original value),\n    <code>select</code> elements which use <code>ng-options</code> <strong>MUST</strong> use the <code>ng-options=\"... track by ...\"</code> variant\n    of the syntax, if the <code>select</code> element has an initial value. See the example above.</p>\n  </div>\n\n  <h2 id=formResetUsage>Usage</h2>\n  <p>Add the <code>form-reset</code> directive to a <code>button</code> element.</p>\n\n  <h3>Options</h3>\n  <p>Options can be passed via attributes on the directive.</p>\n  <div class=table-responsive>\n    <table class=\"table table-bordered table-striped\">\n      <thead>\n      <tr>\n        <th style=width:100px>Name</th>\n        <th style=width:100px>Type</th>\n        <th style=width:50px>Default</th>\n        <th>Description</th>\n      </tr>\n      </thead>\n      <tbody>\n      <tr>\n        <td>form-reset</td>\n        <td>expression</td>\n        <td></td>\n        <td><strong>Required </strong>This expression should represent the parent scope-model-object that the form controls bind to.\n          For example, a Customer Profile form should have a set of form controls that bind to 'myObject.&lt;name|age|birthDate|...&gt;'.\n          In this example, use <code>form-reset=\"myObject\"</code>.</td>\n      </tr>\n      </tbody>\n    </table>\n  </div>\n\n</div>\n";

/***/ },

/***/ "./modules/ngFormLib/controls/formReset/docs/formReset.docs.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);


var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLibDocs.controls.formReset.docs.formReset', []);

/* harmony default export */ exports["a"] = mod.name;

mod.directive('formResetDocs', function () {
  return {
    restrict: 'A',
    controller: 'FormResetDemoController',
    template: __webpack_require__("./modules/ngFormLib/controls/formReset/docs/formReset.docs.html")
  };
});

mod.controller('FormResetDemoController', function Controller() {
  var vm = this;

  vm.titleData = [{ label: 'Dr' }, { label: 'Mr' }, { label: 'Ms' }];

  // Demonstrate the reset directive with non-empty data models
  vm.data = {
    name: 'Not-empty-initially',
    title: vm.titleData[2]
  };
});

/***/ },

/***/ "./modules/ngFormLib/controls/formSelect/FormSelect.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common__ = __webpack_require__("./modules/ngFormLib/controls/common/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__errorMessageContainer_ErrorMessageContainer__ = __webpack_require__("./modules/ngFormLib/controls/errorMessageContainer/ErrorMessageContainer.js");




var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLib.controls.formSelect', [__WEBPACK_IMPORTED_MODULE_1__common__["a" /* default */], __WEBPACK_IMPORTED_MODULE_2__errorMessageContainer_ErrorMessageContainer__["a" /* default */]]);

/* harmony default export */ exports["a"] = mod.name;

// INPUT:
//  <form-select id="frm-size" name="bookSize" required="true" label="Approximate size"
//    ff-class="span12" ff-ng-model="model.size" placeholder="Select a size bracket"
//    ff-ng-options="option.value as option.name for option in refData.bookSizes"
//    field-errors="{required: 'Please select a size bracket'}"
//    text-errors="['data.errors']"></form-select>

// OUTPUT:


mod.directive('formSelect', ['formControlService', function (formControlService) {
  function addPlaceholder(selectElem, placeholderText) {
    if (placeholderText) {
      selectElem.append('<option translate value="">' + placeholderText + '</option>');
    }
  }

  return formControlService.buildDirective({
    controlName: 'formSelect',
    inputElementName: 'select',
    expectedTemplateElements: ['select', 'label'],
    expectedAttributes: ['label'],
    configFn: function configFn(tElement, tAttr, id, name, inputElem, labelElem) {
      formControlService.addLabelText(labelElem, tAttr.label);
      addPlaceholder(inputElem, tAttr.placeholder); // Adds the extra option element to the start of the <option>

      formControlService.createFieldHint(tElement, inputElem, tAttr.fieldHint, id + '-hint', tAttr.fieldHintDisplay);
      formControlService.createErrorFeatures(inputElem.parent(), inputElem, name, tAttr.label, tAttr.fieldErrors, tAttr.textErrors);
    }
  });
}]);

// Populate the template cache with the default template
mod.run(['$templateCache', function ($templateCache) {
  $templateCache.put('ngFormLib/template/formSelect.html', __webpack_require__("./modules/ngFormLib/controls/formSelect/template/FormSelectTemplate.html"));
}]);

/***/ },

/***/ "./modules/ngFormLib/controls/formSelect/docs/formSelect.docs.html":
/***/ function(module, exports) {

module.exports = "<div class=bs-docs-section ng-controller=\"FormSelectDemoController as ctrl\">\n\n  <div class=page-header>\n    <h1 id=formSelect>Form Select <a class=small href={{mainCtrl.REPO}}/src/modules/ngFormLib/controls/formSelect/FormSelect.js target=_blank>FormSelect.js</a>\n    </h1>\n    <code>ngFormLib.controls.formSelect</code>\n  </div>\n\n  <p>The Form Select directive acts like a macro in that it expands into a <code>&lt;label&gt;</code><code>&lt;select&gt;</code> and some auxillary HTML elements, but does change the <code>$scope</code> of those elements.</p>\n\n  <p>It works this way because the elements are inter-related. For example, when the <code>required</code> attribute is set to <code>true</code>\n    the <code>&lt;label&gt;</code> element is changed so that a required-indicator-CSS-class is applied to the element.\n  </p>\n\n  <div class=\"callout callout-danger\">\n    <h4>Plugin dependency</h4>\n    <p>FormSelect requires the <a ahref=#formControlService use-hash=true scroll-offset=50>FormControlService module</a>, the <a href=#fieldErrorController>field error controller module</a>\n      , the <a ahref=#errorMessageContainer>error message container module</a> and the <a href={{mainCtrl.REPO}}/src/modules/ngFormLib/controls/formSelect/template/FormSelectTemplate.html target=_blank>FormSelectTemplate.html</a> template to be loaded.</p>\n  </div>\n\n  <h2 id=formSelectExamples>Examples</h2>\n  <p>Use <code>form-select</code> to create a complete HTML structure containing a <code>label</code> and <code>select</code> element that reacts to the error state of the field.</p>\n\n  <h3>Live demo</h3>\n\n  <div class=bs-example style=padding-bottom:24px append-source>\n\n    \n    <form name=formFormSelect class=form novalidate form-submit>\n\n      <div form-select uid=formFormSelect_fldDemo1 name=formFormSelect_fldDemo1 label=\"Common field\" required=true ff-ng-model=ctrl.data.demo1 ff-ng-options=\"item.label for item in ctrl.titleData track by item.label\" field-errors=\"{required: 'Title is required'}\"></div>\n\n      <div form-select uid=formFormSelect_fldDemo2 name=formFormSelect_fldDemo2 label=\"Field with placeholder\" required=false ff-ng-model=ctrl.data.demo2 ff-ng-options=\"item.label for item in ctrl.titleData track by item.label\" placeholder=\"{{'OTHER.PLACEHOLDER' | translate}}\"></div>\n\n      <div form-select uid=formFormSelect_fldDemo3 name=formFormSelect_fldDemo3 label=\"{{'FIELD.TITLE' | translate}}\" required=false ff-ng-model=ctrl.data.demo3 ff-ng-options=\"item.label for item in ctrl.titleData track by item.label\" field-hint=OTHER.HINT></div>\n\n      <button type=submit class=\"btn btn-primary\">Submit</button>\n      <button type=button class=btn form-reset=ctrl.data>Reset</button>\n    </form>\n\n  </div>\n\n  <h2 id=formSelectUsage>Usage</h2>\n  <p>Add the <code>form-select</code> directive to an element.</p>\n\n  <h3>Options</h3>\n  <p>Options can be passed via attributes on the directive.</p>\n  <div class=table-responsive>\n    <table class=\"table table-bordered table-striped\">\n      <thead>\n        <tr>\n          <th style=width:100px>Name</th>\n          <th style=width:100px>Type</th>\n          <th style=width:50px>Default</th>\n          <th>Description</th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr>\n          <td>field-hint</td>\n          <td>string</td>\n          <td></td>\n          <td>Text that is related to the field but is not the field's label. Often used to provide additional information about the field. This string can be a language-resource-key.</td>\n        </tr>\n        <tr>\n          <td>placeholder</td>\n          <td>string</td>\n          <td></td>\n          <td>Text to display when there is no initial value.</td>\n        </tr>\n        <tr>\n          <td>ff-ng-options</td>\n          <td>expression</td>\n          <td></td>\n          <td><strong>Required</strong> - the AngularJS <code>ngOptions</code> directive, which is applied to the <code>select</code> element.\n          Note that the 'track by' syntax is required in this expression for the control to work correctly with the <code>form-reset</code> directive.</td>\n        </tr>\n      </tbody>\n      <tbody form-controls-common-properties-docs></tbody>\n    </table>\n  </div>\n</div>\n";

/***/ },

/***/ "./modules/ngFormLib/controls/formSelect/docs/formSelect.docs.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);


var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLibDocs.controls.formSelect.docs.formSelect', []);

/* harmony default export */ exports["a"] = mod.name;

mod.directive('formSelectDocs', function () {
  return {
    restrict: 'A',
    controller: 'FormSelectDemoController',
    template: __webpack_require__("./modules/ngFormLib/controls/formSelect/docs/formSelect.docs.html")
  };
});

mod.controller('FormSelectDemoController', function Controller() {
  var vm = this;

  vm.titleData = [{ label: 'Dr' }, { label: 'Mr' }, { label: 'Ms' }];
});

/***/ },

/***/ "./modules/ngFormLib/controls/formSelect/template/FormSelectTemplate.html":
/***/ function(module, exports) {

module.exports = "<div class=form-group><label class=control-label></label><div class=control-row><select class=form-control></select></div></div>\n";

/***/ },

/***/ "./modules/ngFormLib/controls/formSubmit/FormSubmit.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);


var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLib.controls.formSubmit', []);

/* harmony default export */ exports["a"] = mod.name;

/**
 * formSubmit - Executes an expression when the form is valid (essentially a form.submit() handler).
 *
 * It can be applied to either the form element or to a button.
 *
 * @param {Object} $parse   The $parse service
 *
 * @return {Object} Directive definition object
 */
mod.directive('formSubmit', ['$parse', function ($parse) {
  return {
    restrict: 'A',
    require: ['^form'], // Get the form controller
    link: function link(scope, element, attr, controller) {
      var fn = $parse(attr.formSubmit) || __WEBPACK_IMPORTED_MODULE_0_angular___default.a.noop;
      var isForm = element[0].tagName === 'FORM';
      var formController = controller[0];

      element.bind(isForm ? 'submit' : 'click', function (event) {
        formController.setSubmitted(true);

        scope.$apply(function () {
          // scope.$emit('event:FormSubmitAttempted');

          if (formController.$valid) {
            if (fn(scope, { $event: event }) !== false) {
              // Needed by the tracking tool as it clears the input data after a submission.
              // Potentially, form field validation to be done here, but unnecessary at the moment.
              // The reset behaviour can be over-ridden by returning false from the called function(maybe prevent default aswell?)
              formController.setSubmitted(false);
              formController.$setPristine();
            }
          } else {
            event.preventDefault();
          }
        });
      });
    }
  };
}]);

/***/ },

/***/ "./modules/ngFormLib/controls/formSubmit/docs/formSubmit.docs.html":
/***/ function(module, exports) {

module.exports = "<div class=bs-docs-section ng-controller=\"FormSubmitDemoController as ctrl\">\n\n  <div class=page-header>\n    <h1 id=formSubmit>Form Submit <a class=small href={{mainCtrl.REPO}}src/modules/ngFormLib/controls/formSubmit/FormSubmit.js target=_blank>FormSubmit.js</a>\n    </h1>\n    <code>ngFormLib.controls.formSubmit</code>\n  </div>\n\n  <p>Form Submit is a directive which can contain an expression to execute <strong>when the form is valid</strong>.<br/>\n    This directive is useful when you need to execute a function on the <code>$scope</code> once the form data has been successfully validated.\n    The function would typically do some minor data-transformation on (a copy of) the form's data before sending the data to a service for further processing.\n  </p>\n\n  <h2 id=formSubmitExamples>Examples</h2>\n  <p>Add <code>form-submit</code> directive to any form element <strong>or</strong> to any button inside a form.</p>\n\n  <h3>Live demo</h3>\n\n  <div class=bs-example style=padding-bottom:24px append-source>\n\n    \n    <form name=formSubmit class=form novalidate form-submit=ctrl.callWhenValid()>\n      \n      <div form-input uid=formSubmit_fldName name=formSubmit_fldName label=Name required=true input-type=text ff-ng-model=ctrl.data.name ff-maxlength=40 ff-ng-pattern=\"/^[a-zA-Z0-9 \\-.']+$/\" field-errors=\"{required: 'Last name is required', pattern: 'Please enter a valid last name'}\"></div>\n\n      <input type=submit class=btn value=\"Input type=submit\">\n      <button type=submit class=\"btn btn-primary\">Submit button</button>\n      <button type=button class=btn>Non-submit button</button>\n    </form>\n\n    <hr>\n\n    \n    <form name=formSubmit2 class=form novalidate>\n      \n      <div form-input uid=formSubmit2_fldNickName name=formSubmit2_fldNickName label=\"Nick Name\" required=true input-type=text ff-ng-model=ctrl.data.nickName ff-maxlength=40 ff-ng-pattern=\"/^[a-zA-Z0-9 \\-.']+$/\" field-errors=\"{required: 'Last name is required', pattern: 'Please enter a valid last name'}\"></div>\n\n      <input type=submit class=btn value=\"Input type=submit\">\n      <button type=submit class=\"btn btn-primary\" form-submit=ctrl.callWhenValid()>Submit button with directive</button>\n      <button type=button class=btn form-submit=ctrl.callWhenValid()>Non-submit button with directive</button>\n    </form>\n\n  </div>\n\n  <h2 id=formSubmitUsage>Usage</h2>\n  <p>Add the <code>form-submit</code> directive to a <code>form</code> or <code>button</code> element, with a value that is a scope-expression.</p>\n\n</div>\n";

/***/ },

/***/ "./modules/ngFormLib/controls/formSubmit/docs/formSubmit.docs.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);


var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLibDocs.controls.formSubmit.docs.formSubmit', []);

/* harmony default export */ exports["a"] = mod.name;

mod.directive('formSubmitDocs', function () {
  return {
    restrict: 'A',
    controller: 'FormSubmitDemoController',
    template: __webpack_require__("./modules/ngFormLib/controls/formSubmit/docs/formSubmit.docs.html")
  };
});

mod.controller('FormSubmitDemoController', function Controller() {
  var vm = this;

  vm.callWhenValid = function () {
    window.alert('Form is valid');
  };
});

/***/ },

/***/ "./modules/ngFormLib/controls/index.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__errorMessageContainer_ErrorMessageContainer__ = __webpack_require__("./modules/ngFormLib/controls/errorMessageContainer/ErrorMessageContainer.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__formCheckbox_FormCheckbox__ = __webpack_require__("./modules/ngFormLib/controls/formCheckbox/FormCheckbox.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__formDate_FormDate__ = __webpack_require__("./modules/ngFormLib/controls/formDate/FormDate.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__formInput_FormInput__ = __webpack_require__("./modules/ngFormLib/controls/formInput/FormInput.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__formRadioButton_FormRadioButton__ = __webpack_require__("./modules/ngFormLib/controls/formRadioButton/FormRadioButton.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__formReset_FormReset__ = __webpack_require__("./modules/ngFormLib/controls/formReset/FormReset.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__formSelect_FormSelect__ = __webpack_require__("./modules/ngFormLib/controls/formSelect/FormSelect.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__formSubmit_FormSubmit__ = __webpack_require__("./modules/ngFormLib/controls/formSubmit/FormSubmit.js");










// We need the utility module for the ngFormLibDateUtil.getDate() method for the formDateFormat directive, and ngFormLibStringUtil.trim() in controls.common
var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLib.controls', [__WEBPACK_IMPORTED_MODULE_1__errorMessageContainer_ErrorMessageContainer__["a" /* default */], __WEBPACK_IMPORTED_MODULE_2__formCheckbox_FormCheckbox__["a" /* default */], __WEBPACK_IMPORTED_MODULE_3__formDate_FormDate__["a" /* default */], __WEBPACK_IMPORTED_MODULE_4__formInput_FormInput__["a" /* default */], __WEBPACK_IMPORTED_MODULE_5__formRadioButton_FormRadioButton__["a" /* default */], __WEBPACK_IMPORTED_MODULE_6__formReset_FormReset__["a" /* default */], __WEBPACK_IMPORTED_MODULE_7__formSelect_FormSelect__["a" /* default */], __WEBPACK_IMPORTED_MODULE_8__formSubmit_FormSubmit__["a" /* default */]]);

/* harmony default export */ exports["a"] = mod.name;

/***/ },

/***/ "./modules/ngFormLib/controls/requiredMarker/RequiredMarker.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_FormControlService__ = __webpack_require__("./modules/ngFormLib/controls/common/FormControlService.js");



var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLib.controls.requiredMarker', [__WEBPACK_IMPORTED_MODULE_1__common_FormControlService__["a" /* default */]]);

/* harmony default export */ exports["a"] = mod.name;

// Add a simple "required" marker that is not read-out by screen readers (as the field should also have a required indicator)
//
// INPUT:
//  <span required-marker></span>
//  <span required-marker hide="isNotRequired">Some Text</span>

// OUTPUT:
//  <span class="required" aria-hidden="true" ng-class="{\'ng-hide\': hide}" ng-transclude=""></span>
//  <span class="required" aria-hidden="true" ng-class="{\'ng-hide\': hide}" ng-transclude="" hide="isNotRequired">Some Text</span>

mod.directive('requiredMarker', ['formControlService', function (formControlService) {
  return {
    restrict: 'AE',
    replace: true,
    transclude: true,
    templateUrl: function templateUrl(element, attr) {
      return attr.template || formControlService.getHTMLTemplate(element, 'requiredMarker');
    },
    scope: {
      hide: '='
    }
  };
}]);

// Populate the template cache with the default template
mod.run(['$templateCache', function ($templateCache) {
  $templateCache.put('ngFormLib/template/requiredMarker.html', __webpack_require__("./modules/ngFormLib/controls/requiredMarker/template/RequiredMarkerTemplate.html"));
}]);

/***/ },

/***/ "./modules/ngFormLib/controls/requiredMarker/docs/requiredMarker.docs.html":
/***/ function(module, exports) {

module.exports = "<div class=bs-docs-section ng-controller=\"RequiredMarkerDemoController as ctrl\">\n\n  <div class=page-header>\n    <h1 id=requiredMarker>Required Marker <a class=small href={{mainCtrl.REPO}}src/modules/ngFormLib/controls/requiredMarker/RequiredMarker.js target=_blank>RequiredMarker.js</a>\n    </h1>\n    <code>ngFormLib.controls.requiredMarker</code>\n  </div>\n\n  <p>Required Marker is a small directive which emits HTML which can be styled to display a symbol/content to indicate that a form-field is required.\n    The default template makes the marker accessible by hiding the element from a screen reader and reading out 'required' instead.</p>\n\n  <div class=\"callout callout-danger\">\n    <h4>Plugin dependency</h4>\n    <p>Required Marker requires the <a ahref=#formControlService use-hash=true scroll-offset=50>FormControlService module</a> template to be loaded.</p>\n  </div>\n\n  <h2 id=requiredMarkerExamples>Examples</h2>\n  <p>Use <code>required-marker</code> to add an indicator inside a <code>label</code> element.</p>\n\n  <h3>Live demo</h3>\n\n  <div class=bs-example style=padding-bottom:24px append-source>\n\n    \n    <form name=formRequiredMarker class=form novalidate form-submit>\n\n      \n      <div class=form-group>\n        <label for=formRequiredMarker_fldTitle>My field<span required-marker></span></label>\n        <div class=control-row>\n          <select uid=formRequiredMarker_fldTitle name=formRequiredMarker_fldTitle ng-model=ctrl.data.title ng-options=\"item.label for item in ctrl.titleData\" class=form-control ng-required=true field-error-controller></select>\n        </div>\n        <div error-container field-name=formRequiredMarker_fldTitle field-errors=\"{required: 'Please select a title'}\"></div>\n      </div>\n\n\n      \n      <div class=form-group>\n        <label for=formRequiredMarker_fldTitle2>Optionally required field</label><span required-marker hide=\"ctrl.data.title.label === 'Mr'\"></span>\n        <div class=control-row>\n          <select uid=formRequiredMarker_fldTitle2 name=formRequiredMarker_fldTitle2 ng-model=ctrl.data.title2 ng-options=\"item.label for item in ctrl.titleData\" class=form-control ng-required=\"ctrl.data.title.label !== 'Mr'\" field-error-controller></select>\n        </div>\n        <div error-container field-name=formRequiredMarker_fldTitle2 field-errors=\"{required: 'Please select a title'}\"></div>\n      </div>\n\n\n      \n      <div form-input uid=formRequiredMarker_fldName name=formRequiredMarker_fldName label=Name required=true input-type=text ff-ng-model=ctrl.formInput.demo1 field-errors=\"{required: 'Name is required'}\"></div>\n\n      <button type=submit class=\"btn btn-primary\">Submit button</button>\n    </form>\n\n  </div>\n\n  <h2 id=requiredMarkerUsage>Usage</h2>\n  <p>Add the <code>required-marker</code> directive to an element.</p>\n\n  <h3>Options</h3>\n  <p>Options can be passed via attributes on the directive.</p>\n  <div class=table-responsive>\n    <table class=\"table table-bordered table-striped\">\n      <thead>\n      <tr>\n        <th style=width:100px>Name</th>\n        <th style=width:100px>Type</th>\n        <th style=width:50px>Default</th>\n        <th>Description</th>\n      </tr>\n      </thead>\n      <tbody>\n      <tr>\n        <td>hide</td>\n        <td>expression</td>\n        <td>false</td>\n        <td>A scope-expression which causes the required marker to appear (false) or disappear (true)</td>\n      </tr>\n      <tr>\n        <td>template</td>\n        <td>URL</td>\n        <td>ngFormLib/controls/requiredMarker/template/RequiredMarkerTemplate.html</td>\n        <td>The HTML template to use for the control. The default value can be overridden on the element, or globally by setting the default value in the <a ahref=#formControlService>formControlService</a></td>\n      </tr>\n      </tbody>\n    </table>\n  </div>\n</div>\n";

/***/ },

/***/ "./modules/ngFormLib/controls/requiredMarker/docs/requiredMarker.docs.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);


var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLibDocs.controls.requiredMarker.docs.requiredMarker', []);

/* harmony default export */ exports["a"] = mod.name;

mod.directive('requiredMarkerDocs', function () {
  return {
    restrict: 'A',
    controller: 'RequiredMarkerDemoController',
    template: __webpack_require__("./modules/ngFormLib/controls/requiredMarker/docs/requiredMarker.docs.html")
  };
});

mod.controller('RequiredMarkerDemoController', function Controller() {
  var vm = this;

  vm.titleData = [{ label: 'Dr' }, { label: 'Mr' }, { label: 'Ms' }];
});

/***/ },

/***/ "./modules/ngFormLib/controls/requiredMarker/template/RequiredMarkerTemplate.html":
/***/ function(module, exports) {

module.exports = "<span class=required aria-hidden=true ng-class=\"{'ng-hide': hide}\" ng-transclude></span>\n";

/***/ },

/***/ "./modules/ngFormLib/index.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__policy_FormPolicy__ = __webpack_require__("./modules/ngFormLib/policy/FormPolicy.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__controls__ = __webpack_require__("./modules/ngFormLib/controls/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__policy_defaultPolicies__ = __webpack_require__("./modules/ngFormLib/policy/defaultPolicies.js");
/* harmony export (binding) */ __webpack_require__.d(exports, "ngFormLib", function() { return ngFormLib; });
/* harmony export (binding) */ __webpack_require__.d(exports, "defaultPolicies", function() { return defaultPolicies; });




// Don't include this in the angular module, only export it here for convenience


var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLib', [__WEBPACK_IMPORTED_MODULE_1__policy_FormPolicy__["a" /* default */], __WEBPACK_IMPORTED_MODULE_2__controls__["a" /* default */]]);

// The library, and the default policies

var ngFormLib = mod.name;
var defaultPolicies = __WEBPACK_IMPORTED_MODULE_3__policy_defaultPolicies__["a" /* default */];


/***/ },

/***/ "./modules/ngFormLib/policy/FormPolicy.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);


// The form policy intentionally has no hard dependencies.
// If there are form-policy values that exist when the service is being constructed, it will use them.
// Otherwise it will use no-op policy functions.
var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLib.policy', []);

/* harmony default export */ exports["a"] = mod.name;

// This is a configurable service
// It should contain the _default_ values for form policies

mod.provider('formPolicyService', function Provider() {
  var self = this;
  var noop = function noop() {};
  var nullBehaviourOnStateChange = {
    behaviour: function behaviour() {
      return {
        applyBehaviour: noop,
        resetBehaviour: noop
      };
    }
  };
  var nullStateDefinitions = {
    create: function create() {
      return {};
    }, // Return an empty object
    states: function states() {
      return {};
    }
  };
  var nullAccessibilityBehaviour = {
    createAriaErrorElement: function createAriaErrorElement() {
      return '';
    },
    onErrorChangeBehaviour: noop
  };

  // The self.defaults property allows the formPolicy to be customised for a specific form
  self.defaults = {
    formSubmitAttemptedClass: 'form-submit-attempted',
    accessibilityBehaviour: null,
    behaviourOnStateChange: null,
    checkForStateChanges: null,
    stateDefinitions: null
  };

  this.$get = ['$injector', function ($injector) {
    function getService(name) {
      try {
        return $injector.get(name);
      } catch (e) {
        return null; // Provider-not-found error, ignore and move on
      }
    }

    // Policy precedence: this.defaults, policy-value-object, noop
    self.defaults.accessibilityBehaviour = self.defaults.accessibilityBehaviour || getService('formPolicyAccessibilityBehaviour') || nullAccessibilityBehaviour;
    self.defaults.behaviourOnStateChange = self.defaults.behaviourOnStateChange || getService('formPolicyBehaviourOnStateChange') || nullBehaviourOnStateChange;
    self.defaults.checkForStateChanges = self.defaults.checkForStateChanges || (getService('formPolicyCheckForStateChanges') || {}).checker || noop;
    self.defaults.stateDefinitions = self.defaults.stateDefinitions || getService('formPolicyStateDefinitions') || nullStateDefinitions;

    var policyService = {
      getCurrentPolicy: function getCurrentPolicy() {
        return __WEBPACK_IMPORTED_MODULE_0_angular___default.a.copy(self.defaults);
      }
    };

    return policyService;
  }];
});

function formDirective(formPolicyService) {
  return {
    // priority: -1,
    restrict: 'AE',
    require: ['?form'], // Tells the directive to get the controller for the 'form' directive, which is the FormController controller
    compile: function compile(tElement, tAttr) {
      // Use element.data() to store a reference to this element for use by child.inheritedData()
      // Will storing an element this way cause a memory leak? Or should I just store the data I currently need (attr.class)
      // This has to happen during the compile step, as the children need access to the variable when they are compiled
      //  ('class' is a reserved word to JavaScript, so we need to treat it as a string)
      tElement.data('formElementClasses', tAttr['class']);

      return {
        pre: function pre(scope, element, attr, controller) {
          // We want to extend the FormController by adding a form policy
          var formController = controller[0];

          formController._policy = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.extend(formPolicyService.getCurrentPolicy(), scope.$eval(attr.formPolicy));

          // Add a reference to the <form> element's scope to the formController, to support showing errors for nested components
          formController._scope = scope;

          // Determine if we have a parent form controller. If we do, we want to use it for the focus behaviour
          formController._parentController = element.parent().controller('form');

          if (!formController._parentController) {
            // We also want to add an element reference when a control is added
            formController._controls = {};
          }

          // Generate the focus policy function for use by other directive
          formController._applyFormBehaviourOnStateChangePolicy = formController._policy.behaviourOnStateChange.behaviour(formController);

          // Add/remove a class onto the form based on the value of the formSubmitted variable
          formController.setSubmitted = function (value, tellNoOne) {
            element[value ? 'addClass' : 'removeClass'](formController._policy.formSubmitAttemptedClass);
            formController._formSubmitAttempted = value;
            formController._applyFormBehaviourOnStateChangePolicy.resetBehaviour();

            if (value && !tellNoOne) {
              scope.$broadcast('event:FormSubmitAttempted');
            }
          };

          // Flag to indicate whether the form has been submitted
          formController._formSubmitAttempted = false;
          formController._applyFormBehaviourOnStateChangePolicy.resetBehaviour();

          // If this form is an ngForm (in that it has a parent 'form'), then we need to make sure that
          // when the parent form is submitted or reset, the same thing happens to the child forms
          if (formController._parentController) {
            scope.$watch(function () {
              return formController._parentController._formSubmitAttempted;
            }, function (value) {
              if (value !== undefined) {
                // formController.setSubmitted(!!value, true);  // Don't send another notification, just update our own state
                formController.setSubmitted(!!value); // Don't send another notification, just update our own state
              }
            });
          }
        }
      };
    }
  };
}
mod.directive('form', ['formPolicyService', formDirective]);
mod.directive('ngForm', ['formPolicyService', formDirective]);

// We want our formController to expose the list of controls that are registered with the form,
// including controls inside sub-forms. That allows us to reset them directly. Relying simply on the fieldName
// does not work when using sub-forms inside ng-repeaters.

var inputElements = ['input', 'select'];

__WEBPACK_IMPORTED_MODULE_0_angular___default.a.forEach(inputElements, function (inputElem) {
  mod.directive(inputElem, function () {
    function hookupElementToNameToElementMap(formController, element, fieldName, fieldController) {
      // Each element in the map is an array, because form elements *can have the same name*!
      var map = formController._controls;

      if (!map[fieldName]) {
        map[fieldName] = [];
      }
      // Add the field to the end of the list of items with the same name
      map[fieldName][map[fieldName].length] = { 'element': element, 'controller': fieldController };

      element.on('$destroy', function () {
        // Delete just this element from the map of controls
        var map = formController._controls[element.attr('name')];
        var elementId = element.attr('id');

        for (var i = 0; i < map.length; i++) {
          if (map[i].element.attr('id') === elementId) {
            map.splice(i, 1);
            break;
          }
        }
      });
    }

    return {
      restrict: 'E',
      require: ['?^form', '?ngModel'],
      link: {
        pre: function pre(scope, element, attr, controllers) {
          if (!controllers[0]) {
            return;
          }

          var rootFormController = controllers[0]._parentController || controllers[0];
          var fieldController = controllers[1];
          var name = attr.name;

          if (rootFormController && rootFormController._controls) {
            hookupElementToNameToElementMap(rootFormController, element, name, fieldController);
          }
        }
      }
    };
  });
});

/***/ },

/***/ "./modules/ngFormLib/policy/accessibility/PolicyFormAccessibility.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony export (immutable) */ exports["b"] = getAriaErrorElementId;


var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLib.policy.formAccessibility', []);

/* harmony default export */ exports["a"] = mod.name;

var ariaErrorElementSuffix = '-errors-aria';
var ariaErrorElementTemplate = '<span class="sr-only" aria-hidden="true"></span>';

function createAriaErrorElement(formName, fieldName) {
  var elem = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.element(ariaErrorElementTemplate);

  elem.attr('id', getAriaErrorElementId(formName, fieldName));
  return elem;
}

// EXPORTED! Allows the PolicyBehaviourOnStateChange.onErrorSetAriaDescribedByToAriaErrorElement to work.
// Not perfect... still feels like ARIA behaviour is not in one place...
function getAriaErrorElementId(formName, fieldName) {
  return formName + '-' + fieldName + ariaErrorElementSuffix;
}

function createLongErrorDescription(ariaElement, errors) {
  var str = '';
  var i = 0;

  for (var type in errors) {
    if (errors.hasOwnProperty(type)) {
      str += 'Error ' + ++i + ', ' + errors[type] + ',';
    }
  }

  if (i === 1) {
    str = '. There is 1 error for this field. ' + str;
  } else if (i > 1) {
    str = '. There are ' + i + ' errors for this field. ' + str;
  }
  ariaElement.text(str);
}

function createShortErrorDescription(ariaElement, errors) {
  var errorMsgs = [];
  var prefix = '';

  for (var type in errors) {
    if (errors.hasOwnProperty(type)) {
      errorMsgs.push(errors[type]);
    }
  }

  if (errorMsgs.length > 1) {
    prefix = errorMsgs.length + ' errors: ';
  }
  ariaElement.text(prefix + errorMsgs.join('. '));
}

// Define the different display trigger implementations available
mod.constant('formPolicyAccessibilityLibrary', {
  createAriaErrorElement: createAriaErrorElement,
  createLongErrorDescription: createLongErrorDescription,
  createShortErrorDescription: createShortErrorDescription
});

mod.provider('formPolicyAccessibilityBehaviour', ['formPolicyAccessibilityLibrary', function Provider(lib) {
  var config = this.config = {
    createAriaErrorElement: lib.createAriaErrorElement,
    onErrorChangeBehaviour: lib.createLongErrorDescription
  };

  this.$get = function () {
    return config;
  };
}]);

/***/ },

/***/ "./modules/ngFormLib/policy/behaviourOnStateChange/PolicyBehaviourOnStateChange.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angular_scroll__ = __webpack_require__("../node_modules/angular-scroll/angular-scroll.min.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angular_scroll___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_angular_scroll__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__controls_common_FormControlService__ = __webpack_require__("./modules/ngFormLib/controls/common/FormControlService.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__accessibility_PolicyFormAccessibility__ = __webpack_require__("./modules/ngFormLib/policy/accessibility/PolicyFormAccessibility.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__stateDefinitions_PolicyStateDefinitions__ = __webpack_require__("./modules/ngFormLib/policy/stateDefinitions/PolicyStateDefinitions.js");
/* unused harmony export combineBehaviours */






// The form policy intentionally has no hard dependencies.
// If there are form-policy values that exist when the service is being constructed, it will use them.
// Otherwise it will use no-op policy functions.
var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLib.policy.behaviourOnStateChange', ['duScroll', __WEBPACK_IMPORTED_MODULE_2__controls_common_FormControlService__["a" /* default */]]);

/* harmony default export */ exports["a"] = mod.name;

// Helper functions
var timeoutPromise = void 0;
var scrollPromise = void 0;

function isElementVisible(element) {
  return !!element.getBoundingClientRect().top;
}

function setFocusOnField($document, $timeout, duration, element, offset) {
  // If no offsetHeight then assume it's invisible and let the next error field take the scroll position
  if (isElementVisible(element[0])) {
    // console.log('Error focus set to: ' + domElement.id);
    $timeout.cancel(timeoutPromise);
    $timeout.cancel(scrollPromise); // This doesn't seem to make a difference on a Mac - user-generated scrolling does not get cancelled
    timeoutPromise = $timeout(function () {
      element[0].focus();
    }, duration);
    scrollPromise = $document.scrollToElement(element, offset, duration); // scrollToElement() comes from the angular-scroll directive // No offset
    return true;
  }
  return false; // Indicate that we did NOT set the focus
}

// Make this available for people that want to add behaviours:
function combineBehaviours(a, b) {
  // If 'a' is undefined, return b
  if (!a) {
    return b;
  }

  return function () {
    var resultA = a.apply(undefined, arguments);
    var resultB = b.apply(undefined, arguments);

    return {
      applyBehaviour: function applyBehaviour() {
        for (var _len = arguments.length, args2 = Array(_len), _key = 0; _key < _len; _key++) {
          args2[_key] = arguments[_key];
        }

        resultA.applyBehaviour.apply(null, args2);
        resultB.applyBehaviour.apply(null, args2);
      },
      resetBehaviour: function resetBehaviour() {
        for (var _len2 = arguments.length, args2 = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args2[_key2] = arguments[_key2];
        }

        resultA.resetBehaviour.apply(null, args2);
        resultB.resetBehaviour.apply(null, args2);
      }
    };
  };
}

/*
 * Returns a function that can be called when an error is showing FOR THIS FIELD. The function is dynamically created
 *  based on the form policy.
 *
 *  The dynamic function sets the focus if the form policy allows it to
 *  The input parameters are:
 *    - DOMElement of the current form-field control that could get focus
 *    - whether an error is showing on the form-field
 *    - whether the form was just attempted to be submitted
 *
 *  The returned function is stored against the form controller as _applyFormFocusPolicy(...)
 *  _applyFormFocusPolicy() should be called by the field-error-controller directive whenever the field state changes,
 *   and when a form-submit event occurs.
 */
mod.service('formPolicyBehaviourOnStateChangeLibrary', ['$document', '$timeout', 'duScrollDuration', 'formControlService', function ($document, $timeout, duScrollDuration, formControlService) {
  // Policy implementation functions
  function onSubmitFocusFirstFieldIfError(formController) {
    // We want to pretend that there is a single controller for the form, for the purpose of managing the focus.
    // Otherwise, the main form sets the focus, then the subform (ng-form) also sets the focus
    var focusController = formController._parentController || formController;

    return {

      // This function is called by the fieldErrorController when the fieldState changes and when the form is submitted
      applyBehaviour: function applyBehaviour(fieldElem, fieldState, formSubmitAttempted /* , formName, fieldName*/) {
        // Set the focus to the field if there is an error showing and a form-submit has been attempted
        if (fieldState === __WEBPACK_IMPORTED_MODULE_4__stateDefinitions_PolicyStateDefinitions__["b" /* ERROR_STATE */] && formSubmitAttempted) {
          // Make sure element is the first field with an error based on DOM order
          var elems = $document[0][focusController.$name].querySelectorAll('.form-group .ng-invalid');
          var firstElement = void 0;

          __WEBPACK_IMPORTED_MODULE_0_angular___default.a.forEach(elems, function (elem) {
            if (isElementVisible(elem) && !firstElement) {
              firstElement = elem;
            }
          });
          var isFirstElement = firstElement ? firstElement.id === fieldElem[0].id : false;

          // ...and if the focusErrorElement is blank...
          var scrollOffset = formController._policy.behaviourOnStateChange.fieldFocusScrollOffset;

          if (!focusController._focusErrorElement && isFirstElement && setFocusOnField($document, $timeout, duScrollDuration, fieldElem, scrollOffset)) {
            focusController._focusErrorElement = fieldElem;
          }
        }
      },

      resetBehaviour: function resetBehaviour() {
        focusController._focusErrorElement = null;
      }
    };
  }

  function onErrorSetAriaDescribedByToAriaErrorElement() /* formController*/{
    return {
      applyBehaviour: function applyBehaviour(fieldElem, fieldState, formSubmitAttempted, formName, fieldName) {
        fieldElem.attr('aria-invalid', fieldState === __WEBPACK_IMPORTED_MODULE_4__stateDefinitions_PolicyStateDefinitions__["b" /* ERROR_STATE */]);
        // Get a reference to the error element
        var errorElemId = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__accessibility_PolicyFormAccessibility__["b" /* getAriaErrorElementId */])(formName, fieldName);

        // Link the field to the ariaErrorElement.
        if (fieldState === __WEBPACK_IMPORTED_MODULE_4__stateDefinitions_PolicyStateDefinitions__["b" /* ERROR_STATE */]) {
          formControlService.addToAttribute(fieldElem, 'aria-describedby', errorElemId);
        } else {
          formControlService.removeFromAttribute(fieldElem, 'aria-describedby', errorElemId);
        }
      },
      resetBehaviour: function resetBehaviour() {}
    };
  }

  function updateElementStyle(formController) {
    return {
      applyBehaviour: function applyBehaviour(fieldElem, fieldState, formSubmitAttempted, formName, fieldName, formGroupElement) {
        var policy = formController._policy.behaviourOnStateChange;

        formGroupElement[fieldState === __WEBPACK_IMPORTED_MODULE_4__stateDefinitions_PolicyStateDefinitions__["b" /* ERROR_STATE */] ? 'addClass' : 'removeClass'](policy.fieldErrorClass);
        formGroupElement[fieldState === 'success' ? 'addClass' : 'removeClass'](policy.fieldSuccessClass);
      },
      resetBehaviour: function resetBehaviour() {}
    };
  }

  return {
    onSubmitFocusFirstFieldIfError: onSubmitFocusFirstFieldIfError,
    onErrorSetAriaDescribedByToAriaErrorElement: onErrorSetAriaDescribedByToAriaErrorElement,
    updateElementStyle: updateElementStyle
  };
}]);

mod.provider('formPolicyBehaviourOnStateChange', function Provider() {
  var config = this.config = {
    behaviour: undefined,
    fieldErrorClass: 'has-error',
    fieldSuccessClass: 'has-success',
    fieldFocusScrollOffset: 0
  };

  this.$get = ['formPolicyBehaviourOnStateChangeLibrary', function (lib) {
    // If the behaviour has been over-ridden, great. Otherwise this is the default.
    config.behaviour = config.behaviour || [lib.onSubmitFocusFirstFieldIfError, lib.onErrorSetAriaDescribedByToAriaErrorElement, lib.updateElementStyle].reduce(combineBehaviours);

    return config;
  }];
});

/***/ },

/***/ "./modules/ngFormLib/policy/checkForStateChanges/PolicyCheckForStateChanges.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__stateDefinitions_PolicyStateDefinitions__ = __webpack_require__("./modules/ngFormLib/policy/stateDefinitions/PolicyStateDefinitions.js");



var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLib.policy.checkForStateChanges', []);

/* harmony default export */ exports["a"] = mod.name;

// Policy implementation functions
function checkForStateChangesOnBlurUntilSubmitThenOnChange(scope, element, name, stateDefinitions, ngModelController) {
  var errorWatch = void 0;

  scope.$on('event:FormSubmitAttempted', function () {
    (errorWatch || __WEBPACK_IMPORTED_MODULE_0_angular___default.a.noop)(); // Remove the error watcher, which may-or-may-not be present
    errorWatch = watchForErrorChanges(scope, stateDefinitions, ngModelController);
    // console.log('heard formSubmitAttempted');
  });

  // Listen for the form reset event and cancel the submit-watcher
  scope.$on('event:FormReset', function () {
    (errorWatch || __WEBPACK_IMPORTED_MODULE_0_angular___default.a.noop)(); // Remove the error watcher, which may-or-may-not be present
    errorWatch = undefined;
    // console.log('heard formReset');
  });

  // Initially just watch for blur event. But once there's an error, watch for keyup events too
  watchForBlurEvent(scope, element, name, stateDefinitions, ngModelController);
}

function checkForStateChangesOnChange(scope, element, name, stateDefinitions, ngModelController) {
  // Watch the error condition for changes, and flag the field as inErrorShowing when the errorCondition is true
  return watchForErrorChanges(scope, stateDefinitions, ngModelController);
}

function checkForStateChangesOnBlur(scope, element, name, stateDefinitions, ngModelController) {
  watchForBlurEvent(scope, element, name, stateDefinitions, ngModelController);
}

// Helper methods
function createWatch(scope, ngModelController, stateName, stateCondition) {
  return scope.$watch(stateCondition, function (value) {
    if (value === true) {
      ngModelController.fieldState = stateName; // THIS IS THE KEY FLAG
      // console.log('A: ' + stateCondition + ' = ' + value);
    }
  });
}

function watchForErrorChanges(scope, stateDefinitions, ngModelController) {
  // Set up a watch for each state definition... expensive?
  var watchers = [];

  for (var stateName in stateDefinitions) {
    if (stateDefinitions.hasOwnProperty(stateName)) {
      watchers.push(createWatch(scope, ngModelController, stateName, stateDefinitions[stateName]));
    }
  }

  // Return a de-registration function
  return function () {
    // console.log('Remove error watchers...', watchers);
    watchers.forEach(function (deregistrationFn) {
      return deregistrationFn();
    });
  };
}

function evaluateFieldStates(scope, stateDefinitions, ngModelController) {
  for (var prop in stateDefinitions) {
    if (scope.$eval(stateDefinitions[prop]) === true) {
      ngModelController.fieldState = prop;
      // console.log('B: ' + stateDefinitions[prop] + ' = ' + prop);
      break;
    }
  }
}

function watchForBlurEvent(scope, element, fieldName, stateDefinitions, ngModelController) {
  // Determine the initial field state. First state to evaluate to TRUE wins
  evaluateFieldStates(scope, stateDefinitions, ngModelController);

  var handleErrorsOnKeyChangeWatcher = void 0;

  element.bind('blur', function ngShowWatchAction() {
    var initialFieldState = ngModelController.fieldState;

    evaluateFieldStates(scope, stateDefinitions, ngModelController);
    // console.log(initialFieldState, '=>', ngModelController.fieldState);

    // If onBlur we change into an error state (from a non error state), start watching for error-changes (as soon as the field become valid).
    if (initialFieldState !== ngModelController.fieldState && ngModelController.fieldState === __WEBPACK_IMPORTED_MODULE_1__stateDefinitions_PolicyStateDefinitions__["b" /* ERROR_STATE */] && !handleErrorsOnKeyChangeWatcher) {
      // console.log('adding change watchers');
      handleErrorsOnKeyChangeWatcher = watchForErrorChanges(scope, stateDefinitions, ngModelController);
      // If we are already watching for error-changes and the field is no longer in error, stop watching for error changes
    } else if (handleErrorsOnKeyChangeWatcher && ngModelController.fieldState !== __WEBPACK_IMPORTED_MODULE_1__stateDefinitions_PolicyStateDefinitions__["b" /* ERROR_STATE */]) {
      handleErrorsOnKeyChangeWatcher(); // Remove the watcher
      handleErrorsOnKeyChangeWatcher = undefined;
    }

    scope.$apply(); // We are in a jQueryLite handler and have changed a scope property - fire the watchers!
  });
}

// Define the different display trigger implementations available
mod.constant('formPolicyCheckForStateChangesLibrary', function () {
  return {
    onChange: checkForStateChangesOnChange,
    onBlur: checkForStateChangesOnBlur,
    onBlurUntilSubmitThenOnChange: checkForStateChangesOnBlurUntilSubmitThenOnChange
  };
}());

mod.provider('formPolicyCheckForStateChanges', ['formPolicyCheckForStateChangesLibrary', function Provider(lib) {
  var config = this.config = {
    checker: lib.onBlurUntilSubmitThenOnChange
  };

  this.$get = function () {
    return config;
  };
}]);

/***/ },

/***/ "./modules/ngFormLib/policy/defaultPolicies.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__accessibility_PolicyFormAccessibility__ = __webpack_require__("./modules/ngFormLib/policy/accessibility/PolicyFormAccessibility.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__behaviourOnStateChange_PolicyBehaviourOnStateChange__ = __webpack_require__("./modules/ngFormLib/policy/behaviourOnStateChange/PolicyBehaviourOnStateChange.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__checkForStateChanges_PolicyCheckForStateChanges__ = __webpack_require__("./modules/ngFormLib/policy/checkForStateChanges/PolicyCheckForStateChanges.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__stateDefinitions_PolicyStateDefinitions__ = __webpack_require__("./modules/ngFormLib/policy/stateDefinitions/PolicyStateDefinitions.js");






var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLib.defaultPolicies', [__WEBPACK_IMPORTED_MODULE_1__accessibility_PolicyFormAccessibility__["a" /* default */], __WEBPACK_IMPORTED_MODULE_2__behaviourOnStateChange_PolicyBehaviourOnStateChange__["a" /* default */], __WEBPACK_IMPORTED_MODULE_3__checkForStateChanges_PolicyCheckForStateChanges__["a" /* default */], __WEBPACK_IMPORTED_MODULE_4__stateDefinitions_PolicyStateDefinitions__["a" /* default */]]);

/* harmony default export */ exports["a"] = mod.name;

/***/ },

/***/ "./modules/ngFormLib/policy/docs/formPolicy.docs.html":
/***/ function(module, exports) {

module.exports = "<div class=bs-docs-section ng-controller=\"FormPolicyDemoCtrl as ctrl\">\n\n  <div class=page-header>\n    <h1 id=formPolicy>Form Policy <a class=small href={{mainCtrl.REPO}}src/modules/ngFormLib/policy/FormPolicy.js target=_blank>FormPolicy.js</a>\n    </h1>\n    <code>ngFormLib.policy</code>\n  </div>\n\n  <p>Form Policy is a service which is used in conjunction with decorated <code>form</code> and <code>ng-form</code> directives to\n  apply validation behaviours to any form.<br/><strong><code>ngFormLib.policy</code> is a required module for all other Form Policy directives.</strong>\n\n  </p><p>This service exposes the following configurable policies:</p>\n  <ul>\n    <li><strong>field state definition</strong> (policies which define what state a component should be in for the component to be consider in an error-state, a success-state, or some-other-state which you can define</li>\n    <li><strong>when to check for field-state changes</strong> - which user-or-application events should cause the component-state to be checked to see if it has changed state (according to the definition in the above policy)</li>\n    <li><strong>what to do when a state-change occurs</strong> - such as setting the focus to the first field that has an error, when the field is in an error-state</li>\n    <li><strong>accessible form behaviour</strong> - defines how form-field error messages are associated with form-fields</li>\n  </ul>\n\n  <h2 id=formPolicyExamples>Examples</h2>\n  <p>Apply the default form policy to a form.</p>\n\n  <h3>Live demo</h3>\n  <pre class=bs-example-scope>  // Load policy and policy libraries FIRST. The policy libraries define a default policy for each policy-type\n  angular.module('myApp', ['ngFormLib',\n    'ngFormLib.policy.behaviourOnStateChange',\n    'ngFormLib.policy.checkForStateChanges',\n    'ngFormLib.policy.stateDefinitions',\n    'ngFormLib.policy.formAccessibility']\n  );</pre>\n  <div class=bs-example style=padding-bottom:24px append-source>\n\n    <form name=formPolicy class=form novalidate form-submit=\"\">\n      \n      <div class=form-group>\n        <label class=control-label for=formPolicy_fldTitle>Title</label>\n        <div class=control-row>\n          <select id=formPolicy_fldTitle name=formPolicy_fldTitle ng-model=ctrl.employee.title ng-options=\"item.label for item in ctrl.titleData\" class=form-control ng-required=false field-error-controller></select>\n        </div>\n        <div error-container field-name=formPolicy_fldTitle field-errors=\"{required: 'Please select a title'}\"></div>\n      </div>\n\n      \n      <div form-input uid=formPolicy_fldName name=formPolicy_fldName label=Name required=true input-type=text ff-ng-model=ctrl.employee.name ff-maxlength=40 ff-ng-pattern=\"/^[a-zA-Z0-9 \\-.']+$/\" field-errors=\"{required: 'Last name is required', pattern: 'Please enter a valid last name'}\"></div>\n\n      <div form-checkbox uid=formPolicy_fld3 name=formPolicy_fld3 required=true ff-ng-model=ctrl.employee.fld1_3 field-errors=\"{required: 'You must agree'}\">You are required to agree to this</div>\n\n      <button type=submit class=\"btn btn-primary\">Submit</button>\n      <button type=button class=\"btn btn-secondary\" form-reset=ctrl.employee>Reset</button>\n    </form>\n\n    <hr/>\n\n    <form name=formPolicy2 class=form novalidate form-submit=\"\" form-policy=ctrl.myCustomPolicy>\n      <fieldset>\n        <legend>Custom Form Policy</legend>\n\n        <p>This form takes advantage of the default control-templates' HTML structure to render the controls inside a form with <code>class=\"form-horizontal\"</code>\n        as expected within Bootstrap. See the <a href=/css/sampleFormStyle.css target=_blank>sample style sheet</a> to see how to do this.</p>\n\n        <div form-input uid=formPolicy2_fld1 name=formPolicy2_fld1 label=\"Nick Name\" required=true input-type=text ff-ng-model=ctrl.fldFPCustPolicy.name ff-maxlength=40 ff-ng-pattern=\"/^[a-zA-Z0-9 \\-.']+$/\" field-errors=\"{required: 'Last name is required', pattern: 'Please enter a valid last name'}\"></div>\n\n        <div form-select uid=formPolicy2_fld2 name=formPolicy2_fld2 label=\"Common field\" required=true ff-ng-model=ctrl.data.demo1 ff-ng-options=\"item.label for item in ctrl.titleData track by item.label\" field-errors=\"{required: 'Title is required'}\"></div>\n\n        <div form-checkbox uid=formPolicy2_fld3 name=formPolicy2_fld3 required=true ff-ng-model=ctrl.data.fld2_3 field-errors=\"{required: 'You must agree'}\">You are required to agree to this</div>\n\n        <button type=submit class=\"btn btn-primary\">Submit</button>\n      </fieldset>\n    </form>\n  </div>\n\n  <h2 id=formPolicyUsage>Usage</h2>\n  <p>Load the <code>ngFormLib</code>module and (normally) the standard form policy libraries.</p>\n  <div class=highlight>\n    <pre><code class=js highlight-block>\n      // ES5\n      angular.module('myApp', [\n        'ngFormLib',\n        'duScroll',   // Scrolling behaviour for when the state changes to an error and we wish to focus the field\n        'ngFormLib.policy.behaviourOnStateChange',\n        'ngFormLib.policy.checkForStateChanges',\n        'ngFormLib.policy.stateDefinitions',\n        'pascalprecht.translate'    // Adds translation support, which will be used for certain properties when available\n      ]);\n\n      // ES6 / Webpack\n      import {ngFormLib, defaultPolicies} from 'angular-form-lib';\n      import 'angular-scroll';   // Scrolling behaviour for when the state changes to an error and we wish to focus the field\n      import ngTranslate from 'angular-translate';\n      const app = angular.module('myApp', ['duScroll', ngTranslate, ngFormLib, defaultPolicies]);\n    </code></pre>\n  </div>\n\n  <div class=\"callout callout-danger\">\n    <h4>Heads up!</h4>\n    <p>For the form policy to work as above, the following configuration must exist:</p>\n    <ul>\n      <li>the <code>form</code> must have a non-empty <code>name</code> attribute</li>\n      <li>the <code>form-submit</code> directive <strong>must</strong> exist on the <code>form</code> element, or on a <code>button</code> element inside the form</li>\n      <li>each form field must have a non-empty <code>name</code> and <code>ng-model</code> attribute</li>\n      <li>each form field must use the <code>field-error-controller</code> directive for errors to appear when using the <code>error-container</code> directive</li>\n    </ul>\n  </div>\n\n\n  <h3><code>FormPolicy</code> Options</h3>\n\n  <div class=table-responsive>\n    <table class=\"table table-bordered table-striped\">\n      <thead>\n      <tr>\n        <th style=width:100px>Name</th>\n        <th style=width:100px>Type</th>\n        <th style=width:50px>Default</th>\n        <th>Description</th>\n      </tr>\n      </thead>\n      <tbody>\n      <tr>\n        <td>formSubmitAttemptedClass</td>\n        <td>string</td>\n        <td>'form-submit-attempted'</td>\n        <td>a CSS class-name that is applied to the <code>form</code> element when an attempt to submit the form is made (via the <code>formSubmit</code> directive)</td>\n      </tr>\n      <tr>\n        <td>accessibilityBehaviour</td>\n        <td>object</td>\n        <td></td>\n        <td>See PolicyBehaviourOnStateChange Options below.</td>\n      </tr>\n      <tr>\n        <td>behaviourOnStateChange</td>\n        <td>function</td>\n        <td>noop</td>\n        <td>See PolicyBehaviourOnStateChange Options below.</td>\n      </tr>\n      <tr>\n        <td>checkForStateChanges</td>\n        <td>function</td>\n        <td>noop</td>\n        <td>See PolicyCheckForStateChanges Options below.\n        </td>\n      </tr>\n      <tr>\n        <td>stateDefinitions</td>\n        <td>function</td>\n        <td>noop</td>\n        <td>See PolicyStateDefinitions Options below.\n        </td>\n      </tr>\n      </tbody>\n    </table>\n  </div>\n\n  <h3><code>PolicyFormAccessibility</code> Options</h3>\n\n  <div class=table-responsive>\n    <table class=\"table table-bordered table-striped\">\n      <thead>\n      <tr>\n        <th style=width:100px>Name</th>\n        <th style=width:100px>Type</th>\n        <th style=width:50px>Default</th>\n        <th>Description</th>\n      </tr>\n      </thead>\n      <tbody>\n      <tr>\n        <td>createAriaErrorElement</td>\n        <td>function</td>\n        <td><code>formPolicyAccessibilityLibrary.createAriaErrorElement</code></td>\n        <td>Creates and returns a DOM element which will be used to render error messages designed to be read by a screen-reader.</td>\n      </tr>\n      <tr>\n        <td>onErrorChangeBehaviour</td>\n        <td>function</td>\n        <td><code>formPolicyAccessibilityLibrary.createLongErrorDescription</code></td>\n        <td>Function with the signature <code>(ariaElement, errorObj)</code> which updates the text-content inside the\n          ariaElement based on the errors that are showing. The <code>formPolicyAccessibilityLibrary</code> also has\n          a <code>createShortErrorDescription()</code> method.\n        </td>\n      </tr>\n      </tbody>\n    </table>\n  </div>\n\n  <h3><code>PolicyBehaviourOnStateChange</code> Options</h3>\n\n  <div class=table-responsive>\n    <table class=\"table table-bordered table-striped\">\n      <thead>\n      <tr>\n        <th style=width:100px>Name</th>\n        <th style=width:100px>Type</th>\n        <th style=width:50px>Default</th>\n        <th>Description</th>\n      </tr>\n      </thead>\n      <tbody>\n      <tr>\n        <td>fieldErrorClass</td>\n        <td>string</td>\n        <td>'has-error'</td>\n        <td>a CSS class-name that is applied to the field's form-group when an error is showing</td>\n      </tr>\n      <tr>\n        <td>fieldSuccessClass</td>\n        <td>string</td>\n        <td>'has-success'</td>\n        <td>a CSS class-name that is applied to the field's form-group when the field has been successfully validated</td>\n      </tr>\n      <tr>\n        <td>behaviour</td>\n        <td>function</td>\n        <td>\n          <code>formPolicyBehaviourOnStateChangeLibrary.onSubmitFocusFirstFieldIfError</code>\n          <code>formPolicyBehaviourOnStateChangeLibrary.onErrorSetAriaDescribedByToAriaErrorElement</code>\n          <code>formPolicyBehaviourOnStateChangeLibrary.updateElementStyle</code>\n        </td>\n        <td>The behaviour-on-state-change policy function. This function returns an object with two methods on it: <code>applyBehaviour()</code> which is called when an the field's state changes,\n          and <code>resetBehaviour()</code> function which is called when the form is reset and when the form is submitted again. Function signature:\n\n          <pre class=bs-example-code><code class=javascript highlight-block>function myBehaviourOnStateChange(formController) {\n            return {\n              applyBehaviour: function (fieldElem, fieldState, formSubmitAttempted, formName, fieldName, formGroupElement) {...},\n              resetBehaviour: function() {...}\n            };\n          }</code></pre>\n          where:\n          <ul>\n            <li><code>formController</code> is the <code>form</code> controller, which has a reference to the form state and policy,</li>\n            <li><code>fieldElem</code> is a jqLite element</li>\n            <li><code>fieldState</code> is a boolean indicating whether an error for this field is showing or not</li>\n            <li><code>formSubmitAttempted</code> is a boolean indicating whether the user has attempted to submit the form</li>\n            <li><code>formName</code> is the <code>name</code> of the parent form</li>\n            <li><code>fieldName</code> is the <code>name</code> of the field itself</li>\n            <li><code>formGroupElement</code> is a jqLite element reference to the <code>form-group</code> element (used to set error/success styles on)</li>\n          </ul></td>\n      </tr>\n      </tbody>\n    </table>\n  </div>\n\n  <h3><code>PolicyCheckForStateChanges</code> Options</h3>\n\n  <div class=table-responsive>\n    <table class=\"table table-bordered table-striped\">\n      <thead>\n      <tr>\n        <th style=width:100px>Name</th>\n        <th style=width:100px>Type</th>\n        <th style=width:50px>Default</th>\n        <th>Description</th>\n      </tr>\n      </thead>\n      <tbody>\n      <tr>\n        <td>checker</td>\n        <td>function</td>\n        <td><code>formPolicyCheckForStateChangesLibrary.onBlurUntilSubmitThenOnChange</code></td>\n        <td>The check-for-state-changes policy function. This function is responsible for determining <strong>when</strong> to evaluate whether a field has changed state (into an error state or into a success state).\n          Function signature:\n\n          <pre class=bs-example-code><code class=javascript highlight-block>function myCheckForStateChangesFunc(scope, element, fieldName, stateDefinitions, ngModelController) {...}</code></pre>\n          where <ul>\n            <li><code>scope</code> is the Angular $scope for the element</li>\n            <li><code>element</code> is a jqLite field element</li>\n            <li><code>name</code> is the string-name of the field</li>\n            <li><code>stateDefinitions</code> is an Angular fieldState expression that is $watch()ed</li>\n            <li><code>ngModelController</code> is the ngModelController of the field, which contains the <code>fieldState</code> property</li>\n          </ul>\n\n          The <code>formPolicyCheckForStateChangesLibrary</code> also has <code>onChange()</code> and <code>onBlur</code> method.\n        </td>\n      </tr>\n      </tbody>\n    </table>\n  </div>\n\n  <h3><code>PolicyStateDefinitions</code> Options</h3>\n\n  <div class=table-responsive>\n    <table class=\"table table-bordered table-striped\">\n      <thead>\n      <tr>\n        <th style=width:100px>Name</th>\n        <th style=width:100px>Type</th>\n        <th style=width:50px>Default</th>\n        <th>Description</th>\n      </tr>\n      </thead>\n      <tbody>\n      <tr>\n        <td>states</td>\n        <td>object</td>\n        <td><code>formPolicyErrorDefinitionLibrary.onSubmitOrDirty</code> and <code>formPolicySuccessDefinitionLibrary.onSubmitOrDirty</code></td>\n        <td>An object listing the states and the state-definition functions for all fields.\n          Each state-definition function returns a string-expression which is used to determine <strong>if</strong> a field is in the corresponding state.\n          Function signature:\n\n          <pre class=bs-example-code><code class=javascript highlight-block>function stateDefnFunction(formName, fieldName) {\n            return {\n              stateName: libraryFunction(formName, fieldName)\n            };\n          }</code></pre>\n          where <ul>\n            <li><code>stateName</code> is the name of a field state (typically 'error' or 'success')</li>\n            <li><code>formName</code> is the string-name of the form that the field is situated inside of</li>\n            <li><code>fieldName</code> is string-name of the field</li>\n          </ul>\n\n          The <code>formPolicyErrorDefinitionLibrary</code> has the following state definitions:\n          <ul>\n            <li><code>onSubmit()</code> - when the form has been submitted and field is invalid</li>\n            <li><code>onDirty()</code> - when field has been changed and is invalid</li>\n            <li><code>immediately()</code> - when the field is invalid</li>\n            <li><code>onSubmitAndDirty()</code> - when the form has been submitted AND the field has changed AND the field is invalid</li>\n            <li><code>onSubmitOrDirty()</code> - (when the form has been submitted OR the field has changed) AND the field is invalid</li>\n          </ul>\n\n          The <code>formPolicySuccessDefinitionLibrary</code> has the following state definitions:\n          <ul>\n            <li><code>onSubmit()</code> - when the form has been submitted and field is valid</li>\n            <li><code>onDirty()</code> - when field has been changed and is valid</li>\n            <li><code>immediately()</code> - when the field is valid</li>\n            <li><code>onSubmitAndDirty()</code> - when the form has been submitted AND the field has changed AND the field is valid</li>\n            <li><code>onSubmitOrDirty()</code> - (when the form has been submitted OR the field has changed) AND the field is valid</li>\n          </ul>\n        </td>\n      </tr>\n      <tr>\n        <td>create</td>\n        <td>function</td>\n        <td></td>\n        <td>Calls the state definition functions, passing the <code>formName</code> and <code>fieldName</code>.\n        </td>\n      </tr>\n      </tbody>\n    </table>\n  </div>\n\n  <h2 id=formPolicyConfig>Configuration</h2>\n  <p>Form policies can be defined in 3 ways: application-wide, per-form, or a combination of the two (application-wide with per-form overrides).</p>\n\n  <div class=\"callout callout-info\">\n    <h4>Application-wide configuration</h4>\n\n    <p>You can override the default policies by configuring the policy-providers for each policy:</p>\n    <div class=highlight>\n      <pre class=bs-example-code>\n        <code class=javascript highlight-block>\n          var mod = angular.module('myApp', ['ngFormLib',\n            'ngFormLib.policy.behaviourOnStateChange',\n            'ngFormLib.policy.checkForStateChanges',\n            'ngFormLib.policy.stateDefinitions',\n            'ngFormLib.policy.formAccessibility'\n          ])\n\n          // Set the field-error-focus-scroll-position, to allow for the website's fixed header\n          mod.config(['formPolicyBehaviourOnStateChangeProvider', function(stateChangeBehavePolicy) {\n            stateChangeBehavePolicy.config.fieldFocusScrollOffset = 80;\n          }]);\n\n          mod.config(['formPolicyAccessibilityBehaviourProvider', 'formPolicyAccessibilityLibrary', function(a11yPolicy, lib) {\n            // Configure the formPolicyAccessibilityBehaviour to use the short-error version of the onErrorChangeBehaviour\n            a11yPolicy.config.onErrorChangeBehaviour = lib.createShortErrorDescription;\n          }]);\n\n          mod.config(['formPolicyCheckForStateChangesProvider', 'formPolicyCheckForStateChangesLibrary', function(statePolicy, lib) {\n            // Check for errors as soon as the control is changed\n            statePolicy.config.checker = lib.onChange;\n          }]);\n\n          mod.config(['formPolicyStateDefinitionsProvider', 'formPolicyErrorDefinitionLibrary', function(stateDefs, errorLib) {\n            // Show errors immediately\n            stateDefs.config.states.error = errorLib.immediately;\n          }]);\n        </code>\n      </pre>\n    </div>\n  </div>\n\n  <div class=\"callout callout-info\">\n    <h4>Per-Form configuration</h4>\n\n    <p>You can override the application-wide (default) policies by specifying a policy-object on the form via a <code>form-policy</code> attribute:</p>\n    <div class=highlight>\n      <pre class=bs-example-code><code class=html highlight-block>\n        &lt;div ng-controller=\"myController as ctrl\"&gt;\n          &lt;form form-policy=\"myPolicy\"&gt;...&lt;/form&gt;\n        &lt;/div&gt;\n      </code></pre>\n    </div>\n    <div class=highlight>\n      <pre class=bs-example-code><code class=javascript highlight-block>\nmodule.controller('myController', function() {\n  var vm = this;\n\n  function wonderChecker(scope, element, name, errorCondition, ngModelController) {\n      //...\n  }\n\n  // This will overwrite only the checkForStateChanges policy\n  vm.myPolicy = {\n    checkForStateChanges: wonderChecker,\n  };\n}\n        </code>\n      </pre>\n    </div>\n  </div>\n\n</div>\n";

/***/ },

/***/ "./modules/ngFormLib/policy/docs/formPolicy.docs.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);


var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLibDocs.policy.docs.formPolicy', []);

/* harmony default export */ exports["a"] = mod.name;

mod.directive('formPolicyDocs', function () {
  return {
    restrict: 'A',
    controller: 'FormPolicyDemoCtrl',
    template: __webpack_require__("./modules/ngFormLib/policy/docs/formPolicy.docs.html")
  };
});

mod.controller('FormPolicyDemoCtrl', ['formPolicyCheckForStateChangesLibrary', function Controller(formPolicyCheckForStateChangesLibrary) {
  var vm = this;

  vm.titleData = [{ label: 'Dr' }, { label: 'Mr' }, { label: 'Ms' }];

  vm.myCustomPolicy = {
    checkForStateChanges: formPolicyCheckForStateChangesLibrary.onChange
  };
}]);

/***/ },

/***/ "./modules/ngFormLib/policy/stateDefinitions/PolicyStateDefinitions.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__("../node_modules/angular/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony export (binding) */ __webpack_require__.d(exports, "b", function() { return ERROR_STATE; });
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



// TODO: What if the state definition expressions returned the statename, rather than true or false, so we wouldn't need
// to create a watch for each state definition. Instead, the expressions for each state would be like a big
// switch statement, returning a state name or undefined.


// Define the different display trigger implementations available
var mod = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('ngFormLib.policy.stateDefinitions', []);

/* harmony default export */ exports["a"] = mod.name;
var ERROR_STATE = 'error';

// Error Conditions
function errorOnSubmit(formName, fieldName) {
  return formName + '._formSubmitAttempted && ' + fieldName + '.$invalid';
}

function errorOnDirty(formName, fieldName) {
  return fieldName + '.$dirty && ' + fieldName + '.$invalid';
}

function errorImmediately(formName, fieldName) {
  return fieldName + '.$invalid';
}

function errorOnSubmitAndDirty(formName, fieldName) {
  return formName + '._formSubmitAttempted && ' + fieldName + '.$dirty && ' + fieldName + '.$invalid';
}

function errorOnSubmitOrDirty(formName, fieldName) {
  return '(' + formName + '._formSubmitAttempted || ' + fieldName + '.$dirty) && ' + fieldName + '.$invalid';
}

mod.constant('formPolicyErrorDefinitionLibrary', {
  onSubmit: errorOnSubmit,
  onDirty: errorOnDirty,
  immediately: errorImmediately,
  onSubmitAndDirty: errorOnSubmitAndDirty,
  onSubmitOrDirty: errorOnSubmitOrDirty
});

// Success Definitions
function successOnSubmit(formName, fieldName) {
  return formName + '._formSubmitAttempted && ' + fieldName + '.$valid';
}

function successOnDirty(formName, fieldName) {
  return fieldName + '.$dirty && ' + fieldName + '.$valid';
}

function successImmediately(formName, fieldName) {
  return fieldName + '.$valid';
}

function successOnSubmitAndDirty(formName, fieldName) {
  return formName + '._formSubmitAttempted && ' + fieldName + '.$dirty && ' + fieldName + '.$valid';
}

function successOnSubmitOrDirty(formName, fieldName) {
  return '(' + formName + '._formSubmitAttempted || ' + fieldName + '.$dirty) && ' + fieldName + '.$valid';
}

mod.constant('formPolicySuccessDefinitionLibrary', {
  onSubmit: successOnSubmit,
  onDirty: successOnDirty,
  immediately: successImmediately,
  onSubmitAndDirty: successOnSubmitAndDirty,
  onSubmitOrDirty: successOnSubmitOrDirty
});

mod.provider('formPolicyStateDefinitions', ['formPolicyErrorDefinitionLibrary', 'formPolicySuccessDefinitionLibrary', function Provider(errorLib, successLib) {
  var _states;

  var config = this.config = {
    states: (_states = {}, _defineProperty(_states, ERROR_STATE, errorLib.onSubmitOrDirty), _defineProperty(_states, 'success', successLib.onSubmitOrDirty), _states)
  };

  config.create = function (formName, fieldName) {
    var result = {};

    for (var state in config.states) {
      if (config.states.hasOwnProperty(state)) {
        result[state] = config.states[state](formName, fieldName);
      }
    }
    return result;
  };

  this.$get = function () {
    return config;
  };
}]);

/***/ },

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

__webpack_require__("./modules/docs/index.js");
__webpack_require__("./modules/docs/styles/docs.styl");
__webpack_require__("../node_modules/angular-motion/dist/angular-motion.css");
module.exports = __webpack_require__("../node_modules/highlightjs/styles/github.css");


/***/ }

},[0]);
//# sourceMappingURL=docs.222eed47.js.map