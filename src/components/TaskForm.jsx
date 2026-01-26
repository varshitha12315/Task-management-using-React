import React, { useEffect, useMemo, useState } from "react";

/**
 * TaskForm
 * - Controlled inputs (title, description, priority, dueDate)
 * - Reusable for Add + Edit modes
 * - Lightweight validation (required title, max lengths)
 */
export default function TaskForm({ onAdd, onUpdate, onCancelEdit, editingTask }) {
  const isEditing = Boolean(editingTask);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium"); // high | medium | low
  const [dueDate, setDueDate] = useState(""); // YYYY-MM-DD

  const [touched, setTouched] = useState(false);

  // When switching into/out of edit mode, populate/reset the form.
  useEffect(() => {
    if (!editingTask) {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
      setTouched(false);
      return;
    }

    setTitle(editingTask.title || "");
    setDescription(editingTask.description || "");
    setPriority(editingTask.priority || "medium");
    setDueDate(editingTask.dueDate || "");
    setTouched(false);
  }, [editingTask]);

  const errors = useMemo(() => {
    const next = {};
    const t = title.trim();

    if (!t) next.title = "Title is required.";
    if (t.length > 80) next.title = "Title must be 80 characters or less.";
    if ((description || "").length > 500)
      next.description = "Description must be 500 characters or less.";

    // dueDate is optional; browser input enforces valid format
    return next;
  }, [title, description]);

  const isValid = Object.keys(errors).length === 0;

  function handleSubmit(e) {
    e.preventDefault();
    setTouched(true);
    if (!isValid) return;

    const payload = {
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate
    };

    if (isEditing) {
      onUpdate(editingTask.id, payload);
    } else {
      onAdd(payload);
      // Reset after successful add
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
      setTouched(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-slate-900">
            {isEditing ? "Edit task" : "Add a new task"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {isEditing
              ? "Update details and save changes."
              : "Capture what you need to do, set priority and due date."}
          </p>
        </div>
        {isEditing ? (
          <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-200">
            Editing
          </span>
        ) : null}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700" htmlFor="title">
            Title <span className="text-rose-600">*</span>
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => setTouched(true)}
            type="text"
            placeholder="e.g., Finish project report"
            className={[
              "mt-1 w-full rounded-md border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition",
              touched && errors.title
                ? "border-rose-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                : "border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            ].join(" ")}
            maxLength={120}
            autoComplete="off"
          />
          {touched && errors.title ? (
            <p className="mt-1 text-sm text-rose-600">{errors.title}</p>
          ) : (
            <p className="mt-1 text-xs text-slate-500">Keep it short and actionable.</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            className="block text-sm font-medium text-slate-700"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Add details, links, or steps (optional)"
            className={[
              "mt-1 w-full resize-none rounded-md border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition",
              touched && errors.description
                ? "border-rose-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                : "border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            ].join(" ")}
            maxLength={600}
          />
          {touched && errors.description ? (
            <p className="mt-1 text-sm text-rose-600">{errors.description}</p>
          ) : (
            <p className="mt-1 text-xs text-slate-500">Optional, up to 500 characters.</p>
          )}
        </div>

        {/* Priority + Due date */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="priority">
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="dueDate">
              Due date
            </label>
            <input
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              type="date"
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            className={[
              "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold shadow-sm transition",
              isValid
                ? "bg-slate-900 text-white hover:bg-slate-800"
                : "cursor-not-allowed bg-slate-200 text-slate-500"
            ].join(" ")}
            disabled={!isValid}
          >
            {isEditing ? "Save changes" : "Add task"}
          </button>

          {isEditing ? (
            <button
              type="button"
              onClick={onCancelEdit}
              className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              Cancel
            </button>
          ) : (
            <div className="text-xs text-slate-500">
              Tip: use filters and search to quickly find tasks.
            </div>
          )}
        </div>
      </form>
    </div>
  );
}


