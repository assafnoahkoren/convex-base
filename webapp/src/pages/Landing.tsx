import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useConvexAuth } from 'convex/react';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Monitor, Zap, Users, ArrowRight } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useConvexAuth();
  const currentUser = useQuery(api.users.currentUser);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="border-b border-gray-100">
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
      <section className="container mx-auto px-6 py-24 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-[#fba40a] rounded-full text-sm font-medium mb-8">
            <Zap className="h-4 w-4" />
            Digital Signage Made Simple
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Transform Your Office
            <span className="block mt-2 bg-gradient-to-r from-[#fba40a] to-orange-500 bg-clip-text text-transparent">
              Smart TVs Into Dynamic Displays
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Manage and schedule content for your office digital signage boards with ease.
            Perfect for announcements, metrics, and team updates.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Digital Signage
            </h2>
            <p className="text-lg text-gray-600">
              Simple, powerful tools to manage your office displays
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-orange-50 rounded-lg flex items-center justify-center mb-6">
                <Monitor className="h-6 w-6 text-[#fba40a]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Multi-Display Management
              </h3>
              <p className="text-gray-600">
                Control multiple screens across your organization from a single dashboard. Update content in real-time.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-orange-50 rounded-lg flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-[#fba40a]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Real-Time Updates
              </h3>
              <p className="text-gray-600">
                Changes appear instantly on all connected displays. No delays, no manual refreshes required.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-orange-50 rounded-lg flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-[#fba40a]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Team Collaboration
              </h3>
              <p className="text-gray-600">
                Role-based permissions let your team contribute while maintaining control over what gets published.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#fba40a] to-orange-500 rounded-3xl p-12 md:p-16 text-center text-white">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-orange-50 mb-8 max-w-2xl mx-auto">
            Join teams already using Signobee to power their office displays.
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/register')}
            className="bg-white text-[#fba40a] hover:bg-gray-50 px-8 text-lg h-14"
          >
            Create Your Account
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
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
