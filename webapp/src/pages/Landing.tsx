import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useConvexAuth } from 'convex/react';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { User } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useConvexAuth();
  const currentUser = useQuery(api.users.currentUser);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Signo</h1>
          <div className="flex gap-4 items-center">
            {isAuthenticated && currentUser ? (
              <>
                <div className="flex items-center gap-2 text-gray-700">
                  <User className="h-5 w-5" />
                  <span>{currentUser.email}</span>
                </div>
                <Button onClick={() => navigate('/home')}>
                  Go to App
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button onClick={() => navigate('/register')}>
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-20">
      </main>
    </div>
  );
}
