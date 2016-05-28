import { warn } from './utils'

/**
 * Build a getter function. Requires eval.
 *
 * We isolate the try/catch so it doesn't affect the
 * optimization of the parse function when it is not called.
 *
 * @param {String} body
 * @return {Function|undefined}
 */

function makeGetterFn (body) {
  try {
    /* eslint-disable no-new-func */
    return new Function('scope', 'return ' + body + ';')
    /* eslint-enable no-new-func */
  } catch (e) {
    warn(
      'Invalid expression. ' +
      'Generated function body: ' + body
    )
  }
}

/**
 * Parse an expression to getter.
 *
 * @param {String} exp
 * @return {Function}
 */

export default function parse (exp) {
  exp = exp.trim()
  var getter = makeGetterFn('scope.' + exp)
  return getter
}
