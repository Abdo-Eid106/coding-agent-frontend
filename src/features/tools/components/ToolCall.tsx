import { type ToolCallDto, ToolCallEnum } from "../types";
import { BashToolCall } from "./BashTool";
import { EditFileToolCall } from "./EditFileTool";
import { FetchTool } from "./FetchTool";
import { GenericTool } from "./GeneralTool";
import { GrepTool } from "./GrepTool";
import { LsTool } from "./LsTool";
import { ViewFileToolCall } from "./ViewFile";

type Props = {
  toolCall: ToolCallDto;
};

export default function ToolCall({ toolCall }: Props) {
  if (toolCall.name == ToolCallEnum.BASH)
    return (
      <BashToolCall
        command={toolCall.input.command}
        cwd={toolCall.input.cwd}
        output={toolCall.output?.stdout}
      />
    );

  if (toolCall.name == ToolCallEnum.EDIT_FILE) {
    return (
      <EditFileToolCall
        filePath={toolCall.input.filePath}
        original={toolCall.output?.original}
        modified={toolCall.output?.modified}
      />
    );
  }

  if (toolCall.name == ToolCallEnum.FETCH) {
    return (
      <FetchTool
        url={toolCall.input.url}
        format={toolCall.input.format}
        content={toolCall.output?.content}
      />
    );
  }

  if (toolCall.name == ToolCallEnum.GREP) {
    return (
      <GrepTool
        pattern={toolCall.input.pattern}
        directory={toolCall.input.directory}
        content={toolCall.output?.content}
      />
    );
  }

  if (toolCall.name == ToolCallEnum.LS) {
    return (
      <LsTool directory={toolCall.input.directory} entries={toolCall.output} />
    );
  }

  if (toolCall.name == ToolCallEnum.VIEW) {
    return (
      <ViewFileToolCall
        filePath={toolCall.input.filePath}
        content={toolCall.output?.content}
      />
    );
  }

  if (toolCall.name == ToolCallEnum.WRITE) {
    return (
      <ViewFileToolCall
        filePath={toolCall.input.filePath}
        content={toolCall.input.content}
      />
    );
  }

  return (
    <GenericTool
      name={toolCall.name}
      input={toolCall.input}
      output={toolCall.output}
    />
  );
}
