# Claude Code Guidelines for This Repository

This document provides guidelines and conventions for working on this codebase with Claude Code.

## Project Overview

This is a SaaS application for managing digital signage boards on office smart TVs, built with:
- **Frontend**: React + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Convex (real-time database, auth, functions)
- **Features**: Multi-organization support, role-based permissions, i18n (English/Hebrew)

## Project Structure

```
convex-base/
├── convex/                    # Backend (Convex functions, schema, mutations/queries)
│   ├── models/               # Database schema definitions by domain
│   │   ├── auth.ts          # Auth tables (from @convex-dev/auth)
│   │   ├── organization.ts  # Organizations and members
│   │   └── board.ts         # Boards, versions, displays
│   ├── schema.ts            # Main schema combining all models
│   ├── organizations.ts     # Organization queries/mutations
│   ├── boards.ts            # Board queries/mutations
│   └── users.ts             # User queries/mutations
│
└── webapp/
    ├── src/
    │   ├── components/      # Reusable UI components
    │   │   ├── ui/         # shadcn/ui components
    │   │   ├── Shell.tsx   # Main app shell with header/nav
    │   │   └── Sidebar.tsx # Navigation sidebar
    │   ├── contexts/       # React contexts for global state
    │   │   ├── GlobalContext.tsx      # Wrapper for all contexts
    │   │   └── OrganizationContext.tsx # Current organization state
    │   ├── domains/        # Feature-specific code organized by domain
    │   │   └── onboarding/ # Onboarding flow
    │   ├── pages/          # Page components (routes)
    │   │   ├── Boards/    # Boards list, editor, viewer
    │   │   ├── Login.tsx
    │   │   └── Register.tsx
    │   ├── i18n/           # Internationalization
    │   │   ├── config.ts  # i18next configuration
    │   │   └── locales/   # Translation files
    │   │       ├── en.ts  # English (source of truth for keys)
    │   │       └── he.ts  # Hebrew (must match English keys)
    │   └── router.tsx      # React Router configuration
```

## Coding Conventions

### File Organization

1. **Convex Backend**:
   - Keep models in `convex/models/` organized by domain
   - Functions go in root `convex/` directory (e.g., `boards.ts`, `organizations.ts`)
   - Exports must be at root level for Convex to recognize them

2. **Frontend**:
   - Use `domains/` folder for feature-specific code (pages, hooks, components)
   - Use `pages/` for top-level route components
   - Keep reusable UI components in `components/`

### Naming Conventions

- **Files**: PascalCase for components (`BoardsList.tsx`), camelCase for utilities
- **Components**: PascalCase, one component per file
- **Functions/Variables**: camelCase
- **Types/Interfaces**: PascalCase
- **Constants**: UPPER_SNAKE_CASE for true constants, camelCase for configuration objects

### Import Paths

- Use `@/` alias for `webapp/src/` imports
- Use `@convex/` alias for convex-generated API imports
- Convex imports: `import { api } from '@convex/_generated/api'`
- Type imports: `import type { Id } from '@convex/_generated/dataModel'`

### TypeScript

- Always use TypeScript, avoid `any` when possible
- Use `type` for simple types, `interface` for object shapes
- Import types with `import type` for type-only imports
- Convex types: Use generated types from `_generated/dataModel`

### React Patterns

- Functional components with hooks only
- Use `useTranslation()` for all text strings
- Keep components focused and single-responsibility
- Extract complex logic into custom hooks

### Convex Backend Patterns

```typescript
// Query example
export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Query logic here
    return results;
  },
});

// Mutation example
export const create = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check permissions
    // Mutate data
    return newId;
  },
});
```

### Internationalization (i18n)

1. **Translation Files**:
   - All translations in `webapp/src/i18n/locales/`
   - English (`en.ts`) is the source of truth
   - Hebrew (`he.ts`) must have exact same keys
   - Use flat structure with dot notation: `'boards.list.title'`

2. **Adding New Translations**:
   ```typescript
   // 1. Add to en.ts
   'feature.action.label': 'My Label',

   // 2. Add matching key to he.ts
   'feature.action.label': 'התווית שלי',

   // 3. Use in component
   const { t } = useTranslation();
   <Label>{t('feature.action.label')}</Label>
   ```

3. **Type Safety**:
   - English exports `TranslationKeys` type
   - Hebrew uses `Translations` type (enforces same keys)
   - TypeScript will error if keys don't match

### RTL Support

- Document direction set automatically on language change
- Sidebar opens from right in Hebrew, left in English
- Close buttons position dynamically based on side
- Use logical CSS properties when possible (e.g., `margin-inline-start` vs `margin-left`)

### Permissions & Auth

- Use `getAuthUserId(ctx)` in Convex functions
- Check role before mutations: `if (role !== "admin" && role !== "owner")`
- Roles: `owner` (full control) > `admin` (manage) > `member` (view only)
- Hide UI elements for unauthorized users

### Database Schema

- Define schemas in `convex/models/*.ts`
- Export as objects: `export const boardModels = { ... }`
- Combine in `convex/schema.ts`: `...authModels, ...organizationModels, ...boardModels`
- Always index foreign keys and common query fields

### Component Patterns

```typescript
// Component with translations and Convex
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';

export default function MyComponent() {
  const { t } = useTranslation();
  const data = useQuery(api.myDomain.list);
  const doAction = useMutation(api.myDomain.action);

  // Component logic

  return (
    <div>
      <h1>{t('myDomain.title')}</h1>
      {/* ... */}
    </div>
  );
}
```

### UI Components (shadcn/ui)

- Use existing components from `components/ui/`
- Import: `import { Button } from '@/components/ui/button'`
- Customize via className, not by modifying ui components
- Variants: Use built-in variants when available

### Error Handling

- Backend: Throw descriptive errors: `throw new Error("User message")`
- Frontend: Use try/catch and display user-friendly messages via `alert()` or toast
- Always use translated error messages: `alert(t('error.key'))`

### State Management

- Global state: Use React Context (see `GlobalContext.tsx`)
- Local state: `useState` for simple state
- Server state: Convex queries (automatic reactivity)
- Form state: Local `useState` or form libraries

### Routing

- Routes defined in `webapp/src/router.tsx`
- Wrap protected routes with `<ProtectedRoute>`
- Shell wrapper adds header/sidebar: `<Shell><Page /></Shell>`

## Development Workflow

### Adding a New Feature

1. **Plan**: Review `PLAN.md` for feature specifications
2. **Backend First**:
   - Add schema to `convex/models/` if needed
   - Create queries/mutations in `convex/`
   - Test in Convex dashboard
3. **Frontend**:
   - Add translations to `en.ts` and `he.ts`
   - Create page/component in appropriate folder
   - Add route if needed
   - Use Convex hooks to fetch/mutate data
4. **Test**: Use Playwright to test complete user flow

### Adding Translations

1. Add keys to `webapp/src/i18n/locales/en.ts`
2. Add matching keys to `webapp/src/i18n/locales/he.ts`
3. TypeScript will enforce key matching

### Adding a Page

1. Create component in `webapp/src/pages/YourFeature/`
2. Add route in `webapp/src/router.tsx`
3. Add navigation link in `Sidebar.tsx` if needed
4. Add translations for all text

### Convex Development

- Run `npx convex dev` for local development
- Schema changes require backend restart
- Functions auto-reload on save
- Use Convex dashboard for testing queries/mutations

## Important Notes

- **Never commit without permission**: Only create commits when explicitly asked
- **Organization scoping**: All data should be scoped to current organization
- **Permissions**: Always check user role before mutations
- **Translations**: All user-facing text must use `t()` function
- **RTL**: Test both LTR and RTL layouts
- **Real-time**: Convex queries are reactive - UI updates automatically

## Common Patterns

### Check Current Organization
```typescript
const { currentOrganization } = useOrganization();
if (!currentOrganization) return <div>Loading...</div>;
```

### Permission Check (Backend)
```typescript
const membership = await ctx.db
  .query("organizationMembers")
  .withIndex("by_organization_and_user", (q) =>
    q.eq("organizationId", orgId).eq("userId", userId)
  )
  .first();

if (membership.role !== "admin" && membership.role !== "owner") {
  throw new Error("Permission denied");
}
```

### Create with Ownership
```typescript
const boardId = await ctx.db.insert("boards", {
  organizationId: membership.organizationId,
  createdBy: userId,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  // ...
});
```

## Resources

- [Convex Docs](https://docs.convex.dev)
- [React i18next](https://react.i18next.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- Project Plan: See `PLAN.md`

## Questions?

Refer to existing code for examples. Most patterns are already implemented in:
- Auth: `pages/Login.tsx`, `pages/Register.tsx`
- Boards: `pages/Boards/BoardsList.tsx`, `convex/boards.ts`
- Organizations: `convex/organizations.ts`
- i18n: Any component using `useTranslation()`
