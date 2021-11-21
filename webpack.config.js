const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

// copy package.json version to manifest.json

function updateVersion(buffer) {
  const package = require('./package.json');
  const manifest = JSON.parse(buffer.toString());
  manifest.version = package.version;
  return JSON.stringify(manifest, null, 2); // formatted json
}

module.exports = {
  devtool: 'source-map',
  // optimization: {
  //   minimize: false,
  // },

  entry: {
    content: './src/app/content/content.ts',
    background: './src/app/background/background.ts',
    popup: './src/app/popup/popup.ts',
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },

  resolve: {
    extensions: ['.ts', '.js'],
  },

  module: {
    rules: [
      { test: /\.ts$/, use: 'ts-loader', exclude: /node_modules/ },
      // { test: /\.tsx?$/, loader: "ts-loader" },
      // { test: /\.css$/, use: ['style-loader', 'css-loader'] }
    ],
  },

  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: './src/manifest.json',
          to: './manifest.json',
          transform: (content, path) => updateVersion(content),
        },
        { from: './src/popup.html', to: './popup.html' },
        { from: './src/images', to: './images' },
        { from: './src/css', to: './css' },
      ],
    }),
  ],
};
