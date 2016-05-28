const ob = require('./ob.js')

/* eslint-disable no-undef */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ob
} else if (typeof define === 'function' && define.amd) {
  define(ob)
} else if (window) {
  var key = window.ob ? 'ob.js' : 'ob'
  window[key] = ob
}
/* eslint-enable no-undef */
