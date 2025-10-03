import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface BoardSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gridConfig: {
    columns: number;
    rows: number;
    rowHeight: number;
    rowGap?: number;
  };
  backgroundColor?: string;
  onGridConfigChange: (config: { columns: number; rows: number; rowHeight: number; rowGap?: number }) => void;
  onBackgroundColorChange: (color: string) => void;
}

export function BoardSettings({
  open,
  onOpenChange,
  gridConfig,
  backgroundColor = '#ffffff',
  onGridConfigChange,
  onBackgroundColorChange,
}: BoardSettingsProps) {
  const { t } = useTranslation();

  const handleColumnsChange = (value: string) => {
    const columns = parseInt(value);
    if (!isNaN(columns) && columns > 0 && columns <= 24) {
      onGridConfigChange({ ...gridConfig, columns });
    }
  };

  const handleRowsChange = (value: string) => {
    const rows = parseInt(value);
    if (!isNaN(rows) && rows > 0 && rows <= 100) {
      onGridConfigChange({ ...gridConfig, rows });
    }
  };

  const handleRowHeightChange = (value: string) => {
    const rowHeight = parseInt(value);
    if (!isNaN(rowHeight) && rowHeight > 0 && rowHeight <= 500) {
      onGridConfigChange({ ...gridConfig, rowHeight });
    }
  };

  const handleRowGapChange = (value: string) => {
    const rowGap = parseInt(value);
    if (!isNaN(rowGap) && rowGap >= 0 && rowGap <= 100) {
      onGridConfigChange({ ...gridConfig, rowGap });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('boards.settings.title')}</DialogTitle>
          <DialogDescription>{t('boards.settings.description')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Background Color */}
          <div className="space-y-2">
            <Label htmlFor="backgroundColor">{t('boards.settings.backgroundColor')}</Label>
            <div className="flex gap-2">
              <Input
                id="backgroundColor"
                type="color"
                value={backgroundColor}
                onChange={(e) => onBackgroundColorChange(e.target.value)}
                className="w-20 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={backgroundColor}
                onChange={(e) => onBackgroundColorChange(e.target.value)}
                placeholder="#ffffff"
                className="flex-1"
              />
            </div>
          </div>

          {/* Grid Columns */}
          <div className="space-y-2">
            <Label htmlFor="columns">{t('boards.settings.columns')}</Label>
            <Input
              id="columns"
              type="number"
              min="1"
              max="24"
              value={gridConfig.columns}
              onChange={(e) => handleColumnsChange(e.target.value)}
            />
            <p className="text-xs text-gray-500">{t('boards.settings.columnsHelp')}</p>
          </div>

          {/* Grid Rows */}
          <div className="space-y-2">
            <Label htmlFor="rows">{t('boards.settings.rows')}</Label>
            <Input
              id="rows"
              type="number"
              min="1"
              max="100"
              value={gridConfig.rows}
              onChange={(e) => handleRowsChange(e.target.value)}
            />
            <p className="text-xs text-gray-500">{t('boards.settings.rowsHelp')}</p>
          </div>

          {/* Row Height */}
          <div className="space-y-2">
            <Label htmlFor="rowHeight">{t('boards.settings.rowHeight')}</Label>
            <Input
              id="rowHeight"
              type="number"
              min="10"
              max="500"
              value={gridConfig.rowHeight}
              onChange={(e) => handleRowHeightChange(e.target.value)}
            />
            <p className="text-xs text-gray-500">{t('boards.settings.rowHeightHelp')}</p>
          </div>

          {/* Row Gap */}
          <div className="space-y-2">
            <Label htmlFor="rowGap">Row Gap</Label>
            <Input
              id="rowGap"
              type="number"
              min="0"
              max="100"
              value={gridConfig.rowGap || 0}
              onChange={(e) => handleRowGapChange(e.target.value)}
            />
            <p className="text-xs text-gray-500">Spacing between rows (in pixels)</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
