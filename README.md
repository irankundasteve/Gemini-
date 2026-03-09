# Verdant Vault (MERN)

Luxury urban micro-farming subscription platform with a public storefront and a role-locked admin control vault.

## Stack
- React + Vite frontend
- Node.js + Express API
- MongoDB via Mongoose

## Run locally
```bash
npm install
npm run dev
```

- Frontend: `http://localhost:5173`
- API: `http://localhost:4000`

## Public Experience
- Home
- Archive
- The Science
- Custom 404

## Admin Panel UX
- Sidebar (260px / collapsible rail), fixed 64px header, 1440px content max-width
- Brand palette: `#0B3D2E`, `#B87333`, `#87A96B`, `#333333`, `#F9F9F7`
- Role views: Super Admin, Agronomist, Inventory Manager, Content Editor
- Modules: User/Client, Content, Orders & Inventory, Analytics, Forms, Media
- Includes empty, loading, and error state examples for each module

## API Notes
- `GET /api/impact`
- `GET /api/archive`
- `GET /api/admin/roles`
- `GET /api/admin/dashboard`
- `GET /api/admin/module/:moduleKey`
- `POST /api/admin/archive`
- `POST /api/admin/content/seo`
- `GET /api/admin/audit-logs`

Use headers `x-role` and `x-user-id` to simulate role-based access and audit events.
