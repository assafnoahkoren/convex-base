import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { HeaderConfig } from './HeaderConfig';
import { TextConfig } from './TextConfig';
import { ImageConfig } from './ImageConfig';
import type { Id } from '@convex/_generated/dataModel';

interface ConfigPanelProps {
  component: any;
  onClose: () => void;
  onConfigChange: (config: any) => void;
  boardId: Id<'boards'>;
}

export function ConfigPanel({ component, onClose, onConfigChange, boardId }: ConfigPanelProps) {
  const { t } = useTranslation();

  if (!component) return null;

  return (
    <div className="w-80 border-l bg-gray-50 p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">{t('boards.editor.configPanel.title')}</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto">
        {component.type === 'header' && (
          <HeaderConfig config={component.config} onChange={onConfigChange} />
        )}
        {component.type === 'text' && (
          <TextConfig config={component.config} onChange={onConfigChange} />
        )}
        {component.type === 'image' && (
          <ImageConfig config={component.config} onChange={onConfigChange} boardId={boardId} />
        )}
      </div>
    </div>
  );
}
