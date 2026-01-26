import React, { useMemo } from "react";

function PillButton({ active, children, onClick, ariaLabel }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={[
        "inline-flex items-center justify-center rounded-full px-3 py-1.5 text-sm font-medium transition",
        active
          ? "bg-slate-900 text-white"
          : "bg-white text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-50"
      ].join(" ")}
    >
      {children}
    </button>
  );
}

/**
 * FilterBar
 * - Status filter (All/Completed/Pending)
 * - Priority filter (All/High/Medium/Low)
 * - Search by title
 * - Shows visible task count
 */
export default function FilterBar({
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  searchQuery,
  setSearchQuery,
  totalVisible
}) {
  const countLabel = useMemo(() => {
    const n = Number(totalVisible || 0);
    return `${n} ${n === 1 ? "task" : "tasks"} shown`;
  }, [totalVisible]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4">
        {/* Status pills */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm font-semibold text-slate-900">Filters</div>
          <div className="text-xs text-slate-500">{countLabel}</div>
        </div>

        <div className="flex flex-wrap gap-2">
          <PillButton
            active={statusFilter === "all"}
            onClick={() => setStatusFilter("all")}
            ariaLabel="Show all tasks"
          >
            All
          </PillButton>
          <PillButton
            active={statusFilter === "pending"}
            onClick={() => setStatusFilter("pending")}
            ariaLabel="Show pending tasks"
          >
            Pending
          </PillButton>
          <PillButton
            active={statusFilter === "completed"}
            onClick={() => setStatusFilter("completed")}
            ariaLabel="Show completed tasks"
          >
            Completed
          </PillButton>
        </div>

        {/* Priority + Search */}
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="sm:col-span-1">
            <label className="block text-sm font-medium text-slate-700" htmlFor="priorityFilter">
              Priority
            </label>
            <select
              id="priorityFilter"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            >
              <option value="all">All</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700" htmlFor="search">
              Search (title)
            </label>
            <div className="mt-1 flex items-center gap-2">
              <div className="relative flex-1">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </span>
                <input
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  type="text"
                  placeholder="Search by title…"
                  className="w-full rounded-md border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  autoComplete="off"
                />
              </div>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                disabled={!searchQuery}
                className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


