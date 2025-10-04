import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useOrganization } from '@/contexts/OrganizationContext';

export default function SetupDisplay() {
  const { pairingId } = useParams<{ pairingId: string }>();
  const navigate = useNavigate();
  const { currentOrganization } = useOrganization();

  const pairing = useQuery(
    api.displayPairings.get,
    pairingId ? { pairingId: pairingId as Id<"displayPairings"> } : "skip"
  );

  const boards = useQuery(
    api.boards.list,
    currentOrganization ? {} : "skip"
  );

  const createDisplay = useMutation(api.displays.create);
  const setDisplayPairing = useMutation(api.displayPairings.setDisplay);

  const [displayName, setDisplayName] = useState('');
  const [displayLocation, setDisplayLocation] = useState('');
  const [selectedBoardId, setSelectedBoardId] = useState<Id<"boards"> | null>(null);
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    if (!pairingId || !displayName.trim()) return;

    setLoading(true);
    try {
      // Create new display
      const displayId = await createDisplay({
        name: displayName,
        location: displayLocation || undefined,
        currentBoardId: selectedBoardId || undefined,
      });

      // Link display to pairing
      await setDisplayPairing({
        pairingId: pairingId as Id<"displayPairings">,
        displayId,
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
            Setup New Display
          </h1>
          <p className="text-gray-600 mb-8">
            Create a new display and connect it to a board.
          </p>

          <div className="space-y-6 mb-8">
            {/* Display Name */}
            <div>
              <Label htmlFor="displayName" className="text-gray-900 mb-2">
                Display Name *
              </Label>
              <Input
                id="displayName"
                type="text"
                placeholder="e.g., Main Lobby TV"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="mt-1"
              />
            </div>

            {/* Display Location */}
            <div>
              <Label htmlFor="displayLocation" className="text-gray-900 mb-2">
                Location (optional)
              </Label>
              <Input
                id="displayLocation"
                type="text"
                placeholder="e.g., Building A - First Floor"
                value={displayLocation}
                onChange={(e) => setDisplayLocation(e.target.value)}
                className="mt-1"
              />
            </div>

            {/* Board Selection */}
            <div>
              <Label className="text-gray-900 mb-3 block">
                Select Board (optional)
              </Label>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedBoardId(null)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                    selectedBoardId === null
                      ? 'border-[#fba40a] bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-900">No Board</div>
                  <div className="text-sm text-gray-600">Configure later</div>
                </button>

                {boards?.map((board) => (
                  <button
                    key={board._id}
                    onClick={() => setSelectedBoardId(board._id)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                      selectedBoardId === board._id
                        ? 'border-[#fba40a] bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{board.name}</div>
                    {board.description && (
                      <div className="text-sm text-gray-600 mt-1">{board.description}</div>
                    )}
                  </button>
                ))}

                {boards && boards.length === 0 && (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    No boards available yet. You can create one later.
                  </div>
                )}
              </div>
            </div>
          </div>

          <Button
            onClick={handleConnect}
            disabled={!displayName.trim() || loading}
            className="w-full bg-[#fba40a] hover:bg-[#e89609]"
            size="lg"
          >
            {loading ? 'Creating Display...' : 'Create & Connect Display'}
          </Button>
        </div>
      </div>
    </div>
  );
}
