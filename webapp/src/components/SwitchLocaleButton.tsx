import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

export function SwitchLocaleButton() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'he' : 'en';
    i18n.changeLanguage(newLang);
    // Set document direction for RTL support
    document.dir = newLang === 'he' ? 'rtl' : 'ltr';
  };

  return (
    <Button
      variant="ghost"
      onClick={toggleLanguage}
      className="gap-2"
      title={i18n.language === 'en' ? 'Switch to Hebrew' : 'Switch to English'}
    >
      <Languages className="h-5 w-5" />
      <span>{i18n.language === 'en' ? 'עברית' : 'English'}</span>
    </Button>
  );
}
