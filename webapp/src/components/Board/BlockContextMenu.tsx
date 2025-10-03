import { Copy, Clipboard, CopyPlus, Trash2 } from 'lucide-react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';

interface BlockContextMenuProps {
  children: React.ReactNode;
  onCopyStyle: () => void;
  onPasteStyle: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  hasCopiedStyle: boolean;
}

export function BlockContextMenu({
  children,
  onCopyStyle,
  onPasteStyle,
  onDuplicate,
  onDelete,
  hasCopiedStyle,
}: BlockContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={onCopyStyle}>
          <Copy className="mr-2 h-4 w-4" />
          Copy Style
        </ContextMenuItem>
        <ContextMenuItem onClick={onPasteStyle} disabled={!hasCopiedStyle}>
          <Clipboard className="mr-2 h-4 w-4" />
          Paste Style
        </ContextMenuItem>
        <ContextMenuItem onClick={onDuplicate}>
          <CopyPlus className="mr-2 h-4 w-4" />
          Duplicate
        </ContextMenuItem>
        <ContextMenuItem onClick={onDelete} className="text-red-600">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
