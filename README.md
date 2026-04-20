# Seyalla Demo

Seyalla is a role-aware retail assistant demo for Staff and Admin users.

## What is included in this upload

This GitHub upload currently contains:

- `seyalla_agent_demo (1).jsx` — the main source component
- `index.html` — the HTML entry file
- `index-C7Z7b9ut.js` — the compiled frontend bundle
- `index-CQEhPurc.css` — the compiled stylesheet

From the source file, the app includes:

- role-aware Staff/Admin behavior
- admin personas: Store Manager, Brand Manager, Country Manager
- sample business data for employees, targets, attendance, roster, leave, sales, stores, brands, and countries
- intent dictionary and dictionary-based routing
- commission calculation logic
- scope logic for staff/admin visibility
- self-check style test logic embedded in the component

## Important note

This is a frontend demo bundle plus one source JSX file.

It is not yet a complete developer repo because the uploaded files do not include:

- `package.json`
- a lock file
- Vite config
- TypeScript config
- the `@/components/ui/*` source files
- backend API code
- Supabase client/server code
- migrations in repo folders
- standalone test runner files

So this can be used as:

- a static demo deployment
- a UI/logic reference
- a starting point for rebuilding into a full repo

## Inferred stack from the uploaded files

Based on the source and build artifacts:

- React
- React DOM
- Framer Motion
- Lucide React
- local UI components under `@/components/ui/*`
- Vite-style static output

The compiled bundle explicitly shows React and React DOM version `18.3.1`.

## Suggested repo structure

```text
src/
  seyalla_agent_demo.jsx
public/
  index.html
dist/
  assets/
    index-C7Z7b9ut.js
    index-CQEhPurc.css
docs/
  README.md
  requirements.txt
  CONNECT_LIVE_APP.md
```

## What this app does today

### Staff
- commission explanation
- target progress
- earn-more coaching
- sales summary
- category performance
- historical comparison
- ranking position
- roster and attendance
- leave and shift swap support
- daily briefing
- coaching suggestions

### Admin
- scope-aware performance summary
- approvals inbox
- support watchlist
- coaching candidates
- ranking
- historical comparison
- operational issue summary
- category drivers
- executive-style summary

## Recommended next step

Turn this into a proper source repo by adding:

1. `package.json`
2. the missing UI component source files
3. Vite config
4. an API/backend layer
5. Supabase integration
6. standalone tests
