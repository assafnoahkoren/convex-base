import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ImageConfigProps {
  config: {
    imageUrl: string;
    alt: string;
    fit: string;
  };
  onChange: (config: any) => void;
}

export function ImageConfig({ config, onChange }: ImageConfigProps) {
  const { t } = useTranslation();

  const handleChange = (field: string, value: string) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="imageUrl">{t('boards.editor.config.imageUrl')}</Label>
        <Input
          id="imageUrl"
          value={config.imageUrl}
          onChange={(e) => handleChange('imageUrl', e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div>
        <Label htmlFor="alt">{t('boards.editor.config.altText')}</Label>
        <Input
          id="alt"
          value={config.alt}
          onChange={(e) => handleChange('alt', e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="fit">{t('boards.editor.config.imageFit')}</Label>
        <Select value={config.fit} onValueChange={(value) => handleChange('fit', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cover">{t('boards.editor.config.fitCover')}</SelectItem>
            <SelectItem value="contain">{t('boards.editor.config.fitContain')}</SelectItem>
            <SelectItem value="fill">{t('boards.editor.config.fitFill')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
