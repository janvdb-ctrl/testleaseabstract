import { ObligationsDashboardLayout } from "@/components/ObligationsDashboardLayout";
import { mockDashboardProperty } from "@/mocks/dashboard";

export default function DashboardPage() {
  return (
    <main className="flex min-h-screen w-full flex-col bg-[var(--colour-neutral-100)] font-neue-plak-text">
      <ObligationsDashboardLayout property={mockDashboardProperty} />
    </main>
  );
}
