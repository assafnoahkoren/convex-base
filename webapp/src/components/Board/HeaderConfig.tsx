import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface HeaderConfigProps {
  config: {
    text: string;
    fontSize: string;
    color: string;
    alignment: string;
  };
  onChange: (config: any) => void;
}

export function HeaderConfig({ config, onChange }: HeaderConfigProps) {
  const { t } = useTranslation();

  const handleChange = (field: string, value: string) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="text">{t('boards.editor.config.text')}</Label>
        <Input
          id="text"
          value={config.text}
          onChange={(e) => handleChange('text', e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="fontSize">{t('boards.editor.config.fontSize')}</Label>
        <Select value={config.fontSize} onValueChange={(value) => handleChange('fontSize', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="16px">16px</SelectItem>
            <SelectItem value="20px">20px</SelectItem>
            <SelectItem value="24px">24px</SelectItem>
            <SelectItem value="32px">32px</SelectItem>
            <SelectItem value="40px">40px</SelectItem>
            <SelectItem value="48px">48px</SelectItem>
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
            onChange={(e) => handleChange('color', e.target.value)}
            className="w-20 h-10"
          />
          <Input
            value={config.color}
            onChange={(e) => handleChange('color', e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="alignment">{t('boards.editor.config.alignment')}</Label>
        <Select value={config.alignment} onValueChange={(value) => handleChange('alignment', value)}>
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
    </div>
  );
}
