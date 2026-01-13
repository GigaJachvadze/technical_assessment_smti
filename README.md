# technical_assessment_smti

This is a small Next.js + TypeScript kanban demo used for a technical assessment. It demonstrates a client-side kanban board with drag-and-drop, URL-based filters, and a file-backed LowDB store used by API routes.

**Setup**

Clone the repository and install dependencies, then run the dev server:

```bash
git clone <repo-url>
cd technical_assessment_smti

# using npm
npm install
npm run dev

# or using pnpm
pnpm install
pnpm dev
```

Open http://localhost:3000 in your browser after the dev server starts.

**Project structure (overview)**

- `src/` — application source
	- `pages/` — Next.js pages and API routes (see `pages/api/kanban/*`)
	- `ui/` — UI components
		- `components/kanban/` — kanban UI: `kanban.tsx`, `kanban.column.tsx`, `kanban.card.tsx`, `kanban.filter.tsx`, `model.ts`
		- `modal/` — modal context + modal implementation used by filters
	- `helper/` — small utilities (date/number formatting, `queryParams` helpers)
	- `db/` — LowDB JSON files used by API routes (seed/test data)
	- `styles/` — global CSS

**How filtering works**

- Filters (name, date range, value range) are stored in the browser URL query string (for example: `?name=acme&startDate=2026-01-01`).
- The UI reads and updates query params via helpers in `src/helper/queryParams.ts`. When updating query params from a React component we pass the Next.js `router` into the helper so Next detects the change and components re-run data fetches.

**Libraries used**

- `Next.js` — React framework used for pages and API routes
- `TypeScript` — static typing
- `dnd-kit` — drag-and-drop for kanban cards
- `lowdb` — file-backed JSON DB used by API routes (dev/demo only)
- `react-hot-toast` — lightweight toast notifications

If you'd like a deployment section, linting/formatting commands, or an example of using the API endpoints, tell me which you'd prefer and I can append it.