import { ImageIcon } from 'lucide-react';
import type { BoardComponent } from '../types';
import { ImageComponent } from './ImageComponent';
import { ImageSettings } from './ImageSettings';

export const imageComponent: BoardComponent = {
  type: 'image',
  displayName: 'Image',
  icon: ImageIcon,
  render: (config) => <ImageComponent config={config} />,
  settings: (props) => <ImageSettings {...props} />,
  defaultConfig: {
    imageUrl: '',
    alt: 'Image',
    fit: 'cover',
    backgroundColor: 'transparent',
    padding: '8px',
    borderRadius: '0px',
  },
};
