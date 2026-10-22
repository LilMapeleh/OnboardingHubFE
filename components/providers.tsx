"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { orderTaskByStarter, setupFor, starterById, tasks } from "@/lib/content";
import { answer, type AssistantReply } from "@/lib/assistant";
import { buildNotices } from "@/lib/notices";
import { taskDone } from "@/lib/model";
import type { Activity, Nudge, Role, Stage } from "@/lib/types";

const STORAGE_KEY = "onboarding-hub-v1";

export interface ChatMessage {
  id: string;
  from: "user" | "hub";
  text: string;
  reply?: AssistantReply;
}

interface Persisted {
  role: Role;
  done: string[];
  undone: string[];
  read: string[];
  dismissed: string[];
  notes: Record<string, string>;
  stages: Record<string, Stage>;
  accounts: Record<string, boolean>;
  focusStarterId: string;
  nudges: Nudge[];
  activity: Activity[];
}

const defaultPersisted: Persisted = {
  role: "new-hire",
  done: [],
  undone: [],
  read: [],
  dismissed: [],
  notes: {},
  stages: {},
  accounts: {},
  focusStarterId: "maya",
  nudges: [],
  activity: [],
};

interface HubContextValue extends Persisted {
  hydrated: boolean;
  assistantOpen: boolean;
  searchOpen: boolean;
  navOpen: boolean;
  toasts: { id: string; text: string }[];
  messages: ChatMessage[];
  notices: ReturnType<typeof buildNotices>;
  setRole: (role: Role) => void;
  setFocusStarterId: (id: string) => void;
  toggleTask: (taskId: string) => void;
  setNote: (key: string, value: string) => void;
  setStage: (starterId: string, stage: Stage) => void;
  setAccount: (starterId: string, accountId: string, ready: boolean) => void;
  stageOf: (starterId: string) => Stage;
  accountReady: (starterId: string, accountId: string, fallback: boolean) => boolean;
  markRead: (id: string) => void;
  markAllRead: () => void;
  dismissNotice: (id: string) => void;
  nudge: (starterId: string) => void;
  setAssistantOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setNavOpen: (open: boolean) => void;
  ask: (prompt: string) => void;
  resetDemo: () => void;
}

const HubContext = createContext<HubContextValue | null>(null);

const stageOrder: Stage[] = ["awaiting", "ordered", "imaging", "ready", "collected"];

function rank(stage: Stage) {
  return stageOrder.indexOf(stage);
}

export function HubProvider({ children }: { children: React.ReactNode }) {
  const [persisted, setPersisted] = useState<Persisted>(defaultPersisted);
  const [hydrated, setHydrated] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [toasts, setToasts] = useState<{ id: string; text: string }[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const toastRef = useRef(1);
  const chatRef = useRef(1);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Persisted>;
        setPersisted({ ...defaultPersisted, ...parsed });
      }
    } catch {
      setPersisted(defaultPersisted);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
  }, [hydrated, persisted]);

  const toast = useCallback((text: string) => {
    const id = `toast-${toastRef.current++}`;
    setToasts((current) => [...current, { id, text }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 3200);
  }, []);

  const patch = useCallback((partial: Partial<Persisted>) => {
    setPersisted((current) => ({ ...current, ...partial }));
  }, []);

  const setStage = useCallback(
    (starterId: string, stage: Stage) => {
      setPersisted((current) => {
        const next = { ...current, stages: { ...current.stages, [starterId]: stage } };
        const taskId = orderTaskByStarter[starterId];
        if (!taskId) return next;
        const task = tasks.find((item) => item.id === taskId);
        if (!task) return next;
        const complete = rank(stage) >= rank("ordered");
        const done = next.done.filter((id) => id !== taskId);
        const undone = next.undone.filter((id) => id !== taskId);
        if (complete) {
          return { ...next, undone, done: task.baseStatus === "done" ? done : [...done, taskId] };
        }
        return { ...next, done, undone: task.baseStatus === "done" ? [...undone, taskId] : undone };
      });
      const starter = starterById(starterId);
      toast(`${starter?.firstName ?? "Starter"}'s laptop is now ${stage}.`);
    },
    [toast],
  );

  const toggleTask = useCallback(
    (taskId: string) => {
      const task = tasks.find((item) => item.id === taskId);
      if (!task) return;
      setPersisted((current) => {
        const complete = taskDone(task, current.done, current.undone);
        const done = current.done.filter((id) => id !== taskId);
        const undone = current.undone.filter((id) => id !== taskId);
        let stages = current.stages;
        const starterId = Object.entries(orderTaskByStarter).find(([, id]) => id === taskId)?.[0];
        if (starterId && !complete) {
          const base = setupFor(starterId)?.stage ?? "awaiting";
          const currentStage = current.stages[starterId] ?? base;
          if (rank(currentStage) < rank("ordered")) {
            stages = { ...current.stages, [starterId]: "ordered" };
          }
        }
        if (complete) {
          return {
            ...current,
            stages,
            done,
            undone: task.baseStatus === "done" ? [...undone, taskId] : undone,
          };
        }
        return {
          ...current,
          stages,
          undone,
          done: task.baseStatus === "done" ? done : [...done, taskId],
        };
      });
      const currently = taskDone(task, persisted.done, persisted.undone);
      if (!currently) {
        toast(`${task.title} is complete.`);
        setPersisted((current) => ({
          ...current,
          activity: [
            { id: `act-${taskId}-${current.activity.length}`, text: task.title, meta: "Just now" },
            ...current.activity,
          ].slice(0, 8),
        }));
      }
    },
    [persisted.done, persisted.undone, toast],
  );

  const notices = useMemo(
    () =>
      buildNotices(persisted.role, persisted.done, persisted.undone, persisted.nudges).filter(
        (notice) => !persisted.dismissed.includes(notice.id),
      ),
    [persisted],
  );

  const ask = useCallback(
    (prompt: string) => {
      const text = prompt.trim();
      if (!text) return;
      const reply = answer(text, {
        role: persisted.role,
        done: persisted.done,
        undone: persisted.undone,
        focusStarterId: persisted.focusStarterId,
      });
      const userId = `m-${chatRef.current++}`;
      const hubId = `m-${chatRef.current++}`;
      setMessages((current) => [
        ...current,
        { id: userId, from: "user", text },
        { id: hubId, from: "hub", text: reply.body, reply },
      ]);
      setAssistantOpen(true);
    },
    [persisted.done, persisted.focusStarterId, persisted.role, persisted.undone],
  );

  const value = useMemo<HubContextValue>(
    () => ({
      ...persisted,
      hydrated,
      assistantOpen,
      searchOpen,
      navOpen,
      toasts,
      messages,
      notices,
      setRole: (role) => {
        patch({
          role,
          focusStarterId: role === "new-hire" ? "maya" : persisted.focusStarterId,
        });
        setNavOpen(false);
      },
      setFocusStarterId: (id) => patch({ focusStarterId: id }),
      toggleTask,
      setNote: (key, note) => patch({ notes: { ...persisted.notes, [key]: note } }),
      setStage,
      setAccount: (starterId, accountId, ready) =>
        patch({ accounts: { ...persisted.accounts, [`${starterId}:${accountId}`]: ready } }),
      stageOf: (starterId) => persisted.stages[starterId] ?? setupFor(starterId)?.stage ?? "awaiting",
      accountReady: (starterId, accountId, fallback) => {
        const key = `${starterId}:${accountId}`;
        return key in persisted.accounts ? persisted.accounts[key] : fallback;
      },
      markRead: (id) => patch({ read: persisted.read.includes(id) ? persisted.read : [...persisted.read, id] }),
      markAllRead: () => patch({ read: Array.from(new Set([...persisted.read, ...notices.map((notice) => notice.id)])) }),
      dismissNotice: (id) => patch({ dismissed: [...persisted.dismissed, id] }),
      nudge: (starterId) => {
        const starter = starterById(starterId);
        if (!starter) return;
        const id = `nudge-${starterId}-${persisted.nudges.length + 1}`;
        const title = `Nudge sent to ${starter.firstName}`;
        const body = `Asked ${starter.firstName} to clear the oldest open task and reply in Slack.`;
        const nudges = [
          { id, audience: "hr" as const, starterId, title, body, href: "/starters" },
          ...(starterId === "maya"
            ? [
                {
                  id: `${id}-hire`,
                  audience: "new-hire" as const,
                  starterId,
                  title: "Amira is checking in",
                  body: "People asked you to clear your oldest open task when you can.",
                  href: "/tasks",
                },
              ]
            : []),
          ...persisted.nudges,
        ];
        patch({ nudges });
        toast(title);
      },
      setAssistantOpen,
      setSearchOpen,
      setNavOpen,
      ask,
      resetDemo: () => {
        setPersisted(defaultPersisted);
        setMessages([]);
        localStorage.removeItem(STORAGE_KEY);
        toast("Demo reset to Thursday 22 October.");
      },
    }),
    [
      ask,
      assistantOpen,
      hydrated,
      messages,
      navOpen,
      notices,
      patch,
      persisted,
      searchOpen,
      setStage,
      toast,
      toasts,
      toggleTask,
    ],
  );

  return <HubContext.Provider value={value}>{children}</HubContext.Provider>;
}

export function useHub() {
  const context = useContext(HubContext);
  if (!context) throw new Error("useHub must be used within HubProvider");
  return context;
}

export function stageIndex(stage: Stage) {
  return rank(stage);
}

export const allStages = stageOrder;
