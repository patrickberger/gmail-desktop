const HtmlWebpackPlugin = require('html-webpack-plugin'),
      webpack = require('webpack'),
      path = require('path');

module.exports = {

  module: {
    rules: [
      {
        test: /\.ts$/,
        enforce: 'pre',
        loader: 'tslint-loader',
        options: {
          typeCheck: true,
          emitErrors: true
        }
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ // 
      title: "Gmail Desktop",
      template: "src/renderer/index.ejs",
      hash: true
    }),
  ]

}