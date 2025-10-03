import { Navigate } from 'react-router-dom';
import { useConvexAuth } from 'convex/react';
import { useOnboarding } from '@/domains/onboarding/useOnboarding';
import CreateOrganization from '@/domains/onboarding/CreateOrganization';
import { useTranslation } from 'react-i18next';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const { needsOnboarding, isLoading: onboardingLoading } = useOnboarding();

  if (authLoading || onboardingLoading) {
    return <div>{t('common.loading')}</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (needsOnboarding) {
    return <CreateOrganization />;
  }

  return <>{children}</>;
}
