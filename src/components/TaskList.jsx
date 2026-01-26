import React from "react";
import TaskItem from "./TaskItem.jsx";

/**
 * TaskList
 * - Renders TaskItem rows
 * - Shows an empty state when list is empty
 */
export default function TaskList({
  tasks,
  onEdit,
  onDelete,
  onToggleCompleted,
  emptyStateHint
}) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-700">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5h6m-6 4h6m-7 4h7m-8 8h8a2 2 0 002-2V7a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="mt-3 text-sm font-semibold text-slate-900">No tasks</h3>
        <p className="mt-1 text-sm text-slate-600">{emptyStateHint || "You're all caught up."}</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleCompleted={onToggleCompleted}
        />
      ))}
    </ul>
  );
}



