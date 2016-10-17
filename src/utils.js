import {IS_DEBUG} from './constants'

/**
 * Define property with value.
 *
 * @param {Object} object
 * @param {String} property
 * @param {*} value
 * @param {Boolean} [enumerable]
 */

export function def (object, property, value, enumerable) {
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

export function defi (object, property, getter, setter) {
  Object.defineProperty(object, property, {
    get: getter,
    set: setter,
    configurable: true,
    enumerable: true,
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
 * @param {*} fun
 * @param {Boolean}
 */

export function isFunction (fun) {
  return typeof fun === 'function'
}

/**
 * Iterate object
 *
 * @param {Object} object
 * @param {Function} cb
 */

export function every (object, callback) {
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

export const warn =
  IS_DEBUG
  && console
  && isFunction(console.warn)
    ? console.warn
    : noop
