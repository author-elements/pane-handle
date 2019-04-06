// Copyright (c) 2019 Author.io. MIT licensed.
// @author.io/element-pane-handle v1.0.0 available at github.com/author-elements/pane-handle
// Last Build: 4/6/2019, 3:01:13 PM
(function () {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  if (!window.hasOwnProperty('AuthorBaseElement')) {
    console.error('[ERROR] <author-pane-handle> Required dependency "AuthorBaseElement" not found.');
    console.info('AuthorBaseElement is available at https://github.com/author-elements/base');
  }

  (function () {
    var missingDependencies = Array.from(new Set([])).filter(function (dep) {
      return !customElements.get(dep);
    });

    if (missingDependencies.length > 0) {
      console.error("[ERROR] <author-pane-handle> Required dependenc".concat(missingDependencies.length !== 1 ? 'ies' : 'y', " not found: ").concat(missingDependencies.map(function (d) {
        return "<".concat(d, ">");
      }).join(', ').replace(', ' + missingDependencies[missingDependencies.length - 1], ' and ' + missingDependencies[missingDependencies.length - 1])));
      missingDependencies.forEach(function (dep, i) {
        return console.info("".concat(i + 1, ". <").concat(dep, "> is available at ").concat('https://github.com/author-elements/pane-handle'.replace('pane-handle', dep.replace('author-', ''))));
      });
    }
  })();

  var AuthorPaneHandleElement =
  /*#__PURE__*/
  function (_AuthorBaseElement) {
    _inherits(AuthorPaneHandleElement, _AuthorBaseElement);

    function AuthorPaneHandleElement() {
      var _this;

      _classCallCheck(this, AuthorPaneHandleElement);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(AuthorPaneHandleElement).call(this, "<template><style>@charset \"UTF-8\"; :host{display:flex;cursor:row-resize}:host *,:host :after,:host :before{box-sizing:border-box}:host-context(author-pane[horizontal]){cursor:col-resize}author-pane-handle{display:flex;cursor:row-resize}author-pane-handle *,author-pane-handle :after,author-pane-handle :before{box-sizing:border-box}author-pane[horizontal] author-pane-handle{cursor:col-resize}</style><slot></slot></template>"));

      _this.UTIL.defineProperties({
        initialized: {
          private: true,
          default: false
        },
        maxSize: {
          private: true,
          default: null
        },
        startPosition: {
          private: true,
          default: null
        },
        offset: {
          private: true,
          default: null
        }
      });

      _this.UTIL.definePrivateMethods({
        cleanupMouseEventHandlers: function cleanupMouseEventHandlers() {
          document.removeEventListener('mousemove', _this.PRIVATE.globalMousemoveHandler);
          document.removeEventListener('mouseup', _this.PRIVATE.globalMouseupHandler);
        },
        generatePercentage: function generatePercentage(value) {
          return "".concat(value / _this.parentNode.totalSize * 100, "%");
        },
        globalMousemoveHandler: function globalMousemoveHandler(evt) {
          var mousePosition = _this.PRIVATE.axis === 'x' ? evt.clientX : evt.clientY;

          if (mousePosition === _this.PRIVATE.startPosition) {
            return;
          }

          var totalSize = _this.parentNode.totalSize;
          var _this$PRIVATE = _this.PRIVATE,
              previousPane = _this$PRIVATE.previousPane,
              nextPane = _this$PRIVATE.nextPane,
              maxSize = _this$PRIVATE.maxSize,
              offset = _this$PRIVATE.offset,
              generatePercentage = _this$PRIVATE.generatePercentage,
              handleResize = _this$PRIVATE.handleResize;
          var previousSize = mousePosition - offset.previous - previousPane.dimensions.left;

          if (!previousSize || previousSize < 0) {
            previousSize = 0;
          }

          if (previousSize >= maxSize) {
            previousSize = maxSize;
          }

          nextPane.element.size = generatePercentage(maxSize - previousSize);
          previousPane.element.size = generatePercentage(previousSize);
        },
        globalMouseupHandler: function globalMouseupHandler(evt) {
          _this.PRIVATE.startPosition = null;
          _this.PRIVATE.offset = null;

          _this.PRIVATE.cleanupMouseEventHandlers();
        }
      });

      _this.UTIL.registerListeners(_assertThisInitialized(_this), {
        disconnected: function disconnected() {
          return _this.PRIVATE.cleanupMouseEventHandlers();
        },
        initialize: function initialize() {
          if (_this.PRIVATE.initialized) {
            return;
          }

          _this.UTIL.defineProperties({
            axis: {
              private: true,
              readonly: true,
              get: function get() {
                return _this.parentNode.hasAttribute('horizontal') ? 'x' : 'y';
              }
            },
            dimensions: {
              private: true,
              readonly: true,
              get: function get() {
                return _this.getBoundingClientRect();
              }
            },
            previousPane: {
              private: true,
              readonly: true,
              get: function get() {
                var _assertThisInitialize = _assertThisInitialized(_this),
                    previousElementSibling = _assertThisInitialize.previousElementSibling;

                return {
                  element: previousElementSibling,
                  dimensions: previousElementSibling.getBoundingClientRect()
                };
              }
            },
            nextPane: {
              private: true,
              readonly: true,
              get: function get() {
                var _assertThisInitialize2 = _assertThisInitialized(_this),
                    nextElementSibling = _assertThisInitialize2.nextElementSibling;

                return {
                  element: nextElementSibling,
                  dimensions: nextElementSibling.getBoundingClientRect()
                };
              }
            }
          });

          _this.PRIVATE.initialized = true;
        },
        mousedown: function mousedown(evt) {
          var _this$PRIVATE2 = _this.PRIVATE,
              axis = _this$PRIVATE2.axis,
              dimensions = _this$PRIVATE2.dimensions,
              previousPane = _this$PRIVATE2.previousPane,
              nextPane = _this$PRIVATE2.nextPane;
          var startPosition, dimension, offsetReference;

          switch (axis) {
            case 'x':
              startPosition = evt.clientX;
              dimension = 'width';
              offsetReference = 'right';
              break;

            case 'y':
              startPosition = evt.clientY;
              dimension = 'height';
              offsetReference = 'bottom';
              break;
          }

          _this.PRIVATE.startPosition = startPosition;
          _this.PRIVATE.maxSize = previousPane.dimensions[dimension] + nextPane.dimensions[dimension];
          _this.PRIVATE.offset = {
            previous: _this.PRIVATE.startPosition - dimensions[axis],
            next: dimensions[offsetReference] - startPosition
          };
          document.addEventListener('mousemove', _this.PRIVATE.globalMousemoveHandler);
          document.addEventListener('mouseup', _this.PRIVATE.globalMouseupHandler);
        }
      });

      return _this;
    }

    return AuthorPaneHandleElement;
  }(AuthorBaseElement(HTMLElement));

  customElements.define('author-pane-handle', AuthorPaneHandleElement);

}());
//# sourceMappingURL=author-pane-handle.es5.js.map
