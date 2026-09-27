import { useState } from 'react'
import './App.css'

// ─── Constants ─────────────────────────────────────────────────────────────────
// Single source of truth for all employees used everywhere in the app
const EMPLOYEES = [
  { name: 'Priya Sharma', role: 'Sales Manager',       initials: 'PS', color: '#4f6ef7' },
  { name: 'Arjun Mehta',  role: 'Operations Lead',     initials: 'AM', color: '#10b981' },
  { name: 'Sara Nair',    role: 'Marketing Specialist', initials: 'SN', color: '#f59e0b' },
  { name: 'Rahul Gupta',  role: 'Customer Support',    initials: 'RG', color: '#8b5cf6' },
]
// Plain name array — used in the task form select options
const EMPLOYEE_NAMES = EMPLOYEES.map((e) => e.name)

// Max tasks per person used to calculate workload %
// We consider 5 tasks as "full" workload for visual purposes
const MAX_WORKLOAD_TASKS = 5

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
  { id: 'tasks',     label: 'Tasks',     icon: '📋' },
  { id: 'team',      label: 'Team',      icon: '👥' },
]

// ─── Initial task list (sample data) ──────────────────────────────────────────
const initialTasks = [
  {
    id: 1,
    title: 'Update product inventory spreadsheet',
    description: '',
    assignee: 'Priya Sharma',
    deadline: 'Today, 3:00 PM',
    priority: 'High',
    status: 'In Progress',
  },
  {
    id: 2,
    title: 'Reply to pending customer emails',
    description: '',
    assignee: 'Arjun Mehta',
    deadline: 'Today, 5:00 PM',
    priority: 'Medium',
    status: 'To Do',
  },
  {
    id: 3,
    title: 'Prepare weekly sales report',
    description: '',
    assignee: 'Sara Nair',
    deadline: 'Today, 6:00 PM',
    priority: 'High',
    status: 'To Do',
  },
  {
    id: 4,
    title: 'Schedule team standup for next week',
    description: '',
    assignee: 'Rahul Gupta',
    deadline: 'Today, 12:00 PM',
    priority: 'Low',
    status: 'Completed',
  },
  {
    id: 5,
    title: 'Review new vendor contract draft',
    description: '',
    assignee: 'Priya Sharma',
    deadline: 'Today, 4:30 PM',
    priority: 'Medium',
    status: 'In Progress',
  },
]

// Blank form — used when creating a new task
const blankForm = {
  title:       '',
  description: '',
  assignee:    EMPLOYEE_NAMES[0],
  priority:    'Medium',
  deadline:    '',
  status:      'To Do',
}

// ─── Badge helpers ─────────────────────────────────────────────────────────────
function PriorityBadge({ priority }) {
  const cls = { High: 'badge-high', Medium: 'badge-medium', Low: 'badge-low' }[priority] || ''
  return <span className={`badge priority-badge ${cls}`}>{priority}</span>
}

function StatusBadge({ status }) {
  const cls = {
    'To Do':       'badge-todo',
    'In Progress': 'badge-inprogress',
    'Completed':   'badge-completed',
  }[status] || ''
  return <span className={`badge status-badge ${cls}`}>{status}</span>
}

// ─── Shared Task Form Modal ────────────────────────────────────────────────────
function TaskFormModal({ initialData, submitLabel, modalHeading, onClose, onSubmit }) {
  const [form, setForm]     = useState(initialData)
  const [errors, setErrors] = useState({})

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  function validate() {
    const errs = {}
    if (!form.title.trim())    errs.title    = 'Task title is required.'
    if (!form.deadline.trim()) errs.deadline = 'Deadline is required.'
    return errs
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    let formattedDL = form.deadline
    if (/^\d{4}-\d{2}-\d{2}$/.test(form.deadline)) {
      const dateObj = new Date(form.deadline)
      formattedDL = dateObj.toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
      })
    }
    onSubmit({ ...form, deadline: formattedDL })
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{modalHeading}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">✕</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit} noValidate>

          {/* Task Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="tf-title">
              Task Title <span className="required-star">*</span>
            </label>
            <input
              id="tf-title"
              name="title"
              type="text"
              className={`form-input ${errors.title ? 'input-error' : ''}`}
              placeholder="e.g. Update the product catalogue"
              value={form.title}
              onChange={handleChange}
            />
            {errors.title && <span className="error-msg">{errors.title}</span>}
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="tf-description">Description</label>
            <textarea
              id="tf-description"
              name="description"
              className="form-input form-textarea"
              placeholder="Add details about this task (optional)"
              value={form.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          {/* Assign To — uses the EMPLOYEES constant as single source of truth */}
          <div className="form-group">
            <label className="form-label" htmlFor="tf-assignee">Assign To</label>
            <select
              id="tf-assignee"
              name="assignee"
              className="form-input form-select"
              value={form.assignee}
              onChange={handleChange}
            >
              {EMPLOYEE_NAMES.map((emp) => (
                <option key={emp} value={emp}>{emp}</option>
              ))}
            </select>
          </div>

          {/* Priority + Status side by side */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="tf-priority">Priority</label>
              <select
                id="tf-priority"
                name="priority"
                className="form-input form-select"
                value={form.priority}
                onChange={handleChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="tf-status">Status</label>
              <select
                id="tf-status"
                name="status"
                className="form-input form-select"
                value={form.status}
                onChange={handleChange}
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Deadline */}
          <div className="form-group">
            <label className="form-label" htmlFor="tf-deadline">
              Deadline <span className="required-star">*</span>
            </label>
            <input
              id="tf-deadline"
              name="deadline"
              type="date"
              className={`form-input ${errors.deadline ? 'input-error' : ''}`}
              value={form.deadline}
              onChange={handleChange}
            />
            {errors.deadline && <span className="error-msg">{errors.deadline}</span>}
          </div>

          {/* Buttons */}
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-create">{submitLabel}</button>
          </div>

        </form>
      </div>
    </div>
  )
}

// ─── Delete Confirmation Modal ─────────────────────────────────────────────────
function DeleteConfirmModal({ task, onCancel, onConfirm }) {
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-box modal-box-sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Delete Task</h2>
          <button className="modal-close" onClick={onCancel} aria-label="Close">✕</button>
        </div>
        <div className="modal-form">
          <p className="delete-confirm-text">
            Are you sure you want to delete <strong>"{task.title}"</strong>?
            This action cannot be undone.
          </p>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onCancel}>Cancel</button>
            <button type="button" className="btn-delete-confirm" onClick={onConfirm}>
              Delete Task
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Tasks Page ────────────────────────────────────────────────────────────────
function TasksPage({ tasks, onEdit, onDelete, onStatusChange }) {
  const [search,         setSearch]         = useState('')
  const [filterStatus,   setFilterStatus]   = useState('All')
  const [filterPriority, setFilterPriority] = useState('All')
  const [filterAssignee, setFilterAssignee] = useState('All')

  const allAssignees = ['All', ...Array.from(new Set(tasks.map((t) => t.assignee)))]

  const visible = tasks.filter((task) => {
    const matchesSearch   = task.title.toLowerCase().includes(search.toLowerCase())
    const matchesStatus   = filterStatus   === 'All' || task.status   === filterStatus
    const matchesPriority = filterPriority === 'All' || task.priority === filterPriority
    const matchesAssignee = filterAssignee === 'All' || task.assignee === filterAssignee
    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee
  })

  const nextStatus = { 'To Do': 'In Progress', 'In Progress': 'Completed', 'Completed': 'To Do' }

  return (
    <section className="tasks-page">
      {/* Toolbar */}
      <div className="tasks-toolbar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search tasks…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch('')} aria-label="Clear">✕</button>
          )}
        </div>

        <div className="filters-row">
          <select className="filter-select" value={filterStatus}   onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="All">All Status</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <select className="filter-select" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
            <option value="All">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <select className="filter-select" value={filterAssignee} onChange={(e) => setFilterAssignee(e.target.value)}>
            {allAssignees.map((a) => (
              <option key={a} value={a}>{a === 'All' ? 'All Assignees' : a}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="tasks-result-info">
        Showing <strong>{visible.length}</strong> of <strong>{tasks.length}</strong> tasks
      </div>

      {/* Desktop Table */}
      <div className="task-table-wrapper">
        <table className="task-table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Assigned To</th>
              <th>Deadline</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={6} className="no-results-cell">No tasks match your search or filters.</td>
              </tr>
            ) : (
              visible.map((task) => (
                <tr key={task.id}>
                  <td className="task-title-cell">{task.title}</td>
                  <td>
                    <div className="assignee-cell">
                      <div className="assignee-avatar">
                        {task.assignee.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <span>{task.assignee}</span>
                    </div>
                  </td>
                  <td className="deadline-cell">🕐 {task.deadline}</td>
                  <td><PriorityBadge priority={task.priority} /></td>
                  <td><StatusBadge status={task.status} /></td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn action-status" title={`Move to "${nextStatus[task.status]}"`}
                        onClick={() => onStatusChange(task.id, nextStatus[task.status])}>🔄</button>
                      <button className="action-btn action-edit" title="Edit task"
                        onClick={() => onEdit(task)}>✏️</button>
                      <button className="action-btn action-delete" title="Delete task"
                        onClick={() => onDelete(task)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="task-cards-mobile">
        {visible.length === 0 ? (
          <p className="no-results-mobile">No tasks match your search or filters.</p>
        ) : (
          visible.map((task) => (
            <div key={task.id} className="task-card-mobile">
              <div className="task-card-top">
                <span className="task-card-title">{task.title}</span>
                <PriorityBadge priority={task.priority} />
              </div>
              <div className="task-card-meta">
                <div className="assignee-cell">
                  <div className="assignee-avatar">
                    {task.assignee.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <span>{task.assignee}</span>
                </div>
                <span className="deadline-cell">🕐 {task.deadline}</span>
              </div>
              <div className="task-card-footer">
                <StatusBadge status={task.status} />
                <div className="action-btns">
                  <button className="action-btn action-status"
                    title={`Move to "${nextStatus[task.status]}"`}
                    onClick={() => onStatusChange(task.id, nextStatus[task.status])}>🔄</button>
                  <button className="action-btn action-edit" title="Edit task"
                    onClick={() => onEdit(task)}>✏️</button>
                  <button className="action-btn action-delete" title="Delete task"
                    onClick={() => onDelete(task)}>🗑️</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}

// ─── Team Page ─────────────────────────────────────────────────────────────────
function TeamPage({ tasks, onEdit, onDelete, onStatusChange }) {
  // Which employee card is currently expanded (shows their tasks)
  const [selectedEmployee, setSelectedEmployee] = useState(null)

  // Next status cycle (reused from Tasks page)
  const nextStatus = { 'To Do': 'In Progress', 'In Progress': 'Completed', 'Completed': 'To Do' }

  // Build stats for each employee from live task state
  const employeeStats = EMPLOYEES.map((emp) => {
    const myTasks   = tasks.filter((t) => t.assignee === emp.name)
    const pending   = myTasks.filter((t) => t.status !== 'Completed').length
    const done      = myTasks.filter((t) => t.status === 'Completed').length
    const total     = myTasks.length
    // Workload = pending tasks as a % of the max threshold (capped at 100)
    const workload  = Math.min(Math.round((pending / MAX_WORKLOAD_TASKS) * 100), 100)
    const isHigh    = workload >= 70           // flag for high-workload warning
    return { ...emp, myTasks, pending, done, total, workload, isHigh }
  })

  // The tasks shown below the cards when an employee is selected
  const selectedStats = selectedEmployee
    ? employeeStats.find((e) => e.name === selectedEmployee)
    : null

  function handleCardClick(name) {
    // Clicking the same card again collapses it
    setSelectedEmployee((prev) => (prev === name ? null : name))
  }

  return (
    <section className="team-page">

      {/* ── Employee cards grid ── */}
      <div className="team-grid">
        {employeeStats.map((emp) => {
          const isSelected = selectedEmployee === emp.name
          return (
            <div
              key={emp.name}
              className={`emp-card ${isSelected ? 'emp-card-selected' : ''} ${emp.isHigh ? 'emp-card-high' : ''}`}
              onClick={() => handleCardClick(emp.name)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleCardClick(emp.name)}
              aria-expanded={isSelected}
            >
              {/* High-workload warning badge */}
              {emp.isHigh && (
                <span className="high-workload-badge" title="High workload">⚠ High Load</span>
              )}

              {/* Avatar */}
              <div className="emp-avatar" style={{ background: emp.color }}>
                {emp.initials}
              </div>

              {/* Name + Role */}
              <h3 className="emp-name">{emp.name}</h3>
              <p className="emp-role">{emp.role}</p>

              {/* Task stats */}
              <div className="emp-stats">
                <div className="emp-stat">
                  <span className="emp-stat-value">{emp.pending}</span>
                  <span className="emp-stat-label">Pending</span>
                </div>
                <div className="emp-stat-divider" />
                <div className="emp-stat">
                  <span className="emp-stat-value">{emp.done}</span>
                  <span className="emp-stat-label">Completed</span>
                </div>
                <div className="emp-stat-divider" />
                <div className="emp-stat">
                  <span className="emp-stat-value">{emp.total}</span>
                  <span className="emp-stat-label">Total</span>
                </div>
              </div>

              {/* Workload bar */}
              <div className="workload-section">
                <div className="workload-label-row">
                  <span className="workload-label">Workload</span>
                  <span className={`workload-pct ${emp.isHigh ? 'workload-pct-high' : ''}`}>
                    {emp.workload}%
                  </span>
                </div>
                <div className="workload-track">
                  <div
                    className={`workload-bar ${emp.isHigh ? 'workload-bar-high' : ''}`}
                    style={{ width: `${emp.workload}%` }}
                  />
                </div>
              </div>

              {/* Click hint */}
              <p className="emp-click-hint">
                {isSelected ? '▲ Hide tasks' : '▼ View tasks'}
              </p>
            </div>
          )
        })}
      </div>

      {/* ── Expanded task panel for selected employee ── */}
      {selectedStats && (
        <div className="emp-task-panel">
          <div className="section-header">
            <h2 className="section-title">
              Tasks assigned to {selectedStats.name}
            </h2>
            <span className="task-count">{selectedStats.myTasks.length} tasks</span>
          </div>

          {selectedStats.myTasks.length === 0 ? (
            <p className="no-results-mobile" style={{ padding: '24px' }}>
              No tasks assigned to this employee yet.
            </p>
          ) : (
            <>
              {/* Desktop table */}
              <div className="task-table-wrapper">
                <table className="task-table">
                  <thead>
                    <tr>
                      <th>Task</th>
                      <th>Deadline</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedStats.myTasks.map((task) => (
                      <tr key={task.id}>
                        <td className="task-title-cell">{task.title}</td>
                        <td className="deadline-cell">🕐 {task.deadline}</td>
                        <td><PriorityBadge priority={task.priority} /></td>
                        <td><StatusBadge status={task.status} /></td>
                        <td>
                          <div className="action-btns">
                            <button className="action-btn action-status"
                              title={`Move to "${nextStatus[task.status]}"`}
                              onClick={() => onStatusChange(task.id, nextStatus[task.status])}>🔄</button>
                            <button className="action-btn action-edit" title="Edit task"
                              onClick={() => onEdit(task)}>✏️</button>
                            <button className="action-btn action-delete" title="Delete task"
                              onClick={() => onDelete(task)}>🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="task-cards-mobile">
                {selectedStats.myTasks.map((task) => (
                  <div key={task.id} className="task-card-mobile">
                    <div className="task-card-top">
                      <span className="task-card-title">{task.title}</span>
                      <PriorityBadge priority={task.priority} />
                    </div>
                    <span className="deadline-cell">🕐 {task.deadline}</span>
                    <div className="task-card-footer">
                      <StatusBadge status={task.status} />
                      <div className="action-btns">
                        <button className="action-btn action-status"
                          title={`Move to "${nextStatus[task.status]}"`}
                          onClick={() => onStatusChange(task.id, nextStatus[task.status])}>🔄</button>
                        <button className="action-btn action-edit" title="Edit task"
                          onClick={() => onEdit(task)}>✏️</button>
                        <button className="action-btn action-delete" title="Delete task"
                          onClick={() => onDelete(task)}>🗑️</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

    </section>
  )
}

// ─── App ───────────────────────────────────────────────────────────────────────
function App() {
  const [activeNav, setActiveNav]     = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // ── All tasks live in a single state — every page reads from here ────────────
  const [tasks, setTasks] = useState(initialTasks)

  // ── Modal state: null | 'create' | 'edit' | 'delete' ────────────────────────
  const [modalMode,  setModalMode]  = useState(null)
  const [activeTask, setActiveTask] = useState(null)

  // ── Derived dashboard summary counts ─────────────────────────────────────────
  const totalTasks = tasks.length
  const inProgress = tasks.filter((t) => t.status === 'In Progress').length
  const completed  = tasks.filter((t) => t.status === 'Completed').length
  const overdue    = tasks.filter((t) => t.status === 'Overdue').length

  const summaryCards = [
    { label: 'Total Tasks', value: totalTasks, icon: '📋', color: 'card-blue'   },
    { label: 'In Progress', value: inProgress, icon: '🔄', color: 'card-yellow' },
    { label: 'Completed',   value: completed,  icon: '✅', color: 'card-green'  },
    { label: 'Overdue',     value: overdue,    icon: '⚠️', color: 'card-red'   },
  ]

  // ── Handlers ─────────────────────────────────────────────────────────────────
  function closeModal() { setModalMode(null); setActiveTask(null) }

  function handleCreateTask(formData) {
    setTasks((prev) => [{ id: Date.now(), ...formData }, ...prev])
    closeModal()
  }

  function handleEditOpen(task) {
    let deadlineValue = task.deadline
    const parsed = new Date(task.deadline)
    if (!isNaN(parsed.getTime())) {
      const y = parsed.getFullYear()
      const m = String(parsed.getMonth() + 1).padStart(2, '0')
      const d = String(parsed.getDate()).padStart(2, '0')
      deadlineValue = `${y}-${m}-${d}`
    }
    setActiveTask({ ...task, deadline: deadlineValue })
    setModalMode('edit')
  }

  function handleEditSave(formData) {
    setTasks((prev) =>
      prev.map((t) => (t.id === activeTask.id ? { ...t, ...formData } : t))
    )
    closeModal()
  }

  function handleDeleteOpen(task) {
    setActiveTask(task)
    setModalMode('delete')
  }

  function handleDeleteConfirm() {
    setTasks((prev) => prev.filter((t) => t.id !== activeTask.id))
    closeModal()
  }

  function handleStatusChange(id, newStatus) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    )
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="app-layout">

      {/* ── Modals ──────────────────────────────────────────────────────────── */}
      {modalMode === 'create' && (
        <TaskFormModal
          initialData={blankForm}
          modalHeading="Create New Task"
          submitLabel="+ Create Task"
          onClose={closeModal}
          onSubmit={handleCreateTask}
        />
      )}
      {modalMode === 'edit' && activeTask && (
        <TaskFormModal
          initialData={activeTask}
          modalHeading="Edit Task"
          submitLabel="Save Changes"
          onClose={closeModal}
          onSubmit={handleEditSave}
        />
      )}
      {modalMode === 'delete' && activeTask && (
        <DeleteConfirmModal
          task={activeTask}
          onCancel={closeModal}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-logo">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">TaskFlow</span>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeNav === item.id ? 'nav-active' : ''}`}
              onClick={() => { setActiveNav(item.id); setSidebarOpen(false) }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-mini">
            <div className="avatar">AK</div>
            <div className="user-info">
              <span className="user-name">Admin Kumar</span>
              <span className="user-role">Manager</span>
            </div>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Main ────────────────────────────────────────────────────────────── */}
      <div className="main-wrapper">
        <header className="top-header">
          <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle sidebar">
            ☰
          </button>
          <h1 className="header-title">
            {navItems.find((n) => n.id === activeNav)?.label}
          </h1>
          <div className="header-right">
            <button className="btn-create" onClick={() => setModalMode('create')}>
              + Create Task
            </button>
            <div className="profile-area">
              <div className="avatar">AK</div>
              <span className="profile-name">Admin Kumar</span>
            </div>
          </div>
        </header>

        <main className="main-content">

          {/* ── Dashboard ─────────────────────────────────────────────────── */}
          {activeNav === 'dashboard' && (
            <>
              <section className="summary-grid">
                {summaryCards.map((card) => (
                  <div key={card.label} className={`summary-card ${card.color}`}>
                    <div className="card-icon">{card.icon}</div>
                    <div className="card-info">
                      <span className="card-value">{card.value}</span>
                      <span className="card-label">{card.label}</span>
                    </div>
                  </div>
                ))}
              </section>

              <section className="tasks-section">
                <div className="section-header">
                  <h2 className="section-title">Today's Tasks</h2>
                  <span className="task-count">{tasks.length} tasks</span>
                </div>

                <div className="task-table-wrapper">
                  <table className="task-table">
                    <thead>
                      <tr>
                        <th>Task</th>
                        <th>Assigned To</th>
                        <th>Deadline</th>
                        <th>Priority</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map((task) => (
                        <tr key={task.id}>
                          <td className="task-title-cell">{task.title}</td>
                          <td>
                            <div className="assignee-cell">
                              <div className="assignee-avatar">
                                {task.assignee.split(' ').map((n) => n[0]).join('')}
                              </div>
                              <span>{task.assignee}</span>
                            </div>
                          </td>
                          <td className="deadline-cell">🕐 {task.deadline}</td>
                          <td><PriorityBadge priority={task.priority} /></td>
                          <td><StatusBadge status={task.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="task-cards-mobile">
                  {tasks.map((task) => (
                    <div key={task.id} className="task-card-mobile">
                      <div className="task-card-top">
                        <span className="task-card-title">{task.title}</span>
                        <PriorityBadge priority={task.priority} />
                      </div>
                      <div className="task-card-meta">
                        <div className="assignee-cell">
                          <div className="assignee-avatar">
                            {task.assignee.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <span>{task.assignee}</span>
                        </div>
                        <span className="deadline-cell">🕐 {task.deadline}</span>
                      </div>
                      <StatusBadge status={task.status} />
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {/* ── Tasks Page ────────────────────────────────────────────────── */}
          {activeNav === 'tasks' && (
            <TasksPage
              tasks={tasks}
              onEdit={handleEditOpen}
              onDelete={handleDeleteOpen}
              onStatusChange={handleStatusChange}
            />
          )}

          {/* ── Team Page ─────────────────────────────────────────────────── */}
          {activeNav === 'team' && (
            <TeamPage
              tasks={tasks}
              onEdit={handleEditOpen}
              onDelete={handleDeleteOpen}
              onStatusChange={handleStatusChange}
            />
          )}

        </main>
      </div>
    </div>
  )
}

export default App
