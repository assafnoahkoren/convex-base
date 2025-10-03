import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, RotateCcw, Eye } from 'lucide-react';
import { useState } from 'react';

export default function BoardHistory() {
  const { t } = useTranslation();
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const board = useQuery(api.boards.get, { boardId: boardId as Id<'boards'> });
  const versions = useQuery(api.boardVersions.list, { boardId: boardId as Id<'boards'> });
  const restoreVersion = useMutation(api.boardVersions.restore);
  const [restoringId, setRestoringId] = useState<string | null>(null);

  const handleRestore = async (versionId: Id<'boardVersions'>) => {
    if (!confirm(t('boards.history.confirmRestore'))) {
      return;
    }

    setRestoringId(versionId);
    try {
      await restoreVersion({ versionId });
      navigate(`/boards/${boardId}/edit`);
    } catch (error) {
      alert(t('boards.history.restoreError'));
    } finally {
      setRestoringId(null);
    }
  };

  const handlePreview = (_versionId: Id<'boardVersions'>) => {
    // For now, just navigate back - in a full implementation,
    // we'd open a modal or separate page showing the version
    alert(t('boards.history.previewNotImplemented'));
  };

  if (board === undefined || versions === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {t('common.loading')}
      </div>
    );
  }

  if (!board) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Board not found
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(`/boards/${boardId}/edit`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('common.back')}
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{t('boards.history.title')}</h1>
        <p className="text-muted-foreground">
          {t('boards.history.subtitle', { boardName: board.name })}
        </p>
      </div>

      {versions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-semibold mb-2">{t('boards.history.noVersions')}</h3>
            <p className="text-muted-foreground mb-4">{t('boards.history.noVersionsSubtitle')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {versions.map((version, index) => (
            <Card key={version._id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">
                      {t('boards.history.versionNumber', { number: versions.length - index })}
                    </CardTitle>
                    <CardDescription>
                      {new Date(version.createdAt).toLocaleString()} • {version.creatorName}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreview(version._id)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      {t('boards.history.preview')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRestore(version._id)}
                      disabled={restoringId === version._id}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      {restoringId === version._id
                        ? t('boards.history.restoring')
                        : t('boards.history.restore')}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  {t('boards.history.componentCount', {
                    count: version.content.components.length,
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
