import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';

export default function DisplayEditor() {
  const { t } = useTranslation();
  const { displayId } = useParams<{ displayId: string }>();
  const navigate = useNavigate();

  const display = useQuery(api.displays.get, { displayId: displayId as Id<'displays'> });
  const boards = useQuery(api.boards.list);
  const updateDisplay = useMutation(api.displays.update);

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [currentBoardId, setCurrentBoardId] = useState<string>('__none__');

  useEffect(() => {
    if (display) {
      setName(display.name);
      setLocation(display.location || '');
      setCurrentBoardId(display.currentBoardId || '__none__');
    }
  }, [display]);

  const handleSave = async () => {
    if (!displayId) return;

    await updateDisplay({
      displayId: displayId as Id<'displays'>,
      name,
      location: location || undefined,
      currentBoardId: currentBoardId !== '__none__' ? (currentBoardId as Id<'boards'>) : undefined,
    });

    navigate('/displays');
  };

  if (display === undefined || boards === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {t('common.loading')}
      </div>
    );
  }

  if (!display) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Display not found
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/displays')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Edit Display</h1>
      </div>

      <div className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
          <Label htmlFor="name">Display Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Lobby Display"
          />
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Main Building, Floor 1"
          />
        </div>

        <div>
          <Label htmlFor="board">Current Board</Label>
          <Select value={currentBoardId} onValueChange={setCurrentBoardId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a board" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">None</SelectItem>
              {boards.map((board) => (
                <SelectItem key={board._id} value={board._id}>
                  {board.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-4">
          <Button onClick={handleSave} className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
          <Button variant="outline" onClick={() => navigate('/displays')}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
