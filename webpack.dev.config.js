const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'),
    publicPath: '',
  },
  mode: 'development',
  devServer: {
    port: 9000, // порт на котором запускается сервер
    static: {
      directory: path.resolve(__dirname, './dist'), // где отслеживать
    },
    open: {
      app: {
        name: 'chrome',
      },
    },
    devMiddleware: {
      index: 'index.html', // файл, который будет использоваться как индекс-файл
      writeToDisk: false, // по умолчанию Webpack работает с файлами из памяти, но лучше видеть эти файлы
    },
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(png|jpg)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 3 * 1024, // 3 kilobytes
          },
        },
      },
      {
        test: /\.txt/,
        type: 'asset/source',
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, 'css-loader',
        ],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader',
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'style.css', // можно указать имя файла, который будет генерироваться
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        '**/*',
      ],
    }),
    new HtmlWebpackPlugin({
      title: 'Virtual keyboard',
      filename: 'index.html',
      meta: {
        description: 'some page description',
      },
      template: 'src/index.html',
    }),
  ],
};
