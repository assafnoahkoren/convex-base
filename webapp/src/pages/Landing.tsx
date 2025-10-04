import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useConvexAuth } from 'convex/react';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Monitor, Zap, Users, ArrowRight } from 'lucide-react';
import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern';
import DisplayPairingQR from '@/components/DisplayPairingQR';

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useConvexAuth();
  const currentUser = useQuery(api.users.currentUser);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="border-b border-gray-100 relative z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Signobee" className="w-10" />
              <span className="text-2xl vertical-text font-bold">
                signobee
              </span>
            </div>
            <div className="flex gap-3 items-center">
              {isAuthenticated && currentUser ? (
                <Button onClick={() => navigate('/home')} className="bg-[#fba40a] hover:bg-[#e89609]">
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => navigate('/login')}>
                    Sign In
                  </Button>
                  <Button onClick={() => navigate('/register')} className="bg-[#fba40a] hover:bg-[#e89609]">
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <AnimatedGridPattern
          className="absolute inset-0 z-0 stroke-orange-200/50 text-orange-400/40 [mask-image:radial-gradient(600px_circle_at_center,white,transparent)] skew-y-12"
          width={60}
          height={60}
          numSquares={30}
          maxOpacity={0.4}
          duration={3}
        />
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-[#fba40a] rounded-full text-sm font-medium mb-8">
                <Zap className="h-4 w-4" />
                Digital Signage Made Simple
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Transform Your Office
                <span className="block mt-2 bg-gradient-to-r from-[#fba40a] to-orange-500 bg-clip-text text-transparent">
                  Smart TVs Into Dynamic Displays
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-10">
                Manage and schedule content for your office digital signage boards with ease.
                Perfect for announcements, metrics, and team updates.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 md:justify-start justify-center">
                <Button
                  size="lg"
                  onClick={() => navigate('/register')}
                  className="bg-[#fba40a] hover:bg-[#e89609] text-white px-8 text-lg h-14"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/login')}
                  className="border-gray-300 text-gray-700 px-8 text-lg h-14"
                >
                  View Demo
                </Button>
              </div>
            </div>

            <div className="flex justify-center">
              <DisplayPairingQR />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Signobee" className="h-8 w-8" />
              <span className="text-lg font-semibold text-gray-800">signobee</span>
            </div>
            <p className="text-gray-500 text-sm">
              © 2025 Signobee. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
