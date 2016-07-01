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
  format: 'umd',
  moduleId: 'ob',
  moduleName: 'ob',
  dest,
  plugins,
  banner:
`/**
 * ob.js --- By longhao http://longhaohe.com
 * Github: https://github.com/lon3/ob.js
 * MIT Licensed.
 */`,
}
