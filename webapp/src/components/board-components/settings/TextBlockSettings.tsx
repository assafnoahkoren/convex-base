import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SettingsSectionHeader } from '@/components/ui/settings-section-header';

export interface TextBlockConfig {
  fontSize?: string;
  color?: string;
  alignment?: React.CSSProperties['textAlign'];
  verticalAlignment?: 'top' | 'middle' | 'bottom';
  fontWeight?: 'normal' | 'bold' | 'lighter';
}

interface TextBlockSettingsProps {
  config: TextBlockConfig;
  onChange: (field: string, value: string) => void;
  fontSizeOptions?: string[];
}

export function TextBlockSettings({ config, onChange, fontSizeOptions }: TextBlockSettingsProps) {
  const defaultFontSizes = fontSizeOptions || [
    '12px', '14px', '16px', '18px', '20px', '24px', '32px', '40px', '48px'
  ];

  return (
    <>
      <SettingsSectionHeader title="Text Styling" />

      <div>
        <Label htmlFor="fontSize">Font Size</Label>
        <Select
          value={config.fontSize || '16px'}
          onValueChange={(value) => onChange('fontSize', value)}
        >
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
        <Label htmlFor="color">Text Color</Label>
        <div className="flex gap-2">
          <Input
            id="color"
            type="color"
            value={config.color || '#000000'}
            onChange={(e) => onChange('color', e.target.value)}
            className="w-20 h-10"
          />
          <Input
            value={config.color || '#000000'}
            onChange={(e) => onChange('color', e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="fontWeight">Font Weight</Label>
        <Select
          value={config.fontWeight || 'normal'}
          onValueChange={(value) => onChange('fontWeight', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="bold">Bold</SelectItem>
            <SelectItem value="lighter">Lighter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="alignment">Horizontal Alignment</Label>
        <Select
          value={config.alignment || 'left'}
          onValueChange={(value) => onChange('alignment', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Start</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="right">End</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="verticalAlignment">Vertical Alignment</Label>
        <Select
          value={config.verticalAlignment || 'top'}
          onValueChange={(value) => onChange('verticalAlignment', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="top">Top</SelectItem>
            <SelectItem value="middle">Middle</SelectItem>
            <SelectItem value="bottom">Bottom</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
