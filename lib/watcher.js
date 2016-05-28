'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.watch = watch;
exports.makeComputed = makeComputed;

var _dep = require('./dep');

var _dep2 = _interopRequireDefault(_dep);

var _expression = require('./expression');

var _expression2 = _interopRequireDefault(_expression);

var _batcher = require('./batcher');

var _batcher2 = _interopRequireDefault(_batcher);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var uid = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 *
 * @param {Object} owner
 * @param {String|Function} expOrFn
 * @param {Function} callback
 * @param {Object} options
 *                 - {Boolean} deep
 *                 - {Boolean} sync
 *                 - {Boolean} lazy
 * @constructor
 */

function Watcher(owner, getter, callback, options) {
  owner._watchers.push(this);
  this.owner = owner;
  this.getter = getter;
  this.callback = callback;
  this.options = options;
  // uid for batching
  this.id = ++uid;
  this.active = true;
  // for lazy watchers
  this.dirty = options.lazy;
  this.deps = [];
  this.newDeps = [];
  this.depIds = Object.create(null);
  this.newDepIds = null;
  this.value = options.lazy ? undefined : this.get();
}

/**
 * Evaluate the getter, and re-collect dependencies.
 */

Watcher.prototype.get = function () {
  this.beforeGet();
  var scope = this.owner;
  var value = this.getter.call(scope, scope);
  if (this.options.deep) {
    traverse(value);
  }
  this.afterGet();
  return value;
};

/**
 * Prepare for dependency collection.
 */

Watcher.prototype.beforeGet = function () {
  _dep2.default.target = this;
  this.newDepIds = Object.create(null);
  this.newDeps.length = 0;
};

/**
 * Add a dependency to this directive.
 *
 * @param {Dep} dep
 */

Watcher.prototype.addDep = function (dep) {
  var id = dep.id;
  if (!this.newDepIds[id]) {
    this.newDepIds[id] = true;
    this.newDeps.push(dep);
    if (!this.depIds[id]) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */

Watcher.prototype.afterGet = function () {
  _dep2.default.target = null;
  var i = this.deps.length;
  while (i--) {
    var dep = this.deps[i];
    if (!this.newDepIds[dep.id]) {
      dep.removeSub(this);
    }
  }
  this.depIds = this.newDepIds;
  var tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */

Watcher.prototype.update = function () {
  if (this.options.lazy) {
    this.dirty = true;
  } else if (this.options.sync) {
    this.run();
  } else {
    (0, _batcher2.default)(this);
  }
};

/**
 * Batcher job interface.
 * Will be called by the batcher.
 */

Watcher.prototype.run = function () {
  if (this.active) {
    var value = this.get();
    if (value !== this.value ||
    // Deep watchers and watchers on Object/Arrays should fire even when
    // the value is the same, because the value may have mutated;
    (0, _utils.isObject)(value) || this.options.deep) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      // in debug + async mode, when a watcher callbacks
      // throws, we also throw the saved before-push error
      // so the full cross-tick stack trace is available.
      this.callback.call(this.owner, value, oldValue);
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */

Watcher.prototype.evaluate = function () {
  // avoid overwriting another watcher that is being
  // collected.
  var current = _dep2.default.target;
  this.value = this.get();
  this.dirty = false;
  _dep2.default.target = current;
};

/**
 * Depend on all deps collected by this watcher.
 */

Watcher.prototype.depend = function () {
  var i = this.deps.length;
  while (i--) {
    this.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subcriber list.
 */

Watcher.prototype.teardown = function () {
  if (this.active) {
    var i = this.deps.length;
    while (i--) {
      this.deps[i].removeSub(this);
    }
    this.active = false;
    this.owner = this.callback = this.value = null;
  }
};

/**
 * Recrusively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 *
 * @param {*} val
 */

function traverse(val) {
  var i, keys;
  if ((0, _utils.isArray)(val)) {
    i = val.length;
    while (i--) {
      traverse(val[i]);
    }
  } else if ((0, _utils.isObject)(val)) {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) {
      traverse(val[keys[i]]);
    }
  }
}

/**
 * Create an watcher instance, returns the new watcher.
 *
 * @param {Object} owner
 * @param {String|Function} expOrFn
 * @param {Function} callback
 * @param {Object} options
 *                 - {Boolean} deep
 *                 - {Boolean} sync
 *                 - {Boolean} lazy
 * @constructor
 */

function watch(owner, expOrFn, callback, options) {
  // parse expression for getter
  var getter = (0, _utils.isFunc)(expOrFn) ? expOrFn : (0, _expression2.default)(expOrFn);
  var instance = new Watcher(owner, getter, callback, options);
  return instance;
}

/**
 * Make a computed getter, which can collect dependencies.
 *
 * @param {Object} owner
 * @param {Function} getter
 */

function makeComputed(owner, getter) {
  var watcher = new Watcher(owner, getter, null, {
    lazy: true
  });
  return function computedGetter() {
    if (watcher.dirty) {
      watcher.evaluate();
    }
    if (_dep2.default.target) {
      watcher.depend();
    }
    return watcher.value;
  };
}
//# sourceMappingURL=watcher.js.map