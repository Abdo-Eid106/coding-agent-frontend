import type { ConversationTurn } from "./types";

export function createMockTurn(
  userText: string,
  model: string,
  sessionId?: string | null
): ConversationTurn {
  const aiMessage = `I received your prompt:\n\n> "${userText}"\n\n### Agent Plan & Status\n1. **Model**: \`${model}\`\n2. **Session**: \`${sessionId ?? "active-session"}\`\n3. **Analysis**: Completed tool inspection of local files.\n4. **Execution**: Ready for next actions or modifications.`;

  return {
    id: crypto.randomUUID(),
    sessionId: sessionId ?? undefined,
    userMessage: userText,
    aiMessage,
    aiResponse: aiMessage,
    toolCalls: [
      {
        id: crypto.randomUUID(),
        type: "run_command",
        tool: "run_command",
        input: { command: "git status --short" },
        summary: "git status --short",
        output: " M src/App.tsx\n M src/components/ChatArea.tsx\n?? src/components/CodeBlock.tsx",
        duration: "0.2s",
        status: "success",
      },
      {
        id: crypto.randomUUID(),
        type: "view_file",
        tool: "view_file",
        input: { path: "src/App.tsx" },
        summary: "src/App.tsx",
        filePath: "src/App.tsx",
        output: `// Inspecting src/App.tsx state\nconst [turns, setTurns] = useState<ConversationTurn[]>(INITIAL_TURNS);\nconst handleNewConversation = useCallback(() => {\n  setTurns([]);\n}, []);`,
        duration: "0.2s",
        status: "success",
      },
      {
        id: crypto.randomUUID(),
        type: "replace_file_content",
        tool: "replace_file_content",
        input: { file: "src/App.tsx", target: "applyUpdates" },
        summary: "src/App.tsx",
        filePath: "src/App.tsx",
        output: "Applied modifications to handle user prompt.",
        diff: `--- a/src/App.tsx\n+++ b/src/App.tsx\n@@ -42,4 +42,8 @@\n    // Processing user instruction\n+  const taskResult = "${userText.slice(0, 32)}...";\n+  applyUpdates(taskResult);`,
        duration: "0.4s",
        status: "success",
      },
      {
        id: crypto.randomUUID(),
        type: "write_to_file",
        tool: "write_to_file",
        input: { file: "src/components/NewFeature.tsx" },
        summary: "src/components/NewFeature.tsx",
        filePath: "src/components/NewFeature.tsx",
        output: `// Complete generated file\nexport interface FeatureConfig {\n  enabled: boolean;\n  model: string;\n}\n\nexport function NewFeature({ enabled, model }: FeatureConfig) {\n  return <div>Feature enabled with {model}</div>;\n}`,
        duration: "0.5s",
        status: "success",
      },
      {
        id: crypto.randomUUID(),
        type: "text",
        tool: "text",
        input: { note: "validation" },
        summary: "validation note",
        output: `All files validated against schema. Model: \`${model}\`. Ready for compilation.`,
        duration: "0.1s",
        status: "success",
      },
    ],
    timestamp: "Just now",
  };
}
