import { ClipboardList, Layers, UserCheck } from "lucide-react";
import { POLARIA_BRAND } from "@/constants/brand";
import type { ConfiguratorAction } from "../types/configurator.types";

export const CONFIGURATOR_BRAND = POLARIA_BRAND;

export const CONFIGURATOR_ACTIONS: ConfiguratorAction[] = [
  {
    id: "creation",
    title: "Creación",
    description: "Crea y gestiona configuraciones",
    icon: Layers,
  },
  {
    id: "creation-assignment",
    title: "Creación y asignación",
    description: "Crea recursos y asígnalos a usuarios",
    icon: UserCheck,
  },
  {
    id: "integration",
    title: "Integración",
    description: "Gestiona integraciones externas",
    icon: ClipboardList,
  },
] as const;

export const CONFIGURATOR_PANEL_TITLE = "Panel del Configurador" as const;

export const CONFIGURATOR_PANEL_SUBTITLE =
  "Selecciona una acción para comenzar" as const;
