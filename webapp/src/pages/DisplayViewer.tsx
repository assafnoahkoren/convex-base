import { useParams } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';
import BoardViewer from './Boards/BoardViewer';

export default function DisplayViewer() {
  const { displayId } = useParams<{ displayId: string }>();

  const display = useQuery(
    api.displays.get,
    displayId ? { displayId: displayId as Id<"displays"> } : "skip"
  );

  if (!display) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Loading display...</div>
      </div>
    );
  }

  if (!display.currentBoardId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <h1 className="text-3xl font-bold mb-4">{display.name}</h1>
          <p className="text-gray-400">No board assigned to this display</p>
        </div>
      </div>
    );
  }

  // Pass the boardId to BoardViewer
  return <BoardViewer boardIdOverride={display.currentBoardId} />;
}
