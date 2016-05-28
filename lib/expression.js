'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseExpression;

var _util = require('./util');

/**
 * Build a getter function. Requires eval.
 *
 * We isolate the try/catch so it doesn't affect the
 * optimization of the parse function when it is not called.
 *
 * @param {String} body
 * @return {Function|undefined}
 */

function makeGetterFn(body) {
  try {
    /* eslint-disable no-new-func */
    return new Function('scope', 'return ' + body + ';');
    /* eslint-enable no-new-func */
  } catch (e) {
    (0, _util.warn)('Invalid expression. ' + 'Generated function body: ' + body);
  }
}

/**
 * Parse an expression into re-written getter/setters.
 *
 * @param {String} exp
 * @param {Boolean} needSet
 * @return {Function}
 */

function parseExpression(exp) {
  exp = exp.trim();
  var get = makeGetterFn('scope.' + exp);
  return { exp: exp, get: get };
}
//# sourceMappingURL=expression.js.map