import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CommonTextSettingsProps {
  config: {
    fontSize: string;
    color: string;
    alignment: string;
  };
  onChange: (field: string, value: string) => void;
  fontSizeOptions?: string[];
}

export function CommonTextSettings({ config, onChange, fontSizeOptions }: CommonTextSettingsProps) {
  const { t } = useTranslation();

  const defaultFontSizes = fontSizeOptions || [
    '12px', '14px', '16px', '18px', '20px', '24px', '32px', '40px', '48px'
  ];

  return (
    <>
      <div>
        <Label htmlFor="fontSize">{t('boards.editor.config.fontSize')}</Label>
        <Select value={config.fontSize} onValueChange={(value) => onChange('fontSize', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {defaultFontSizes.map((size) => (
              <SelectItem key={size} value={size}>{size}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="color">{t('boards.editor.config.color')}</Label>
        <div className="flex gap-2">
          <Input
            id="color"
            type="color"
            value={config.color}
            onChange={(e) => onChange('color', e.target.value)}
            className="w-20 h-10"
          />
          <Input
            value={config.color}
            onChange={(e) => onChange('color', e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="alignment">{t('boards.editor.config.alignment')}</Label>
        <Select value={config.alignment} onValueChange={(value) => onChange('alignment', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">{t('boards.editor.config.alignLeft')}</SelectItem>
            <SelectItem value="center">{t('boards.editor.config.alignCenter')}</SelectItem>
            <SelectItem value="right">{t('boards.editor.config.alignRight')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
