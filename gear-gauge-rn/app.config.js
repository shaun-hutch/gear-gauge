// Dynamically sets storybookEnabled extra from the STORYBOOK_ENABLED env var.
// All static config lives in app.json — this file only adds dynamic extras.
export default ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    storybookEnabled: process.env.STORYBOOK_ENABLED || null,
  },
});
