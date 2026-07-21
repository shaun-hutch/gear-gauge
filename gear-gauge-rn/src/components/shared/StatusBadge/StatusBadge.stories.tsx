import { Status, StatusBadge } from "./StatusBadge";

export default {
  title: "Components/StatusBadge",
  component: StatusBadge,
};

export const Default = () => (
  <>
    <StatusBadge status={Status.Info} />
    <StatusBadge status={Status.Success} />
    <StatusBadge status={Status.Warning} />
    <StatusBadge status={Status.Error} />
  </>
)