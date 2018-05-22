module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    publicPath: '/lobby'
  },
  devServer: {
    historyApiFallback: true,
  }
}