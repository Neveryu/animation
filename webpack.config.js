const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: "development",
  entry: {
    animation: './src/animation.js'
  },
  plugins: [
    new CleanWebpackPlugin(['build'])
  ],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: "[name].js",
    library: 'animation',
    libraryTarget: 'umd'
  }
}