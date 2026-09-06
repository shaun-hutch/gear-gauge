// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const { FlatCompat } = require('@eslint/eslintrc');
const expoConfig = require("eslint-config-expo/flat");

// The a11y plugin ships a legacy (eslintrc-style) config, so FlatCompat is used
// to translate `plugin:react-native-a11y/ios` into ESLint 9 flat-config format.
// The `ios` preset enables the accessibility rules relevant to the iOS-first app.
const compat = new FlatCompat({ baseDirectory: __dirname });

module.exports = defineConfig([
  expoConfig,
  ...compat.extends("plugin:react-native-a11y/ios"),
  {
    ignores: ["dist/*"],
  }
]);
