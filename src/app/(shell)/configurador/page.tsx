"use client";

import {
  ConfiguratorPanelConnected,
  type ConfiguratorActionId,
} from "@/modules/configurator";
import { PlatformScopeGuard } from "@/components/auth/PlatformScopeGuard";

function handleActionClick(_actionId: ConfiguratorActionId) {
  // TODO: navegar a sub-rutas del configurador según actionId
}

export default function ConfiguradorPage() {
  return (
    <PlatformScopeGuard>
      <ConfiguratorPanelConnected onActionClick={handleActionClick} />
    </PlatformScopeGuard>
  );
}
