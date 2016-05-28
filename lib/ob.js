'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ob;

var _observe = require('./observe.js');

var _watcher = require('./watcher');

var _watcher2 = _interopRequireDefault(_watcher);

var _dep = require('./dep');

var _dep2 = _interopRequireDefault(_dep);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

ob.current = null;
ob.deep = true;
Object.setPrototypeOf(ob, {
  config: config,
  method: method, $method: $method,
  data: data, $data: $data,
  computed: computed, $computed: $computed,
  watch: watch, $watch: $watch
});

function ob(o) {
  var deep = arguments.length <= 1 || arguments[1] === undefined ? ob.deep : arguments[1];

  ob.current = o;
  var isOb = o.hasOwnProperty('_watchers');
  if (!isOb) {
    init(o);
    if (deep) {
      var value;
      Object.keys(o).forEach(function (key) {
        if (typeof o[key] !== 'function') {
          value = o._data[key] = o[key];
          ob.$data(value, key, o);
        }
      });
    }
  }
  return ob;
}

function init(owner) {
  Object.defineProperty(owner, '_watchers', {
    value: [],
    enumerable: false
  });
  Object.defineProperty(owner, '_data', {
    value: Object.create(null),
    enumerable: false
  });
  (0, _observe.observe)(owner._data);
  return ob;
}

function config(config) {
  var owner = arguments.length <= 1 || arguments[1] === undefined ? ob.current || {} : arguments[1];

  config.method && $method(config.method, owner);
  config.prop && $data(config.prop, owner);
  config.data && $data(config.data, owner);
  config.computed && $computed(config.computed, owner);
  return ob;
}

function $data(items) {
  Object.keys(items).forEach(function (key) {
    return data(items[key], key, ob.current);
  });
  return ob;
}
function data(value, key) {
  (0, _observe.defineReactive)(ob.current._data, key, value);
  proxy(ob.current, key);
  return ob;
}

function $method(items) {
  Object.keys(items).forEach(function (key) {
    return method(items[key]);
  });
  return ob;
}
function method(method) {
  var key = arguments.length <= 1 || arguments[1] === undefined ? method.name : arguments[1];

  ob.current[key] = method.bind(ob.current);
  return ob;
}

function $computed(items) {
  Object.keys(items).forEach(function (key) {
    return computed(items[key], key, ob.current);
  });
  return ob;
}
function computed(computed) {
  var key = arguments.length <= 1 || arguments[1] === undefined ? computed.name : arguments[1];

  var desc = {
    enumerable: true,
    configurable: true
  };
  if (typeof computed === 'function') {
    desc.get = makeComputedGetter(computed, ob.current);
    desc.set = _util.noop;
  } else {
    desc.get = computed.get ? makeComputedGetter(computed.get, ob.current) : _util.noop;
    desc.set = computed.set ? computed.set.bind(this) : _util.noop;
  }
  Object.defineProperty(ob.current, key, desc);
  return ob;
}

function $watch(watch) {
  return ob;
}
function watch(expression, callback) {
  expression = expression || callback.name;
  /* eslint-disable no-new */
  new _watcher2.default(ob.current, expression, callback, { deep: true });
  /* eslint-enable no-new-func */
  return ob;
}

function proxy(o, key) {
  Object.defineProperty(o, key, {
    get: function getter() {
      return o._data[key];
    },
    set: function setter(val) {
      o._data[key] = val;
    },
    configurable: true,
    enumerable: true
  });
}

function makeComputedGetter(getter, owner) {
  var watcher = new _watcher2.default(owner, getter, null, {
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
//# sourceMappingURL=ob.js.map