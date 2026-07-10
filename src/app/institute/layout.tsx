import { InstituteShell } from '@/components/institute/institute-shell';

export default function InstituteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <InstituteShell>{children}</InstituteShell>;
}
