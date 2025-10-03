import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { SettingsSectionHeader } from '@/components/ui/settings-section-header';

export interface BlockConfig {
  backgroundColor?: string;
  padding?: string;
  borderRadius?: string;
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
}

interface BlockSettingsProps {
  config: BlockConfig;
  onChange: (field: string, value: string) => void;
}

export function BlockSettings({ config, onChange }: BlockSettingsProps) {
  return (
    <>
      <SettingsSectionHeader title="Block Styling" />

      <div>
        <Label htmlFor="backgroundColor">Background Color</Label>
        <div className="flex gap-2">
          <Input
            id="backgroundColor"
            type="color"
            value={config.backgroundColor || 'transparent'}
            onChange={(e) => onChange('backgroundColor', e.target.value)}
            className="w-20 h-10"
          />
          <Input
            value={config.backgroundColor || 'transparent'}
            onChange={(e) => onChange('backgroundColor', e.target.value)}
            className="flex-1"
            placeholder="transparent"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="padding">Padding</Label>
        <Input
          id="padding"
          type="text"
          value={config.padding || '16px'}
          onChange={(e) => onChange('padding', e.target.value)}
          placeholder="e.g., 16px"
        />
      </div>

      <div>
        <Label htmlFor="borderRadius">Border Radius</Label>
        <Input
          id="borderRadius"
          type="text"
          value={config.borderRadius || '0px'}
          onChange={(e) => onChange('borderRadius', e.target.value)}
          placeholder="e.g., 8px"
        />
      </div>

      <div>
        <Label>Margin</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div>
            <Label htmlFor="marginTop" className="text-xs text-gray-500">Top</Label>
            <Input
              id="marginTop"
              type="text"
              value={config.marginTop || '0px'}
              onChange={(e) => onChange('marginTop', e.target.value)}
              placeholder="0px"
            />
          </div>
          <div>
            <Label htmlFor="marginRight" className="text-xs text-gray-500">Right</Label>
            <Input
              id="marginRight"
              type="text"
              value={config.marginRight || '0px'}
              onChange={(e) => onChange('marginRight', e.target.value)}
              placeholder="0px"
            />
          </div>
          <div>
            <Label htmlFor="marginBottom" className="text-xs text-gray-500">Bottom</Label>
            <Input
              id="marginBottom"
              type="text"
              value={config.marginBottom || '0px'}
              onChange={(e) => onChange('marginBottom', e.target.value)}
              placeholder="0px"
            />
          </div>
          <div>
            <Label htmlFor="marginLeft" className="text-xs text-gray-500">Left</Label>
            <Input
              id="marginLeft"
              type="text"
              value={config.marginLeft || '0px'}
              onChange={(e) => onChange('marginLeft', e.target.value)}
              placeholder="0px"
            />
          </div>
        </div>
      </div>
    </>
  );
}
