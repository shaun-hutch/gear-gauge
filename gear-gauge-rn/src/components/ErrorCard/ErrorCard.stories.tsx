import { ErrorCard } from "./ErrorCard";

export default {
  title: "Components/ErrorCard",
  component: ErrorCard,
};

/** Default — a short error message. */
export const Default = () => <ErrorCard message="Failed to load gear" />;

/** Long message — verifies wrapping and layout. */
export const LongMessage = () => (
  <ErrorCard message="Unable to sync your gear with HealthKit. Please check your permissions and try again." />
);
