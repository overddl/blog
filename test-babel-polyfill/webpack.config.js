const path = require('path');

module.exports = {
  entry: {
    "app": path.resolve('./index.js')
  },
  mode: "development",
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      loader: "babel-loader",
    }]
  },
  output: {
    path: __dirname,
    filename: "./dist/bunder.js"
  }
}