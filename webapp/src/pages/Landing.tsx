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
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">
            Digital Signage Made Simple
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Manage your office smart TV displays with ease. Create beautiful boards,
            assign them to displays, and keep your team informed.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/register')}>
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
              Sign In
            </Button>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="text-4xl mb-4">📺</div>
              <h3 className="text-xl font-semibold mb-2">Easy Management</h3>
              <p className="text-gray-600">
                Create and manage digital signage boards with a simple drag-and-drop interface
              </p>
            </div>
            <div className="p-6">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold mb-2">Customizable</h3>
              <p className="text-gray-600">
                Design beautiful boards with text, images, and customizable layouts
              </p>
            </div>
            <div className="p-6">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
              <p className="text-gray-600">
                Changes appear instantly on all connected displays
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
