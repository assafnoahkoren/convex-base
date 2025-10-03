import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { SettingsProps } from '../types';
import { BlockSettings } from '../settings/BlockSettings';
import { TextBlockSettings } from '../settings/TextBlockSettings';

export function TextSettings({ config, onChange }: SettingsProps) {
  const handleChange = (field: string, value: string) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="content">Text Content</Label>
        <Textarea
          id="content"
          value={config.content || ''}
          onChange={(e) => handleChange('content', e.target.value)}
          placeholder="Enter text content"
          rows={4}
        />
      </div>

      <TextBlockSettings
        config={config}
        onChange={handleChange}
        fontSizeOptions={['12px', '14px', '16px', '18px', '20px', '24px', '32px']}
      />

      <BlockSettings config={config} onChange={handleChange} />
    </div>
  );
}
