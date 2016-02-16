'use strict';
const path = require('path');
const webpack = require('webpack');
module.exports = {
  devtool: 'source-map',
  entry: {
    index: [
      './src/index.jsx'
    ],
    demo: [
      './src/demo.jsx'
    ]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/'
  },
  resolve: {
    modulesDirectories: ['node_modules', './src'],
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  ],
  postcss: [require('autoprefixer')],
  module: {
    loaders: [{
      test: /\.jsx?/,
      loaders: ['babel']
    }, {
      test: /\.less/,
      loaders: ['style', 'css', 'postcss', 'less']
    }, {
      test: /\.css$/,
      loaders: ['style', 'css', 'postcss']
    }]
  }
};
