import { Navigate } from 'react-router-dom';
import { useConvexAuth } from 'convex/react';
import { useOnboarding } from '@/domains/onboarding/useOnboarding';
import CreateOrganization from '@/domains/onboarding/CreateOrganization';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const { needsOnboarding, isLoading: onboardingLoading } = useOnboarding();

  if (authLoading || onboardingLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (needsOnboarding) {
    return <CreateOrganization />;
  }

  return <>{children}</>;
}
