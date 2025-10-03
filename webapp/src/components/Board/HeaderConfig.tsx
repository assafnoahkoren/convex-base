import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CommonTextSettings } from './CommonTextSettings';

interface HeaderConfigProps {
  config: {
    text: string;
    fontSize: string;
    color: string;
    alignment: string;
    verticalAlignment?: string;
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

      <CommonTextSettings
        config={config}
        onChange={handleChange}
        fontSizeOptions={['16px', '20px', '24px', '32px', '40px', '48px']}
      />
    </div>
  );
}
