import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useTranslation } from 'react-i18next';

interface CreateBoardModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateBoardModal({ open, onClose }: CreateBoardModalProps) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createBoard = useMutation(api.boards.create);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const boardId = await createBoard({
        name,
        description: description || undefined,
      });

      // Reset form
      setName('');
      setDescription('');
      onClose();

      // Navigate to editor
      navigate(`/boards/${boardId}/edit`);
    } catch (error) {
      alert(t('boards.create.error'));
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t('boards.create.title')}</SheetTitle>
          <SheetDescription>
            {t('boards.create.description')}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor="name">{t('boards.create.nameLabel')}</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder={t('boards.create.namePlaceholder')}
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">{t('boards.create.descriptionLabel')}</Label>
            <Input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('boards.create.descriptionPlaceholder')}
              disabled={isSubmitting}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? t('boards.create.creating') : t('boards.create.submitButton')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              {t('boards.create.cancelButton')}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
