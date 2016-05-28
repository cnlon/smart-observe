'use strict';

var ob = require('./ob.js')

/* eslint-disable no-new-func, no-undef */
;(function (win) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ob;
  } else if (typeof define === 'function' && define.amd) {
    define(ob);
  } else {
    win.observe = ob;
  }
})(Function('return this')());
/* eslint-enable no-new-func, no-undef */
//# sourceMappingURL=index.js.map