import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SettingsSectionHeader } from '@/components/ui/settings-section-header';
import { Button } from '@/components/ui/button';
import { AlignLeft, AlignCenter, AlignRight, AlignVerticalSpaceAround, AlignStartVertical, AlignEndVertical } from 'lucide-react';

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
        <Label>Alignment</Label>
        <div className="flex gap-1 mt-2">
          <Button
            type="button"
            variant={config.alignment === 'left' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange('alignment', 'left')}
            className="flex-1"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={config.alignment === 'center' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange('alignment', 'center')}
            className="flex-1"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={config.alignment === 'right' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange('alignment', 'right')}
            className="flex-1"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={config.verticalAlignment === 'top' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange('verticalAlignment', 'top')}
            className="flex-1"
          >
            <AlignStartVertical className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={config.verticalAlignment === 'middle' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange('verticalAlignment', 'middle')}
            className="flex-1"
          >
            <AlignVerticalSpaceAround className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={config.verticalAlignment === 'bottom' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange('verticalAlignment', 'bottom')}
            className="flex-1"
          >
            <AlignEndVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}
