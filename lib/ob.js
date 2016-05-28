'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ob;

var _observe = require('./observe.js');

var _watcher = require('./watcher');

var _utils = require('./utils');

var current = null;

// {Function} One of carry, react, compute, watch. Default is watch.
ob.default = watch;

// {Boolean} Default is true
reactive.auto = true;

// {Boolean} Default is false
watch.deep = watch.lazy = watch.sync = false;

Object.setPrototypeOf(ob, {
  reactive: reactive,
  carry: carry, $carry: $carry,
  react: react, $react: $react,
  compute: compute, $compute: $compute,
  watch: watch, $watch: $watch
});

/**
 * ob
 *
 * @param {Object} owner
 * @param {*} [expr]
 * @param {*} [func]
 * @param {*} [opt]
 * @return {Function} ob
 */

function ob(owner, expr, func, opt) {
  current = owner;
  var isOber = owner.hasOwnProperty('_watchers');
  if (!isOber) {
    init(owner);
    if (reactive.auto) {
      reactive();
    }
  }
  if (expr) {
    ob.default(expr, func, opt);
  }
  return ob;
}

/**
 * init
 *
 * @param {Object} owner
 * @return {Function} ob
 */

function init(owner) {
  (0, _utils.def)(owner, '_watchers', [], false);
  (0, _utils.def)(owner, '_data', Object.create(null), false);
  (0, _observe.observe)(owner._data);
  return ob;
}

/**
 * reactive
 *
 * @param {Object} config
 * @return {Function} ob
 */

function reactive(config) {
  if (config) {
    config.methods && $carry(config.methods);
    config.data && $react(config.data);
    config.computed && $compute(config.computed);
    config.watchers && $watch(config.watchers);
  } else {
    (0, _utils.every)(current, function (key, val) {
      !(0, _utils.isFunc)(val) && react(key, val);
    });
  }
  return ob;
}

/**
 * carry
 *
 * @param {String} key
 * @param {Function} method
 */

function carry(key, method) {
  current[key] = method.bind(current);
  return ob;
}

/**
 * $carry
 *
 * @param {Object} items
 * @return {Function} ob
 */

function $carry(items) {
  (0, _utils.every)(items, function (key, val) {
    carry(key, val);
  });
  return ob;
}

/**
 * react
 *
 * @param {String} key
 * @param {*} val
 */

function react(key, val) {
  current._data[key] = val;
  (0, _observe.defineReactive)(current._data, key, val);
  proxy(current, key);
  return ob;
}

/**
 * $react
 *
 * @param {Object} items
 * @return {Function} ob
 */

function $react(items) {
  (0, _utils.every)(items, function (key, val) {
    react(key, val);
  });
  return ob;
}

/**
 * compute
 *
 * @param {String} key
 * @param {Function|Object} accessor
 *        - Function getter
 *        - Object
 *          - Function [get]  - getter
 *          - Function [set]  - setter
 * @param {Boolean} [cache]  - default is true
 */

function compute(key, accessor, cache) {
  var getter, setter;
  if ((0, _utils.isFunc)(accessor)) {
    getter = (0, _watcher.makeComputed)(current, accessor);
    setter = _utils.noop;
  } else {
    getter = accessor.get ? cache !== false ? (0, _watcher.makeComputed)(current, accessor.get) : accessor.get.bind(this) : _utils.noop;
    setter = accessor.set ? accessor.set.bind(this) : _utils.noop;
  }
  (0, _utils.defi)(current, key, getter, setter);
}

/**
 * $compute
 *
 * @param {Object} items
 * @return {Function} ob
 */

function $compute(items) {
  (0, _utils.every)(items, function (key, val) {
    compute(key, val);
  });
  return ob;
}

/**
 * watch
 *
 * @param {String|Function} exprOrFunc
 * @param {Function} callback
 * @param {Object} [options]
 *                 - {Boolean} deep
 *                 - {Boolean} sync
 *                 - {Boolean} lazy
 */

function watch(exprOrFunc, callback, options) {
  return (0, _watcher.watch)(current, exprOrFunc, callback, options || watch);
}

/**
 * $watch
 *
 * @param {Object} items
 * @return {Function} ob
 */

function $watch(items) {
  (0, _utils.every)(items, function (expr, fnOrOpt) {
    if ((0, _utils.isFunc)(fnOrOpt)) {
      watch(expr, fnOrOpt);
    } else {
      watch(expr, fnOrOpt.watcher, fnOrOpt);
    }
  });
  return ob;
}

/**
 * proxy
 *
 * @param {Object} owner
 * @param {String} key
 */

function proxy(owner, key) {
  function getter() {
    return owner._data[key];
  }
  function setter(val) {
    owner._data[key] = val;
  }
  (0, _utils.defi)(owner, key, getter, setter);
}
//# sourceMappingURL=ob.js.map