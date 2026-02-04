## Task Management Web Application

A modern, minimal **Task Management** web app built with **React (Vite)**, **Tailwind CSS**, and **LocalStorage** for data persistence. Tasks are stored entirely in the browser — no backend required.

---

## ✨ Features

- **Add tasks** with:
  - Title (required)
  - Description (optional)
  - Priority: High / Medium / Low
  - Due date
- **Edit / Delete** existing tasks
- **Mark tasks as Completed / Pending**
- **Task priority badges** with color-coding
- **Due date display** with overdue highlighting
- **Filter tasks** by:
  - All
  - Completed
  - Pending
  - Priority (All / High / Medium / Low)
- **Search tasks by title**
- **Task summary**:
  - Total
  - Pending
  - Completed
- **Empty state UI** when:
  - No tasks exist
  - No tasks match current filters
- **Responsive design** for mobile, tablet, and desktop
- **LocalStorage persistence** (data survives page refresh)
- **Simple “Clear all tasks”** action with confirmation

---

## 🛠 Tech Stack

- **React.js** (Functional Components, Hooks)
- **JavaScript (ES6+)**
- **Vite** (build tool & dev server)
- **Tailwind CSS** (utility-first styling)
- **Browser LocalStorage** (persistence)
- No backend, no TypeScript, no external state libraries

---

## 📁 Project Structure

```bash
.
├─ index.html
├─ package.json
├─ postcss.config.js
├─ tailwind.config.js
├─ vite.config.js
└─ src
   ├─ main.jsx
   ├─ App.jsx
   ├─ index.css
   └─ components
      ├─ TaskForm.jsx
      ├─ TaskList.jsx
      ├─ TaskItem.jsx
      └─ FilterBar.jsx
```

- `App.jsx` – main layout, state management, LocalStorage sync, filtering & summary
- `TaskForm.jsx` – controlled form for adding/editing tasks
- `TaskList.jsx` – renders list and empty state
- `TaskItem.jsx` – single task card (priority badge, due date, actions)
- `FilterBar.jsx` – status & priority filters, search, visible count

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18+ recommended)
- **npm** (comes with Node)

### Install dependencies

```bash
npm install
```

### Run in development mode

```bash
npm run dev
```

Open the dev URL shown in the terminal (usually `http://localhost:5173/`).

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

---

## 💾 Data Persistence

- All tasks are stored under a stable LocalStorage key (e.g. `tm_tasks_v1`).
- Clearing browser storage or using a different browser/machine will reset tasks.
- “Clear all” removes every task and resets LocalStorage for this app.

---

## 🧩 Implementation Notes

- Uses React **hooks**: `useState`, `useEffect`, `useMemo`
- **Controlled inputs** in `TaskForm` for all fields
- Simple client-side **validation**:
  - Title required, length-limited
  - Description length-limited
- **Tailwind CSS only** (`index.css` contains only Tailwind directives)
- **No dark mode** (by design, per requirements)

---

## 📦 Scripts (package.json)

- `npm run dev` – start Vite dev server
- `npm run build` – production build
- `npm run preview` – preview built app

---

## 👩‍💻 Author

*Varshitha I P*  
BE in Data Science | Aspiring Software Developer  

Focused on building clean, scalable, and responsive web applications.  
This project is part of my internship-focused portfolio to demonstrate front-end development skills.

- GitHub: https://github.com/varshitha12315
- LinkedIn: www.linkedin.com/in/varshitha-i-p
