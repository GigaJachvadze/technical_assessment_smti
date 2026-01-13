# Design Decisions

This document records key design decisions made while building the kanban demo.

## 1) Drag-and-drop approach

- Decision: Use the `dnd-kit` library for drag-and-drop.
- Rationale: Implementing drag-and-drop from scratch is time-consuming and error-prone. `dnd-kit` is a well-known, actively maintained library that provides flexible, accessible primitives and saved substantial implementation time for this short project.

## 2) State management

- Local/parent-child: Kanban-specific state (columns and cards) lives in the `KanbanBoard` component and is passed down to child components (`KanbanColumn`, `KanbanCard`) as props. This keeps drag-and-drop and column-specific updates simple and predictable.
- Global/context: Application-level UI state such as the modal and loader are implemented via React Context so they are accessible from different parts of the UI without prop-drilling.

## 3) UX decisions and alternatives considered

- Decision: Use a clean, minimal, modern UI inspired by an external UI suggestion tool (Google's Stitch AI) and implement the layout with Tailwind-like utility styles.
- Rationale: I am not primarily a UI/UX designer; using a reference design allowed me to produce a polished, pixel-accurate UI quickly. The trade-off is less bespoke interaction design and less time for micro-interaction polish.
- Alternatives considered:
  - Hand-designing a bespoke UI from scratch — gives full control but requires significantly more time.
  - Using a full UI component library (e.g., Material UI, Radix) — would speed up building accessible primitives, but for this small demo a lighter approach was chosen.

## 4) Improvements if more time was available

- Fix outstanding bugs: There are a few known issues that would benefit from additional time to diagnose and resolve.
- Backend: Replace the dev/demo LowDB file-backed store with a proper database and API layer (e.g., Postgres or MongoDB with a small service), add migrations, and improve concurrency handling.
- Validation: Add input validators and server-side validation for all API endpoints.
- Dynamic columns: Make kanban columns editable/creatable by the user instead of being static.
- Tests: Add unit and integration tests (component tests + API tests) to improve reliability.

## Notes

- Timebox: This project was completed under a tight deadline (2 days). Decisions were influenced by that constraint: prioritize working functionality, clarity, and maintainability within the available time.

If you want, I can expand this doc with diagrams (state flow, component tree), or add a short migration plan for switching to a real backend. 
