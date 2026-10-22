export type Role = "new-hire" | "manager" | "hr" | "it" | "workplace";

export type Track = "design" | "engineering" | "customer" | "people" | "delivery";

export type Risk = "on-track" | "watch" | "at-risk";

export type PhaseId =
  | "offer"
  | "preboard"
  | "week1"
  | "settle"
  | "day30"
  | "build"
  | "day60"
  | "own"
  | "day90";

export type Category =
  | "compliance"
  | "access"
  | "equipment"
  | "learning"
  | "people"
  | "culture"
  | "impact"
  | "check-in";

export type TaskStatus = "todo" | "in-progress" | "done" | "blocked";

export type Stage = "awaiting" | "ordered" | "imaging" | "ready" | "collected";

export type ResourceKind = "Course" | "Guide" | "System" | "Policy" | "Channel";

export interface Person {
  id: string;
  name: string;
  title: string;
  team: string;
  location: string;
  email: string;
  slack: string;
  focus: string;
  desk: Role | "buddy" | "leader";
}

export interface Starter {
  id: string;
  name: string;
  firstName: string;
  roleTitle: string;
  team: string;
  track: Track;
  location: string;
  workMode: "Hybrid" | "Remote" | "Office";
  startDate: string;
  startLabel: string;
  day: number;
  managerId: string;
  buddyId: string;
  hrId: string;
  goal: string;
  pronoun: "she" | "he" | "they";
}

export interface Task {
  id: string;
  starterId: string;
  title: string;
  detail: string;
  phase: PhaseId;
  owner: Role;
  dueDay: number;
  baseStatus: TaskStatus;
  category: Category;
  resourceId?: string;
}

export interface Resource {
  id: string;
  title: string;
  kind: ResourceKind;
  source: string;
  summary: string;
  time?: string;
  tracks: Track[] | "all";
  steps: string[];
}

export interface AccountAccess {
  id: string;
  label: string;
  ready: boolean;
}

export interface Setup {
  starterId: string;
  device: string;
  extras: string;
  stage: Stage;
  desk: string;
  kit: string;
  firstDay: string;
  accounts: AccountAccess[];
}

export interface NavItem {
  href: string;
  label: string;
  hint: string;
  icon: "home" | "path" | "tasks" | "pulse" | "book" | "people" | "team" | "starters" | "device" | "desk";
}

export interface Activity {
  id: string;
  text: string;
  meta: string;
}

export interface Nudge {
  id: string;
  audience: Role;
  starterId: string;
  title: string;
  body: string;
  href: string;
}

export interface Notice {
  id: string;
  role: Role;
  title: string;
  body: string;
  href: string;
  tone: "action" | "risk" | "success" | "info";
  when: string;
}
