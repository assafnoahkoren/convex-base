import { useState } from 'react';
import type { HeaderConfig } from './HeaderSettings';

const getVerticalAlignClass = (align: string) => {
  switch (align) {
    case 'middle': return 'flex items-center';
    case 'bottom': return 'flex items-end';
    default: return 'flex items-start';
  }
};

export function HeaderComponent({
  config,
  onConfigChange
}: {
  config: HeaderConfig;
  onConfigChange?: (config: HeaderConfig) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(config.text || 'Header');

  const handleClick = (e: React.MouseEvent) => {
    if (onConfigChange) {
      e.stopPropagation();
      setIsEditing(true);
      setEditText(config.text || 'Header');
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (onConfigChange && editText !== config.text) {
      onConfigChange({ ...config, text: editText });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleBlur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditText(config.text || 'Header');
    }
  };

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
      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          className="w-full bg-transparent border-none outline-none"
          style={{
            fontSize: config.fontSize || '24px',
            color: config.color || '#000000',
            textAlign: config.alignment || 'left',
            fontWeight: config.fontWeight || 'bold',
          }}
        />
      ) : (
        <h1
          className="w-full cursor-text"
          style={{ fontWeight: config.fontWeight || 'bold' }}
          onClick={handleClick}
        >
          {config.text || 'Header'}
        </h1>
      )}
    </div>
  );
}
