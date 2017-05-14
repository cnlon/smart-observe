import {DEBUGGING} from './constants'

/**
 * Define property with value.
 *
 * @param {Object} object
 * @param {String} property
 * @param {*} value
 * @param {Boolean} [enumerable]
 */

export function defineValue (object, property, value, enumerable) {
  Object.defineProperty(object, property, {
    value,
    enumerable: !!enumerable,
    writable: true,
    configurable: true,
  })
}

/**
 * Define property with getter and setter.
 *
 * @param {Object} object
 * @param {String} property
 * @param {Function} getter
 * @param {Function} setter
 */

export function defineAccessor (object, property, getter, setter) {
  Object.defineProperty(object, property, {
    get: getter,
    set: setter,
    enumerable: true,
    configurable: true,
  })
}

/**
 * Array type check.
 *
 * @return {Boolean}
 */

export const isArray = Array.isArray

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 *
 * @param {*} object
 * @return {Boolean}
 */

const toString = Object.prototype.toString
const OBJECT_STRING = '[object Object]'
export function isPlainObject (object) {
  return toString.call(object) === OBJECT_STRING
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 *
 * @param {*} object
 * @return {Boolean}
 */

export function isObject (object) {
  return object !== null && typeof object === 'object'
}

/**
 * Function type check
 *
 * @param {*} func
 * @param {Boolean}
 */

export function isFunction (func) {
  return typeof func === 'function'
}

/**
 * Iterate object
 *
 * @param {Object} object
 * @param {Function} callback
 */

export function everyEntries (object, callback) {
  const keys = Object.keys(object)
  for (let i = 0, l = keys.length; i < l; i++) {
    callback(keys[i], object[keys[i]])
  }
}

/**
 * noop is function which is nothing to do.
 */

export function noop () {}

/**
 * @param {String} string
 */

export const warn = typeof DEBUGGING !== 'undefined' && DEBUGGING
  && typeof console !== 'undefined' && console
  && isFunction(console.warn)
    ? console.warn
    : noop

export let _Set
if (typeof Set !== 'undefined' && Set.toString().match(/native code/)) {
  // use native Set when available.
  _Set = Set
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = function () {
    this.set = Object.create(null)
  }
  _Set.prototype.has = function (key) {
    return this.set[key] !== undefined
  }
  _Set.prototype.add = function (key) {
    this.set[key] = 1
  }
  _Set.prototype.clear = function () {
    this.set = Object.create(null)
  }
}
