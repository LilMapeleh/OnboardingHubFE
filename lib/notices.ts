import { starterById, tasks } from "./content";
import {
  dueLabel,
  isOverdue,
  isSoon,
  ownsTask,
  roleLabel,
  taskDone,
} from "./model";
import type { Notice, Nudge, Role } from "./types";

const curated: Notice[] = [
  {
    id: "cur-studio",
    role: "new-hire",
    tone: "info",
    title: "Studio hour on Thursday",
    body: "London design critique is at 16:00. Visitors can listen from the back.",
    href: "/resources",
    when: "This week",
  },
  {
    id: "cur-figma",
    role: "new-hire",
    tone: "success",
    title: "Figma access is ready",
    body: "The product design library is in your Sitecore Figma team.",
    href: "/resources",
    when: "Today",
  },
  {
    id: "cur-hr",
    role: "hr",
    tone: "info",
    title: "Six people are in this 90-day window",
    body: "Two have not started yet. Priya arrives on 2 November.",
    href: "/pulse",
    when: "Cohort",
  },
  {
    id: "cur-it",
    role: "it",
    tone: "info",
    title: "ServiceNow still covers the exceptions",
    body: "Docks, VPN oddities, and replacements are requested there, then mirrored here.",
    href: "/resources",
    when: "Reminder",
  },
  {
    id: "cur-wx",
    role: "workplace",
    tone: "info",
    title: "Priya starts on Monday 2 November",
    body: "Kits usually leave five days before arrival. Desk 4.22 is only reserved.",
    href: "/workplace",
    when: "Upcoming",
  },
  {
    id: "cur-mgr",
    role: "manager",
    tone: "info",
    title: "Maya is in the settle-in phase",
    body: "The useful move this week is booking the 30-day conversation, not adding tasks.",
    href: "/team",
    when: "This week",
  },
];

export function buildNotices(role: Role, done: string[], undone: string[], nudges: Nudge[]): Notice[] {
  const generated: Notice[] = [];

  for (const task of tasks) {
    if (!ownsTask(task, role)) continue;
    const starter = starterById(task.starterId);
    if (!starter) continue;
    const complete = taskDone(task, done, undone);
    if (complete) continue;
    const overdue = isOverdue(task, starter.day, false);
    const soon = isSoon(task, starter.day, false);
    if (!overdue && !soon) continue;
    const who = role === "new-hire" ? "You" : starter.firstName;
    generated.push({
      id: `task-${task.id}`,
      role,
      tone: overdue ? "risk" : "action",
      title: overdue ? `${who}: ${task.title}` : task.title,
      body: `${dueLabel(task, starter.day, false)}. Owned by ${roleLabel(task.owner)}.`,
      href: task.category === "check-in" && role === "manager" ? "/team" : "/tasks",
      when: overdue ? "Overdue" : dueLabel(task, starter.day, false),
    });
  }

  generated.sort((a, b) => {
    if (a.tone === b.tone) return 0;
    if (a.tone === "risk") return -1;
    if (b.tone === "risk") return 1;
    return 0;
  });

  const fromNudges: Notice[] = nudges
    .filter((nudge) => nudge.audience === role)
    .map((nudge) => ({
      id: nudge.id,
      role,
      tone: "action" as const,
      title: nudge.title,
      body: nudge.body,
      href: nudge.href,
      when: "Just now",
    }));

  return [...fromNudges, ...generated.slice(0, 5), ...curated.filter((item) => item.role === role)];
}
