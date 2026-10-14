import type { ConversationTurn } from "./types";

export const INITIAL_TURNS: ConversationTurn[] = [
  {
    id: "turn-1",
    userMessage:
      "make for me that page, use tailwind, use the theme provided in the app.css, make the ui look like this antigravity, when collapsing the sidebar, it should move to the left and disappear, the sidebar should display the projects and each project item is like a collapse that display the sessions inside it, it can be opened and closed, there is a button that is used to create a new project, creating project is just seelcting a working directory, i don't need this scheduled tasks, nor conversation histories, each project item has + button which opens a drop down menu, this menu has button to delete the the project,",
    toolCalls: [
      {
        id: "tc-1-1",
        tool: "run_command",
        summary: "pnpm add lucide-react",
        output: "Progress: resolved 109, reused 44, downloaded 1, added 1, done\ndependencies:\n+ lucide-react 1.55.0\nDone in 6.1s using pnpm v11.2.2",
        duration: "6.1s",
        status: "success",
      },
      {
        id: "tc-1-2",
        tool: "write_to_file",
        summary: "src/components/Sidebar.tsx",
        output: "Created file src/components/Sidebar.tsx with slide-out left animation and project hierarchy.",
        duration: "0.8s",
        status: "success",
      },
      {
        id: "tc-1-3",
        tool: "run_command",
        summary: "pnpm build",
        output: "$ tsc -b && vite build\nvite v8.3.4 building client environment for production...\ntransforming...\n✓ 1913 modules transformed.\nrendering chunks...\ndist/index.html   0.48 kB\n✓ built in 315ms",
        duration: "1.2s",
        status: "success",
      },
    ],
    aiResponse: `I have built the page layout matching the Antigravity design:

### Implemented Features

- **Collapsible Sidebar**: Slides smoothly to the left with \`translateX(-100%)\` and collapses completely.
- **Project & Sessions Hierarchy**: Each project item is collapsible and displays its nested sessions with relative timestamps.
- **Action Dropdowns**: Hovering on a project displays a \`+\` action button with options to create sessions or delete the project.
- **New Project Modal**: Allows specifying a working directory path to register projects.
- **Theme Variables**: Connected to your existing OKLCH color palette defined in \`app.css\`.`,
    timestamp: "10m ago",
  },
  {
    id: "turn-2",
    userMessage:
      "make both the drop down menus for projects and models have max height and make them scrollable, add more dummy data so i can view the scrolling",
    toolCalls: [
      {
        id: "tc-2-1",
        tool: "view_file",
        summary: "src/components/ChatArea.tsx",
        output: "Examined project selector pill and model picker dropdown structure.\nTargeting scroll overflow containers with bounded height.",
        duration: "0.2s",
        status: "success",
      },
      {
        id: "tc-2-2",
        tool: "replace_file_content",
        summary: "src/store/useProjectStore.ts",
        filePath: "src/store/useProjectStore.ts",
        output: "Added 8 additional projects with realistic sessions.",
        diff: `--- a/src/store/useProjectStore.ts
+++ b/src/store/useProjectStore.ts
@@ -28,7 +28,25 @@
     name: "nest",
     workingDirectory: "/home/user/projects/nest",
-    sessions: [],
+    sessions: [
+      { id: generateId(), name: "Setup auth guard", lastActive: "1d" },
+      { id: generateId(), name: "Database migrations", lastActive: "3d" },
+    ],
     isExpanded: false,
   },
+  {
+    id: generateId(),
+    name: "workflow-automations",
+    workingDirectory: "/home/user/projects/workflow-automations",
+    sessions: [
+      { id: generateId(), name: "Cron scheduler refactor", lastActive: "3h" },
+    ],
+    isExpanded: false,
+  },
+  {
+    id: generateId(),
+    name: "rag-knowledge-base",
+    workingDirectory: "/home/user/projects/rag-knowledge-base",
+    sessions: [],
+    isExpanded: false,
+  },`,
        duration: "0.4s",
        status: "success",
      },
      {
        id: "tc-2-3",
        tool: "replace_file_content",
        summary: "src/components/ChatArea.tsx",
        filePath: "src/components/ChatArea.tsx",
        output: "Configured max-h-60 and max-h-64 with overflow-y-auto on project & model menus.",
        diff: `--- a/src/components/ChatArea.tsx
+++ b/src/components/ChatArea.tsx
@@ -124,7 +124,10 @@
             <Dropdown
               isOpen={projectDropdownOpen}
               direction="up"
               className="absolute bottom-full mb-2 left-0 z-50"
             >
-              <div className="min-w-[220px] rounded-lg border border-border bg-popover py-1">
+              <div className="min-w-[240px] max-h-60 flex flex-col rounded-lg border border-border bg-popover overflow-hidden">
+                <div className="px-3 py-2 text-xs font-semibold uppercase shrink-0 border-b border-border/50">
+                  Project
+                </div>
+                <div className="overflow-y-auto py-1">`,
        duration: "0.3s",
        status: "success",
      },
      {
        id: "tc-2-4",
        tool: "run_command",
        summary: "pnpm build",
        output: "$ tsc -b && vite build\nvite v8.3.4 building client environment for production...\n✓ 1914 modules transformed.\n✓ built in 205ms",
        duration: "0.9s",
        status: "success",
      },
    ],
    aiResponse: `I have updated both dropdown menus to be scrollable and expanded the dummy datasets:

1. **Scrollable Dropdowns**:
   - **Project Dropdown**: Given a \`max-h-60\` height with \`overflow-y-auto\` scroll area and a clean sticky header.
   - **Model Dropdown**: Given a \`max-h-64\` height with \`overflow-y-auto\` scroll area and a sticky header.

2. **Added Dummy Data**:
   - **Projects**: Added 8 additional projects with realistic sessions (\`workflow-automations\`, \`rag-knowledge-base\`, \`payment-service\`, etc.) in \`useProjectStore.ts\`.
   - **Models**: Added 10 additional models with tags and statuses (\`Claude 3.7 Sonnet\`, \`GPT-4o\`, \`o3-mini\`, etc.) in \`ChatArea.tsx\`.

\`\`\`tsx
<div className="max-h-60 overflow-y-auto py-1">
  {projects.map((project) => (
    <button key={project.id} ... />
  ))}
</div>
\`\`\`

Both dropdowns now cleanly scroll within their viewport bounds.`,
    timestamp: "Just now",
  },
];
