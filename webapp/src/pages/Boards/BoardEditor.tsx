import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';
import { useTranslation } from 'react-i18next';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Eye, X, History } from 'lucide-react';
import { ComponentToolbar } from '@/components/Board/ComponentToolbar';
import { ConfigPanel } from '@/components/Board/ConfigPanel';

// Component renderers (same as viewer but editable)
function HeaderComponent({ config }: { config: any }) {
  return (
    <div
      className="flex items-center justify-center h-full p-4 cursor-move"
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
      className="flex items-center h-full p-4 cursor-move"
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
    <div className="h-full w-full p-2 cursor-move">
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

export default function BoardEditor() {
  const { t } = useTranslation();
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const board = useQuery(api.boards.get, { boardId: boardId as Id<'boards'> });
  const updateBoard = useMutation(api.boards.update);

  const [layout, setLayout] = useState<GridLayout.Layout[]>([]);
  const [components, setComponents] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);

  // Load board data into state
  useEffect(() => {
    if (board) {
      const gridLayout: GridLayout.Layout[] = board.content.components.map((comp: any) => ({
        i: comp.id,
        x: comp.position.x,
        y: comp.position.y,
        w: comp.position.w,
        h: comp.position.h,
      }));
      setLayout(gridLayout);
      setComponents(board.content.components);
    }
  }, [board]);

  const handleLayoutChange = (newLayout: GridLayout.Layout[]) => {
    setLayout(newLayout);
  };

  const handleSave = async () => {
    if (!board) return;

    setIsSaving(true);
    try {
      // Update components with new positions from layout
      const updatedComponents = components.map((comp) => {
        const layoutItem = layout.find((l) => l.i === comp.id);
        if (layoutItem) {
          return {
            ...comp,
            position: {
              x: layoutItem.x,
              y: layoutItem.y,
              w: layoutItem.w,
              h: layoutItem.h,
            },
          };
        }
        return comp;
      });

      await updateBoard({
        boardId: boardId as Id<'boards'>,
        content: {
          gridConfig: board.content.gridConfig,
          components: updatedComponents,
        },
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    window.open(`/boards/${boardId}/view`, '_blank');
  };

  const handleAddComponent = (type: 'header' | 'text' | 'image') => {
    const newId = `${type}-${Date.now()}`;
    const newComponent = {
      id: newId,
      type,
      position: { x: 0, y: 0, w: 4, h: 2 },
      config: type === 'header'
        ? { text: 'New Header', fontSize: '24px', color: '#000000', alignment: 'left' }
        : type === 'text'
        ? { content: 'New Text', fontSize: '16px', color: '#000000', alignment: 'left' }
        : { imageUrl: 'https://via.placeholder.com/300', alt: 'Image', fit: 'cover' },
    };

    setComponents([...components, newComponent]);
    setLayout([
      ...layout,
      { i: newId, x: 0, y: Infinity, w: 4, h: 2 },
    ]);
  };

  const handleRemoveComponent = (componentId: string) => {
    setComponents(components.filter((c) => c.id !== componentId));
    setLayout(layout.filter((l) => l.i !== componentId));
    if (selectedComponentId === componentId) {
      setSelectedComponentId(null);
    }
  };

  const handleConfigChange = (config: any) => {
    if (!selectedComponentId) return;

    setComponents(components.map((c) =>
      c.id === selectedComponentId ? { ...c, config } : c
    ));
  };

  const selectedComponent = components.find((c) => c.id === selectedComponentId);

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

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Toolbar */}
      <div className="w-64 border-r bg-gray-50 p-4 flex flex-col">
        <div className="mb-4">
          <Button variant="ghost" onClick={() => navigate('/boards')} className="w-full justify-start">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('common.back')}
          </Button>
        </div>

        <div className="mb-4">
          <h2 className="font-bold text-lg mb-2">{board.name}</h2>
          <p className="text-sm text-gray-600">{board.description}</p>
        </div>

        <ComponentToolbar onAddComponent={handleAddComponent} />

        <div className="mt-auto space-y-2">
          <Button onClick={handleSave} disabled={isSaving} className="w-full">
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? t('common.saving') : t('common.save')}
          </Button>
          <Button onClick={handlePreview} variant="outline" className="w-full">
            <Eye className="mr-2 h-4 w-4" />
            {t('common.preview')}
          </Button>
          <Button
            onClick={() => navigate(`/boards/${boardId}/history`)}
            variant="outline"
            className="w-full"
          >
            <History className="mr-2 h-4 w-4" />
            {t('boards.history.viewHistory')}
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-auto bg-white p-4">
        <GridLayout
          className="layout"
          layout={layout}
          cols={board.content.gridConfig.columns}
          rowHeight={board.content.gridConfig.rowHeight}
          width={1200}
          onLayoutChange={handleLayoutChange}
          draggableHandle=".cursor-move"
        >
          {components.map((component) => (
            <div
              key={component.id}
              className={`border rounded bg-white overflow-hidden relative group cursor-pointer ${
                selectedComponentId === component.id ? 'border-blue-500 border-2' : 'border-gray-300 hover:border-blue-500'
              }`}
              onClick={() => setSelectedComponentId(component.id)}
            >
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveComponent(component.id);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
              {component.type === 'header' && <HeaderComponent config={component.config} />}
              {component.type === 'text' && <TextComponent config={component.config} />}
              {component.type === 'image' && <ImageComponent config={component.config} />}
            </div>
          ))}
        </GridLayout>
      </div>

      {/* Config Panel */}
      {selectedComponent && (
        <ConfigPanel
          component={selectedComponent}
          onClose={() => setSelectedComponentId(null)}
          onConfigChange={handleConfigChange}
        />
      )}
    </div>
  );
}
