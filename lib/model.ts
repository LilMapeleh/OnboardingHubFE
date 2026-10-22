import {
  defaultAgendas,
  agendas,
  people,
  personById,
  phaseById,
  phases,
  starterById,
  starters,
  tasks,
} from "./content";
import type { PhaseId, Risk, Role, Starter, Task, TaskStatus } from "./types";

export function taskDone(task: Task, done: string[], undone: string[]) {
  if (undone.includes(task.id)) return false;
  if (done.includes(task.id)) return true;
  return task.baseStatus === "done";
}

export function taskStatus(task: Task, done: string[], undone: string[]): TaskStatus {
  if (taskDone(task, done, undone)) return "done";
  if (task.baseStatus === "blocked") return "blocked";
  if (task.baseStatus === "in-progress" || done.includes(`${task.id}:progress`)) return "in-progress";
  return "todo";
}

export function phaseForDay(day: number): PhaseId {
  if (day < -14) return "offer";
  if (day <= 0) return "preboard";
  if (day <= 7) return "week1";
  if (day < 30) return "settle";
  if (day === 30) return "day30";
  if (day < 60) return "build";
  if (day === 60) return "day60";
  if (day < 90) return "own";
  return "day90";
}

export function dayLabel(day: number) {
  if (day < 1) {
    const left = 1 - day;
    return left === 1 ? "Starts tomorrow" : `Starts in ${left} days`;
  }
  if (day > 90) return "Day 90 complete";
  return `Day ${day}`;
}

export function dueDelta(task: Task, day: number) {
  return task.dueDay - day;
}

export function dueLabel(task: Task, day: number, done: boolean) {
  if (done) return "Complete";
  const delta = dueDelta(task, day);
  if (delta < 0) return `${-delta} day${-delta === 1 ? "" : "s"} overdue`;
  if (delta === 0) return "Due today";
  if (delta === 1) return "Due tomorrow";
  if (delta <= 14) return `Due in ${delta} days`;
  if (task.dueDay >= 1) return `Due day ${task.dueDay}`;
  return "Due before day 1";
}

export function isOverdue(task: Task, day: number, done: boolean) {
  return !done && task.dueDay < day;
}

export function isSoon(task: Task, day: number, done: boolean) {
  if (done) return false;
  const delta = dueDelta(task, day);
  return delta >= 0 && delta <= 7;
}

export interface Progress {
  done: number;
  total: number;
  pct: number;
}

export function progressFor(list: Task[], done: string[], undone: string[]): Progress {
  const total = list.length;
  const complete = list.filter((task) => taskDone(task, done, undone)).length;
  return {
    done: complete,
    total,
    pct: total === 0 ? 0 : Math.round((complete / total) * 100),
  };
}

export function starterTasks(starterId: string) {
  return tasks.filter((task) => task.starterId === starterId);
}

export function riskFor(starter: Starter, done: string[], undone: string[]): Risk {
  const open = starterTasks(starter.id).filter((task) => !taskDone(task, done, undone));
  const oldest = open.reduce((max, task) => {
    const late = starter.day - task.dueDay;
    return late > max ? late : max;
  }, 0);
  if (oldest >= 5) return "at-risk";
  if (oldest >= 1) return "watch";
  return "on-track";
}

export function overdueTasks(starter: Starter, done: string[], undone: string[]) {
  return starterTasks(starter.id)
    .filter((task) => isOverdue(task, starter.day, taskDone(task, done, undone)))
    .sort((a, b) => a.dueDay - b.dueDay);
}

export function attentionLine(starter: Starter, done: string[], undone: string[]) {
  const late = overdueTasks(starter, done, undone);
  if (late.length === 0) return null;
  const top = late[0];
  const days = starter.day - top.dueDay;
  const age = `${days} day${days === 1 ? "" : "s"} overdue`;
  if (late.length === 1) return `${top.title} is ${age}.`;
  return `${late.length} open loops. The oldest is ${top.title}, ${age}.`;
}

export function nextMilestone(day: number) {
  if (day < 1) {
    const left = 1 - day;
    return { label: "Day 1", detail: left === 1 ? "Tomorrow" : `In ${left} days` };
  }
  const marks: { day: number; label: string }[] = [
    { day: 7, label: "End of week one" },
    { day: 30, label: "30-day check-in" },
    { day: 60, label: "60-day check-in" },
    { day: 90, label: "Day 90 review" },
  ];
  const next = marks.find((mark) => mark.day >= day);
  if (!next) return { label: "Journey complete", detail: "Past day 90" };
  const left = next.day - day;
  return {
    label: next.label,
    detail: left === 0 ? "Today" : left === 1 ? "Tomorrow" : `In ${left} days`,
  };
}

export function ownerName(task: Task) {
  const starter = starterById(task.starterId);
  if (!starter) return "Unassigned";
  if (task.owner === "new-hire") return starter.name;
  if (task.owner === "manager") return personById(starter.managerId)?.name ?? "Manager";
  if (task.owner === "hr") return personById(starter.hrId)?.name ?? "People";
  if (task.owner === "it") return "Chris Dalton";
  return "Noor El-Sayed";
}

export function roleLabel(role: Role) {
  switch (role) {
    case "new-hire":
      return "New hire";
    case "manager":
      return "Manager";
    case "hr":
      return "People";
    case "it":
      return "IT";
    case "workplace":
      return "Workplace";
  }
}

export function ownsTask(task: Task, role: Role) {
  if (task.owner !== role) return false;
  if (role === "new-hire") return task.starterId === "maya";
  if (role === "manager") return starterById(task.starterId)?.managerId === "jordan";
  return true;
}

export function agendaFor(task: Task) {
  return agendas[task.id] ?? defaultAgendas[task.phase] ?? [];
}

export function phaseMeta(id: PhaseId) {
  return phaseById(id) ?? phases[0];
}

export function supportCircle(starter: Starter) {
  return [starter.managerId, starter.buddyId, starter.hrId, "chris", "noor"]
    .map((id) => people.find((person) => person.id === id))
    .filter((person): person is NonNullable<typeof person> => Boolean(person));
}

export function reportsOf(managerId: string) {
  return starters.filter((starter) => starter.managerId === managerId);
}

export function cohortRisk(done: string[], undone: string[]) {
  return starters.map((starter) => ({
    starter,
    risk: riskFor(starter, done, undone),
    progress: progressFor(starterTasks(starter.id), done, undone),
    line: attentionLine(starter, done, undone),
  }));
}

export function openByOwner(done: string[], undone: string[]) {
  const roles: Role[] = ["new-hire", "manager", "hr", "it", "workplace"];
  return roles.map((role) => ({
    role,
    label: roleLabel(role),
    count: tasks.filter((task) => task.owner === role && !taskDone(task, done, undone)).length,
  }));
}

export function categoryLabel(category: Task["category"]) {
  switch (category) {
    case "compliance":
      return "Compliance";
    case "access":
      return "Access";
    case "equipment":
      return "Equipment";
    case "learning":
      return "Learning";
    case "people":
      return "People";
    case "culture":
      return "Culture";
    case "impact":
      return "Impact";
    case "check-in":
      return "Check-in";
  }
}

export function riskLabel(risk: Risk) {
  switch (risk) {
    case "on-track":
      return "On track";
    case "watch":
      return "Watch";
    case "at-risk":
      return "At risk";
  }
}

export function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

const avatarTones: Record<string, string> = {
  maya: "#E2231A",
  luis: "#1E4D7B",
  priya: "#1F7A4D",
  elena: "#A16207",
  sam: "#6B3FA0",
  noah: "#B4533A",
  jordan: "#1C1614",
  helena: "#1E4D7B",
  helen: "#6B3FA0",
  owen: "#1F7A4D",
  lars: "#B4533A",
  samira: "#E2231A",
  devon: "#1E4D7B",
  hannah: "#1F7A4D",
  jonah: "#A16207",
  renee: "#6B3FA0",
  ida: "#B4533A",
  amira: "#A16207",
  chris: "#1E4D7B",
  noor: "#1F7A4D",
};

export function avatarTone(id: string) {
  return avatarTones[id] ?? "#1C1614";
}

export function upcomingStarters() {
  return [...starters].filter((starter) => starter.day < 1).sort((a, b) => b.day - a.day);
}

export function checkInTasks(starterIds?: string[]) {
  return tasks.filter(
    (task) =>
      task.category === "check-in" &&
      task.owner === "manager" &&
      (!starterIds || starterIds.includes(task.starterId)),
  );
}
