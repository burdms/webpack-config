const path = require('path');
const fs = require('fs');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

const mode = process.env.NODE_ENV;

const isDev = mode === 'development';

const PATHS = {
  src: path.join(__dirname, '../src'),
  build: path.join(__dirname, '../build'),
  assets: 'assets',
};

const PAGES_DIR = `${PATHS.src}/pug/pages`;
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.pug'));


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
    filename: `${PATHS.assets}/scripts/${generateFilename('js')}`,
    path: PATHS.build,
    publicPath: '/',
    clean: true,
    environment: {
      arrowFunction: false,
    },
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendors',
          test: /node_modules/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  target: isDev ? 'web' : 'browserslist',
  mode,
  context: PATHS.src,
  resolve: {
    alias: {
      '~': 'src',
    },
  },
  plugins: [
    ...PAGES.map(page => new HtmlWebpackPlugin({
      template: `${PAGES_DIR}/${page}`,
      filename: `./${page.replace(/\.pug/, '.html')}`,
    })),
    new CopyPlugin({
      patterns: [
        {
          from: `${PATHS.src}/static`,
          to: PATHS.build,
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: `${PATHS.assets}/styles/${generateFilename('css')}`,
    }),
    // new ImageMinimizerPlugin({
    //   minimizerOptions: {
    //     plugins: [
    //       ["gifsicle", { interlaced: true }],
    //       ["jpegtran", { progressive: true }],
    //       ["optipng", { optimizationLevel: 5 }],
    //     ],
    //   },
    // }),
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
        test: /\.pug$/i,
        use: {
          loader: 'pug-loader',
        },
      },
      {
        test: /\.(?:gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
        generator: {
          filename: `${PATHS.assets}/images/[hash][ext][query]`,
        },
      },
      {
        test: /\.svg$/,
        type: 'asset/inline',
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|)$/,
        type: 'asset/resource',
        generator: {
          filename: `${PATHS.assets}/fonts/[hash][ext][query]`,
        },
      },
    ],
  },
};
