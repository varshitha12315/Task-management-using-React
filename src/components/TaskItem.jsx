import React, { useMemo } from "react";

function formatDateLabel(yyyyMmDd) {
  if (!yyyyMmDd) return "";
  // Treat YYYY-MM-DD as a local date for display (avoid timezone shifting).
  const [y, m, d] = yyyyMmDd.split("-").map((x) => Number(x));
  if (!y || !m || !d) return yyyyMmDd;
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function isOverdue(yyyyMmDd) {
  if (!yyyyMmDd) return false;
  const [y, m, d] = yyyyMmDd.split("-").map((x) => Number(x));
  if (!y || !m || !d) return false;
  const due = new Date(y, m - 1, d);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return due.getTime() < today.getTime();
}

function priorityBadge(priority) {
  switch (priority) {
    case "high":
      return {
        label: "High",
        cls: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200"
      };
    case "medium":
      return {
        label: "Medium",
        cls: "bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200"
      };
    case "low":
      return {
        label: "Low",
        cls: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200"
      };
    default:
      return { label: "—", cls: "bg-slate-50 text-slate-700 ring-1 ring-inset ring-slate-200" };
  }
}

/**
 * TaskItem
 * - Displays a single task
 * - Allows complete toggle, edit, delete
 */
export default function TaskItem({ task, onEdit, onDelete, onToggleCompleted }) {
  const badge = useMemo(() => priorityBadge(task.priority), [task.priority]);
  const dueLabel = useMemo(() => formatDateLabel(task.dueDate), [task.dueDate]);
  const overdue = useMemo(
    () => !task.completed && isOverdue(task.dueDate),
    [task.completed, task.dueDate]
  );

  return (
    <li
      className={[
        "rounded-xl border bg-white p-4 shadow-sm transition sm:p-5",
        task.completed ? "border-slate-200 opacity-80" : "border-slate-200 hover:border-slate-300"
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => onToggleCompleted(task.id)}
          className={[
            "mt-0.5 flex h-5 w-5 items-center justify-center rounded border shadow-sm",
            task.completed
              ? "border-slate-900 bg-slate-900 text-white"
              : "border-slate-300 bg-white text-transparent hover:border-slate-400"
          ].join(" ")}
          aria-label={task.completed ? "Mark as pending" : "Mark as completed"}
          title={task.completed ? "Mark as pending" : "Mark as completed"}
        >
          {/* simple checkmark */}
          <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.07 7.094a1 1 0 0 1-1.42.002L3.29 8.872a1 1 0 0 1 1.414-1.414l3.225 3.225 6.36-6.394a1 1 0 0 1 1.415.001z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3
                className={[
                  "truncate text-sm font-semibold text-slate-900 sm:text-base",
                  task.completed ? "line-through decoration-slate-400" : ""
                ].join(" ")}
                title={task.title}
              >
                {task.title}
              </h3>
              {task.description ? (
                <p
                  className={[
                    "mt-1 text-sm text-slate-600",
                    task.completed ? "line-through decoration-slate-300" : ""
                  ].join(" ")}
                >
                  {task.description}
                </p>
              ) : null}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${badge.cls}`}>
                {badge.label}
              </span>
              {task.dueDate ? (
                <span
                  className={[
                    "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
                    overdue
                      ? "bg-rose-50 text-rose-700 ring-rose-200"
                      : "bg-slate-50 text-slate-700 ring-slate-200"
                  ].join(" ")}
                  title={task.dueDate}
                >
                  Due {dueLabel}
                </span>
              ) : null}
            </div>
          </div>

          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-slate-500">
              {task.completed ? "Completed" : "Pending"}
              {task.updatedAt ? (
                <span className="hidden sm:inline">
                  {" "}
                  · Updated{" "}
                  {new Date(task.updatedAt).toLocaleString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                  })}
                </span>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onEdit(task)}
                className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(task.id)}
                className="inline-flex items-center justify-center rounded-md border border-rose-200 bg-white px-3 py-1.5 text-sm font-medium text-rose-700 shadow-sm hover:bg-rose-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}


