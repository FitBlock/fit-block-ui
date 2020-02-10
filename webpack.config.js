const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: './ui/default/static/app.js',
  output: {
    path: path.join(__dirname, 'build/ui/default/static/'),
    filename: 'webpack.bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({template: './ui/default/static/index.html'})
  ]
};