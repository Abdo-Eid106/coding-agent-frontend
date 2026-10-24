import { GenericTool } from "./GeneralTool";
import { FetchTool } from "./FetchTool";

export function GenericToolCallDemo() {
  return (
    <>
      {/* Objects for both input and output */}
      <GenericTool
        name="get_weather"
        input={{ city: "Cairo", unit: "celsius" }}
        output={{
          city: "Cairo",
          temperature: 31,
          unit: "celsius",
          conditions: "Sunny",
          forecast: [
            { day: "Tue", high: 33, low: 22 },
            { day: "Wed", high: 32, low: 21 },
          ],
        }}
      />

      {/* JSON strings, as many tool-calling APIs send them */}
      <GenericTool
        name="create_task"
        input='{"title":"Write release notes","dueDate":"2026-10-25","tags":["docs","release"]}'
        output='{"id":"task_8f2c1","status":"created","url":"https://example.com/tasks/task_8f2c1"}'
      />

      {/* Plain-text output that is not JSON is shown as is */}
      <GenericTool
        name="run_tests"
        input={{ path: "src/utils", watch: false }}
        output={
          "PASS  src/utils/math.test.ts\nPASS  src/utils/format.test.ts\n\nTests: 14 passed, 14 total"
        }
      />

      {/* Still running: no output yet */}
      <GenericTool
        name="search_docs"
        input={{ query: "vite proxy config", limit: 5 }}
      />
    </>
  );
}

// Shaped like the fetch tool's output for { format: "markdown" }: Turndown's conversion of the page body.
const markdownContent = [
  "# Getting Started with Vite",
  "",
  "Vite is a **fast** build tool for modern web projects. It has two main parts:",
  "",
  "*   A dev server with [hot module replacement](https://vite.dev/guide/features.html#hot-module-replacement)",
  "*   A build command that bundles your code with Rollup",
  "",
  "## Installation",
  "",
  "Create a new project with your package manager of choice:",
  "",
  "```",
  "npm create vite@latest my-app",
  "cd my-app",
  "npm install",
  "npm run dev",
  "```",
  "",
  "## Requirements",
  "",
  "1.  Node.js 20.19+ or 22.12+",
  "2.  A terminal and a code editor",
  "",
  "> Note: some templates need a newer Node.js version than the minimum above.",
].join("\n");

// Shaped like the fetch tool's output for the default { format: "text" }: the raw response body.
const rawHtmlContent = [
  "<!doctype html>",
  '<html lang="en">',
  "  <head><title>Example Domain</title></head>",
  "  <body>",
  "    <h1>Example Domain</h1>",
  "    <p>This domain is for use in illustrative examples in documents.</p>",
  "  </body>",
  "</html>",
].join("\n");

export function FetchToolCallDemo() {
  return (
    <>
      <FetchTool
        url="https://vite.dev/guide/"
        format="markdown"
        content={markdownContent}
      />
      <FetchTool
        url="https://example.com"
        format="text"
        content={rawHtmlContent}
      />
      <FetchTool url="https://example.com/empty" format="markdown" content="" />
    </>
  );
}

import { GrepTool } from "./GrepTool";
const DIR = "/home/user/my-app";

// Shaped like ripgrep's plain output: `path:line:text`, one match per line.
const useStateOutput = [
  `${DIR}/src/components/Button.tsx:1:import { useState } from "react";`,
  `${DIR}/src/components/Button.tsx:8:  const [pressed, setPressed] = useState(false);`,
  `${DIR}/src/components/Modal.tsx:3:import { useEffect, useState } from "react";`,
  `${DIR}/src/components/Modal.tsx:12:  const [open, setOpen] = useState(false);`,
  `${DIR}/src/hooks/useDebounce.ts:1:import { useEffect, useState } from "react";`,
  `${DIR}/src/hooks/useDebounce.ts:6:  const [debounced, setDebounced] = useState(value);`,
].join("\n");

const todoOutput = `${DIR}/src/main.tsx:14:// TODO: remove this hack, see other TODO in App.tsx`;

export function GrepToolCallDemo() {
  return (
    <>
      <GrepTool pattern="useState" directory={DIR} content={useStateOutput} />
      <GrepTool pattern="TODO" directory={DIR} content={todoOutput} />
      {/* ripgrep exits with code 1 and prints nothing when there are no matches */}
      <GrepTool pattern="doesNotExist" directory={DIR} content="" />
    </>
  );
}

import { EditFileToolCall } from "./EditFileTool";

import { ViewFileToolCall } from "./ViewFile";
import { BashToolCall } from "./BashTool";
import { LsTool, type LsEntry } from "./LsTool";
import ToolCallGroup from "./ToolCallGroup";

// Shaped like the real `ls` tool output for { recursive: true, maxDepth: 3 }:
// folders first, alphabetical, and each folder's children listed right after it.
const projectEntries: LsEntry[] = [
  { name: "public", type: "directory" },
  { name: "public/favicon.ico", type: "file" },
  { name: "public/robots.txt", type: "file" },
  { name: "src", type: "directory" },
  { name: "src/components", type: "directory" },
  { name: "src/components/Button.tsx", type: "file" },
  { name: "src/components/Modal.tsx", type: "file" },
  { name: "src/hooks", type: "directory" },
  { name: "src/hooks/useDebounce.ts", type: "file" },
  { name: "src/utils", type: "directory" },
  { name: "src/utils/math.ts", type: "file" },
  { name: "src/index.css", type: "file" },
  { name: "src/main.tsx", type: "file" },
  { name: "package.json", type: "file" },
  { name: "README.md", type: "file" },
  { name: "tsconfig.json", type: "file" },
  { name: "vite.config.ts", type: "file" },
];

const flatEntries: LsEntry[] = [
  { name: "docs", type: "directory" },
  { name: "src", type: "directory" },
  { name: "package.json", type: "file" },
];

export function LsToolCallDemo() {
  return (
    <>
      <LsTool directory="/home/user/my-app" entries={projectEntries} />
      <LsTool directory="/home/user/my-app/docs" entries={[]} />
      <LsTool directory="/home/user/other-app" entries={flatEntries} />
    </>
  );
}

export function FileChanges() {
  return (
    <ToolCallGroup>
      <EditFileToolCall
        filePath="src/user.ts"
        original={`export function getUser(id: string) {
  return db.user.findOne({ id });
}`}
        modified={`export async function getUser(id: string) {
  return await db.user.findOne({ id });
}`}
      />

      <EditFileToolCall
        filePath="src/config.ts"
        original={`export const PORT = 3000;
export const DEBUG = false;`}
        modified={`export const PORT = 4000;
export const DEBUG = true;
export const NODE_ENV = "development";`}
      />

      <ViewFileToolCall
        filePath="src/utils/math.ts"
        content={"export const add = (a: number, b: number) => a + b;\n"}
      />

      <BashToolCall
        cwd="/home/abdo/projects/my-agent"
        command={"npm run build\nnpm test"}
        output={"Build successful\nAll tests passed"}
      />
      <LsToolCallDemo />
      <GrepToolCallDemo />
      <FetchToolCallDemo />
      <GenericToolCallDemo />
    </ToolCallGroup>
  );
}
