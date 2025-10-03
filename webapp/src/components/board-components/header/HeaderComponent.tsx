import type { HeaderConfig } from './HeaderSettings';

const getVerticalAlignClass = (align: string) => {
  switch (align) {
    case 'middle': return 'flex items-center';
    case 'bottom': return 'flex items-end';
    default: return 'flex items-start';
  }
};

export function HeaderComponent({ config }: { config: HeaderConfig }) {
  return (
    <div
      className={`h-full ${getVerticalAlignClass(config.verticalAlignment || 'top')}`}
      style={{
        fontSize: config.fontSize || '24px',
        color: config.color || '#000000',
        textAlign: config.alignment || 'left',
        backgroundColor: config.backgroundColor || 'transparent',
        padding: config.padding || '16px',
        borderRadius: config.borderRadius || '0px',
        fontWeight: config.fontWeight || 'bold',
      }}
    >
      <h1 className="w-full" style={{ fontWeight: config.fontWeight || 'bold' }}>
        {config.text || 'Header'}
      </h1>
    </div>
  );
}
