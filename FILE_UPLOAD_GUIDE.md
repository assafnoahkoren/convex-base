# File Upload with Organization-Based Authorization in Convex

## Overview

Convex provides built-in file storage with the ability to implement custom authorization. This guide explains how to upload and access files (like images) with organization-level access control.

## How It Works

### 1. **File Storage Architecture**

```
┌─────────────────────────────────────────────────────────┐
│                    Convex Storage                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  File Blob   │  │  File Blob   │  │  File Blob   │  │
│  │ (storageId)  │  │ (storageId)  │  │ (storageId)  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
           │                  │                  │
           ├──────────────────┴──────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────┐
│              Files Table (Metadata)                      │
│  ┌───────────────────────────────────────────────────┐  │
│  │ fileId, storageId, organizationId, boardId, ...   │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 2. **Authorization Flow**

1. **Upload**: User uploads file → File stored in Convex storage
2. **Metadata**: We save metadata linking the file to an organization
3. **Access**: When retrieving, we check if user belongs to the organization
4. **Serve**: If authorized, return a signed URL for the file

### 3. **Key Implementation Details**

#### Upload Process (Client → Server)

```typescript
// 1. Generate upload URL (authenticated)
const uploadUrl = await generateUploadUrl();

// 2. Upload file to Convex storage
const response = await fetch(uploadUrl, {
  method: "POST",
  body: file,
});
const { storageId } = await response.json();

// 3. Save metadata with organization association
await saveFile({ storageId, boardId });
```

#### Retrieval Process

```typescript
// 1. Request file URL with storageId
const url = await getUrl({ storageId });

// 2. Server checks:
//    - Does file exist?
//    - Is user in the same organization as the file?
//    - If yes, return signed URL
//    - If no, throw "Access denied"

// 3. Use the URL in <img src={url} />
```

### 4. **Security Features**

✅ **Organization Isolation**: Files from one organization cannot be accessed by users in another organization

✅ **Authentication Required**: All file operations require authentication

✅ **Metadata Tracking**: Track who uploaded files and when

✅ **Role-Based Deletion**: Only admins/owners can delete files

✅ **Automatic URL Expiration**: Signed URLs expire after a period (Convex handles this)

## Usage Example in ImageConfig Component

```typescript
import { useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';

export function ImageConfig({ config, onChange, boardId }) {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const saveFile = useMutation(api.files.saveFile);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // 1. Generate upload URL
      const uploadUrl = await generateUploadUrl();

      // 2. Upload file
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: file,
      });
      const { storageId } = await response.json();

      // 3. Save metadata
      await saveFile({ storageId, boardId });

      // 4. Update component config with storageId
      onChange({ ...config, storageId, imageUrl: null });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileUpload} />
      {uploading && <p>Uploading...</p>}
    </div>
  );
}
```

## Displaying Images

```typescript
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';

function ImageComponent({ config }) {
  // If storageId exists, fetch the authorized URL
  const imageUrl = useQuery(
    api.files.getUrl,
    config.storageId ? { storageId: config.storageId } : "skip"
  );

  // Fallback to external URL if no storageId
  const src = imageUrl || config.imageUrl || 'https://via.placeholder.com/300';

  return <img src={src} alt={config.alt} />;
}
```

## Why This Approach?

### ❌ Alternative: Public URLs (Not Secure)
```typescript
// This would work but has NO authorization
const url = await ctx.storage.getUrl(storageId);
// Anyone with this URL can access the file!
```

### ✅ Our Approach: Query with Authorization
```typescript
// User must be authenticated AND in the right organization
export const getUrl = query({
  handler: async (ctx, { storageId }) => {
    // Check user authentication
    // Check organization membership
    // THEN return URL
  }
});
```

## Benefits

1. **Security**: Files are protected by organization boundaries
2. **Scalability**: Convex handles file storage and CDN delivery
3. **Simplicity**: No need to manage your own S3 buckets or CDN
4. **Real-time**: File URLs update in real-time via Convex reactivity
5. **Performance**: Signed URLs are cached and served from Convex's CDN

## Migration Path

If you have existing external image URLs:

```typescript
// Component config can support both:
{
  // New approach (uploaded files)
  storageId: "k123abc...",

  // Legacy approach (external URLs)
  imageUrl: "https://example.com/image.jpg"
}

// Display logic:
const src = imageUrl || externalUrl || placeholder;
```

## Limitations

- File size limits apply (check Convex documentation for current limits)
- URLs expire after a period (automatically refreshed by Convex)
- Files count toward your Convex storage quota

## Next Steps

To implement this fully:
1. ✅ Add `files` table to schema (already done)
2. ✅ Create `files.ts` with mutations and queries (already done)
3. Update `ImageConfig.tsx` to support file uploads
4. Update `ImageComponent` to fetch URLs for uploaded files
5. Add file deletion when components are removed
6. Add file cleanup when boards are deleted
