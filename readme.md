# Initial steps

## Install

Follow the [Webpack getting started guide](https://webpack.js.org/guides/getting-started/) and the [Typescript basis setup](https://webpack.js.org/guides/typescript/):

- `npm init -y`: create package.json
- `npm install --save-dev webpack webpack-cli`: install webpack
- `npm install --save-dev typescript ts-loader`: install typescript
- `npm install --save-dev @types/chrome`: let typescript know about the chrome types
- `npm install --save-dev @types/dom-mediacapture-record`: let typescript know about the MediaRecorder
- `npm install --save-dev copy-webpack-plugin`: to be able to configure copy actions in `webpack.config.json` for files like `manifest.json`, images, ... assets to de `dist` folder

Add `.gitignore`.

Create folder structure in `src` folder.

## Config

- update `package.json`
  - remove `"main": "index.js",` (not applicable for a chrome extension)
  - add `"build": "webpack"` to `scripts`
- update `webpack.config.js`:

  ```
  devtool: 'source-map',

  entry: {
    content: './src/app/content.ts',
    background: './src/app/background.ts',
    popup: './src/app/popup.ts',
  },

  output: {
    path: path.resolve(__dirname, 'dist/js'),
    filename: '[name].js'
  },
  ```

- update `tsconfig.js`

  ```
  "compilerOptions"{
    "alwaysStrict": true,
  },

  "include": [
    "src/**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
  ```

## Troubleshooting

- `npm run build` did not do anything, however `npx webpack` worked. Not feeling like enabling scripts globally (`npm config set ignore-scripts false`), I added an `.npmrc` config to the project.
- The background service worker `background.js` _must_ be in the root directory of the plugin, or the extension will fail to load.
- Because the `captureStream` is still in draft, it was not available on the interface of `HTMLMediaElement`. Instead of creating a new interface that extends, this can be fixed thanks to typescript's interface merging capabilities and augmenting the global scope (see `interfaces.ts`).
