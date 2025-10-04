import { useState } from 'react';
import { Menu, Home, LogOut, LayoutGrid, Monitor } from 'lucide-react';
import { useAuthActions } from '@convex-dev/auth/react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { SwitchLocaleButton } from '@/components/SwitchLocaleButton';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export function SidebarMenu() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const { signOut } = useAuthActions();
  const navigate = useNavigate();
  const isRTL = i18n.language === 'he';

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side={isRTL ? 'right' : 'left'}>
        <SheetHeader>
          <SheetTitle>{t('navigation.menu')}</SheetTitle>
          <SheetDescription>{t('navigation.menuDescription')}</SheetDescription>
        </SheetHeader>
        <nav className="mt-6 flex flex-col gap-2">
          <Button
            variant="ghost"
            className="justify-start"
            onClick={() => {
              navigate('/home');
              setOpen(false);
            }}
          >
            <Home className="mr-2 h-4 w-4" />
            {t('navigation.home')}
          </Button>
          <Button
            variant="ghost"
            className="justify-start"
            onClick={() => {
              navigate('/boards');
              setOpen(false);
            }}
          >
            <LayoutGrid className="mr-2 h-4 w-4" />
            {t('navigation.boards')}
          </Button>
          <Button
            variant="ghost"
            className="justify-start"
            onClick={() => {
              navigate('/displays');
              setOpen(false);
            }}
          >
            <Monitor className="mr-2 h-4 w-4" />
            Displays
          </Button>
          <div className="flex items-center justify-start px-2 py-1">
            <SwitchLocaleButton />
          </div>
          <Button
            variant="ghost"
            className="justify-start"
            onClick={() => {
              signOut();
              setOpen(false);
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {t('auth.signOut')}
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
