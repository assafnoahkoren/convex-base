import { SidebarMenu } from './Sidebar';
import { useOrganization } from '@/contexts/OrganizationContext';

export function Shell({ children }: { children: React.ReactNode }) {
  const { currentOrganization } = useOrganization();

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <SidebarMenu />
            <h1 className="text-xl font-bold">{currentOrganization?.name || 'My App'}</h1>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4">{children}</main>
    </div>
  );
}
