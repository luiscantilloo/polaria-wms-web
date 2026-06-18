"use client";

import type {
  ConfiguratorActionId,
  ConfiguratorPanelProps,
} from "../types/configurator.types";
import { ConfiguratorActionsGrid } from "./ConfiguratorActionsGrid";
import { ConfiguratorHeader } from "./ConfiguratorHeader";

export function ConfiguratorPanel({ onActionClick }: ConfiguratorPanelProps) {
  return (
    <main className="flex flex-1 flex-col justify-start gap-8 pt-8 pb-10 sm:gap-10 sm:pt-12 sm:pb-14 lg:gap-12 lg:pt-16 lg:pb-20">
      <ConfiguratorHeader />
      <ConfiguratorActionsGrid onActionClick={onActionClick} />
    </main>
  );
}

interface ConfiguratorPanelConnectedProps {
  onActionClick?: (actionId: ConfiguratorActionId) => void;
}

export function ConfiguratorPanelConnected({
  onActionClick,
}: ConfiguratorPanelConnectedProps) {
  return <ConfiguratorPanel onActionClick={onActionClick} />;
}
