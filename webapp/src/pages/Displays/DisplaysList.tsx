import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Edit } from 'lucide-react';

export default function DisplaysList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const displays = useQuery(api.displays.list);
  const boards = useQuery(api.boards.list);
  const createDisplay = useMutation(api.displays.create);
  const deleteDisplay = useMutation(api.displays.remove);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newDisplayLocation, setNewDisplayLocation] = useState('');

  const handleCreate = async () => {
    if (!newDisplayName.trim()) return;

    await createDisplay({
      name: newDisplayName,
      location: newDisplayLocation || undefined,
    });

    setNewDisplayName('');
    setNewDisplayLocation('');
    setIsCreateDialogOpen(false);
  };

  const handleDelete = async (displayId: Id<'displays'>) => {
    if (confirm('Are you sure you want to delete this display?')) {
      await deleteDisplay({ displayId });
    }
  };

  const getBoardName = (boardId?: Id<'boards'>) => {
    if (!boardId || !boards) return 'None';
    const board = boards.find((b) => b._id === boardId);
    return board?.name || 'Unknown';
  };

  if (displays === undefined || boards === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {t('common.loading')}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Displays</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Display
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Display</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Display Name</Label>
                <Input
                  id="name"
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  placeholder="e.g., Lobby Display"
                />
              </div>
              <div>
                <Label htmlFor="location">Location (Optional)</Label>
                <Input
                  id="location"
                  value={newDisplayLocation}
                  onChange={(e) => setNewDisplayLocation(e.target.value)}
                  placeholder="e.g., Main Building, Floor 1"
                />
              </div>
              <Button onClick={handleCreate} className="w-full">
                Create Display
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {displays.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No displays yet. Create your first display to get started.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Current Board</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displays.map((display) => (
              <TableRow key={display._id}>
                <TableCell className="font-medium">{display.name}</TableCell>
                <TableCell>{display.location || '-'}</TableCell>
                <TableCell>{getBoardName(display.currentBoardId)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/displays/${display._id}`)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(display._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
