import { cx } from "@/lib/cx";

export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="9" fill="#E2231A" />
      <path
        d="M8 18.5 13.2 13l4 4L24 10"
        fill="none"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8 23h16" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

const paths = {
  home: "M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-4.5v-5h-3V21H5a1 1 0 0 1-1-1v-8.5Z",
  path: "M4 16c2.5-4 5-4 7.5 0s5 4 8.5 0",
  tasks: "M5 6h14M5 12h14M5 18h9",
  pulse: "M3 12h3l2-5 4 10 2-5h7",
  book: "M5 5.5h6.5A2.5 2.5 0 0 1 14 8v11H7.2A2.2 2.2 0 0 0 5 21.2V5.5Zm14 0H12.5",
  people: "M9 11a3 3 0 1 0-0.01-6A3 3 0 0 0 9 11Zm6 0a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8ZM4 19.5c.4-2.4 2.4-3.5 5-3.5s4.6 1.1 5 3.5M14 16.2c1.6-.2 3.2.4 3.8 2.3",
  team: "M8 14V6h8v8M4 18h16",
  starters: "M12 4v16M5 8h14M7 16h10",
  device: "M6 5h12v10H6V5Zm3 12h6",
  desk: "M3 15h18M8 15v4M16 15v4M6 8h12",
  search: "M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Zm5.2-2.3L20 20",
  bell: "M6 16V11a6 6 0 1 1 12 0v5l1.5 2H4.5L6 16Zm3.2 2a2.8 2.8 0 0 0 5.6 0",
  spark: "M12 3l1.4 5.2L18.5 9.5 13.4 11 12 16l-1.4-5L5.5 9.5 10.6 8.2 12 3Z",
  close: "M6 6l12 12M18 6 6 18",
  menu: "M4 7h16M4 12h16M4 17h16",
} as const;

export function Icon({
  name,
  className,
}: {
  name: keyof typeof paths;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" className={cx("h-4 w-4", className)} fill="none" aria-hidden>
      <path d={paths[name]} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
