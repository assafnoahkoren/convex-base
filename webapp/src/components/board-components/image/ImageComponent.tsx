import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { ImageIcon } from 'lucide-react';
import type { BoardComponentConfig } from '../types';

export function ImageComponent({ config }: { config: BoardComponentConfig }) {
  // If storageId exists, fetch the authorized URL
  const imageUrl = useQuery(
    api.files.getUrl,
    config.storageId ? { storageId: config.storageId } : 'skip'
  );

  // Use uploaded image URL, fallback to external URL
  const src = imageUrl || config.imageUrl;

  // If no image, show placeholder
  if (!src) {
    return (
      <div
        className="h-full w-full flex flex-col items-center justify-center bg-gray-100 text-gray-400"
        style={{
          backgroundColor: config.backgroundColor || '#f3f4f6',
          padding: config.padding || '16px',
          borderRadius: config.borderRadius || '0px',
        }}
      >
        <ImageIcon className="h-16 w-16 mb-2" />
        <p className="text-sm">No Image</p>
      </div>
    );
  }

  return (
    <div
      className="h-full w-full"
      style={{
        backgroundColor: config.backgroundColor || 'transparent',
        padding: config.padding || '8px',
        borderRadius: config.borderRadius || '0px',
      }}
    >
      <img
        src={src}
        alt={config.alt || 'Image'}
        className="h-full w-full"
        style={{
          objectFit: config.fit || 'cover',
        }}
      />
    </div>
  );
}
