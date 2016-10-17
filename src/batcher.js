let queue = []
let has = {}
let waiting = false
let queueIndex

/**
 * Reset the batcher's state.
 */

function resetBatcherState () {
  queue = []
  has = {}
  waiting = false
}

/**
 * Flush queue and run the watchers.
 */

function flushBatcherQueue () {
  runBatcherQueue(queue)
  resetBatcherState()
}

/**
 * Run the watchers in a single queue.
 *
 * @param {Array} queue
 */

function runBatcherQueue (queue) {
  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (queueIndex = 0; queueIndex < queue.length; queueIndex++) {
    const watcher = queue[queueIndex]
    const id = watcher.id
    has[id] = null
    watcher.run()
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

const nextTick = (function () {
  let callbacks = []
  let pending = false
  let timerFunction
  function nextTickHandler () {
    pending = false
    const callbackCopies = callbacks.slice(0)
    callbacks = []
    for (let i = 0; i < callbackCopies.length; i++) {
      callbackCopies[i]()
    }
  }

  /* istanbul ignore if */
  if (typeof MutationObserver !== 'undefined') {
    let counter = 1
    /* global MutationObserver */
    const observer = new MutationObserver(nextTickHandler)
    /* global */
    const textNode = document.createTextNode(counter)
    observer.observe(textNode, {characterData: true})
    timerFunction = function () {
      counter = (counter + 1) % 2
      textNode.data = counter
    }
  } else {
    // webpack attempts to inject a shim for setImmediate
    // if it is used as a global, so we have to work around that to
    // avoid bundling unnecessary code.
    const inBrowser = typeof window !== 'undefined'
      && Object.prototype.toString.call(window) !== '[object Object]'
    const context =
      inBrowser ? window : typeof global !== 'undefined' ? global : {}
    timerFunction = context.setImmediate || setTimeout
  }
  return function (callback, context) {
    const fun = context ? function () { callback.call(context) } : callback
    callbacks.push(fun)
    if (pending) return
    pending = true
    timerFunction(nextTickHandler, 0)
  }
})()

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

export default function batch (watcher) {
  const id = watcher.id
  if (has[id] == null) {
    has[id] = queue.length
    queue.push(watcher)
    // queue the flush
    if (!waiting) {
      waiting = true
      nextTick(flushBatcherQueue)
    }
  }
}
