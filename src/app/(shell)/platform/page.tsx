import { redirect } from "next/navigation";
import { ROUTES } from "@/config/routes";

/** Redirige ruta legacy al dominio del configurador. */
export default function PlatformPage() {
  redirect(ROUTES.configurator);
}
