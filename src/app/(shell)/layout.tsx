import { AppShellLayout } from "@/components/layouts/AppShellLayout";

export default function ShellLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppShellLayout>{children}</AppShellLayout>;
}
