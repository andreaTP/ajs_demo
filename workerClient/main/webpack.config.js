module.exports = {
  entry: './main.js',
  output: {
    filename: '../main-out.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
      }
    ]
  }
}
