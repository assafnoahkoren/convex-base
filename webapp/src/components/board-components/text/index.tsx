import { AlignLeft } from 'lucide-react';
import type { BoardComponent } from '../types';
import { TextComponent } from './TextComponent';
import { TextSettings } from './TextSettings';

export const textComponent: BoardComponent = {
  type: 'text',
  displayName: 'Text',
  icon: AlignLeft,
  render: (config) => <TextComponent config={config} />,
  settings: (props) => <TextSettings {...props} />,
  defaultConfig: {
    content: 'New Text',
    fontSize: '16px',
    color: '#000000',
    alignment: 'left',
    verticalAlignment: 'top',
    fontWeight: 'normal',
    backgroundColor: 'transparent',
    padding: '16px',
    borderRadius: '0px',
  },
};
