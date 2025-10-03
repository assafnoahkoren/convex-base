import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';

interface Organization {
  _id: Id<'organizations'>;
  _creationTime: number;
  name: string;
  createdAt: number;
  role: 'owner' | 'admin' | 'member';
}

interface OrganizationContextType {
  currentOrganization: Organization | null;
  setCurrentOrganization: (org: Organization | null) => void;
  userOrganizations: Organization[] | undefined;
  isLoading: boolean;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const userOrganizations = useQuery(api.organizations.getUserOrganizations);
  const isLoading = userOrganizations === undefined;

  useEffect(() => {
    if (userOrganizations && userOrganizations.length > 0 && !currentOrganization) {
      // Auto-select first organization if none selected
      setCurrentOrganization(userOrganizations[0]);
    }
  }, [userOrganizations, currentOrganization]);

  return (
    <OrganizationContext.Provider
      value={{
        currentOrganization,
        setCurrentOrganization,
        userOrganizations,
        isLoading,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within OrganizationProvider');
  }
  return context;
}
