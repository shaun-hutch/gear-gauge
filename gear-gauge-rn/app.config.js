// Dynamically sets extras from env vars. All static config lives in app.json —
// this file only adds dynamic extras.
//
// - STORYBOOK_ENABLED → renders the Storybook UI instead of the app.
// - SEED_DB           → populates the SQLite DB with demo gear on launch
//                       (dev-only mock data).
export default ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    storybookEnabled: process.env.STORYBOOK_ENABLED || null,
    seedDb: process.env.SEED_DB || null,
  },
});
