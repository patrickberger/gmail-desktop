const pkg = require(__dirname + '/package.json');
const webpack = require('webpack');

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
    new webpack.DefinePlugin({
      'APP_VERSION': JSON.stringify(pkg.version),
      'APP_HOMEPAGE': JSON.stringify(pkg.homepage),
      'APP_PRODUCTNAME': JSON.stringify(pkg.productName)
    })
  ]

}