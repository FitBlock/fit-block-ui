const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  // devtool: 'source-map',
  mode: 'development',
  entry: './ui/default/static/src/app.js',
  output: {
    path: path.join(__dirname, 'build/ui/default/static/'),
    filename: 'webpack.bundle.js'
  },
  resolve: {
      alias: {
          '@': path.join(__dirname, 'ui/default/static/src'),
      }
  },
  plugins: [
    new HtmlWebpackPlugin({template: './ui/default/static/index.html'})
  ],
  module: {
    rules: [{
      test: /\.html$/,
      use: [ {
        loader: 'html-loader',
      }],
    }]
  }
};