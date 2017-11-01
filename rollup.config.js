import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'

const needMin = !!process.env.MIN
let file = 'dist/smart-observe.js'
const plugins = [
  resolve({
    jsnext: true,
    browser: true,
  }),
  babel({
    presets: [
      ['env', {
        targets: {
          browsers: ['last 3 versions', 'IE >= 9'],
          node: '4'
        },
        modules: false
      }]
    ],
    plugins: [
      'transform-class-properties',
      'external-helpers'
    ],
  })
]
if (needMin) {
  file = 'dist/smart-observe.min.js'
  plugins.push(uglify())
}

export default {
  input: 'src/index.js',
  output: {
    file,
    format: 'umd',
    name: 'observe',
    banner:
    `/**
     * smart-observe --- By lon
     * https://github.com/cnlon/smart-observe
     */`,
  },
  plugins,
}
