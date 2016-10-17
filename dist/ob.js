/**
 * ob.js --- By lon
 * Github: https://github.com/lon3/ob.js
 * MIT Licensed.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define('ob', factory) :
  (global.ob = factory());
}(this, (function () { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









var get$1 = function get$1(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get$1(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};



















var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

var uid = 0;

/**
 * A dep is an observable that can have multiple
 * watcher subscribing to it.
 *
 * @constructor
 */

var Dep = function () {
  function Dep() {
    classCallCheck(this, Dep);

    this.id = uid++;
    this.subs = [];
  }

  /**
   * Add a subscriber.
   *
   * @param {Watcher} sub
   */

  // the current target watcher being evaluated.
  // this is globally unique because there could be only one
  // watcher being evaluated at any time.


  createClass(Dep, [{
    key: "addSub",
    value: function addSub(sub) {
      this.subs.push(sub);
    }

    /**
     * Remove a subscriber.
     *
     * @param {Watcher} sub
     */

  }, {
    key: "removeSub",
    value: function removeSub(sub) {
      this.subs.$remove(sub);
    }

    /**
     * Add self as a dependency to the target watcher.
     */

  }, {
    key: "depend",
    value: function depend() {
      Dep.target.addDep(this);
    }

    /**
     * Notify all subscribers of a new value.
     */

  }, {
    key: "notify",
    value: function notify() {
      var subs = this.subs;
      for (var i = 0, l = subs.length; i < l; i++) {
        subs[i].update();
      }
    }
  }]);
  return Dep;
}();

Dep.target = null;

var OB_NAME = '__ob__';
var WATCHERS_PROPERTY_NAME = '__watchers__';
var DATA_PROPTERTY_NAME = '__data__';

var IS_DEBUG = typeof process !== 'undefined' && process.env.NODE_ENV !== 'production';

/**
 * Define property with value.
 *
 * @param {Object} object
 * @param {String} property
 * @param {*} value
 * @param {Boolean} [enumerable]
 */

function def(object, property, value, enumerable) {
  Object.defineProperty(object, property, {
    value: value,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Define property with getter and setter.
 *
 * @param {Object} object
 * @param {String} property
 * @param {Function} getter
 * @param {Function} setter
 */

function defi(object, property, getter, setter) {
  Object.defineProperty(object, property, {
    get: getter,
    set: setter,
    configurable: true,
    enumerable: true
  });
}

/**
 * Array type check.
 *
 * @return {Boolean}
 */

var isArray = Array.isArray;

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 *
 * @param {*} object
 * @return {Boolean}
 */

var toString = Object.prototype.toString;
var OBJECT_STRING = '[object Object]';
function isPlainObject(object) {
  return toString.call(object) === OBJECT_STRING;
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 *
 * @param {*} object
 * @return {Boolean}
 */

function isObject(object) {
  return object !== null && (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object';
}

/**
 * Function type check
 *
 * @param {*} fun
 * @param {Boolean}
 */

function isFunction(fun) {
  return typeof fun === 'function';
}

/**
 * Iterate object
 *
 * @param {Object} object
 * @param {Function} cb
 */

function every(object, callback) {
  var keys = Object.keys(object);
  for (var i = 0, l = keys.length; i < l; i++) {
    callback(keys[i], object[keys[i]]);
  }
}

/**
 * noop is function which is nothing to do.
 */

function noop() {}

/**
 * @param {String} string
 */

var warn = IS_DEBUG && console && isFunction(console.warn) ? console.warn : noop;

var arrayPrototype = Array.prototype;
var arrayMethods = Object.create(arrayPrototype);
var arrayMutativeMethods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];

/**
 * Augment an target Array with arrayMethods
 *
 * @param {Array} array
 */

function amend(array) {
  Object.setPrototypeOf(array, arrayMethods);
}

/**
 * Intercept mutating methods and emit events
 */

var _loop = function _loop(i, l, method) {
  // cache original method
  var original = arrayPrototype[method];
  def(arrayMethods, method, function mutator() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var result = original.apply(this, args);
    var ob = this[OB_NAME];
    var inserted = void 0;
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
    ob.dep.notify(); // notify change
    return result;
  });
};

for (var i = 0, l = arrayMutativeMethods.length, method; i < l; method = arrayMutativeMethods[++i]) {
  _loop(i, l, method);
}

/**
 * Swap the element at the given index with a new value
 * and emits corresponding event.
 *
 * @param {Number} index
 * @param {*} value
 * @return {*} - replaced element
 */

function $set(index, value) {
  if (index >= this.length) {
    this.length = Number(index) + 1;
  }
  return this.splice(index, 1, value)[0];
}
def(arrayPrototype, '$set', $set);

/**
 * Convenience method to remove the element at given index
 * or target element reference.
 *
 * @param {*} item
 */

function $remove(item) {
  /* istanbul ignore if */
  if (!this.length) return;
  var index = this.indexOf(item);
  if (index > -1) {
    return this.splice(index, 1);
  }
}
def(arrayPrototype, '$remove', $remove);

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
  def(value, OB_NAME, this);
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
 * @param {Object} object
 */

Observer.prototype.walk = function (object) {
  var _this = this;

  every(object, function (key, value) {
    return _this.convert(key, value);
  });
};

/**
 * Observe a list of Array items.
 *
 * @param {Array} items
 */

Observer.prototype.observeArray = function (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

/**
 * Convert a property into getter/setter so we can emit
 * the events when the property is accessed/changed.
 *
 * @param {String} key
 * @param {*} value
 */

Observer.prototype.convert = function (key, value) {
  defineReactive(this.value, key, value);
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
  var ob = void 0;
  if (Object.prototype.hasOwnProperty.call(value, OB_NAME) && value[OB_NAME] instanceof Observer) {
    ob = value[OB_NAME];
  } else if ((isArray(value) || isPlainObject(value)) && Object.isExtensible(value)) {
    ob = new Observer(value);
  }
  return ob;
}

/**
 * Define a reactive property on an Object.
 *
 * @param {Object} object
 * @param {String} key
 * @param {*} value
 */

function defineReactive(object, key, value) {
  var dep = new Dep();

  var desc = Object.getOwnPropertyDescriptor(object, key);
  if (desc && desc.configurable === false) {
    return;
  }

  // cater for pre-defined getter/setters
  var getter = desc && desc.get;
  var setter = desc && desc.set;

  var childOb = observe(value);

  function reactiveGetter() {
    var currentValue = getter ? getter.call(object) : value;
    if (Dep.target) {
      dep.depend();
      if (childOb) {
        childOb.dep.depend();
      }
      if (isArray(currentValue)) {
        for (var i = 0, l = currentValue.length, e; i < l; i++) {
          e = currentValue[i];
          e && e[OB_NAME] && e[OB_NAME].dep.depend();
        }
      }
    }
    return currentValue;
  }
  function reactiveSetter(newValue) {
    var oldValue = getter ? getter.call(object) : value;
    if (newValue === oldValue) {
      return;
    }
    if (setter) {
      setter.call(object, newValue);
    } else {
      value = newValue;
    }
    childOb = observe(newValue);
    dep.notify();
  }
  defi(object, key, reactiveGetter, reactiveSetter);
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

function makeGetterFunction(body) {
  try {
    /* eslint-disable no-new-func */
    return new Function('scope', 'return ' + body + ';');
    /* eslint-enable no-new-func */
  } catch (e) {
    warn('Invalid expression. Generated function body: ' + body);
  }
}

/**
 * Parse an expression to getter.
 *
 * @param {String} expression
 * @return {Function|undefined}
 */

function parse(expression) {
  expression = String.prototype.trim.call(expression);
  return makeGetterFunction('scope.' + expression);
}

var queue = [];
var has = {};
var waiting = false;
var queueIndex = void 0;

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
 * @param {Function} callback
 * @param {Object} context
 */

var nextTick = function () {
  var callbacks = [];
  var pending = false;
  var timerFunction = void 0;
  function nextTickHandler() {
    pending = false;
    var callbackCopies = callbacks.slice(0);
    callbacks = [];
    for (var i = 0; i < callbackCopies.length; i++) {
      callbackCopies[i]();
    }
  }

  /* istanbul ignore if */
  if (typeof MutationObserver !== 'undefined') {
    (function () {
      var counter = 1;
      /* global MutationObserver */
      var observer = new MutationObserver(nextTickHandler);
      /* global */
      var textNode = document.createTextNode(counter);
      observer.observe(textNode, { characterData: true });
      timerFunction = function timerFunction() {
        counter = (counter + 1) % 2;
        textNode.data = counter;
      };
    })();
  } else {
    // webpack attempts to inject a shim for setImmediate
    // if it is used as a global, so we have to work around that to
    // avoid bundling unnecessary code.
    var inBrowser = typeof window !== 'undefined' && Object.prototype.toString.call(window) !== '[object Object]';
    var context = inBrowser ? window : typeof global !== 'undefined' ? global : {};
    timerFunction = context.setImmediate || setTimeout;
  }
  return function (callback, context) {
    var fun = context ? function () {
      callback.call(context);
    } : callback;
    callbacks.push(fun);
    if (pending) return;
    pending = true;
    timerFunction(nextTickHandler, 0);
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

var Watcher = function () {

  /**
   * A watcher parses an expression, collects dependencies,
   * and fires callback when the expression value changes.
   *
   * @param {Object} owner
   * @param {String|Function} getter
   * @param {Function} callback
   * @param {Object} options
   *                 - {Boolean} deep
   *                 - {Boolean} sync
   *                 - {Boolean} lazy
   * @constructor
   */

  function Watcher(owner, getter, callback, options) {
    classCallCheck(this, Watcher);

    owner[WATCHERS_PROPERTY_NAME].push(this);
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

  createClass(Watcher, [{
    key: 'get',
    value: function get() {
      this.beforeGet();
      var scope = this.owner;
      var value = this.getter.call(scope, scope);
      if (this.options.deep) {
        traverse(value);
      }
      this.afterGet();
      return value;
    }

    /**
     * Prepare for dependency collection.
     */

  }, {
    key: 'beforeGet',
    value: function beforeGet() {
      Dep.target = this;
      this.newDepIds = Object.create(null);
      this.newDeps.length = 0;
    }

    /**
     * Add a dependency to this directive.
     *
     * @param {Dep} dep
     */

  }, {
    key: 'addDep',
    value: function addDep(dep) {
      var id = dep.id;
      if (!this.newDepIds[id]) {
        this.newDepIds[id] = true;
        this.newDeps.push(dep);
        if (!this.depIds[id]) {
          dep.addSub(this);
        }
      }
    }

    /**
     * Clean up for dependency collection.
     */

  }, {
    key: 'afterGet',
    value: function afterGet() {
      Dep.target = null;
      var i = this.deps.length;
      while (i--) {
        var dep = this.deps[i];
        if (!this.newDepIds[dep.id]) {
          dep.removeSub(this);
        }
      }
      this.depIds = this.newDepIds
      /* eslint-disable no-unexpected-multiline, no-sequences */
      [(this.deps, this.newDeps)] = [this.newDeps, this.deps];
      /* eslint-enable no-unexpected-multiline, no-sequences */
    }

    /**
     * Will be called when a dependency changes.
     */

  }, {
    key: 'update',
    value: function update() {
      if (this.options.lazy) {
        this.dirty = true;
      } else if (this.options.sync) {
        this.run();
      } else {
        batch(this);
      }
    }

    /**
     * Will be called by the batcher.
     */

  }, {
    key: 'run',
    value: function run() {
      if (this.active) {
        var value = this.get();
        if (value !== this.value
        // Deep watchers and watchers on Object/Arrays should fire even when
        // the value is the same, because the value may have mutated;
        || isObject(value) || this.options.deep) {
          var oldValue = this.value;
          this.value = value;
          this.callback.call(this.owner, value, oldValue);
        }
      }
    }

    /**
     * Evaluate the value of the watcher.
     * This only gets called for lazy watchers.
     */

  }, {
    key: 'evaluate',
    value: function evaluate() {
      // avoid overwriting another watcher that is being collected.
      var current = Dep.target;
      this.value = this.get();
      this.dirty = false;
      Dep.target = current;
    }

    /**
     * Depend on all deps collected by this watcher.
     */

  }, {
    key: 'depend',
    value: function depend() {
      var i = this.deps.length;
      while (i--) {
        this.deps[i].depend();
      }
    }

    /**
     * Remove self from all dependencies' subcriber list.
     */

  }, {
    key: 'teardown',
    value: function teardown() {
      if (this.active) {
        var i = this.deps.length;
        while (i--) {
          this.deps[i].removeSub(this);
        }
        this.active = false;
        this.owner = this.callback = this.value = null;
      }
    }
  }]);
  return Watcher;
}();

/**
 * Recrusively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 *
 * @param {*} value
 */

function traverse(value) {
  var i = void 0,
      keys = void 0;
  if (isArray(value)) {
    i = value.length;
    while (i--) {
      traverse(value[i]);
    }
  } else if (isObject(value)) {
    keys = Object.keys(value);
    i = keys.length;
    while (i--) {
      traverse(value[keys[i]]);
    }
  }
}

/**
 * Create an watcher instance, returns the new watcher.
 *
 * @param {Object} owner
 * @param {String|Function} expressionOrFunction
 * @param {Function} callback
 * @param {Object} options
 *                 - {Boolean} deep
 *                 - {Boolean} sync
 *                 - {Boolean} lazy
 * @return {Watcher}
 */

function watch$1(owner, expressionOrFunction, callback, options) {
  // parse expression for getter
  var getter = isFunction(expressionOrFunction) ? expressionOrFunction : parse(expressionOrFunction);
  return new Watcher(owner, getter, callback, options);
}

/**
 * Make a computed getter, which can collect dependencies.
 *
 * @param {Object} owner
 * @param {Function} getter
 */

function makeComputed(owner, getter) {
  var watcher = new Watcher(owner, getter, null, { lazy: true });
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

// Only could be react, compute or watch
ob.default = react;
ob.deep = ob.lazy = ob.sync = false;

Object.setPrototypeOf(ob, { react: react, compute: compute, watch: watch$$1 });

/**
 * ob
 *
 * @public
 * @param {Object} target
 * @param {*} [expression]
 * @param {*} [fun]
 * @param {*} [options]
 * @return {Function} ob
 */

function ob(target, expression, fun, options) {
  if (!target.hasOwnProperty(WATCHERS_PROPERTY_NAME)) {
    init(target);
  }
  return ob.default(target, expression, fun, options);
}

/**
 * React options
 *
 * @public
 * @param {Object} options
 * @param {Object} [target]
 * @return {Function} ob
 */

function react(options, target) {
  if (target) {
    if (!target.hasOwnProperty(WATCHERS_PROPERTY_NAME)) {
      init(target);
    }
  } else {
    target = Object.create(null);
  }
  options.methods && carryMethods(target, options.methods);
  options.data && reactProperties(target, options.data);
  options.computed && computeProperties(target, options.computed);
  options.watchers && watchProperties(target, options.watchers);
  return target;
}

/**
 * Compute property
 *
 * @public
 * @param {Object} target
 * @param {String} name
 * @param {Function|Object} getterOrAccessor
 *        - Function getter
 *        - Object accessor
 *          - Function [get]  - getter
 *          - Function [set]  - setter
 * @param {Boolean} [cache]
 */

function compute(target, name, getterOrAccessor, cache) {
  if (!target.hasOwnProperty(WATCHERS_PROPERTY_NAME)) {
    init(target);
  }
  var getter = void 0,
      setter = void 0;
  if (isFunction(getterOrAccessor)) {
    getter = makeComputed(target, getterOrAccessor);
    setter = noop;
  } else {
    getter = getterOrAccessor.get ? cache !== false ? makeComputed(target, getterOrAccessor.get) : getterOrAccessor.get.bind(this) : noop;
    setter = getterOrAccessor.set ? getterOrAccessor.set.bind(this) : noop;
  }
  defi(target, name, getter, setter);
}

/**
 * Watch property
 *
 * @public
 * @param {Object} target
 * @param {String|Function} expressionOrFunction
 * @param {Function} callback
 * @param {Object} [options]
 *                 - {Boolean} deep
 *                 - {Boolean} sync
 *                 - {Boolean} lazy
 * @return {Watcher}
 */

function watch$$1(target, expressionOrFunction, callback) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ob;

  if (!target.hasOwnProperty(WATCHERS_PROPERTY_NAME)) {
    init(target);
  }
  return watch$1(target, expressionOrFunction, callback, options);
}

/**
 * @private
 * @param {Object} target
 */

function init(target) {
  def(target, WATCHERS_PROPERTY_NAME, [], false);
  def(target, DATA_PROPTERTY_NAME, Object.create(null), false);
  observe(target[DATA_PROPTERTY_NAME]);
  reactSelfProperties(target);
}

/**
 * @private
 * @param {Object} target
 * @param {Object} methods
 */

function carryMethods(target, methods) {
  every(methods, function (name, method) {
    target[name] = method.bind(target);
  });
}

/**
 * @private
 * @param {Object} target
 * @param {String} key
 * @param {*} value
 */
function reactProperty(target, key, value) {
  target[DATA_PROPTERTY_NAME][key] = value;
  defineReactive(target[DATA_PROPTERTY_NAME], key, value);
  proxy(target, key);
}

/**
 * @private
 * @param {Object} target
 * @param {Object} properties
 */

function reactProperties(target, properties) {
  every(properties, function (key, value) {
    return reactProperty(target, key, value);
  });
}

/**
 * @private
 * @param {Object} target
 */

function reactSelfProperties(target) {
  every(target, function (key, value) {
    !isFunction(value) && reactProperty(target, key, value);
  });
}

/**
 * @private
 * @param {Object} target
 * @param {Object} properties
 */

function computeProperties(target, properties) {
  every(properties, function (key, value) {
    return compute(target, key, value);
  });
}

/**
 * @private
 * @param {Object} target
 * @param {Object} properties
 */

function watchProperties(target, properties) {
  every(properties, function (expression, functionOrOption) {
    if (isFunction(functionOrOption)) {
      watch$$1(target, expression, functionOrOption);
    } else {
      watch$$1(target, expression, functionOrOption.watcher, functionOrOption);
    }
  });
}

/**
 * @private
 * @param {Object} target
 * @param {String} key
 */

function proxy(target, key) {
  function getter() {
    return target[DATA_PROPTERTY_NAME][key];
  }
  function setter(value) {
    target[DATA_PROPTERTY_NAME][key] = value;
  }
  defi(target, key, getter, setter);
}

return ob;

})));
//# sourceMappingURL=ob.js.map
