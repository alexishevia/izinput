# IZ Input

IZ Input lets you manually add transactions to "Invoice Zero" - the personal finance system.

## Getting Started

1. Install [Node.js](https://nodejs.org/) (v10.15.0 preferred)
2. Start the expo server with `npm install && npm start`.

### Running the app on your phone

1. Install the [Expo app](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en) on your phone.
2. Using the Expo app on your phone, scan the provided QR code and wait until the app is loaded.

### Running the app on a virtual android device

1. Install [Android Studio](https://developer.android.com/studio)
2. Open "AVD Manager" from `Android studio > Configure > AVD Manager`
3. Create and start a new Virtual Device
4. On the terminal tab where you started the expo server, type `a`. The expo server will then install Expo on the virtual device and start your app.

Note: to "shake" your android virtual device, press `Ctrl + m` (on Linux). You'll see the React Native dev menu pop up.

### Running the app on a virtual iOS device

1. Install [Xcode through the Apple App Store](https://apps.apple.com/app/xcode/id497799835)
2. Open a simulator from `Xcode -> Open Developer Tool -> Simulator`
3. On the terminal tab where you started the expo server, type `i`. The expo server will then install Expo on the virtual device and start your app.

### Debugging

Follow Expo's instructions for [Debugging Redux](https://docs.expo.io/versions/v33.0.0/workflow/debugging/#debugging-redux).

### Linting / Formatting Code

This project is configured to run [prettier](https://github.com/prettier/prettier) when you do a `git add` (using [husky](https://www.npmjs.com/package/husky) and [lint-staged](https://www.npmjs.com/package/lint-staged)), so you don't need to worry about formatting code.

However, we still use [eslint](https://eslint.org/) to capture syntax errors. The `.eslintrc.json` file is set to extend [eslint-config-prettier](https://www.npmjs.com/package/eslint-config-prettier), so eslint will only report on syntax errors instead of enforcing formatting.

Note:  
Some editors will fail to load eslint from a pacakage's subdirectory, and will
default to the global eslint - which might not have all the plugins you need.

If that happens, you'll need to manually specify the path to the correct `eslint`.

In my case, I had to create a local `.vimrc` file with:

```
let g:syntastic_javascript_eslint_exec='/path/to/izinput/node_modules/.bin/eslint'
```

## UI Library

IZ Input is using [React Native Paper](https://callstack.github.io/react-native-paper/) as the UI library.

## Publishing the app

I'm using the expo cli to publish the app.

More info: https://docs.expo.io/versions/v33.0.0/distribution/building-standalone-apps/

Whenever I want to push a new version of the app, I run `expo publish`.

Users will automatically receive the new version the next time they open the app.

Note: To generate the initial APK I had to run `expo build:android`.
