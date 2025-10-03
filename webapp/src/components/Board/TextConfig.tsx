import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CommonTextSettings } from './CommonTextSettings';

interface TextConfigProps {
  config: {
    content: string;
    fontSize: string;
    color: string;
    alignment: string;
  };
  onChange: (config: any) => void;
}

export function TextConfig({ config, onChange }: TextConfigProps) {
  const { t } = useTranslation();

  const handleChange = (field: string, value: string) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="content">{t('boards.editor.config.content')}</Label>
        <Textarea
          id="content"
          value={config.content}
          onChange={(e) => handleChange('content', e.target.value)}
          rows={4}
        />
      </div>

      <CommonTextSettings
        config={config}
        onChange={handleChange}
        fontSizeOptions={['12px', '14px', '16px', '18px', '20px', '24px']}
      />
    </div>
  );
}
