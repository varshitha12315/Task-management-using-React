import React, { useEffect, useMemo, useState } from "react";
import TaskForm from "./components/TaskForm.jsx";
import FilterBar from "./components/FilterBar.jsx";
import TaskList from "./components/TaskList.jsx";

/**
 * LocalStorage key used for persistence.
 * Keep this stable so users don't lose tasks between releases.
 */
const STORAGE_KEY = "tm_tasks_v1";

/**
 * Safely read tasks from LocalStorage.
 * Returns an empty array if nothing is stored or JSON is corrupted.
 */
function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function App() {
  // Task state is the single source of truth for the UI.
  const [tasks, setTasks] = useState(() => loadTasks());

  // UI state for filtering/searching.
  const [statusFilter, setStatusFilter] = useState("all"); // all | completed | pending
  const [priorityFilter, setPriorityFilter] = useState("all"); // all | high | medium | low
  const [searchQuery, setSearchQuery] = useState("");

  // For editing: we store the currently selected task object (or null).
  const [editingTask, setEditingTask] = useState(null);

  /**
   * Persist tasks into LocalStorage whenever they change.
   * This is what makes tasks survive page refresh.
   */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  /**
   * Derive filtered tasks from state (no extra state needed).
   * useMemo avoids re-filtering on unrelated renders.
   */
  const visibleTasks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return tasks
      .filter((t) => {
        if (statusFilter === "completed") return Boolean(t.completed);
        if (statusFilter === "pending") return !t.completed;
        return true;
      })
      .filter((t) => {
        if (priorityFilter === "all") return true;
        return t.priority === priorityFilter;
      })
      .filter((t) => {
        if (!q) return true;
        return (t.title || "").toLowerCase().includes(q);
      })
      // Sort: incomplete first, then nearest due date, then newest
      .sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;

        const ad = a.dueDate ? new Date(a.dueDate).getTime() : Number.POSITIVE_INFINITY;
        const bd = b.dueDate ? new Date(b.dueDate).getTime() : Number.POSITIVE_INFINITY;
        if (ad !== bd) return ad - bd;

        return (b.createdAt || 0) - (a.createdAt || 0);
      });
  }, [tasks, statusFilter, priorityFilter, searchQuery]);

  const summary = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    return { total, completed, pending };
  }, [tasks]);

  function handleAddTask(payload) {
    // payload comes from TaskForm and is already validated.
    const now = Date.now();
    const newTask = {
      id: now, // Unique enough for LocalStorage apps (per requirements).
      title: payload.title,
      description: payload.description,
      priority: payload.priority, // high | medium | low
      dueDate: payload.dueDate || "", // YYYY-MM-DD (string)
      completed: false,
      createdAt: now,
      updatedAt: now
    };
    setTasks((prev) => [newTask, ...prev]);
  }

  function handleStartEdit(task) {
    setEditingTask(task);
    // Scroll to top on smaller screens so the user sees the form immediately.
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancelEdit() {
    setEditingTask(null);
  }

  function handleUpdateTask(taskId, payload) {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          title: payload.title,
          description: payload.description,
          priority: payload.priority,
          dueDate: payload.dueDate || "",
          updatedAt: Date.now()
        };
      })
    );
    setEditingTask(null);
  }

  function handleDeleteTask(taskId) {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    // If you delete the item you were editing, exit edit mode.
    if (editingTask?.id === taskId) setEditingTask(null);
  }

  function handleToggleCompleted(taskId) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, completed: !t.completed, updatedAt: Date.now() }
          : t
      )
    );
  }

  function handleClearAll() {
    // Simple safety confirmation. No external libs, no modal.
    const ok = window.confirm("Clear ALL tasks? This cannot be undone.");
    if (!ok) return;
    setTasks([]);
    setEditingTask(null);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top bar */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div>
            <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
              Task Management
            </h1>
            <p className="text-sm text-slate-500">
              {summary.total} total · {summary.pending} pending · {summary.completed} completed
            </p>
          </div>

          <button
            type="button"
            onClick={handleClearAll}
            disabled={tasks.length === 0}
            className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Clear all tasks"
            title="Clear all tasks"
          >
            Clear all
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-12">
        {/* Left column: Form */}
        <section className="lg:col-span-5">
          <TaskForm
            onAdd={handleAddTask}
            onUpdate={handleUpdateTask}
            onCancelEdit={handleCancelEdit}
            editingTask={editingTask}
          />
        </section>

        {/* Right column: Filters + List */}
        <section className="lg:col-span-7">
          <FilterBar
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            totalVisible={visibleTasks.length}
          />

          <div className="mt-4">
            <TaskList
              tasks={visibleTasks}
              onEdit={handleStartEdit}
              onDelete={handleDeleteTask}
              onToggleCompleted={handleToggleCompleted}
              emptyStateHint={
                tasks.length === 0
                  ? "Add your first task to get started."
                  : "No tasks match your current filters."
              }
            />
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-slate-500 sm:px-6">
          Data is stored locally in your browser (LocalStorage). No backend.
        </div>
      </footer>
    </div>
  );
}


