import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import { useOrganization } from '@/contexts/OrganizationContext';

export default function SetupDisplay() {
  const { pairingId } = useParams<{ pairingId: string }>();
  const navigate = useNavigate();
  const { currentOrganization } = useOrganization();

  const pairing = useQuery(
    api.displayPairings.get,
    pairingId ? { pairingId: pairingId as Id<"displayPairings"> } : "skip"
  );

  const displays = useQuery(
    api.displays.list,
    currentOrganization ? {} : "skip"
  );

  const setDisplay = useMutation(api.displayPairings.setDisplay);
  const [selectedDisplayId, setSelectedDisplayId] = useState<Id<"displays"> | null>(null);
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    if (!pairingId || !selectedDisplayId) return;

    setLoading(true);
    try {
      await setDisplay({
        pairingId: pairingId as Id<"displayPairings">,
        displayId: selectedDisplayId,
      });
      navigate('/home');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to connect display');
    } finally {
      setLoading(false);
    }
  };

  if (!pairing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (pairing.status === "expired") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">QR Code Expired</h1>
          <p className="text-gray-600">Please scan a new QR code from the display.</p>
        </div>
      </div>
    );
  }

  if (pairing.status === "completed") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Display Connected</h1>
          <p className="text-gray-600">This display has been successfully configured.</p>
        </div>
      </div>
    );
  }

  if (!currentOrganization) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Please Log In</h1>
          <p className="text-gray-600 mb-4">You need to be logged in to configure a display.</p>
          <Button onClick={() => navigate('/login')}>Log In</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Connect Display
          </h1>
          <p className="text-gray-600 mb-8">
            Select which display board should be shown on this screen.
          </p>

          <div className="space-y-4 mb-8">
            {displays?.map((display) => (
              <button
                key={display._id}
                onClick={() => setSelectedDisplayId(display._id)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                  selectedDisplayId === display._id
                    ? 'border-[#fba40a] bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold text-gray-900">{display.name}</div>
                {display.location && (
                  <div className="text-sm text-gray-600 mt-1">{display.location}</div>
                )}
              </button>
            ))}

            {displays && displays.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No displays available. Create a display first.
              </div>
            )}
          </div>

          <Button
            onClick={handleConnect}
            disabled={!selectedDisplayId || loading}
            className="w-full bg-[#fba40a] hover:bg-[#e89609]"
            size="lg"
          >
            {loading ? 'Connecting...' : 'Connect Display'}
          </Button>
        </div>
      </div>
    </div>
  );
}
