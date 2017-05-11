import {
  observe as doObserve,
  defineReactive,
} from './observe'
import {
  watch as doWatch,
  makeComputed,
} from './watcher'
import {
  defineValue,
  defineAccessor,
  noop,
  isFunction,
  everyEntries,
} from './util'
import {
  WATCHERS_PROPERTY_NAME,
  DATA_PROPTERTY_NAME,
} from './constants'

Object.defineProperties(observe, {
  'react': {value: react},
  'compute': {value: compute},
  'watch': {value: watch},
  'default': {value: watch, writable: true}, // Only could be react, compute or watch
  'deep': {value: false, writable: true},
  'lazy': {value: false, writable: true},
  'sync': {value: false, writable: true},
})

/**
 * observe
 *
 * @public
 * @param {Object} target
 * @param {*} [expression]
 * @param {*} [func]
 * @param {*} [options]
 * @return {Function} observe
 */

export default function observe (target, expression, func, options) {
  if (!target.hasOwnProperty(WATCHERS_PROPERTY_NAME)) {
    init(target)
  }
  return observe.default(target, expression, func, options)
}

/**
 * React options
 *
 * @param {Object} options
 * @param {Object} [target]
 * @return {Function} observe
 */

function react (options, target) {
  if (target) {
    if (!target.hasOwnProperty(WATCHERS_PROPERTY_NAME)) {
      init(target)
    }
  } else {
    target = {}
    init(target)
  }
  options.methods && carryMethods(target, options.methods)
  options.data && reactProperties(target, options.data)
  options.computed && computeProperties(target, options.computed)
  options.watchers && watchProperties(target, options.watchers)
  return target
}

/**
 * Compute property
 *
 * @param {Object} target
 * @param {String} name
 * @param {Function|Object} getterOrAccessor
 *        - Function getter
 *        - Object accessor
 *          - Function [get]  - getter
 *          - Function [set]  - setter
 *          - Boolean [cache]
 * @param {Boolean} [cache]
 */

function compute (target, name, getterOrAccessor, cache) {
  if (!target.hasOwnProperty(WATCHERS_PROPERTY_NAME)) {
    init(target)
  }
  let getter, setter
  if (isFunction(getterOrAccessor)) {
    getter = cache !== false
            ? makeComputed(target, getterOrAccessor)
            : getterOrAccessor.bind(this)
    setter = noop
  } else {
    getter = getterOrAccessor.get
            ? getterOrAccessor.cache !== false || cache !== false
              ? makeComputed(target, getterOrAccessor.get)
              : getterOrAccessor.get.bind(this)
            : noop
    setter = getterOrAccessor.set ? getterOrAccessor.set.bind(this) : noop
  }
  defineAccessor(target, name, getter, setter)
}

/**
 * Watch property
 *
 * @param {Object} target
 * @param {String|Function} expressionOrFunction
 * @param {Function} callback
 * @param {Object} [options]
 *                 - {Boolean} deep
 *                 - {Boolean} sync
 *                 - {Boolean} lazy
 * @return {Watcher}
 */

function watch (target, expressionOrFunction, callback, options = observe) {
  if (!target.hasOwnProperty(WATCHERS_PROPERTY_NAME)) {
    init(target)
  }
  return doWatch(target, expressionOrFunction, callback, options)
}

/**
 * @param {Object} target
 */

function init (target) {
  defineValue(target, WATCHERS_PROPERTY_NAME, [], false)
  defineValue(target, DATA_PROPTERTY_NAME, Object.create(null), false)
  doObserve(target[DATA_PROPTERTY_NAME])
  reactSelfProperties(target)
}

/**
 * @param {Object} target
 * @param {Object} methods
 */

function carryMethods (target, methods) {
  everyEntries(methods, (name, method) => {
    target[name] = method.bind(target)
  })
}

/**
 * @param {Object} target
 * @param {String} key
 * @param {*} value
 */

function reactProperty (target, key, value) {
  target[DATA_PROPTERTY_NAME][key] = value
  defineReactive(target[DATA_PROPTERTY_NAME], key, value)
  proxy(target, key)
}

/**
 * @param {Object} target
 * @param {Object} properties
 */

function reactProperties (target, properties) {
  everyEntries(properties, (key, value) => reactProperty(target, key, value))
}

/**
 * @param {Object} target
 */

function reactSelfProperties (target) {
  everyEntries(target, (key, value) => {
    !isFunction(value) && reactProperty(target, key, value)
  })
}

/**
 * @param {Object} target
 * @param {Object} properties
 */

function computeProperties (target, properties) {
  everyEntries(properties, (key, value) => compute(target, key, value))
}

/**
 * @param {Object} target
 * @param {Object} properties
 */

function watchProperties (target, properties) {
  everyEntries(properties, (expression, functionOrOption) => {
    if (isFunction(functionOrOption)) {
      watch(target, expression, functionOrOption)
    } else {
      watch(target, expression, functionOrOption.watcher, functionOrOption)
    }
  })
}

/**
 * @param {Object} target
 * @param {String} key
 */

function proxy (target, key) {
  function getter () {
    return target[DATA_PROPTERTY_NAME][key]
  }
  function setter (value) {
    target[DATA_PROPTERTY_NAME][key] = value
  }
  defineAccessor(target, key, getter, setter)
}
