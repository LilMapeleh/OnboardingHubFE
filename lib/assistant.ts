import {
  nav,
  people,
  personById,
  resources,
  setups,
  starterById,
  starters,
  workspaces,
} from "./content";
import {
  attentionLine,
  dayLabel,
  dueLabel,
  ownerName,
  phaseForDay,
  phaseMeta,
  progressFor,
  riskFor,
  riskLabel,
  starterTasks,
  supportCircle,
  taskDone,
} from "./model";
import type { Role } from "./types";

export interface AssistantLink {
  label: string;
  href: string;
}

export interface AssistantItem {
  label: string;
  meta: string;
}

export interface AssistantReply {
  body: string;
  links: AssistantLink[];
  items: AssistantItem[];
}

export interface AssistantContext {
  role: Role;
  done: string[];
  undone: string[];
  focusStarterId: string;
}

const pages = [...nav, ...workspaces, { href: "/notifications", label: "Notifications", hint: "Reminders", icon: "home" as const }];

function starterFor(ctx: AssistantContext) {
  if (ctx.role === "new-hire") return starterById("maya")!;
  return starterById(ctx.focusStarterId) ?? starterById("maya")!;
}

function openTasks(ctx: AssistantContext, starterId?: string) {
  return (starterId ? starterTasks(starterId) : starterTasks(starterFor(ctx).id))
    .filter((task) => !taskDone(task, ctx.done, ctx.undone))
    .sort((a, b) => a.dueDay - b.dueDay);
}

function reply(body: string, links: AssistantLink[] = [], items: AssistantItem[] = []): AssistantReply {
  return { body, links, items };
}

export function suggestedPrompts(role: Role) {
  switch (role) {
    case "new-hire":
      return [
        "What should I do next?",
        "Who is my buddy?",
        "How do I use Workday?",
        "What happens at day 30?",
      ];
    case "manager":
      return [
        "What is waiting on me?",
        "How is Maya doing?",
        "What should a 30-day check-in cover?",
        "Who is at risk?",
      ];
    case "hr":
      return [
        "Who needs attention?",
        "Who has not started yet?",
        "What is overdue for People?",
        "Open the pulse",
      ];
    case "it":
      return [
        "Who is waiting on a laptop?",
        "What access does Priya still need?",
        "How do new hires set up Okta?",
      ];
    case "workplace":
      return [
        "What should be ready for Priya?",
        "Whose welcome kit is open?",
        "What does day one look like?",
      ];
  }
}

export function answer(raw: string, ctx: AssistantContext): AssistantReply {
  const query = raw.trim().toLowerCase();
  const starter = starterFor(ctx);

  if (!query) {
    return reply("Ask about a task, a person, or a system. I can also take you to the right desk.");
  }

  const page = pages.find((item) => {
    const name = item.label.toLowerCase();
    return (
      (query.includes(name) || query.includes(item.href.slice(1))) &&
      /(open|go|take|show|where|navigate|pulse|page)/.test(query)
    );
  });
  if (page && /(open|go|take|show|where|navigate)/.test(query)) {
    return reply(`The ${page.label.toLowerCase()} desk is the right place for that.`, [
      { label: `Open ${page.label}`, href: page.href },
    ]);
  }

  if (/(who is at risk|at risk|needs attention|cohort|pulse|who needs)/.test(query)) {
    const rows = starters.map((person) => ({
      person,
      risk: riskFor(person, ctx.done, ctx.undone),
      line: attentionLine(person, ctx.done, ctx.undone),
    }));
    const hot = rows.filter((row) => row.risk !== "on-track");
    return reply(
      hot.length
        ? "These starters need a human, not another reminder piled on top."
        : "Everyone in this sample cohort is on track.",
      [{ label: "Open Pulse", href: "/pulse" }],
      rows.map((row) => ({
        label: `${row.person.name} · ${riskLabel(row.risk)}`,
        meta: row.line ?? dayLabel(row.person.day),
      })),
    );
  }

  const named = starters.find((person) => query.includes(person.firstName.toLowerCase()) || query.includes(person.name.toLowerCase()));
  if (named && /(how is|doing|status|progress|about)/.test(query)) {
    const progress = progressFor(starterTasks(named.id), ctx.done, ctx.undone);
    const line = attentionLine(named, ctx.done, ctx.undone);
    return reply(
      `${named.name} is ${dayLabel(named.day).toLowerCase()} in ${phaseMeta(phaseForDay(named.day)).label}. Journey progress is ${progress.pct}%. ${line ?? "Nothing is overdue."}`,
      [{ label: `Open ${named.firstName}'s journey`, href: "/journey" }],
      openTasks(ctx, named.id)
        .slice(0, 3)
        .map((task) => ({ label: task.title, meta: dueLabel(task, named.day, false) })),
    );
  }

  if (/(buddy|manager|who do i ask|who is my|hr partner|people partner)/.test(query)) {
    const circle = supportCircle(named ?? starter);
    const focus = /buddy/.test(query)
      ? circle.find((person) => person.id === (named ?? starter).buddyId)
      : /manager/.test(query)
        ? circle.find((person) => person.id === (named ?? starter).managerId)
        : null;
    if (focus) {
      return reply(`${focus.name} is ${focus.title} in ${focus.team}. ${focus.focus}`, [
        { label: "Open support", href: "/support" },
      ], [{ label: focus.email, meta: focus.slack }]);
    }
    return reply(
      `Around ${named?.firstName ?? starter.firstName}, these are the people who actually unblock the journey.`,
      [{ label: "Open support", href: "/support" }],
      circle.map((person) => ({ label: person.name, meta: person.title })),
    );
  }

  if (/(what should i do|next|due|overdue|today|this week|waiting on me|my tasks)/.test(query)) {
    const open = tasksForRole(ctx)
      .filter((task) => !taskDone(task, ctx.done, ctx.undone))
      .sort((a, b) => a.dueDay - b.dueDay)
      .slice(0, 4);
    if (open.length === 0) {
      return reply("Nothing open on your desk right now.", [{ label: "Browse tasks", href: "/tasks" }]);
    }
    return reply(
      "Start with the oldest date. The rest can wait.",
      [{ label: "Open tasks", href: "/tasks" }],
      open.map((task) => {
        const person = starterById(task.starterId)!;
        return {
          label: task.title,
          meta: `${person.firstName} · ${dueLabel(task, person.day, false)}`,
        };
      }),
    );
  }

  if (/(30|60|90|check-in|check in)/.test(query)) {
    const which = query.includes("60") ? "day 60" : query.includes("90") ? "day 90" : "day 30";
    const prompts =
      which === "day 60"
        ? ["Where has value already shown up?", "What should stop?", "Who relies on them now?"]
        : which === "day 90"
          ? ["What will they own next?", "What support stays?", "What are the quarter goals?"]
          : ["What is clear, and what is fuzzy?", "Which relationship needs time?", "What does a good next month look like?"];
    return reply(
      `A ${which} check-in is 45 minutes. The new hire writes first. The manager listens, then leaves with one outcome.`,
      [{ label: "Open the manager desk", href: "/team" }],
      prompts.map((item) => ({ label: item, meta: which })),
    );
  }

  if (/(laptop|equipment|device|macbook|access does priya|priya still)/.test(query)) {
    const target = named ?? starters.find((person) => query.includes(person.firstName.toLowerCase())) ?? starters.find((person) => person.id === "priya")!;
    const setup = setups.find((item) => item.starterId === target.id);
    if (!setup) return reply("I could not find a device record for that person.");
    return reply(
      `${target.firstName}'s ${setup.device} is ${setup.stage}. Desk: ${setup.desk}.`,
      [{ label: "Open equipment", href: "/equipment" }],
      setup.accounts.map((account) => ({
        label: account.label,
        meta: account.ready ? "Ready" : "Not yet",
      })),
    );
  }

  if (/(okta|mfa|sign in|login)/.test(query)) {
    const guide = resources.find((item) => item.id === "okta")!;
    return reply(guide.summary, [{ label: "Open the Okta guide", href: "/resources" }], guide.steps.map((step) => ({ label: step, meta: "Okta" })));
  }

  if (/(workday|pto|time off|holiday|benefit|payroll)/.test(query)) {
    return reply(
      "Workday holds pay, time off, and personal details. This hub only points there. Plans differ by country, so treat the Workday page as the source, not this demo.",
      [{ label: "Open the Workday note", href: "/resources" }],
      [
        { label: "Time off", meta: "Request it in the Absence app. Your manager approves." },
        { label: "Benefits", meta: "Enrol from the deadline in your welcome mail." },
        { label: "Profile", meta: "Bank details and emergency contacts sit under personal information." },
      ],
    );
  }

  if (/(slack|channel)/.test(query)) {
    const guide = resources.find((item) => item.id === "slack")!;
    return reply(guide.summary, [{ label: "Open Slack notes", href: "/resources" }], guide.steps.map((step) => ({ label: step, meta: "Slack" })));
  }

  if (/(xm cloud|sandbox|cloud portal|what is xm)/.test(query)) {
    return reply(
      "XM Cloud is the product Maya, Luis, and much of this cohort orbit. Cloud Portal is where a personal sandbox is granted. The fundamentals course is the shortest way in.",
      [
        { label: "XM Cloud course", href: "/resources" },
        { label: "Journey", href: "/journey" },
      ],
    );
  }

  if (/(desk|kit|day one|first day|office|where do i)/.test(query)) {
    const target = named ?? starter;
    const setup = setups.find((item) => item.starterId === target.id)!;
    return reply(
      `${target.firstName} arrives ${setup.firstDay}. Desk ${setup.desk}. Kit: ${setup.kit}. Reception asks for photo ID, then Workplace.`,
      [{ label: "Open workplace", href: "/workplace" }],
      [
        { time: "09:30", title: "Badge" },
        { time: "10:00", title: "Laptop and Okta" },
        { time: "11:00", title: "Manager welcome" },
      ].map((item) => ({ label: item.title, meta: item.time })),
    );
  }

  if (/(expense|travel|navan)/.test(query)) {
    const guide = resources.find((item) => item.id === "expenses")!;
    return reply(guide.summary, [{ label: "Open the expense note", href: "/resources" }], guide.steps.map((step) => ({ label: step, meta: "Navan" })));
  }

  const resource = resources.find((item) => query.includes(item.title.toLowerCase()) || query.includes(item.id.replace("-", " ")));
  if (resource) {
    return reply(resource.summary, [{ label: "Open resources", href: "/resources" }], resource.steps.map((step) => ({ label: step, meta: resource.source })));
  }

  const person = people.find((item) => query.includes(item.name.toLowerCase().split(" ")[0].toLowerCase()));
  if (person && query.split(" ").length < 8) {
    return reply(`${person.name}, ${person.title}. ${person.focus}`, [{ label: "Open support", href: "/support" }], [
      { label: person.email, meta: person.slack },
    ]);
  }

  const taskHit = tasksForRole(ctx).find((task) => query.includes(task.title.toLowerCase().slice(0, 18).toLowerCase()));
  if (taskHit) {
    const person = starterById(taskHit.starterId)!;
    const complete = taskDone(taskHit, ctx.done, ctx.undone);
    return reply(
      `${taskHit.detail} ${ownerName(taskHit)} owns it. ${dueLabel(taskHit, person.day, complete)}.`,
      [{ label: "Open tasks", href: "/tasks" }],
    );
  }

  return reply(
    "I can help with the 90-day journey, the people around a starter, and the systems they use: Okta, Workday, Slack, Cloud Portal, and the design library. Try one of the suggestions, or ask who needs attention.",
    pages.slice(0, 4).map((item) => ({ label: item.label, href: item.href })),
  );
}

function tasksForRole(ctx: AssistantContext) {
  const all = starters.flatMap((person) => starterTasks(person.id));
  if (ctx.role === "new-hire") {
    return all.filter((task) => task.starterId === "maya" && task.owner === "new-hire");
  }
  if (ctx.role === "manager") {
    return all.filter(
      (task) => task.owner === "manager" && (task.starterId === "maya" || task.starterId === "luis"),
    );
  }
  return all.filter((task) => task.owner === ctx.role);
}

export function roleGreeting(role: Role) {
  switch (role) {
    case "new-hire":
      return "Ask about your next task, your buddy, or a system.";
    case "manager":
      return "Ask what is waiting, or how Maya and Luis are doing.";
    case "hr":
      return "Ask who needs attention across the cohort.";
    case "it":
      return "Ask who is waiting on a device or an account.";
    case "workplace":
      return "Ask what day one should look like, and for whom.";
  }
}

export function personLine(id: string) {
  const person = personById(id);
  return person ? `${person.name}, ${person.title}` : id;
}
