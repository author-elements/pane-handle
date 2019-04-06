// Copyright (c) 2019 Author.io. MIT licensed.
// @author.io/element-pane-handle v1.0.0 available at github.com/author-elements/pane-handle
// Last Build: 4/6/2019, 3:01:13 PM
(function () {
  'use strict';

  if (!window.hasOwnProperty('AuthorBaseElement')) {
              console.error('[ERROR] <author-pane-handle> Required dependency "AuthorBaseElement" not found.');
              console.info('AuthorBaseElement is available at https://github.com/author-elements/base');
            }
          (function () {
            let missingDependencies = Array.from(new Set([])).filter(dep => !customElements.get(dep));
            if (missingDependencies.length > 0) {
              console.error(`[ERROR] <author-pane-handle> Required dependenc${missingDependencies.length !== 1 ? 'ies' : 'y'} not found: ${missingDependencies.map(d => `<${d}>`).join(', ').replace(', ' + missingDependencies[missingDependencies.length - 1], ' and ' + missingDependencies[missingDependencies.length - 1])}`);
              missingDependencies.forEach((dep, i) => console.info(`${i+1}. <${dep}> is available at ${'https://github.com/author-elements/pane-handle'.replace('pane-handle', dep.replace('author-', ''))}`));
            }
          })();
          class AuthorPaneHandleElement extends AuthorBaseElement(HTMLElement) {
    constructor () {
      super(`<template><style>@charset "UTF-8"; :host{display:flex;cursor:row-resize}:host *,:host :after,:host :before{box-sizing:border-box}:host-context(author-pane[horizontal]){cursor:col-resize}author-pane-handle{display:flex;cursor:row-resize}author-pane-handle *,author-pane-handle :after,author-pane-handle :before{box-sizing:border-box}author-pane[horizontal] author-pane-handle{cursor:col-resize}</style><slot></slot></template>`);

      this.UTIL.defineProperties({
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

      this.UTIL.definePrivateMethods({
        cleanupMouseEventHandlers: () => {
          document.removeEventListener('mousemove', this.PRIVATE.globalMousemoveHandler);
          document.removeEventListener('mouseup', this.PRIVATE.globalMouseupHandler);
        },

        generatePercentage: value => `${(value / this.parentNode.totalSize) * 100}%`,

        globalMousemoveHandler: evt => {
          let mousePosition = this.PRIVATE.axis === 'x' ? evt.clientX : evt.clientY;

          if (mousePosition === this.PRIVATE.startPosition) {
            return
          }

          let { totalSize } = this.parentNode;
          let { previousPane, nextPane, maxSize, offset, generatePercentage, handleResize } = this.PRIVATE;
          let previousSize = (mousePosition - offset.previous) - previousPane.dimensions.left;

          if (!previousSize || previousSize < 0) {
            previousSize = 0;
          }

          if (previousSize >= maxSize) {
            previousSize = maxSize;
          }

          nextPane.element.size = generatePercentage(maxSize - previousSize);
          previousPane.element.size = generatePercentage(previousSize);
        },

        globalMouseupHandler: evt => {
          this.PRIVATE.startPosition = null;
          this.PRIVATE.offset = null;
          this.PRIVATE.cleanupMouseEventHandlers();
        }
      });

      this.UTIL.registerListeners(this, {
        disconnected: () => this.PRIVATE.cleanupMouseEventHandlers(),

        initialize: () => {
          if (this.PRIVATE.initialized) {
            return
          }

          this.UTIL.defineProperties({
            axis: {
              private: true,
              readonly: true,
              get: () => this.parentNode.hasAttribute('horizontal') ? 'x' : 'y'
            },

            dimensions: {
              private: true,
              readonly: true,
              get: () => this.getBoundingClientRect()
            },

            previousPane: {
              private: true,
              readonly: true,
              get: () => {
                let { previousElementSibling } = this;

                return {
                  element: previousElementSibling,
                  dimensions: previousElementSibling.getBoundingClientRect()
                }
              }
            },

            nextPane: {
              private: true,
              readonly: true,
              get: () => {
                let { nextElementSibling } = this;

                return {
                  element: nextElementSibling,
                  dimensions: nextElementSibling.getBoundingClientRect()
                }
              }
            }
          });

          this.PRIVATE.initialized = true;
        },

        mousedown: evt => {
          let { axis, dimensions, previousPane, nextPane } = this.PRIVATE;
          let startPosition, dimension, offsetReference;

          switch (axis) {
            case 'x':
              startPosition = evt.clientX;
              dimension = 'width';
              offsetReference = 'right';
              break

            case 'y':
              startPosition = evt.clientY;
              dimension = 'height';
              offsetReference = 'bottom';
              break
          }

          this.PRIVATE.startPosition = startPosition;
          this.PRIVATE.maxSize = previousPane.dimensions[dimension] + nextPane.dimensions[dimension];

          this.PRIVATE.offset = {
            previous: this.PRIVATE.startPosition - dimensions[axis],
            next: dimensions[offsetReference] - startPosition
          };

          document.addEventListener('mousemove', this.PRIVATE.globalMousemoveHandler);
          document.addEventListener('mouseup', this.PRIVATE.globalMouseupHandler);
        }
      });
    }
  }

  customElements.define('author-pane-handle', AuthorPaneHandleElement);

}());
//# sourceMappingURL=author-pane-handle.js.map
