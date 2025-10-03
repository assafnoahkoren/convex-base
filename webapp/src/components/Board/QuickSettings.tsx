import { useTranslation } from 'react-i18next';

interface QuickSettingsProps {
  gridConfig: {
    columns: number;
    rows: number;
    rowHeight: number;
    rowGap?: number;
  };
  backgroundColor: string;
  onGridConfigChange: (config: { columns: number; rows: number; rowHeight: number; rowGap?: number }) => void;
  onBackgroundColorChange: (color: string) => void;
}

export function QuickSettings({
  gridConfig,
  backgroundColor,
  onGridConfigChange,
  onBackgroundColorChange,
}: QuickSettingsProps) {
  const { t } = useTranslation();


  return (
    <div className="pt-2 border-t">
      <p className="text-xs text-gray-500 mb-2 px-2">Quick Settings</p>
      <div className="space-y-2">
        {/* Columns */}
        <div className="flex items-center justify-between px-2 py-1">
          <span className="text-xs text-gray-600">Columns</span>
          <div className="flex gap-1">
            <button
              onClick={() => onGridConfigChange({ ...gridConfig, columns: 12 })}
              className={`px-2 py-0.5 text-xs rounded ${gridConfig.columns === 12 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              12
            </button>
            <button
              onClick={() => onGridConfigChange({ ...gridConfig, columns: 24 })}
              className={`px-2 py-0.5 text-xs rounded ${gridConfig.columns === 24 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              24
            </button>
          </div>
        </div>

        {/* Row Height */}
        <div className="flex items-center justify-between px-2 py-1">
          <span className="text-xs text-gray-600">Row Height</span>
          <div className="flex gap-1">
            <button
              onClick={() => onGridConfigChange({ ...gridConfig, rowHeight: 50 })}
              className={`px-2 py-0.5 text-xs rounded ${gridConfig.rowHeight === 50 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              50
            </button>
            <button
              onClick={() => onGridConfigChange({ ...gridConfig, rowHeight: 100 })}
              className={`px-2 py-0.5 text-xs rounded ${gridConfig.rowHeight === 100 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              100
            </button>
          </div>
        </div>

        {/* Background Color */}
        <div className="px-2 py-1">
          <span className="text-xs text-gray-600 mb-1.5 block">Background</span>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => onBackgroundColorChange(e.target.value)}
              className="w-full h-8 rounded border border-gray-300 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
