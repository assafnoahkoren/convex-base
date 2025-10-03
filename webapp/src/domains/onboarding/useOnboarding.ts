import { useOrganization } from '@/contexts/OrganizationContext';

export function useOnboarding() {
  const { userOrganizations, isLoading } = useOrganization();

  const needsOnboarding = !isLoading && (!userOrganizations || userOrganizations.length === 0);

  return {
    needsOnboarding,
    isLoading,
  };
}
