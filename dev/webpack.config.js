var path = require('path')

var config = {
  entry: {
    app: './dev/index.js',
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'dev.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
      },
    ],
  },
  babel: {
    presets: ['es2015'],
    plugins: ['transform-class-properties'],
  },
  devtool: 'eval',
  resolve: {
    alias: {
      'ob.js': path.resolve(__dirname, '../src/index.js'),
    },
  },
}

module.exports = config
