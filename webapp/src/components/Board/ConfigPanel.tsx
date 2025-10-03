import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import type { Id } from '@convex/_generated/dataModel';
import { getComponent } from '@/components/board-components/index.tsx';

interface ConfigPanelProps {
  component: any;
  onClose: () => void;
  onConfigChange: (config: any) => void;
  boardId: Id<'boards'>;
}

export function ConfigPanel({ component, onClose, onConfigChange, boardId }: ConfigPanelProps) {
  const { t } = useTranslation();

  if (!component) return null;

  const boardComponent = getComponent(component.type);
  if (!boardComponent) return null;

  return (
    <div className="w-80 border-l bg-gray-50 p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">{boardComponent.displayName}</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto">
        {boardComponent.settings({ config: component.config, onChange: onConfigChange, boardId })}
      </div>
    </div>
  );
}
