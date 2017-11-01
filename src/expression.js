import {warn} from './util'

/**
 * Build a getter function. Requires eval.
 *
 * We isolate the try/catch so it doesn't affect the
 * optimization of the parse function when it is not called.
 *
 * @param {string} body
 * @return {function|undefined}
 */

function makeGetterFunction (body) {
  try {
    /* eslint-disable no-new-func */
    return new Function('scope', `return ${body};`)
    /* eslint-enable no-new-func */
  } catch (e) {
    warn('Invalid expression. Generated function body: ' + body)
  }
}

/**
 * Parse an expression to getter.
 *
 * @param {string} expression
 * @return {function|undefined}
 */

export default function parse (expression) {
  expression = String.prototype.trim.call(expression)
  return makeGetterFunction('scope.' + expression)
}
