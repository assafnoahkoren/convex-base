import type { Id } from '@convex/_generated/dataModel';

export interface BoardComponentConfig {
  [key: string]: any;
}

export interface SettingsProps {
  config: BoardComponentConfig;
  onChange: (config: BoardComponentConfig) => void;
  boardId?: Id<'boards'>;
}

export interface BoardComponent {
  type: string;
  displayName: string;
  icon?: React.ComponentType<{ className?: string }>;
  render: (config: BoardComponentConfig) => JSX.Element;
  settings: (props: SettingsProps) => JSX.Element;
  defaultConfig: BoardComponentConfig;
}

export interface ComponentPosition {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface ComponentInstance {
  id: string;
  type: string;
  position: ComponentPosition;
  config: BoardComponentConfig;
}
