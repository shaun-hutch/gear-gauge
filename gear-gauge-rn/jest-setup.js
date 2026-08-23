/**
 * Jest setup that runs after the test framework is installed, but before each
 * test suite. Reanimated (and its Worklets engine) are native libraries, so
 * they need to be mocked to run in Jest's Node.js environment.
 *
 * - Worklets provides an official Jest mock that no-ops its native bindings.
 * - Reanimated's `setUpTests()` registers the `toHaveAnimatedStyle` /
 *   `toHaveAnimatedProps` matchers used when asserting on animated values.
 */

jest.mock("react-native-worklets", () =>
  require("react-native-worklets/src/mock"),
);

require("react-native-reanimated").setUpTests();
