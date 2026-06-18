import type { LucideIcon } from "lucide-react";

export type ConfiguratorActionId =
  | "creation"
  | "creation-assignment"
  | "integration";

export interface ConfiguratorAction {
  id: ConfiguratorActionId;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface ConfiguratorPanelProps {
  onActionClick?: (actionId: ConfiguratorActionId) => void;
}
