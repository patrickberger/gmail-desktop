const CopyWebpackPlugin = require('copy-webpack-plugin');
const staticsFolder = require('path').resolve(__dirname, 'static');

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
    new CopyWebpackPlugin([
      { from: 'build/icons/*', to: staticsFolder, flatten: true },
      { from: 'src/static/*', to: staticsFolder, flatten: true },
      { from: 'node_modules/jquery/dist/jquery.min.*', to: staticsFolder, flatten: true },
      { from: 'node_modules/gmail-js/src/gmail.js', to: staticsFolder, flatten: true }
    ])
  ]
}
