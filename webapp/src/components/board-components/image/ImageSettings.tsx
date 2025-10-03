import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Loader2 } from 'lucide-react';
import type { SettingsProps } from '../types';
import { BlockSettings } from '../settings/BlockSettings';
import { SettingsSectionHeader } from '@/components/ui/settings-section-header';

export function ImageSettings({ config, onChange, boardId }: SettingsProps) {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const saveFile = useMutation(api.files.saveFile);

  const handleChange = (field: string, value: string) => {
    onChange({ ...config, [field]: value });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !boardId) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert(t('boards.editor.config.invalidFileType'));
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert(t('boards.editor.config.fileTooLarge'));
      return;
    }

    setUploading(true);
    try {
      // 1. Generate upload URL
      const uploadUrl = await generateUploadUrl();

      // 2. Upload file to Convex storage
      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const { storageId } = await response.json();

      // 3. Save file metadata with organization association
      await saveFile({ storageId, boardId });

      // 4. Update component config with storageId, clear external URL
      onChange({ ...config, storageId, imageUrl: undefined });
    } catch (error) {
      console.error('Upload error:', error);
      alert(t('boards.editor.config.uploadError'));
    } finally {
      setUploading(false);
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-4">
      <SettingsSectionHeader title="Image Source" />

      {/* File Upload Section */}
      <div>
        <Label>{t('boards.editor.config.uploadImage')}</Label>
        <div className="flex gap-2 mt-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
            id="image-upload"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('boards.editor.config.uploading')}
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                {t('boards.editor.config.chooseFile')}
              </>
            )}
          </Button>
        </div>
        {config.storageId && (
          <p className="text-sm text-green-600 mt-1">
            {t('boards.editor.config.imageUploaded')}
          </p>
        )}
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-gray-50 px-2 text-muted-foreground">
            {t('boards.editor.config.orUseUrl')}
          </span>
        </div>
      </div>

      {/* External URL Section */}
      <div>
        <Label htmlFor="imageUrl">{t('boards.editor.config.imageUrl')}</Label>
        <Input
          id="imageUrl"
          value={config.imageUrl || ''}
          onChange={(e) => handleChange('imageUrl', e.target.value)}
          placeholder="https://example.com/image.jpg"
          disabled={uploading}
        />
      </div>

      <div>
        <Label htmlFor="alt">{t('boards.editor.config.altText')}</Label>
        <Input
          id="alt"
          value={config.alt || ''}
          onChange={(e) => handleChange('alt', e.target.value)}
          placeholder="Image description"
        />
      </div>

      <div>
        <Label htmlFor="fit">{t('boards.editor.config.imageFit')}</Label>
        <Select value={config.fit || 'cover'} onValueChange={(value) => handleChange('fit', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cover">{t('boards.editor.config.fitCover')}</SelectItem>
            <SelectItem value="contain">{t('boards.editor.config.fitContain')}</SelectItem>
            <SelectItem value="fill">{t('boards.editor.config.fitFill')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <BlockSettings config={config} onChange={handleChange} />
    </div>
  );
}
