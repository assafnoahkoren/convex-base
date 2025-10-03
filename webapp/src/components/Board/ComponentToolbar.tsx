import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Heading, Type, Image } from 'lucide-react';

interface ComponentToolbarProps {
  onAddComponent: (type: 'header' | 'text' | 'image') => void;
}

export function ComponentToolbar({ onAddComponent }: ComponentToolbarProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-semibold text-sm text-gray-700 mb-2">
        {t('boards.editor.components')}
      </h3>

      <Button
        variant="outline"
        className="w-full justify-start"
        onClick={() => onAddComponent('header')}
      >
        <Heading className="mr-2 h-4 w-4" />
        {t('boards.editor.addHeader')}
      </Button>

      <Button
        variant="outline"
        className="w-full justify-start"
        onClick={() => onAddComponent('text')}
      >
        <Type className="mr-2 h-4 w-4" />
        {t('boards.editor.addText')}
      </Button>

      <Button
        variant="outline"
        className="w-full justify-start"
        onClick={() => onAddComponent('image')}
      >
        <Image className="mr-2 h-4 w-4" />
        {t('boards.editor.addImage')}
      </Button>
    </div>
  );
}
