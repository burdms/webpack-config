const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const mode = process.env.NODE_ENV;

const isDev = mode === 'development';

const generateFilename = (ext) =>
  isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;

module.exports = {
  entry: {
    main: './scripts/main.js',
  },
  output: {
    filename: `./scripts/${generateFilename('js')}`,
    path: path.resolve(__dirname, 'build'),
    clean: true,
    environment: {
      arrowFunction: false,
    },
  },
  mode,
  context: path.resolve(__dirname, 'src'),
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      minify: {
        collapseWhitespace: !isDev,
      },
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/resources'),
          to: path.resolve(__dirname, 'build'),
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: `./styles/${generateFilename('css')}`,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.(c|sa|sc)ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '/',
            },
          },
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.html$/i,
        use: {
          loader: 'html-loader',
        },
      },
      {
        test: /\.pug$/i,
        use: {
          loader: 'pug-loader',
          options: {
            pretty: true,
          }
        },
      },
    ],
  },
  devServer: {
    contentBase: './build',
    open: true,
    port: 3000,
    hot: true,
    compress: true,
    overlay: true,
    writeToDisk: false,
    historyApiFallback: true,
  },
  devtool: isDev && 'source-map',
};
