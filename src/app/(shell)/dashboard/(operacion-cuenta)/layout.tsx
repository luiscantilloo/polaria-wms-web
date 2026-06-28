import { OperadorCuentaBreadcrumb } from "@/modules/dashboard";

export default function OperacionCuentaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-1 flex-col">
      <OperadorCuentaBreadcrumb />
      {children}
    </div>
  );
}
