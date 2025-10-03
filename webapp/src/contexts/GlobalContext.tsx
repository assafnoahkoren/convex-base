import { ReactNode } from 'react';
import { OrganizationProvider } from './OrganizationContext';

export function GlobalContext({ children }: { children: ReactNode }) {
  return (
    <OrganizationProvider>
      {children}
    </OrganizationProvider>
  );
}
