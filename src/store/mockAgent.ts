import type { ConversationTurn } from "./types";

export function createMockTurn(userText: string, model: string): ConversationTurn {
  return {
    id: crypto.randomUUID(),
    userMessage: userText,
    toolCalls: [
      {
        id: crypto.randomUUID(),
        tool: "run_command",
        summary: "git status --short",
        output: " M src/App.tsx\n M src/components/ChatArea.tsx\n?? src/components/CodeBlock.tsx",
        duration: "0.2s",
        status: "success",
      },
      {
        id: crypto.randomUUID(),
        tool: "view_file",
        summary: "src/App.tsx",
        filePath: "src/App.tsx",
        output: `// Inspecting src/App.tsx state\nconst [turns, setTurns] = useState<ConversationTurn[]>(INITIAL_TURNS);\nconst handleNewConversation = useCallback(() => {\n  setTurns([]);\n}, []);`,
        duration: "0.2s",
        status: "success",
      },
      {
        id: crypto.randomUUID(),
        tool: "replace_file_content",
        summary: "src/App.tsx",
        filePath: "src/App.tsx",
        output: "Applied modifications to handle user prompt.",
        diff: `--- a/src/App.tsx\n+++ b/src/App.tsx\n@@ -42,4 +42,8 @@\n    // Processing user instruction\n+  const taskResult = "${userText.slice(0, 32)}...";\n+  applyUpdates(taskResult);`,
        duration: "0.4s",
        status: "success",
      },
      {
        id: crypto.randomUUID(),
        tool: "write_to_file",
        summary: "src/components/NewFeature.tsx",
        filePath: "src/components/NewFeature.tsx",
        output: `// Complete generated file\nexport interface FeatureConfig {\n  enabled: boolean;\n  model: string;\n}\n\nexport function NewFeature({ enabled, model }: FeatureConfig) {\n  return <div>Feature enabled with {model}</div>;\n}`,
        duration: "0.5s",
        status: "success",
      },
      {
        id: crypto.randomUUID(),
        tool: "text",
        summary: "validation note",
        output: `All files validated against schema. Model: \`${model}\`. Ready for compilation.`,
        duration: "0.1s",
        status: "success",
      },
    ],
    aiResponse: `I received your prompt:\n\n> "${userText}"\n\n### Agent Plan & Status\n1. **Model**: \`${model}\`\n2. **Analysis**: Completed tool inspection of local files.\n3. **Execution**: Ready for next actions or modifications.`,
    timestamp: "Just now",
  };
}
