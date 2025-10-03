import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';
import { useTranslation } from 'react-i18next';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Eye, X, History, GripVertical, Settings, GripHorizontal } from 'lucide-react';
import { ComponentToolbar } from '@/components/Board/ComponentToolbar';
import { ConfigPanel } from '@/components/Board/ConfigPanel';
import { BoardSettings } from '@/components/Board/BoardSettings';
import { QuickSettings } from '@/components/Board/QuickSettings';
import { BlockContextMenu } from '@/components/Board/BlockContextMenu';
import { getComponent } from '@/components/board-components/index.tsx';

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
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [gridConfig, setGridConfig] = useState({ columns: 12, rows: 12, rowHeight: 100 });
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [copiedStyle, setCopiedStyle] = useState<any>(null);
  const [dragPreview, setDragPreview] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [draggingType, setDraggingType] = useState<'header' | 'text' | 'image' | null>(null);

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
      setGridConfig(board.content.gridConfig);
      setBackgroundColor(board.content.backgroundColor || '#ffffff');
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
          gridConfig,
          backgroundColor,
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

  const handleAddComponent = (type: 'header' | 'text' | 'image', position?: { x: number; y: number }) => {
    const newId = `${type}-${Date.now()}`;
    const component = getComponent(type);
    if (!component) return;

    const { w, h } = component.defaultSize;

    const newComponent = {
      id: newId,
      type,
      position: { x: position?.x ?? 0, y: position?.y ?? 0, w, h },
      config: component.defaultConfig,
    };

    setComponents([...components, newComponent]);
    setLayout([
      ...layout,
      { i: newId, x: position?.x ?? 0, y: position?.y ?? Infinity, w, h },
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

  const handleCopyStyle = (componentId: string) => {
    const component = components.find((c) => c.id === componentId);
    if (component) {
      setCopiedStyle(component.config);
    }
  };

  const handlePasteStyle = (componentId: string) => {
    if (!copiedStyle) return;
    setComponents(components.map((c) =>
      c.id === componentId ? { ...c, config: { ...c.config, ...copiedStyle } } : c
    ));
  };

  const handleDuplicate = (componentId: string) => {
    const component = components.find((c) => c.id === componentId);
    const layoutItem = layout.find((l) => l.i === componentId);
    if (!component || !layoutItem) return;

    const newId = `${component.type}-${Date.now()}`;
    const newComponent = {
      ...component,
      id: newId,
    };

    setComponents([...components, newComponent]);
    setLayout([
      ...layout,
      {
        i: newId,
        x: layoutItem.x,
        y: layoutItem.y + layoutItem.h,
        w: layoutItem.w,
        h: layoutItem.h
      },
    ]);
  };

  const handleCenter = (componentId: string) => {
    const layoutItem = layout.find((l) => l.i === componentId);
    if (!layoutItem) return;

    // Calculate centered x position
    const centeredX = Math.floor((gridConfig.columns - layoutItem.w) / 2);

    setLayout(layout.map((l) =>
      l.i === componentId ? { ...l, x: centeredX } : l
    ));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragPreview(null);

    const componentType = draggingType || (e.dataTransfer.getData('componentType') as 'header' | 'text' | 'image');
    setDraggingType(null);
    if (!componentType) return;

    // Get the drop position relative to the canvas
    const canvas = e.currentTarget as HTMLElement;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate grid position
    const cellWidth = 1200 / gridConfig.columns;
    const gridX = Math.floor(x / cellWidth);
    const gridY = Math.floor(y / gridConfig.rowHeight);

    // Create component at the drop position
    handleAddComponent(componentType, { x: Math.min(gridX, gridConfig.columns - 4), y: gridY });
  };

  const handleComponentDragStart = (type: 'header' | 'text' | 'image') => {
    setDraggingType(type);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';

    if (!draggingType) return;

    // Get the drop position relative to the canvas
    const canvas = e.currentTarget as HTMLElement;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate grid position
    const cellWidth = 1200 / gridConfig.columns;
    const gridX = Math.floor(x / cellWidth);
    const gridY = Math.floor(y / gridConfig.rowHeight);

    // Get component size
    const component = getComponent(draggingType);
    const w = component?.defaultSize.w || 4;
    const h = component?.defaultSize.h || 2;

    // Update preview
    setDragPreview({
      x: gridX,
      y: gridY,
      w,
      h
    });
  };

  const handleDragLeave = () => {
    setDragPreview(null);
  };

  const handleDragEnd = () => {
    setDraggingType(null);
    setDragPreview(null);
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
        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate('/boards')} className="justify-start">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('common.back')}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setSettingsOpen(true)}>
              <Settings className="h-4 w-4" />
            </Button>
          </div>

          {/* Quick Settings */}
          <QuickSettings
            gridConfig={gridConfig}
            backgroundColor={backgroundColor}
            onGridConfigChange={setGridConfig}
            onBackgroundColorChange={setBackgroundColor}
          />
        </div>

        <div className="mb-4">
          <h2 className="font-bold text-lg mb-2">{board.name}</h2>
          <p className="text-sm text-gray-600">{board.description}</p>
        </div>

        <ComponentToolbar
          onAddComponent={handleAddComponent}
          onDragStart={handleComponentDragStart}
          onDragEnd={handleDragEnd}
        />

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
      <div className="flex-1 overflow-auto p-4 relative" style={{ backgroundColor }}>
        <div
          className="relative"
          style={{ width: '1200px', minHeight: `${gridConfig.rows * gridConfig.rowHeight}px` }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {/* Grid overlay */}
          <div
            className="absolute top-0 left-0 pointer-events-none border-r border-b"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgb(203 213 225 / 0.7) 1px, transparent 1px),
                linear-gradient(to bottom, rgb(203 213 225 / 0.7) 1px, transparent 1px)
              `,
              backgroundSize: `${1200 / gridConfig.columns}px ${gridConfig.rowHeight}px`,
              borderColor: 'rgb(203 213 225 / 0.7)',
              width: '1200px',
              height: '100%',
              minHeight: `${gridConfig.rows * gridConfig.rowHeight}px`,
            }}
          />
          {/* Drag Preview */}
          {dragPreview && (
            <div
              className="absolute bg-blue-500/30 border-2 border-blue-500 rounded pointer-events-none z-50"
              style={{
                left: `${(dragPreview.x * 1200) / gridConfig.columns}px`,
                top: `${dragPreview.y * gridConfig.rowHeight}px`,
                width: `${(dragPreview.w * 1200) / gridConfig.columns}px`,
                height: `${dragPreview.h * gridConfig.rowHeight}px`,
              }}
            />
          )}
          <GridLayout
            className="layout"
            layout={layout}
            cols={gridConfig.columns}
            rowHeight={gridConfig.rowHeight}
            width={1200}
            onLayoutChange={handleLayoutChange}
            draggableHandle=".cursor-move"
            margin={[0, 0]}
            containerPadding={[0, 0]}
            autoSize={true}
            verticalCompact={false}
            compactType={null}
            preventCollision={true}
          >
          {components.map((component) => (
            <div key={component.id} className="h-full w-full">
              <BlockContextMenu
                onCopyStyle={() => handleCopyStyle(component.id)}
                onPasteStyle={() => handlePasteStyle(component.id)}
                onDuplicate={() => handleDuplicate(component.id)}
                onDelete={() => handleRemoveComponent(component.id)}
                onCenter={() => handleCenter(component.id)}
                hasCopiedStyle={!!copiedStyle}
              >
                <div
                  className={`h-full w-full rounded overflow-hidden relative group ${
                    selectedComponentId === component.id ? 'border-blue-500 border-2' : 'hover:border hover:border-blue-500'
                  }`}
                  onClick={() => setSelectedComponentId(component.id)}
                >
                  {/* Drag Handle */}
                  <div className="cursor-move absolute top-0 left-1/2 -translate-x-1/2 w-10 h-6 bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10 rounded-b-md drag-handle">
                    <GripHorizontal className="h-4 w-4 text-gray-400" />
                  </div>
                  {/* Remove Button */}
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity h-5 w-5"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveComponent(component.id);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  {/* Component Content */}
                  {(() => {
                    const boardComponent = getComponent(component.type);
                    return boardComponent ? boardComponent.render(component.config) : null;
                  })()}
                </div>
              </BlockContextMenu>
            </div>
          ))}
          </GridLayout>
        </div>
      </div>

      {/* Config Panel */}
      {selectedComponent && (
        <ConfigPanel
          component={selectedComponent}
          onClose={() => setSelectedComponentId(null)}
          onConfigChange={handleConfigChange}
          boardId={boardId as Id<'boards'>}
        />
      )}

      {/* Board Settings Dialog */}
      <BoardSettings
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        gridConfig={gridConfig}
        backgroundColor={backgroundColor}
        onGridConfigChange={setGridConfig}
        onBackgroundColorChange={setBackgroundColor}
      />
    </div>
  );
}
