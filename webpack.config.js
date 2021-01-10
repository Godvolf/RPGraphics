const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = function(_env, argv) {

  return {
    mode: 'development',
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "assets/js/[name].[contenthash:8].js",
      publicPath: "/"
    },
    devServer: {
      port: 3000,
      hot: true,
      clientLogLevel: 'silent',
      host: 'localhost',
      historyApiFallback: true
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          }
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"]
        }
      ]},
      plugins: [
        new HtmlWebpackPlugin({
          template: path.resolve(__dirname, "public", "index.html")
        })
      ],
    resolve: {
      extensions: [".js", ".jsx"]
    }
  };
};
