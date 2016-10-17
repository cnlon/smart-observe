import Dep from './dep'
import parseExpression from './expression'
import batch from './batcher'
import {
  isArray,
  isObject,
  isFunction,
} from './utils'
import {WATCHERS_PROPERTY_NAME} from './constants'

let uid = 0

class Watcher {

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

  constructor (owner, getter, callback, options) {
    owner[WATCHERS_PROPERTY_NAME].push(this)
    this.owner = owner
    this.getter = getter
    this.callback = callback
    this.options = options
    // uid for batching
    this.id = ++uid
    this.active = true
    // for lazy watchers
    this.dirty = options.lazy
    this.deps = []
    this.newDeps = []
    this.depIds = Object.create(null)
    this.newDepIds = null
    this.value = options.lazy
      ? undefined
      : this.get()
  }

  /**
   * Evaluate the getter, and re-collect dependencies.
   */

  get () {
    this.beforeGet()
    const scope = this.owner
    const value = this.getter.call(scope, scope)
    if (this.options.deep) {
      traverse(value)
    }
    this.afterGet()
    return value
  }

  /**
   * Prepare for dependency collection.
   */

  beforeGet () {
    Dep.target = this
    this.newDepIds = Object.create(null)
    this.newDeps.length = 0
  }

  /**
   * Add a dependency to this directive.
   *
   * @param {Dep} dep
   */

  addDep (dep) {
    const id = dep.id
    if (!this.newDepIds[id]) {
      this.newDepIds[id] = true
      this.newDeps.push(dep)
      if (!this.depIds[id]) {
        dep.addSub(this)
      }
    }
  }

  /**
   * Clean up for dependency collection.
   */

  afterGet () {
    Dep.target = null
    let i = this.deps.length
    while (i--) {
      const dep = this.deps[i]
      if (!this.newDepIds[dep.id]) {
        dep.removeSub(this)
      }
    }
    this.depIds = this.newDepIds
    /* eslint-disable no-unexpected-multiline, no-sequences */
    [this.deps, this.newDeps] = [this.newDeps, this.deps]
    /* eslint-enable no-unexpected-multiline, no-sequences */
  }

  /**
   * Will be called when a dependency changes.
   */

  update () {
    if (this.options.lazy) {
      this.dirty = true
    } else if (this.options.sync) {
      this.run()
    } else {
      batch(this)
    }
  }

  /**
   * Will be called by the batcher.
   */

  run () {
    if (this.active) {
      const value = this.get()
      if (
        value !== this.value
        // Deep watchers and watchers on Object/Arrays should fire even when
        // the value is the same, because the value may have mutated;
        || ((isObject(value) || this.options.deep))
      ) {
        const oldValue = this.value
        this.value = value
        this.callback.call(this.owner, value, oldValue)
      }
    }
  }

  /**
   * Evaluate the value of the watcher.
   * This only gets called for lazy watchers.
   */

  evaluate () {
    // avoid overwriting another watcher that is being collected.
    const current = Dep.target
    this.value = this.get()
    this.dirty = false
    Dep.target = current
  }

  /**
   * Depend on all deps collected by this watcher.
   */

  depend () {
    let i = this.deps.length
    while (i--) {
      this.deps[i].depend()
    }
  }

  /**
   * Remove self from all dependencies' subcriber list.
   */

  teardown () {
    if (this.active) {
      let i = this.deps.length
      while (i--) {
        this.deps[i].removeSub(this)
      }
      this.active = false
      this.owner = this.callback = this.value = null
    }
  }
}

/**
 * Recrusively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 *
 * @param {*} value
 */

function traverse (value) {
  let i, keys
  if (isArray(value)) {
    i = value.length
    while (i--) traverse(value[i])
  } else if (isObject(value)) {
    keys = Object.keys(value)
    i = keys.length
    while (i--) traverse(value[keys[i]])
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

export function watch (owner, expressionOrFunction, callback, options) {
  // parse expression for getter
  const getter = isFunction(expressionOrFunction)
               ? expressionOrFunction
               : parseExpression(expressionOrFunction)
  return new Watcher(owner, getter, callback, options)
}

/**
 * Make a computed getter, which can collect dependencies.
 *
 * @param {Object} owner
 * @param {Function} getter
 */

export function makeComputed (owner, getter) {
  const watcher = new Watcher(owner, getter, null, {lazy: true})
  return function computedGetter () {
    if (watcher.dirty) {
      watcher.evaluate()
    }
    if (Dep.target) {
      watcher.depend()
    }
    return watcher.value
  }
}
