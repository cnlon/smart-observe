import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'

const needMin = !!process.env.MIN
let dest = 'dist/smart-observe.js'
const plugins = [
  resolve({
    jsnext: true,
    browser: true,
  }),
  commonjs(),
  babel({
    presets: ['es2015-rollup'],
    plugins: ['transform-class-properties'],
  }),
]
if (needMin) {
  dest = 'dist/smart-observe.min.js'
  plugins.push(uglify())
}

export default {
  entry: 'src/index.js',
  format: 'umd',
  moduleId: 'observe',
  moduleName: 'observe',
  dest,
  plugins,
  banner:
`/**
 * smart-observe --- By lon
 * https://github.com/cnlon/smart-observe
 */`,
}
