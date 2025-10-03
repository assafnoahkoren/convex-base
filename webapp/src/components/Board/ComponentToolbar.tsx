import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Heading, Type, Image } from 'lucide-react';

interface ComponentToolbarProps {
  onAddComponent: (type: 'header' | 'text' | 'image') => void;
  onDragStart?: (type: 'header' | 'text' | 'image') => void;
  onDragEnd?: () => void;
}

export function ComponentToolbar({ onAddComponent, onDragStart, onDragEnd }: ComponentToolbarProps) {
  const { t } = useTranslation();

  const handleDragStart = (e: React.DragEvent, type: 'header' | 'text' | 'image') => {
    e.dataTransfer.setData('componentType', type);
    e.dataTransfer.setData('text/plain', type); // Fallback for better compatibility
    e.dataTransfer.effectAllowed = 'copy';
    onDragStart?.(type);
  };

  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-semibold text-sm text-gray-700 mb-2">
        {t('boards.editor.components')}
      </h3>

      <Button
        variant="outline"
        className="w-full justify-start cursor-grab active:cursor-grabbing"
        onClick={() => onAddComponent('header')}
        draggable
        onDragStart={(e) => handleDragStart(e, 'header')}
        onDragEnd={onDragEnd}
      >
        <Heading className="mr-2 h-4 w-4" />
        {t('boards.editor.addHeader')}
      </Button>

      <Button
        variant="outline"
        className="w-full justify-start cursor-grab active:cursor-grabbing"
        onClick={() => onAddComponent('text')}
        draggable
        onDragStart={(e) => handleDragStart(e, 'text')}
        onDragEnd={onDragEnd}
      >
        <Type className="mr-2 h-4 w-4" />
        {t('boards.editor.addText')}
      </Button>

      <Button
        variant="outline"
        className="w-full justify-start cursor-grab active:cursor-grabbing"
        onClick={() => onAddComponent('image')}
        draggable
        onDragStart={(e) => handleDragStart(e, 'image')}
        onDragEnd={onDragEnd}
      >
        <Image className="mr-2 h-4 w-4" />
        {t('boards.editor.addImage')}
      </Button>
    </div>
  );
}
