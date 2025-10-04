import { useNavigate } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Monitor, Layout, ArrowRight } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const boards = useQuery(api.boards.list);
  const displays = useQuery(api.displays.list);

  const boardsCount = boards?.length ?? 0;
  const displaysCount = displays?.length ?? 0;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Boards Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-14 w-14 bg-orange-50 rounded-xl flex items-center justify-center">
              <Layout className="h-7 w-7 text-[#fba40a]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{boardsCount}</h2>
              <p className="text-gray-600">Boards</p>
            </div>
          </div>

          <p className="text-gray-600 mb-6">
            Manage your digital signage content and layouts
          </p>

          <Button
            onClick={() => navigate('/boards')}
            className="w-full bg-[#fba40a] hover:bg-[#e89609]"
          >
            View Boards
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Displays Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-14 w-14 bg-orange-50 rounded-xl flex items-center justify-center">
              <Monitor className="h-7 w-7 text-[#fba40a]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{displaysCount}</h2>
              <p className="text-gray-600">Displays</p>
            </div>
          </div>

          <p className="text-gray-600 mb-6">
            Configure and monitor your connected display screens
          </p>

          <Button
            onClick={() => navigate('/displays')}
            className="w-full bg-[#fba40a] hover:bg-[#e89609]"
          >
            View Displays
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
