import type { Id } from '@convex/_generated/dataModel';

export interface BoardComponentConfig {
  [key: string]: any;
}

export interface SettingsProps<T extends BoardComponentConfig = BoardComponentConfig> {
  config: T;
  onChange: (config: T) => void;
  boardId?: Id<'boards'>;
}

export interface BoardComponent<T extends BoardComponentConfig = BoardComponentConfig> {
  type: string;
  displayName: string;
  icon?: React.ComponentType<{ className?: string }>;
  render: (config: T) => JSX.Element;
  settings: (props: SettingsProps<T>) => JSX.Element;
  defaultConfig: T;
  defaultSize: {
    w: number;
    h: number;
  };
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
