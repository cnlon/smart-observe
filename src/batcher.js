import nextTick from 'smart-next-tick'

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
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 *
 * @param {Watcher} watcher
 *   properties:
 *   - {number} id
 *   - {function} run
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
