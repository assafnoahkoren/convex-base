import { useState } from 'react';
import { Menu, Home, LogOut } from 'lucide-react';
import { useAuthActions } from '@convex-dev/auth/react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export function SidebarMenu() {
  const [open, setOpen] = useState(false);
  const { signOut } = useAuthActions();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>Navigate your application</SheetDescription>
        </SheetHeader>
        <nav className="mt-6 flex flex-col gap-2">
          <Button variant="ghost" className="justify-start" onClick={() => setOpen(false)}>
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
          <Button
            variant="ghost"
            className="justify-start"
            onClick={() => {
              signOut();
              setOpen(false);
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
