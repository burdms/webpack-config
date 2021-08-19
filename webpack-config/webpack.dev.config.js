const { merge } = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.config');

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  devServer: {
    contentBase: baseWebpackConfig.externals.paths.build,
    open: true,
    port: 3000,
    // hot: true,
    compress: true,
    overlay: true,
    writeToDisk: false,
    historyApiFallback: true,
  },
  devtool: 'source-map',
});

module.exports = new Promise((resolve, reject) => {
  resolve(devWebpackConfig);
});
