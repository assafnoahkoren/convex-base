import { Type } from 'lucide-react';
import type { BoardComponent } from '../types';
import { HeaderComponent } from './HeaderComponent';
import { HeaderSettings, type HeaderConfig } from './HeaderSettings';

export const headerComponent: BoardComponent<HeaderConfig> = {
  type: 'header',
  displayName: 'Header',
  icon: Type,
  render: (config) => <HeaderComponent config={config} />,
  settings: (props) => <HeaderSettings {...props} />,
  defaultConfig: {
    text: 'New Header',
    fontSize: '32px',
    color: '#000000',
    alignment: 'left',
    verticalAlignment: 'top',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    padding: '16px',
    borderRadius: '0px',
  },
  defaultSize: {
    w: 6,
    h: 1,
  },
};
