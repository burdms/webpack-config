const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const mode = process.env.NODE_ENV;

const isDev = mode === 'development';

const PATHS = {
  src: path.join(__dirname, '../src'),
  build: path.join(__dirname, '../build'),
};

const generateFilename = (ext) =>
  isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;

module.exports = {
  externals: {
    paths: PATHS,
  },
  entry: {
    main: `${PATHS.src}/index.js`,
  },
  output: {
    filename: `scripts/${generateFilename('js')}`,
    path: PATHS.build,
    clean: true,
    environment: {
      arrowFunction: false,
    },
    assetModuleFilename: 'images/[hash][ext][query]',
  },
  target: isDev ? 'web' : 'browserslist',
  mode,
  context: PATHS.src,
  plugins: [
    new HtmlWebpackPlugin({
      template: `${PATHS.src}/index.html`,
      minify: {
        collapseWhitespace: !isDev,
      },
    }),
    new CopyPlugin({
      patterns: [
        {
          from: `${PATHS.src}/resources`,
          to: PATHS.build,
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: `styles/${generateFilename('css')}`,
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
          {
            loader: 'postcss-loader',
            options: {
              'postcssOptions': {
                'config': path.resolve(__dirname, '../postcss.config.js'),
              },
            }
          },
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
        test: /\.(?:gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.svg$/,
        type: 'asset/inline',
      },
    ],
  },
};
