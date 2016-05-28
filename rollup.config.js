import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'

const needMin = !!process.env.MIN
var dest = 'dist/ob.js'
var plugins = [
  babel({
    presets: [ 'es2015-rollup' ],
  }),
]
if (needMin) {
  dest = 'dist/ob.min.js'
  plugins.push(uglify())
}

export default {
  entry: 'src/ob.js',
  format: 'cjs',
  dest,
  plugins,
  outro:
`
if (typeof module !== 'undefined' && module.exports) {`,
  footer:
`
} else if (typeof define === 'function' && define.amd) {
  define(ob)
} else if (window) {
  var key = window.ob ? 'ob.js' : 'ob'
  window[key] = ob
}`,
}
