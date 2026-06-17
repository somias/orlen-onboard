import { TODAY, TRACK_ORDER, TRACK_OFFSET, TRACK_TEAM } from "./constants";
import { TEMPLATES } from "./templates";

export function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

export function fmt(date, locale = "en-GB") {
  return date.toLocaleDateString(locale, { day: "numeric", month: "short" });
}

export function initials(name) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

let TASK_SEQ = 1;
let HIRE_SEQ = 1;

export function tasksFromTemplate(templateKey, start) {
  const tpl = TEMPLATES[templateKey];
  const tasks = [];
  for (const track of TRACK_ORDER) {
    const items = tpl.tracks[track] || [];
    for (const label of items) {
      tasks.push({
        id: TASK_SEQ++,
        track,
        label,
        done: false,
        assignee: TRACK_TEAM[track],
        due: addDays(start, TRACK_OFFSET[track]),
      });
    }
  }
  return tasks;
}

export function buildHire({ name, role, templateKey, start, owner, pct }) {
  const tasks = tasksFromTemplate(templateKey, start);
  const doneN = Math.round((pct ?? 0) * tasks.length);
  tasks.forEach((t, i) => (t.done = i < doneN));
  return {
    id: HIRE_SEQ++,
    name,
    role,
    department: TEMPLATES[templateKey].department,
    templateKey,
    start,
    owner,
    tasks,
  };
}

export function derive(hire) {
  const total = hire.tasks.length;
  const done = hire.tasks.filter((t) => t.done).length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const overdue = hire.tasks.filter((t) => !t.done && t.due < TODAY).length;
  let status;
  if (pct === 100) status = "Complete";
  else if (overdue > 0) status = "Overdue";
  else if (hire.start <= TODAY) status = "In progress";
  else if (hire.start <= addDays(TODAY, 7)) status = "Starting soon";
  else status = "Upcoming";
  return { total, done, pct, overdue, status };
}

export const SEED = [
  buildHire({
    name: "Miloš Savković",
    role: "Senior software engineer",
    templateKey: "corporate",
    start: new Date(2026, 4, 25),
    owner: "Sebastian Wróblewski",
    pct: 1,
  }),
  buildHire({
    name: "Lukas Brandt",
    role: "Junior power trader",
    templateKey: "trading",
    start: new Date(2026, 5, 22),
    owner: "P. Nowak",
    pct: 0.64,
  }),
  buildHire({
    name: "Anna Kowalska",
    role: "Compliance officer",
    templateKey: "compliance",
    start: new Date(2026, 5, 18),
    owner: "M. Lang",
    pct: 0.82,
  }),
  buildHire({
    name: "Piotr Nowak",
    role: "Back-office analyst",
    templateKey: "operations",
    start: new Date(2026, 5, 16),
    owner: "T. Becker",
    pct: 0.45,
  }),
  buildHire({
    name: "Sofia Richter",
    role: "HR coordinator",
    templateKey: "corporate",
    start: new Date(2026, 5, 29),
    owner: "Sebastian Wróblewski",
    pct: 0.2,
  }),
  buildHire({
    name: "Jonas Weber",
    role: "IT systems engineer",
    templateKey: "it",
    start: new Date(2026, 6, 1),
    owner: "P. Nowak",
    pct: 0.1,
  }),
  buildHire({
    name: "Sebastian Wróblewski",
    role: "Head of Corporate Services",
    templateKey: "corporate",
    start: new Date(2019, 8, 2),
    owner: "Executive Board",
    pct: 1,
  }),
];
