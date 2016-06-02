/**
 * ob.js --- By longhao http://longhaohe.com
 * Github: https://github.com/longhaohe/ob.js
 * MIT Licensed.
 */

import ob from './ob.js'

/* eslint-disable no-undef, no-new-func */
;(function (win) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ob
  } else if (typeof define === 'function' && define.amd) {
    define(ob)
  } else if (win) {
    var key =
      typeof win.ob === 'undefined'
        ? 'ob'
        : 'ob.js'
    win[key] = ob
  }
})(Function('return this')())
/* eslint-enable no-undef, no-new-func */
