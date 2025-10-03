import { useParams } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';
import { useTranslation } from 'react-i18next';

// Component renderers
function HeaderComponent({ config }: { config: any }) {
  return (
    <div
      className="flex items-center justify-center h-full p-4"
      style={{
        fontSize: config.fontSize || '24px',
        color: config.color || '#000000',
        textAlign: config.alignment || 'left',
      }}
    >
      <h1 className="font-bold">{config.text || 'Header'}</h1>
    </div>
  );
}

function TextComponent({ config }: { config: any }) {
  return (
    <div
      className="flex items-center h-full p-4"
      style={{
        fontSize: config.fontSize || '16px',
        color: config.color || '#000000',
        textAlign: config.alignment || 'left',
      }}
    >
      <p>{config.content || 'Text'}</p>
    </div>
  );
}

function ImageComponent({ config }: { config: any }) {
  return (
    <div className="h-full w-full p-2">
      <img
        src={config.imageUrl || 'https://via.placeholder.com/300'}
        alt={config.alt || 'Image'}
        className="h-full w-full"
        style={{
          objectFit: config.fit || 'cover',
        }}
      />
    </div>
  );
}

export default function BoardViewer() {
  const { t } = useTranslation();
  const { boardId } = useParams<{ boardId: string }>();
  const board = useQuery(api.boards.get, { boardId: boardId as Id<'boards'> });

  if (board === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {t('common.loading')}
      </div>
    );
  }

  if (!board) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Board not found
      </div>
    );
  }

  const { gridConfig, components } = board.content;

  return (
    <div className="h-screen w-screen overflow-hidden bg-white">
      <div
        className="grid h-full w-full gap-2 p-4"
        style={{
          gridTemplateColumns: `repeat(${gridConfig.columns}, 1fr)`,
          gridTemplateRows: `repeat(${gridConfig.rows}, ${gridConfig.rowHeight}px)`,
        }}
      >
        {components.map((component: any) => {
          const { id, type, position, config } = component;

          return (
            <div
              key={id}
              className="border border-gray-200 rounded bg-white overflow-hidden"
              style={{
                gridColumn: `${position.x + 1} / span ${position.w}`,
                gridRow: `${position.y + 1} / span ${position.h}`,
              }}
            >
              {type === 'header' && <HeaderComponent config={config} />}
              {type === 'text' && <TextComponent config={config} />}
              {type === 'image' && <ImageComponent config={config} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
