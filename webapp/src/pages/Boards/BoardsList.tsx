import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateBoardModal } from './CreateBoardModal';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function BoardsList() {
  const { t } = useTranslation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const boards = useQuery(api.boards.list);
  const duplicateBoard = useMutation(api.boards.duplicate);
  const deleteBoard = useMutation(api.boards.deleteBoard);
  const navigate = useNavigate();

  const handleDuplicate = async (boardId: Id<'boards'>) => {
    try {
      await duplicateBoard({ boardId });
    } catch (error) {
      alert(t('boards.list.duplicateError'));
    }
  };

  const handleDelete = async (boardId: Id<'boards'>) => {
    if (!confirm(t('boards.list.deleteConfirm'))) {
      return;
    }
    try {
      await deleteBoard({ boardId });
    } catch (error: any) {
      alert(error.message || t('boards.list.deleteError'));
    }
  };

  if (boards === undefined) {
    return <div>{t('common.loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('boards.list.title')}</h1>
          <p className="text-muted-foreground">{t('boards.list.subtitle')}</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>{t('boards.list.createButton')}</Button>
      </div>

      {boards.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-semibold mb-2">{t('boards.list.noBoardsTitle')}</h3>
            <p className="text-muted-foreground mb-4">{t('boards.list.noBoardsSubtitle')}</p>
            <Button onClick={() => setIsCreateModalOpen(true)}>{t('boards.list.createFirstButton')}</Button>
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
                  {t('boards.list.lastUpdated')}: {new Date(board.updatedAt).toLocaleDateString()}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/boards/${board._id}/edit`)}
                  >
                    {t('boards.list.editButton')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/boards/${board._id}/view`, '_blank')}
                  >
                    {t('boards.list.previewButton')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDuplicate(board._id)}
                  >
                    {t('boards.list.duplicateButton')}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(board._id)}
                  >
                    {t('boards.list.deleteButton')}
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
