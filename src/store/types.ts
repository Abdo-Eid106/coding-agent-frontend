export interface Session {
  id: string;
  name: string;
  lastActive: string; // relative time like "5d", "8h", "14d"
}

export interface Project {
  id: string;
  name: string;
  workingDirectory: string;
  sessions: Session[];
  isExpanded: boolean;
}
