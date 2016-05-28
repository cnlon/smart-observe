'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = amend;

var _utils = require('./utils');

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);
var arrayMutating = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];

/**
 * Augment an target Array with arrayMethods
 *
 * @param {Array} arr
 */

function amend(arr) {
  Object.setPrototypeOf(arr, arrayMethods);
}

/**
 * Intercept mutating methods and emit events
 */

(0, _utils.each)(arrayMutating, function (method) {
  // cache original method
  var original = arrayProto[method];
  (0, _utils.def)(arrayMethods, method, function mutator() {
    // avoid leaking arguments:
    // http://jsperf.com/closure-with-arguments
    var i = arguments.length;
    var args = new Array(i);
    while (i--) {
      args[i] = arguments[i];
    }
    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
        inserted = args;
        break;
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        inserted = args.slice(2);
        break;
    }
    if (inserted) ob.observeArray(inserted);
    // notify change
    ob.dep.notify();
    return result;
  });
});

/**
 * Swap the element at the given index with a new value
 * and emits corresponding event.
 *
 * @param {Number} index
 * @param {*} val
 * @return {*} - replaced element
 */

function $set(index, val) {
  if (index >= this.length) {
    this.length = Number(index) + 1;
  }
  return this.splice(index, 1, val)[0];
}
(0, _utils.def)(arrayProto, '$set', $set);

/**
 * Convenience method to remove the element at given index or target element reference.
 *
 * @param {*} item
 */

function $remove(item) {
  /* istanbul ignore if */
  if (!this.length) return;
  var index = (0, _utils.indexOf)(this, item);
  if (index > -1) {
    return this.splice(index, 1);
  }
}
(0, _utils.def)(arrayProto, '$remove', $remove);
//# sourceMappingURL=array.js.map