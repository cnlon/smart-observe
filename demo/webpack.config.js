var path = require('path')

var config = {
  entry: {
    module: './demo/module/index.js',
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: '[name]/[name].js',
  },
  devtool: 'eval',
  resolve: {
    alias: {
      'ob.js': path.resolve(__dirname, '../dist/ob.js'),
    },
  },
}

module.exports = config
