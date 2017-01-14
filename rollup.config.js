import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'

const needMin = !!process.env.MIN
let dest = 'dist/ob.js'
const plugins = [
  babel({
    presets: ['es2015-rollup'],
    plugins: ['transform-class-properties'],
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
 * ob.js --- By lon
 * https://github.com/cnlon/ob.js
 */`,
}
