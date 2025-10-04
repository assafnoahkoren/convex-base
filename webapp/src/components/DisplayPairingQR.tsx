import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';
import { useNavigate } from 'react-router-dom';

export default function DisplayPairingQR() {
  const [pairingId, setPairingId] = useState<Id<"displayPairings"> | null>(null);
  const createPairing = useMutation(api.displayPairings.create);
  const pairing = useQuery(
    api.displayPairings.get,
    pairingId ? { pairingId } : "skip"
  );
  const navigate = useNavigate();

  // Create pairing on mount
  useEffect(() => {
    createPairing().then(setPairingId);
  }, [createPairing]);

  // Watch for completed pairing and redirect
  useEffect(() => {
    if (pairing?.status === "completed" && pairing.displayId) {
      navigate(`/display/${pairing.displayId}`);
    }
  }, [pairing, navigate]);

  if (!pairingId) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const setupUrl = `${window.location.origin}/setup-display/${pairingId}`;

  return (
    <div className="flex flex-col items-center gap-6 p-8 rounded-2xl">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Connect Your Display
        </h3>
      </div>

      <div className="p-4 bg-white rounded-lg border-2 border-gray-200">
        <QRCodeSVG
          value={setupUrl}
          size={200}
          level="H"
          includeMargin={false}
        />
      </div>

      {pairing?.status === "expired" && (
        <div className="text-sm text-red-600">
          QR code expired. Please refresh the page.
        </div>
      )}

      {pairing?.status === "pending" && (
        <div className="text-sm text-gray-500">
          Waiting for configuration...
        </div>
      )}
    </div>
  );
}
