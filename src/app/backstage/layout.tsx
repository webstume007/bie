import { AdminShell } from '@/components/backstage/admin-shell';

export default function BackstageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
