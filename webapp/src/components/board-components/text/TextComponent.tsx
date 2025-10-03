import type { TextConfig } from './TextSettings';

const getVerticalAlignClass = (align: string) => {
  switch (align) {
    case 'middle': return 'flex items-center';
    case 'bottom': return 'flex items-end';
    default: return 'flex items-start';
  }
};

export function TextComponent({ config }: { config: TextConfig }) {
  return (
    <div
      className={`h-full ${getVerticalAlignClass(config.verticalAlignment || 'top')}`}
      style={{
        fontSize: config.fontSize || '16px',
        color: config.color || '#000000',
        textAlign: (config.alignment || 'left') as React.CSSProperties['textAlign'],
        backgroundColor: config.backgroundColor || 'transparent',
        padding: config.padding || '16px',
        borderRadius: config.borderRadius || '0px',
        fontWeight: config.fontWeight || 'normal',
        marginTop: config.marginTop || '0px',
        marginRight: config.marginRight || '0px',
        marginBottom: config.marginBottom || '0px',
        marginLeft: config.marginLeft || '0px',
      }}
    >
      <p className="w-full" style={{ fontWeight: config.fontWeight || 'normal' }}>
        {config.content || 'Text'}
      </p>
    </div>
  );
}
