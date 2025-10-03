import type { BoardComponent } from './types';
import { headerComponent } from './header';
import { textComponent } from './text';
import { imageComponent } from './image';

// Component registry - all available board components
export const boardComponents: Record<string, BoardComponent> = {
  header: headerComponent,
  text: textComponent,
  image: imageComponent,
};

// Get component by type
export function getComponent(type: string): BoardComponent | undefined {
  return boardComponents[type];
}

// Get all component types
export function getComponentTypes(): string[] {
  return Object.keys(boardComponents);
}

// Get all components as array
export function getAllComponents(): BoardComponent[] {
  return Object.values(boardComponents);
}

// Re-export types
export * from './types';
