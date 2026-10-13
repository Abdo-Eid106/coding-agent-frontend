import { useState, useCallback } from "react";
import type { Project, Session } from "./types";

const generateId = () => crypto.randomUUID();

const SAMPLE_PROJECTS: Project[] = [
  {
    id: generateId(),
    name: "mcp",
    workingDirectory: "/home/user/projects/mcp",
    sessions: [
      { id: generateId(), name: "Adding Summary Node …", lastActive: "5d" },
      { id: generateId(), name: "refactor my code", lastActive: "14d" },
    ],
    isExpanded: true,
  },
  {
    id: generateId(),
    name: "ai-agent-chat-front…",
    workingDirectory: "/home/user/projects/ai-agent-chat-frontend",
    sessions: [
      { id: generateId(), name: "Tailwind Chat UI Genera…", lastActive: "5d" },
      { id: generateId(), name: "Human In The Loop Grep", lastActive: "8d" },
    ],
    isExpanded: false,
  },
  {
    id: generateId(),
    name: "nest",
    workingDirectory: "/home/user/projects/nest",
    sessions: [
      { id: generateId(), name: "Setup auth guard", lastActive: "1d" },
      { id: generateId(), name: "Database migrations", lastActive: "3d" },
    ],
    isExpanded: false,
  },
  {
    id: generateId(),
    name: "customer-support-…",
    workingDirectory: "/home/user/projects/customer-support",
    sessions: [
      { id: generateId(), name: "Ticket escalation workflow", lastActive: "2w" },
    ],
    isExpanded: false,
  },
  {
    id: generateId(),
    name: "workflow-automations",
    workingDirectory: "/home/user/projects/workflow-automations",
    sessions: [
      { id: generateId(), name: "Cron scheduler refactor", lastActive: "3h" },
      { id: generateId(), name: "Webhook delivery retry logic", lastActive: "12h" },
    ],
    isExpanded: false,
  },
  {
    id: generateId(),
    name: "rag-knowledge-base",
    workingDirectory: "/home/user/projects/rag-knowledge-base",
    sessions: [
      { id: generateId(), name: "Vector store embeddings", lastActive: "2d" },
      { id: generateId(), name: "Semantic chunking pipeline", lastActive: "4d" },
    ],
    isExpanded: false,
  },
  {
    id: generateId(),
    name: "payment-service",
    workingDirectory: "/home/user/projects/payment-service",
    sessions: [
      { id: generateId(), name: "Stripe webhooks handling", lastActive: "1w" },
    ],
    isExpanded: false,
  },
  {
    id: generateId(),
    name: "analytics-engine",
    workingDirectory: "/home/user/projects/analytics-engine",
    sessions: [
      { id: generateId(), name: "Realtime metrics aggregation", lastActive: "6d" },
    ],
    isExpanded: false,
  },
  {
    id: generateId(),
    name: "auth-microservice",
    workingDirectory: "/home/user/projects/auth-microservice",
    sessions: [
      { id: generateId(), name: "OAuth2 & PKCE implementation", lastActive: "10d" },
    ],
    isExpanded: false,
  },
  {
    id: generateId(),
    name: "cloud-infrastructure",
    workingDirectory: "/home/user/projects/cloud-infrastructure",
    sessions: [
      { id: generateId(), name: "Terraform module updates", lastActive: "3w" },
    ],
    isExpanded: false,
  },
  {
    id: generateId(),
    name: "mobile-app-react-native",
    workingDirectory: "/home/user/projects/mobile-app-react-native",
    sessions: [
      { id: generateId(), name: "Navigation drawer revamp", lastActive: "4w" },
    ],
    isExpanded: false,
  },
  {
    id: generateId(),
    name: "docs-portal",
    workingDirectory: "/home/user/projects/docs-portal",
    sessions: [
      { id: generateId(), name: "Search indexing via Algolia", lastActive: "1mo" },
    ],
    isExpanded: false,
  },
];

export function useProjectStore() {
  const [projects, setProjects] = useState<Project[]>(SAMPLE_PROJECTS);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const toggleProject = useCallback((projectId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, isExpanded: !p.isExpanded } : p
      )
    );
  }, []);

  const addProject = useCallback((name: string, workingDirectory: string) => {
    const newProject: Project = {
      id: generateId(),
      name,
      workingDirectory,
      sessions: [],
      isExpanded: false,
    };
    setProjects((prev) => [newProject, ...prev]);
  }, []);

  const deleteProject = useCallback((projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
  }, []);

  const addSession = useCallback((projectId: string, sessionName: string) => {
    const newSession: Session = {
      id: generateId(),
      name: sessionName,
      lastActive: "now",
    };
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, sessions: [newSession, ...p.sessions], isExpanded: true }
          : p
      )
    );
    setActiveSessionId(newSession.id);
  }, []);

  const selectSession = useCallback((sessionId: string) => {
    setActiveSessionId(sessionId);
  }, []);

  return {
    projects,
    activeSessionId,
    toggleProject,
    addProject,
    deleteProject,
    addSession,
    selectSession,
  };
}
