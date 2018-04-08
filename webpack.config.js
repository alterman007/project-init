const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    main: path.join(__dirname, 'src/index.js'),
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[hash:5].js',
    publicPath: 'public/',
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        use: 'babel-loader',
      },
      {
        test: /\.styl$/,
        use: [
          'style-loader',
          'css-loader',
          'stylus-loader',
        ],
      }
    ],
  },
  plugins: [
    new HTMLWebpackPlugin(),
  ],
  devtool: 'source-map',
  devServer: {
    host: '0.0.0.0',
    port: '8888',
    overlay: {
      errors: true,
    },
    publicPath: '/public/',
    contentBase: path.join(__dirname, 'dist'),
    historyApiFallback: {
      index: '/public/index.html',
    },
  },
};
