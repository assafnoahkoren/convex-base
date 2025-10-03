import type { BoardComponentConfig } from '../types';

const getVerticalAlignClass = (align: string) => {
  switch (align) {
    case 'middle': return 'flex items-center';
    case 'bottom': return 'flex items-end';
    default: return 'flex items-start';
  }
};

export function TextComponent({ config }: { config: BoardComponentConfig }) {
  return (
    <div
      className={`h-full ${getVerticalAlignClass(config.verticalAlignment || 'top')}`}
      style={{
        fontSize: config.fontSize || '16px',
        color: config.color || '#000000',
        textAlign: config.alignment || 'left',
        backgroundColor: config.backgroundColor || 'transparent',
        padding: config.padding || '16px',
        borderRadius: config.borderRadius || '0px',
        fontWeight: config.fontWeight || 'normal',
      }}
    >
      <p className="w-full" style={{ fontWeight: config.fontWeight || 'normal' }}>
        {config.content || 'Text'}
      </p>
    </div>
  );
}
