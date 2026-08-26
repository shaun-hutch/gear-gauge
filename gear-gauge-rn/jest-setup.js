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

// expo-crypto is a native module — mock `randomUUID` so model factories
// (e.g. createGear) can run in Jest's Node.js environment. The counter keeps
// generated ids unique within a test run.
jest.mock("expo-crypto", () => {
  let uuidCounter = 0;
  return {
    randomUUID: jest.fn(() =>
      `00000000-0000-4000-8000-${String(uuidCounter++).padStart(12, "0")}`,
    ),
  };
});
