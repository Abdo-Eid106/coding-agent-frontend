import type { MessageDto } from "./types";
import type { ConversationTurn } from "../store/types";

export function messagesToTurns(messages: MessageDto[]): ConversationTurn[] {
  const turns: ConversationTurn[] = [];

  // Check if messages use nested `replies` or `parentMessage` format
  const isNestedFormat =
    messages.length > 0 &&
    (messages.some(
      (msg) =>
        "replies" in msg ||
        "parentMessage" in msg ||
        msg.replies !== undefined,
    ) ||
      messages.every((msg) => msg.role === "user"));

  if (isNestedFormat) {
    for (const msg of messages) {
      if (msg.role === "user" || !msg.role) {
        const replies: MessageDto[] = msg.replies ?? [];
        const aiMessage = replies.map((r: MessageDto) => r.content).join("\n\n");
        const sessionId =
          typeof msg.session === "string" ? msg.session : msg.session?.id;

        turns.push({
          id: msg.id,
          userMessage: msg.content,
          aiMessage,
          timestamp: msg.createdAt
            ? new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : undefined,
          sessionId,
        });
      } else if (msg.role === "ai") {
        const lastTurn = turns.at(-1);
        if (lastTurn && !lastTurn.aiMessage) {
          lastTurn.aiMessage = msg.content;
        } else {
          turns.push({
            id: msg.id,
            userMessage: "",
            aiMessage: msg.content,
            timestamp: msg.createdAt
              ? new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : undefined,
          });
        }
      }
    }
    return turns;
  }

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
