const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  entry: "./src/app.ts",
  devtool: "source-map",
  output: {
    filename: "./bundle.js",
    clean: true,
  },
  resolve: {
    extensions: [".ts"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
      },
      {
        test: /\.(png|json|ttf|xhtml)$/i,
        type: "asset/resource",
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Output Management",
      template: "index.html",
    }),
  ],
  devServer: {
    https: true,
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    port: 9000,
  },
};
