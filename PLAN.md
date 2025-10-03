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

## Implementation Phases

### Phase 1: Data Models & Board Management
- [ ] Create board data model (with JSON content field)
- [ ] Create board versions data model
- [ ] Create displays data model
- [ ] Boards list page
- [ ] Create board functionality
- [ ] Delete board functionality

### Phase 2: Board Editor
- [ ] Install and configure react-grid-layout
- [ ] Basic grid editor UI
- [ ] Add Header component
- [ ] Add Text component
- [ ] Add Image component
- [ ] Save board layout to Convex
- [ ] Component configuration panel

### Phase 3: Board Viewer
- [ ] Fullscreen board viewer route
- [ ] Real-time updates from Convex
- [ ] Render all component types
- [ ] Auto-refresh on changes
- [ ] Responsive layout for different TV sizes

### Phase 4: Display Management
- [ ] Displays list page
- [ ] Create/edit display
- [ ] Assign board to display
- [ ] Display status indicators

### Phase 5: Version History
- [ ] Create version snapshot on save
- [ ] Version history list
- [ ] Preview previous versions
- [ ] Restore previous version

### Phase 6: Polish & UX
- [ ] Loading states
- [ ] Error handling
- [ ] Empty states
- [ ] Permissions enforcement (admin-only editing)
- [ ] Image upload and management
- [ ] Board duplication
- [ ] Component copy/paste
