/** @type{import("@storybook/react-native").StorybookConfig} */
module.exports = {
  // Look for stories in the src/components directory
  stories: ["../src/components/**/*.stories.?(ts|tsx|js|jsx)"],
  // deviceAddons is the v10+ replacement for the deprecated `addons` field
  deviceAddons: [
    "@storybook/addon-ondevice-controls",
    "@storybook/addon-ondevice-actions",
  ],
};
