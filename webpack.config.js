const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

const ENV = {
  PRODUCTION: 'production',
  DEVELOPMENT: 'development',
};

const SRC_PATH = path.resolve(__dirname, './src');
const DIST_PATH = path.resolve(__dirname, './dist');

const environment = process.env.NODE_ENV === 'production' ? ENV.PRODUCTION : ENV.DEVELOPMENT;

const getRules = () => [{
  test: /\.vue$/,
  loader: 'vue-loader',
  options: {
    loaders: {
      css: ExtractTextPlugin.extract({
        use: 'css-loader',
        fallback: 'vue-style-loader',
      }),
    },
  },
}, {
  test: /\.css$/,
  use: ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: 'css-loader',
  }),
}, {
  test: /\.js$/,
  loader: 'babel-loader',
  query: {
    presets: ['es2015']
  },
  include: [
    path.resolve(__dirname, '../')
  ],
  exclude: /node_modules/
}, {
  test: /\.json?$/,
  exclude: [/node_modules/],
  use: [{
    loader: 'json-loader',
  }],
}, {
  test: /\.(jpe?g|png|gif|svg)$/i,
  use: [{
    loader: 'url-loader',
    options: {
      limit: 10000,
    },
  }],
}, {
  test: /\.(jpg|jpeg|png)?$/,
  exclude: [/node_modules/],
  use: [{
    loader: 'file-loader?name=[path][name].[hash].[ext]',
  }],
}, {
  test: /\.scss$/,
  exclude: [/node_modules/],
  loader: ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: [
      'css-loader', {
        loader: 'postcss-loader',
        options: {
          plugins() {
            return [autoprefixer];
          },
        },
      },
      'sass-loader',
    ],
  }),
},
];

const getPlugins = () => {
  const plugins = [
    new HtmlWebpackPlugin({
      title: 'Custom template',
      template: 'index.ejs',
    }),

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: `"${environment}"`,
      },
    }),

    new ExtractTextPlugin({
      filename: '[name].bundle.css',
      disable: environment === ENV.DEVELOPMENT,
    }),
    new webpack.ProvidePlugin({ // inject ES5 modules as global vars
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Tether: 'tether',
    }),
  ];

  return plugins;
};

const webpackConfig = {
  context: SRC_PATH,
  entry: {
    app: ['./app.js'],
  },
  devtool: 'source-map',
  output: {
    publicPath: '/',
    path: DIST_PATH,
    filename: '[name].[hash].bundle.js',
  },
  resolve: {
    extensions: ['.webpack.js', '.vue', '.js'],
    alias: {
      common: './src/common',
      vue$: 'vue/dist/vue.js',
    },
  },
  module: {
    rules: getRules(),
  },
  plugins: getPlugins(),
};

module.exports = webpackConfig;