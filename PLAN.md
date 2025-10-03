# Application Feature Plan

## Product Vision
A SaaS platform for organizations to create and manage custom content boards for their office smart TVs using a drag-and-drop interface.

## MVP Scope

### Core Features
- [x] Organization management with user roles (owner, admin, member)
- [x] User authentication and onboarding
- [ ] Multiple boards per organization
- [ ] Simple grid-based drag-and-drop board editor
- [ ] Three component types: Header, Text, Image
- [ ] Real-time content updates via Convex DB
- [ ] Board viewer (fullscreen for TV displays)
- [ ] Display/TV management (assign boards to specific TVs)
- [ ] Version history and rollback capability
- [ ] Admin-only board creation and editing

### Deferred Features (Post-MVP)
- External data integrations (APIs, databases)
- Scheduled content rotation
- Advanced components (video, iframe, charts, RSS feeds)
- Free-form positioning (Figma/Canva style)
- Monetization (board limits, display limits, storage limits)
- Scheduled content display (different content at different times)

## Technical Architecture

### Data Models

#### Boards
- id
- organizationId
- name
- description (optional)
- content (JSON object containing):
  - gridConfig (columns, rows, layout settings)
  - components (array of component objects):
    - id (component identifier)
    - type (header | text | image)
    - position (x, y, w, h in grid units)
    - config (component-specific settings):
      - Header: text, fontSize, color, alignment
      - Text: content, fontSize, color, alignment
      - Image: imageUrl, alt, fit (cover/contain)
- createdBy (userId)
- createdAt
- updatedAt

#### Board Versions
- id
- boardId
- content (snapshot of board.content JSON)
- createdBy (userId)
- createdAt

#### Displays (TVs)
- id
- organizationId
- name (e.g., "Lobby TV", "Conference Room 1")
- location (optional description)
- currentBoardId
- createdAt
- updatedAt

### Key Pages/Routes

1. **Dashboard** (`/`) - List all boards, create new board
2. **Board Editor** (`/boards/:boardId/edit`) - Drag-and-drop interface to design board
3. **Board Viewer** (`/boards/:boardId/view`) - Fullscreen display for TVs
4. **Board History** (`/boards/:boardId/history`) - View and restore previous versions
5. **Displays** (`/displays`) - Manage TVs and assign boards
6. **Organization Settings** - Manage members, settings

### Technology Stack

#### Frontend
- React + TypeScript
- React Router for routing
- **react-grid-layout** for drag-and-drop grid system
- Tailwind CSS for styling
- shadcn/ui components

#### Backend
- Convex for database and real-time updates
- Convex Auth for authentication
- File storage for images (Convex storage or external)

## Implementation Plan - Step by Step

### Step 1: Setup & Data Layer ✅
**Goal:** Complete backend foundation for boards

- [x] Create board data model (with JSON content field)
- [x] Create board versions data model
- [x] Create displays data model
- [x] Create Convex queries:
  - [x] `boards.list` - Get all boards for current organization
  - [x] `boards.get` - Get single board by ID
  - [x] `boards.getForDisplay` - Get board assigned to a display
- [x] Create Convex mutations:
  - [x] `boards.create` - Create new board with default content
  - [x] `boards.update` - Update board content
  - [x] `boards.delete` - Delete board (admin only)
  - [x] `boards.duplicate` - Duplicate existing board

**Acceptance Criteria:**
- ✅ Can create, read, update, delete boards via Convex dashboard
- ✅ Boards are scoped to organizations
- ✅ Only admins/owners can modify boards

---

### Step 2: Boards Dashboard ✅
**Goal:** List and manage boards

- [x] Create `/boards` route in router
- [x] Create `webapp/src/pages/Boards/BoardsList.tsx`:
  - [x] Display all boards in card grid
  - [x] Show board name, description, last updated
  - [x] "Create Board" button
  - [x] Actions: Edit, Duplicate, Delete
  - [x] Empty state when no boards
- [x] Create `webapp/src/pages/Boards/CreateBoardModal.tsx`:
  - [x] Form with name and description
  - [x] Initialize with default empty grid
  - [x] Redirect to editor after creation
- [x] Update Shell sidebar to include Boards link

**Acceptance Criteria:**
- ✅ Can view all organization's boards
- ✅ Can create new board with name
- ✅ Can navigate to board editor
- ✅ Can delete boards

---

### Step 3: Basic Board Viewer (Read-Only)
**Goal:** Display board content on TV screens

- [ ] Create `/boards/:boardId/view` route
- [ ] Create `webapp/src/pages/Boards/BoardViewer.tsx`:
  - [ ] Fullscreen layout (no header/nav)
  - [ ] Render grid layout
  - [ ] Render all components based on type
  - [ ] Real-time updates via Convex subscription
- [ ] Create component renderers:
  - [ ] `HeaderComponent.tsx` - Render header with styling
  - [ ] `TextComponent.tsx` - Render text with styling
  - [ ] `ImageComponent.tsx` - Render image with fit options
- [ ] Add auto-refresh every 30 seconds (fallback)

**Acceptance Criteria:**
- Can open board in fullscreen view
- All component types render correctly
- Board updates in real-time when edited
- Works on different screen sizes

---

### Step 4: Install Grid Layout Library
**Goal:** Setup drag-and-drop infrastructure

- [ ] Install react-grid-layout: `npm install react-grid-layout`
- [ ] Install types: `npm install -D @types/react-grid-layout`
- [ ] Create wrapper component `webapp/src/components/Board/GridLayout.tsx`:
  - [ ] Configure grid settings (12 columns, responsive)
  - [ ] Handle layout changes
  - [ ] Styling for grid items
- [ ] Test with mock data

**Acceptance Criteria:**
- react-grid-layout is installed and working
- Can render a basic draggable grid
- Grid changes emit events

---

### Step 5: Board Editor - Basic Layout
**Goal:** Create/edit boards with drag-and-drop

- [ ] Create `/boards/:boardId/edit` route
- [ ] Create `webapp/src/pages/Boards/BoardEditor.tsx`:
  - [ ] Two-panel layout: Toolbar (left) + Canvas (right)
  - [ ] Integrate GridLayout component
  - [ ] Save button (persists to Convex)
  - [ ] Preview button (opens viewer in new tab)
  - [ ] Back button
- [ ] Create toolbar `webapp/src/components/Board/ComponentToolbar.tsx`:
  - [ ] List of available components (Header, Text, Image)
  - [ ] Drag component to add to canvas
- [ ] Handle layout changes and save to state
- [ ] Implement save mutation call

**Acceptance Criteria:**
- Can open board in editor
- Can see existing components on grid
- Can drag components to reposition
- Can resize components
- Can save changes to Convex
- Changes reflect in viewer immediately

---

### Step 6: Add Components to Board
**Goal:** Add new components to canvas

- [ ] Implement "Add Component" flow:
  - [ ] Click component in toolbar
  - [ ] Add to grid at first available position
  - [ ] Assign unique component ID
  - [ ] Set default config based on type
- [ ] Create default configs:
  - [ ] Header: "New Header", 24px, black, left-aligned
  - [ ] Text: "New Text", 16px, black, left-aligned
  - [ ] Image: placeholder image URL, cover fit
- [ ] Add remove component button (X icon on each grid item)

**Acceptance Criteria:**
- Can click toolbar to add Header component
- Can click toolbar to add Text component
- Can click toolbar to add Image component
- New components appear on grid
- Can delete components from grid
- Components persist after save

---

### Step 7: Component Configuration Panel
**Goal:** Edit component properties

- [ ] Create `webapp/src/components/Board/ConfigPanel.tsx`:
  - [ ] Opens when component is selected
  - [ ] Right sidebar panel
  - [ ] Show current component config
  - [ ] Close/deselect button
- [ ] Create config forms for each component type:
  - [ ] `HeaderConfig.tsx` - Text input, font size, color, alignment
  - [ ] `TextConfig.tsx` - Textarea, font size, color, alignment
  - [ ] `ImageConfig.tsx` - URL input, alt text, fit (cover/contain)
- [ ] Update component config in state on change
- [ ] Auto-save or manual save button

**Acceptance Criteria:**
- Can click component to select it
- Config panel opens with current settings
- Can change Header text and see live preview
- Can change Text content and see live preview
- Can change Image URL and see live preview
- Can change font size, color, alignment
- Changes persist after save

---

### Step 8: Image Upload
**Goal:** Upload images instead of just URLs

- [ ] Setup Convex file storage
- [ ] Create `convex/images.ts`:
  - [ ] Mutation to generate upload URL
  - [ ] Query to get image URL by storage ID
- [ ] Update `ImageConfig.tsx`:
  - [ ] Add file upload button
  - [ ] Upload to Convex storage
  - [ ] Store storage ID in component config
  - [ ] Show preview thumbnail
- [ ] Update `ImageComponent.tsx` to handle storage IDs

**Acceptance Criteria:**
- Can upload image from local file
- Image is stored in Convex
- Image displays correctly in viewer
- Can still use external URLs if needed

---

### Step 9: Display Management
**Goal:** Manage TVs and assign boards

- [ ] Create `/displays` route
- [ ] Create `webapp/src/pages/Displays/DisplaysList.tsx`:
  - [ ] List all displays in table
  - [ ] Show name, location, assigned board
  - [ ] "Add Display" button
  - [ ] Actions: Edit, Delete
- [ ] Create `webapp/src/pages/Displays/DisplayForm.tsx`:
  - [ ] Form for name, location
  - [ ] Dropdown to select board
  - [ ] Save mutation
- [ ] Update viewer route to accept display ID:
  - [ ] `/displays/:displayId/view` - Load board from display
- [ ] Add displays link to sidebar

**Acceptance Criteria:**
- Can create displays with name and location
- Can assign board to display
- Can change assigned board
- Can open display-specific viewer URL
- Viewer shows assigned board in real-time

---

### Step 10: Version History
**Goal:** Track and restore board versions

- [ ] Update `boards.update` mutation:
  - [ ] Create version snapshot before updating
  - [ ] Store previous content in boardVersions
- [ ] Create Convex queries:
  - [ ] `boardVersions.list` - Get all versions for a board
  - [ ] `boardVersions.get` - Get specific version content
- [ ] Create mutation:
  - [ ] `boards.restore` - Restore board to previous version
- [ ] Create `/boards/:boardId/history` route
- [ ] Create `webapp/src/pages/Boards/BoardHistory.tsx`:
  - [ ] List versions with timestamp and author
  - [ ] Preview button for each version
  - [ ] Restore button for each version
  - [ ] Confirmation modal for restore
- [ ] Add "View History" button in board editor

**Acceptance Criteria:**
- Every save creates a version snapshot
- Can view list of all versions
- Can preview what a version looked like
- Can restore to previous version
- Current board updates after restore

---

### Step 11: Permissions & Validation
**Goal:** Enforce admin-only editing

- [ ] Create permission helper `convex/lib/permissions.ts`:
  - [ ] `canEditBoard()` - Check if user is admin/owner
  - [ ] `canManageDisplays()` - Check permissions
- [ ] Add permission checks to mutations:
  - [ ] boards.create, update, delete
  - [ ] displays.create, update, delete
- [ ] Hide edit buttons for non-admins in UI
- [ ] Show permission errors in UI
- [ ] Add role badges to user display

**Acceptance Criteria:**
- Only admins/owners can edit boards
- Only admins/owners can manage displays
- Members can only view
- Clear error messages when permissions denied
- UI hides edit options for members

---

### Step 12: Polish & UX Improvements
**Goal:** Production-ready experience

- [ ] Add loading states:
  - [ ] Skeleton loaders for board list
  - [ ] Loading spinner in editor
  - [ ] Loading state in viewer
- [ ] Add error handling:
  - [ ] Toast notifications for errors
  - [ ] Error boundaries
  - [ ] Retry logic for failed saves
- [ ] Empty states:
  - [ ] No boards yet
  - [ ] No displays yet
  - [ ] Empty canvas in editor
- [ ] Add board duplication:
  - [ ] "Duplicate" action in board list
  - [ ] Copy all content and components
  - [ ] Append "(Copy)" to name
- [ ] Add keyboard shortcuts in editor:
  - [ ] Ctrl+S to save
  - [ ] Delete key to remove component
  - [ ] Esc to deselect
- [ ] Improve grid styling:
  - [ ] Better component borders
  - [ ] Hover states
  - [ ] Selected state styling
- [ ] Add confirmation modals:
  - [ ] Confirm before deleting board
  - [ ] Confirm before deleting display
  - [ ] Warn about unsaved changes

**Acceptance Criteria:**
- All actions have appropriate loading states
- Errors are handled gracefully with user feedback
- Empty states guide users to take action
- Can duplicate boards easily
- Keyboard shortcuts work in editor
- Destructive actions require confirmation
- UI is polished and intuitive

---

### Step 13: Testing & Deployment
**Goal:** Ensure everything works end-to-end

- [ ] Test complete user flow:
  - [ ] Create organization
  - [ ] Create board
  - [ ] Add components
  - [ ] Configure components
  - [ ] Save board
  - [ ] Create display
  - [ ] Assign board to display
  - [ ] Open viewer on TV
  - [ ] Edit board and see live updates
  - [ ] Restore previous version
- [ ] Test permissions:
  - [ ] Admin can edit
  - [ ] Member cannot edit
- [ ] Test on actual TV/large display
- [ ] Performance testing with multiple components
- [ ] Deploy to production

**Acceptance Criteria:**
- Complete flow works without errors
- Real-time updates work reliably
- Displays correctly on TV screens
- Performance is acceptable
- Application is deployed and accessible
