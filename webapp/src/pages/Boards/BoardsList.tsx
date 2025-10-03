import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateBoardModal } from './CreateBoardModal';
import { useNavigate } from 'react-router-dom';

export default function BoardsList() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const boards = useQuery(api.boards.list);
  const duplicateBoard = useMutation(api.boards.duplicate);
  const deleteBoard = useMutation(api.boards.deleteBoard);
  const navigate = useNavigate();

  const handleDuplicate = async (boardId: Id<'boards'>) => {
    try {
      await duplicateBoard({ boardId });
    } catch (error) {
      alert('Failed to duplicate board');
    }
  };

  const handleDelete = async (boardId: Id<'boards'>) => {
    if (!confirm('Are you sure you want to delete this board?')) {
      return;
    }
    try {
      await deleteBoard({ boardId });
    } catch (error: any) {
      alert(error.message || 'Failed to delete board');
    }
  };

  if (boards === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Boards</h1>
          <p className="text-muted-foreground">Manage your organization's display boards</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>Create Board</Button>
      </div>

      {boards.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-semibold mb-2">No boards yet</h3>
            <p className="text-muted-foreground mb-4">Create your first board to get started</p>
            <Button onClick={() => setIsCreateModalOpen(true)}>Create Your First Board</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {boards.map((board) => (
            <Card key={board._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{board.name}</CardTitle>
                {board.description && (
                  <CardDescription>{board.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-4">
                  Last updated: {new Date(board.updatedAt).toLocaleDateString()}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/boards/${board._id}/edit`)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/boards/${board._id}/view`, '_blank')}
                  >
                    Preview
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDuplicate(board._id)}
                  >
                    Duplicate
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(board._id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateBoardModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
