import { useParams } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';
import { useTranslation } from 'react-i18next';
import { getComponent } from '@/components/board-components/index.tsx';

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

  const { gridConfig, components, backgroundColor = '#ffffff' } = board.content;

  return (
    <div className="h-screen w-screen overflow-hidden" style={{ backgroundColor }}>
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
              {(() => {
                const boardComponent = getComponent(type);
                return boardComponent ? boardComponent.render(config) : null;
              })()}
            </div>
          );
        })}
      </div>
    </div>
  );
}
