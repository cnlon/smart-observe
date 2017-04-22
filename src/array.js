import {def} from './util'
import {OB_NAME} from './constants'

const arrayPrototype = Array.prototype
const arrayMethods = Object.create(arrayPrototype)
const arrayMutativeMethods = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse',
]

/**
 * Augment an target Array with arrayMethods
 *
 * @param {Array} array
 */

export default function amend (array) {
  Object.setPrototypeOf(array, arrayMethods)
}

/**
 * Intercept mutating methods and emit events
 */

for (
  let i = 0, l = arrayMutativeMethods.length, method;
  i < l;
  method = arrayMutativeMethods[++i]
) {
  // cache original method
  const original = arrayPrototype[method]
  def(arrayMethods, method, function mutator (...args) {
    const result = original.apply(this, args)
    const ob = this[OB_NAME]
    let inserted
    switch (method) {
      case 'push':
        inserted = args
        break
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) ob.observeArray(inserted)
    ob.dep.notify()  // notify change
    return result
  })
}

/**
 * Swap the element at the given index with a new value
 * and emits corresponding event.
 *
 * @param {Number} index
 * @param {*} value
 * @return {*} - replaced element
 */

function $set (index, value) {
  if (index >= this.length) {
    this.length = Number(index) + 1
  }
  return this.splice(index, 1, value)[0]
}
def(arrayPrototype, '$set', $set)

/**
 * Convenience method to remove the element at given index
 * or target element reference.
 *
 * @param {*} item
 */

function $remove (item) {
  /* istanbul ignore if */
  if (!this.length) return
  const index = this.indexOf(item)
  if (index > -1) {
    return this.splice(index, 1)
  }
}
def(arrayPrototype, '$remove', $remove)
