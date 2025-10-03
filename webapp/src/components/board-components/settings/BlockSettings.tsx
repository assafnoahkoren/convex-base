import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export interface BlockConfig {
  backgroundColor?: string;
  padding?: string;
  borderRadius?: string;
}

interface BlockSettingsProps {
  config: BlockConfig;
  onChange: (field: string, value: string) => void;
}

export function BlockSettings({ config, onChange }: BlockSettingsProps) {
  return (
    <>
      <div>
        <Label htmlFor="backgroundColor">Background Color</Label>
        <div className="flex gap-2">
          <Input
            id="backgroundColor"
            type="color"
            value={config.backgroundColor || '#ffffff'}
            onChange={(e) => onChange('backgroundColor', e.target.value)}
            className="w-20 h-10"
          />
          <Input
            value={config.backgroundColor || '#ffffff'}
            onChange={(e) => onChange('backgroundColor', e.target.value)}
            className="flex-1"
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
    </>
  );
}
