import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import type { SettingsProps } from '../types';
import { BlockSettings } from '../settings/BlockSettings';
import { TextBlockSettings } from '../settings/TextBlockSettings';
import { SettingsSectionHeader } from '@/components/ui/settings-section-header';

export function HeaderSettings({ config, onChange }: SettingsProps) {
  const handleChange = (field: string, value: string) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <div className="space-y-4">
      <SettingsSectionHeader title="Content" />

      <div>
        <Label htmlFor="text">Header Text</Label>
        <Input
          id="text"
          value={config.text || ''}
          onChange={(e) => handleChange('text', e.target.value)}
          placeholder="Enter header text"
        />
      </div>

      <TextBlockSettings
        config={config}
        onChange={handleChange}
        fontSizeOptions={['16px', '20px', '24px', '32px', '40px', '48px', '64px']}
      />

      <BlockSettings config={config} onChange={handleChange} />
    </div>
  );
}
