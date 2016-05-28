var path = require('path')

var config = {
  entry: {
    module: './demo/module/index.js',
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: '[name]/[name].js',
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel',
      },
    ],
  },
  babel: {
    presets: [ 'es2015' ],
  },
  devtool: 'eval',
  resolve: {
    alias: {
      'ob.js': path.resolve(__dirname, '../lib/index.js'),
    },
  },
}

module.exports = config
