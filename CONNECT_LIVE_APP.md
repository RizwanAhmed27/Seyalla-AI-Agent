# CONNECT_LIVE_APP.md

This file explains how to connect the uploaded Seyalla frontend demo to a live app.

## 1. Understand what you currently have

Your uploaded files are mainly a frontend demo:

- `seyalla_agent_demo (1).jsx` = source logic
- `index.html` = entry page
- `index-C7Z7b9ut.js` = compiled frontend bundle
- `index-CQEhPurc.css` = compiled CSS

This means the current upload is best treated as a UI prototype / static demo.

To connect it to a live app properly, you need to rebuild it as a normal frontend project.

## 2. Create a proper frontend project

Use Vite + React.

### Step 1
Create a new React app:

```bash
npm create vite@latest seyalla-live -- --template react
```

### Step 2
Go into the project:

```bash
cd seyalla-live
```

### Step 3
Install dependencies:

```bash
npm install react@18.3.1 react-dom@18.3.1 framer-motion lucide-react
```

### Step 4
Add your UI layer.
Because your uploaded JSX imports local UI files like:

- `@/components/ui/card`
- `@/components/ui/button`
- `@/components/ui/input`
- `@/components/ui/badge`
- `@/components/ui/scroll-area`

you must either:

- recreate those files in your repo, or
- replace those imports with plain HTML/CSS or your own components

Without those files, the source JSX will not compile as-is.

## 3. Move the uploaded source into the project

### Step 5
Create:

```text
src/seyalla_agent_demo.jsx
```

Paste the content of `seyalla_agent_demo (1).jsx` into that file.

### Step 6
Update `src/main.jsx` so it renders the component.

Example:

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import SeyallaAgentDemo from "./seyalla_agent_demo";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SeyallaAgentDemo />
  </React.StrictMode>
);
```

## 4. Run it locally first

### Step 7
Start the app:

```bash
npm run dev
```

If it fails, the most likely cause is the missing `@/components/ui/*` files.

Fix that first before moving to backend integration.

## 5. Connect it to a real backend

Right now the demo uses in-file sample data and in-file logic.

To connect it to a live app, you should move these parts out of the JSX file:

- employees
- sales
- targets
- attendance
- schedules
- leave requests
- routing helpers
- commission engine
- dictionary logic

Move them into:

```text
src/lib/
src/data/
src/api/
```

## 6. Add a live API layer

You need a backend endpoint that accepts a chat message and returns a scoped response.

Recommended route design:

```text
POST /api/seyalla/chat
```

Request body example:

```json
{
  "message": "How far am I from target?",
  "role": "STAFF",
  "adminPersona": "STORE_MANAGER",
  "activeEmployeeId": 1
}
```

Backend responsibilities:

1. authenticate the user
2. identify role and scope
3. load allowed data only
4. run business calculations
5. run AI routing / explanation
6. return structured response

## 7. Connect to Supabase

Recommended Supabase tables:

- employees
- sales_records
- targets
- attendance_records
- schedules
- leave_requests
- seyalla_threads
- seyalla_messages
- seyalla_analytics_events
- seyalla_workflow_actions

### Step 8
Create a Supabase project.

### Step 9
Add environment variables:

```env
VITE_SUPABASE_URL=YOUR_URL
VITE_SUPABASE_ANON_KEY=YOUR_KEY
```

### Step 10
Install Supabase client:

```bash
npm install @supabase/supabase-js
```

### Step 11
Create `src/lib/supabase.js`:

```js
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

### Step 12
Move your sample demo logic into backend/API-safe modules:
- intent dictionary
- entity extraction
- routing logic
- commission engine
- role/scope rules

### Step 13
Replace in-file sample data with database queries.

### Step 14
Call the backend route from the frontend instead of computing everything directly in the component.

## 8. Recommended production path

Best architecture:

- frontend React app
- backend route for `/api/seyalla/chat`
- Supabase auth
- Supabase database
- row-level security
- thread/message persistence
- analytics logging
- optional OpenAI integration for natural-language explanation layer

## 9. Final note

Because the uploaded project is missing some source/config files, use this as a rebuild-and-connect guide rather than a full plug-and-run production setup.
