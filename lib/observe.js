'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.observe = observe;
exports.defineReactive = defineReactive;

var _dep = require('./dep');

var _dep2 = _interopRequireDefault(_dep);

var _array = require('./array');

var _array2 = _interopRequireDefault(_array);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Observer class that are attached to each observed
 * object. Once attached, the observer converts target
 * object's property keys into getter/setters that
 * collect dependencies and dispatches updates.
 *
 * @param {Array|Object} value
 * @constructor
 */

function Observer(value) {
  this.value = value;
  this.dep = new _dep2.default();
  (0, _utils.def)(value, '__ob__', this);
  if ((0, _utils.isArray)(value)) {
    (0, _array2.default)(value);
    this.observeArray(value);
  } else {
    this.walk(value);
  }
}

/**
 * Walk through each property and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 *
 * @param {Object} obj
 */

Observer.prototype.walk = function (obj) {
  var _this = this;

  (0, _utils.every)(obj, function (key, val) {
    _this.convert(key, val);
  });
};

/**
 * Observe a list of Array items.
 *
 * @param {Array} items
 */

Observer.prototype.observeArray = function (items) {
  (0, _utils.each)(items, function (val) {
    observe(val);
  });
};

/**
 * Convert a property into getter/setter so we can emit
 * the events when the property is accessed/changed.
 *
 * @param {String} key
 * @param {*} val
 */

Observer.prototype.convert = function (key, val) {
  defineReactive(this.value, key, val);
};

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 *
 * @param {*} value
 * @return {Observer|undefined}
 */

function observe(value) {
  if (!value || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') {
    return;
  }
  var ob;
  if (Object.prototype.hasOwnProperty.call(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (((0, _utils.isArray)(value) || (0, _utils.isPlainObject)(value)) && Object.isExtensible(value)) {
    ob = new Observer(value);
  }
  return ob;
}

/**
 * Define a reactive property on an Object.
 *
 * @param {Object} obj
 * @param {String} key
 * @param {*} val
 */

function defineReactive(obj, key, val) {
  var dep = new _dep2.default();

  var desc = Object.getOwnPropertyDescriptor(obj, key);
  if (desc && desc.configurable === false) {
    return;
  }

  // cater for pre-defined getter/setters
  var getter = desc && desc.get;
  var setter = desc && desc.set;

  var childOb = observe(val);

  function reactiveGetter() {
    var value = getter ? getter.call(obj) : val;
    if (_dep2.default.target) {
      dep.depend();
      if (childOb) {
        childOb.dep.depend();
      }
      if ((0, _utils.isArray)(value)) {
        (0, _utils.each)(value, function (e) {
          e && e.__ob__ && e.__ob__.dep.depend();
        });
      }
    }
    return value;
  }
  function reactiveSetter(newVal) {
    var value = getter ? getter.call(obj) : val;
    if (newVal === value) {
      return;
    }
    if (setter) {
      setter.call(obj, newVal);
    } else {
      val = newVal;
    }
    childOb = observe(newVal);
    dep.notify();
  }
  (0, _utils.defi)(obj, key, reactiveGetter, reactiveSetter);
}
//# sourceMappingURL=observe.js.map