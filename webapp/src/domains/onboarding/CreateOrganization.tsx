import { useState } from 'react';
import { useMutation } from 'convex/react';
import { useTranslation } from 'react-i18next';
import { api } from '@convex/_generated/api';
import { useOrganization } from '@/contexts/OrganizationContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CreateOrganization() {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createOrganization = useMutation(api.organizations.createOrganization);
  const { setCurrentOrganization, userOrganizations} = useOrganization();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const organizationId = await createOrganization({ name });

      // Refresh will happen automatically via the query, but we can set it explicitly
      // Wait a bit for the query to update
      setTimeout(() => {
        const newOrg = userOrganizations?.find(org => org._id === organizationId);
        if (newOrg) {
          setCurrentOrganization(newOrg);
        }
      }, 100);
    } catch (err) {
      setError(t('onboarding.createOrganization.failed'));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('onboarding.createOrganization.title')}</CardTitle>
          <CardDescription>{t('onboarding.createOrganization.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('onboarding.createOrganization.organizationName')}</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder={t('onboarding.createOrganization.organizationNamePlaceholder')}
                disabled={isSubmitting}
              />
            </div>
            {error && <div className="text-sm text-destructive">{error}</div>}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? t('onboarding.createOrganization.creating') : t('onboarding.createOrganization.createButton')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
