const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.js",
  optimization: {
    minimize: true
  },
  target: "webworker",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "bin"),
    libraryTarget: "this",
  },
  module: {
    rules: [
      {
        test: /\.(txt|html)/,
        type: "asset/source",
      },
      {
        test: /\.ya?ml$/,
        use: 'yaml-loader',
        type: 'json'
      }
    ],
  },
  resolve: {
    fallback: {
      util: require.resolve("core-js/"),
      url: require.resolve("core-js/"),
      fs: require.resolve("core-js/"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      buffer: require.resolve('buffer'),
      process: require.resolve("process"),      
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      URL: "core-js/web/url",
      process: 'process/browser',
    }),
  ],
};
