import type { MessageDto } from "./types";
import type { ConversationTurn } from "../store/types";

export function messagesToTurns(messages: MessageDto[]): ConversationTurn[] {
  const turns: ConversationTurn[] = [];
  let currentTurn: Partial<ConversationTurn> | null = null;

  for (const msg of messages) {
    if (msg.role === "user") {
      if (currentTurn) {
        turns.push({
          id: currentTurn.id || crypto.randomUUID(),
          userMessage: currentTurn.userMessage || "",
          aiMessage: currentTurn.aiMessage || "",
          timestamp: currentTurn.timestamp,
        });
      }
      currentTurn = {
        id: msg.id,
        userMessage: msg.content,
        aiMessage: "",
        timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    } else if (msg.role === "ai") {
      if (!currentTurn) {
        currentTurn = {
          id: msg.id,
          userMessage: "",
          aiMessage: msg.content,
          timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
      } else {
        currentTurn.aiMessage =
          (currentTurn.aiMessage ? currentTurn.aiMessage + "\n\n" : "") +
          msg.content;
      }
      turns.push(currentTurn as ConversationTurn);
      currentTurn = null;
    }
  }

  if (currentTurn) {
    turns.push({
      id: currentTurn.id || crypto.randomUUID(),
      userMessage: currentTurn.userMessage || "",
      aiMessage: currentTurn.aiMessage || "",
      timestamp: currentTurn.timestamp,
    });
  }

  return turns;
}
