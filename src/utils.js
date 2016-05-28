/**
 * Define a property.
 *
 * @param {Object} obj
 * @param {String} key
 * @param {*} val
 * @param {Boolean} [enumerable]
 */

export function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true,
  })
}

/**
 * Define a property.
 *
 * @param {Object} obj
 * @param {String} key
 * @param {Function} getter
 * @param {Function} setter
 */

export function defi (obj, key, getter, setter) {
  Object.defineProperty(obj, key, {
    get: getter,
    set: setter,
    configurable: true,
    enumerable: true,
  })
}

/**
 * Array type check.
 *
 * @param {*} obj
 * @return {Boolean}
 */

export const isArray = Array.isArray

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 *
 * @param {*} obj
 * @return {Boolean}
 */

var toString = Object.prototype.toString
var OBJECT_STRING = '[object Object]'
export function isPlainObject (obj) {
  return toString.call(obj) === OBJECT_STRING
}

/**
 * Manual indexOf because it's slightly faster than
 * native.
 *
 * @param {Array} arr
 * @param {*} obj
 */

export function indexOf (arr, obj) {
  var i = arr.length
  while (i--) {
    if (arr[i] === obj) return i
  }
  return -1
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 *
 * @param {*} obj
 * @return {Boolean}
 */

export function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * every
 *
 * @param {Object} obj
 * @param {Function} cb
 */

export function every (obj, cb) {
  var keys = Object.keys(obj)
  for (var i = 0, l = keys.length; i < l; i++) {
    cb(keys[i], obj[keys[i]])
  }
}

/**
 * each
 *
 * @param {Array} arr
 * @param {Function} cb
 */

export function each (arr, cb) {
  for (var i = 0, l = arr.length; i < l; i++) {
    cb(arr[i], i)
  }
}

/**
 * isFunc
 *
 * @param {*} func
 * @param {Boolean}
 */

export function isFunc (func) {
  return typeof func === 'function'
}

/**
 * noop is function which is nothing to do.
 */

export function noop () {}

/**
 * isDebug
 */

export const isDebug =
  typeof process !== 'undefined' &&
  process.env.NODE_ENV !== 'production'

/**
 * warn
 */

export const warn =
  isDebug &&
  console && isFunc(console.warn)
  ? console.warn
  : noop
