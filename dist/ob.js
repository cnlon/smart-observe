'use strict';

var babelHelpers = {};
babelHelpers.typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
};
babelHelpers;

/**
 * Define a property.
 *
 * @param {Object} obj
 * @param {String} key
 * @param {*} val
 * @param {Boolean} [enumerable]
 */

function def(obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Define a property.
 *
 * @param {Object} obj
 * @param {String} key
 * @param {Function} getter
 * @param {Function} setter
 */

function defi(obj, key, getter, setter) {
  Object.defineProperty(obj, key, {
    get: getter,
    set: setter,
    configurable: true,
    enumerable: true
  });
}

/**
 * Array type check.
 *
 * @param {*} obj
 * @return {Boolean}
 */

var isArray = Array.isArray;

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 *
 * @param {*} obj
 * @return {Boolean}
 */

var toString = Object.prototype.toString;
var OBJECT_STRING = '[object Object]';
function isPlainObject(obj) {
  return toString.call(obj) === OBJECT_STRING;
}

/**
 * Manual indexOf because it's slightly faster than
 * native.
 *
 * @param {Array} arr
 * @param {*} obj
 */

function indexOf(arr, obj) {
  var i = arr.length;
  while (i--) {
    if (arr[i] === obj) return i;
  }
  return -1;
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 *
 * @param {*} obj
 * @return {Boolean}
 */

function isObject(obj) {
  return obj !== null && (typeof obj === 'undefined' ? 'undefined' : babelHelpers.typeof(obj)) === 'object';
}

/**
 * every
 *
 * @param {Object} obj
 * @param {Function} cb
 */

function every(obj, cb) {
  var keys = Object.keys(obj);
  for (var i = 0, l = keys.length; i < l; i++) {
    cb(keys[i], obj[keys[i]]);
  }
}

/**
 * each
 *
 * @param {Array} arr
 * @param {Function} cb
 */

function each(arr, cb) {
  for (var i = 0, l = arr.length; i < l; i++) {
    cb(arr[i], i);
  }
}

/**
 * isFunc
 *
 * @param {*} func
 * @param {Boolean}
 */

function isFunc(func) {
  return typeof func === 'function';
}

/**
 * noop is function which is nothing to do.
 */

function noop() {}

/**
 * isDebug
 */

var isDebug = typeof process !== 'undefined' && process.env.NODE_ENV !== 'production';

/**
 * warn
 */

var warn = isDebug && console && isFunc(console.warn) ? console.warn : noop;

var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 *
 * @constructor
 */

function Dep() {
  this.id = uid++;
  this.subs = [];
}

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null;

/**
 * Add a directive subscriber.
 *
 * @param {Directive} sub
 */

Dep.prototype.addSub = function (sub) {
  this.subs.push(sub);
};

/**
 * Remove a directive subscriber.
 *
 * @param {Directive} sub
 */

Dep.prototype.removeSub = function (sub) {
  this.subs.$remove(sub);
};

/**
 * Add self as a dependency to the target watcher.
 */

Dep.prototype.depend = function () {
  Dep.target.addDep(this);
};

/**
 * Notify all subscribers of a new value.
 */

Dep.prototype.notify = function () {
  var subs = this.subs;
  each(subs, function (sub) {
    sub.update();
  });
};

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

each(arrayMutating, function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator() {
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
def(arrayProto, '$set', $set);

/**
 * Convenience method to remove the element at given index or target element reference.
 *
 * @param {*} item
 */

function $remove(item) {
  /* istanbul ignore if */
  if (!this.length) return;
  var index = indexOf(this, item);
  if (index > -1) {
    return this.splice(index, 1);
  }
}
def(arrayProto, '$remove', $remove);

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
  this.dep = new Dep();
  def(value, '__ob__', this);
  if (isArray(value)) {
    amend(value);
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

  every(obj, function (key, val) {
    _this.convert(key, val);
  });
};

/**
 * Observe a list of Array items.
 *
 * @param {Array} items
 */

Observer.prototype.observeArray = function (items) {
  each(items, function (val) {
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
  if (!value || (typeof value === 'undefined' ? 'undefined' : babelHelpers.typeof(value)) !== 'object') {
    return;
  }
  var ob;
  if (Object.prototype.hasOwnProperty.call(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if ((isArray(value) || isPlainObject(value)) && Object.isExtensible(value)) {
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
  var dep = new Dep();

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
    if (Dep.target) {
      dep.depend();
      if (childOb) {
        childOb.dep.depend();
      }
      if (isArray(value)) {
        each(value, function (e) {
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
  defi(obj, key, reactiveGetter, reactiveSetter);
}

/**
 * Build a getter function. Requires eval.
 *
 * We isolate the try/catch so it doesn't affect the
 * optimization of the parse function when it is not called.
 *
 * @param {String} body
 * @return {Function|undefined}
 */

function makeGetterFn(body) {
  try {
    /* eslint-disable no-new-func */
    return new Function('scope', 'return ' + body + ';');
    /* eslint-enable no-new-func */
  } catch (e) {
    warn('Invalid expression. ' + 'Generated function body: ' + body);
  }
}

/**
 * Parse an expression to getter.
 *
 * @param {String} exp
 * @return {Function}
 */

function parse(exp) {
  exp = exp.trim();
  var getter = makeGetterFn('scope.' + exp);
  return getter;
}

var queueIndex;
var queue = [];
var has = {};
var waiting = false;

/**
 * Reset the batcher's state.
 */

function resetBatcherState() {
  queue = [];
  has = {};
  waiting = false;
}

/**
 * Flush queue and run the watchers.
 */

function flushBatcherQueue() {
  runBatcherQueue(queue);
  resetBatcherState();
}

/**
 * Run the watchers in a single queue.
 *
 * @param {Array} queue
 */

function runBatcherQueue(queue) {
  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (queueIndex = 0; queueIndex < queue.length; queueIndex++) {
    var watcher = queue[queueIndex];
    var id = watcher.id;
    has[id] = null;
    watcher.run();
  }
}

/**
 * Defer a task to execute it asynchronously. Ideally this
 * should be executed as a microtask, so we leverage
 * MutationObserver if it's available, and fallback to
 * setTimeout(0).
 *
 * @param {Function} cb
 * @param {Object} ctx
 */

var nextTick = function () {
  var callbacks = [];
  var pending = false;
  var timerFunc;
  function nextTickHandler() {
    pending = false;
    var copies = callbacks.slice(0);
    callbacks = [];
    for (var i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }

  /* istanbul ignore if */
  if (typeof MutationObserver !== 'undefined') {
    var counter = 1;
    /* global MutationObserver */
    var observer = new MutationObserver(nextTickHandler);
    /* global */
    var textNode = document.createTextNode(counter);
    observer.observe(textNode, {
      characterData: true
    });
    timerFunc = function timerFunc() {
      counter = (counter + 1) % 2;
      textNode.data = counter;
    };
  } else {
    // webpack attempts to inject a shim for setImmediate
    // if it is used as a global, so we have to work around that to
    // avoid bundling unnecessary code.
    var inBrowser = typeof window !== 'undefined' && Object.prototype.toString.call(window) !== '[object Object]';
    var context = inBrowser ? window : typeof global !== 'undefined' ? global : {};
    timerFunc = context.setImmediate || setTimeout;
  }
  return function (cb, ctx) {
    var func = ctx ? function () {
      cb.call(ctx);
    } : cb;
    callbacks.push(func);
    if (pending) return;
    pending = true;
    timerFunc(nextTickHandler, 0);
  };
}();

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 *
 * @param {Watcher} watcher
 *   properties:
 *   - {Number} id
 *   - {Function} run
 */

function batch(watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = queue.length;
    queue.push(watcher);
    // queue the flush
    if (!waiting) {
      waiting = true;
      nextTick(flushBatcherQueue);
    }
  }
}

var uid$1 = 0;

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
  this.id = ++uid$1;
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
  Dep.target = this;
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
  Dep.target = null;
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
    batch(this);
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
    isObject(value) || this.options.deep) {
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
  var current = Dep.target;
  this.value = this.get();
  this.dirty = false;
  Dep.target = current;
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
  if (isArray(val)) {
    i = val.length;
    while (i--) {
      traverse(val[i]);
    }
  } else if (isObject(val)) {
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

function watch$1(owner, expOrFn, callback, options) {
  // parse expression for getter
  var getter = isFunc(expOrFn) ? expOrFn : parse(expOrFn);
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
    if (Dep.target) {
      watcher.depend();
    }
    return watcher.value;
  };
}

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
  def(owner, '_watchers', [], false);
  def(owner, '_data', Object.create(null), false);
  observe(owner._data);
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
    every(current, function (key, val) {
      !isFunc(val) && react(key, val);
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
  every(items, function (key, val) {
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
  defineReactive(current._data, key, val);
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
  every(items, function (key, val) {
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
  if (isFunc(accessor)) {
    getter = makeComputed(current, accessor);
    setter = noop;
  } else {
    getter = accessor.get ? cache !== false ? makeComputed(current, accessor.get) : accessor.get.bind(this) : noop;
    setter = accessor.set ? accessor.set.bind(this) : noop;
  }
  defi(current, key, getter, setter);
}

/**
 * $compute
 *
 * @param {Object} items
 * @return {Function} ob
 */

function $compute(items) {
  every(items, function (key, val) {
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
  return watch$1(current, exprOrFunc, callback, options || watch);
}

/**
 * $watch
 *
 * @param {Object} items
 * @return {Function} ob
 */

function $watch(items) {
  every(items, function (expr, fnOrOpt) {
    if (isFunc(fnOrOpt)) {
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
  defi(owner, key, getter, setter);
}

if (typeof module !== 'undefined' && module.exports) {

module.exports = ob;

} else if (typeof define === 'function' && define.amd) {
  define(ob)
} else if (window) {
  var key = window.ob ? 'ob.js' : 'ob'
  window[key] = ob
}
//# sourceMappingURL=ob.js.map