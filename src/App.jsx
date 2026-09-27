import { useState, useEffect } from 'react'
import './App.css'
import * as api from './services/api'
import {
  calculateTaskUrgency,
  isTaskOverdue,
  getTeamWorkloadMetrics,
  getWorkloadRecommendation,
  getTodaysActionPlan,
} from './utils/workflow'

// ─── Inline Minimal SVG Icons (Anti-emoji, light, crisp) ───────────────────────
function IconDashboard() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  )
}

function IconTasks() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  )
}

function IconTeam() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function IconPlus() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function IconSearch() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function IconClock() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function IconRefresh() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  )
}

function IconEdit() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

function IconTrash() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  )
}

function IconTotalTasks() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  )
}

function IconInProgress() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 12" />
    </svg>
  )
}

function IconCompleted() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

function IconOverdue() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

// ─── Constants ─────────────────────────────────────────────────────────────────
// Single source of truth for all employees used everywhere in the app
const EMPLOYEES = [
  { name: 'Priya Sharma', role: 'Sales Manager',       initials: 'PS', color: '#4f46e5' },
  { name: 'Arjun Mehta',  role: 'Operations Lead',     initials: 'AM', color: '#059669' },
  { name: 'Sara Nair',    role: 'Marketing Specialist', initials: 'SN', color: '#d97706' },
  { name: 'Rahul Gupta',  role: 'Customer Support',    initials: 'RG', color: '#7c3aed' },
]

const EMPLOYEE_NAMES = EMPLOYEES.map((e) => e.name)

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <IconDashboard /> },
  { id: 'tasks',     label: 'Tasks',     icon: <IconTasks /> },
  { id: 'team',      label: 'Team',      icon: <IconTeam /> },
]

// ─── Initial task list (sample fallback data) ──────────────────────────────────
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

function UrgencyBadge({ urgency }) {
  if (!urgency || urgency.level === 'Completed') return null
  const cls = {
    Critical: 'badge-urgency-critical',
    High:     'badge-urgency-high',
    Medium:   'badge-urgency-medium',
    Low:      'badge-urgency-low',
  }[urgency.level] || 'badge-urgency-low'

  return (
    <span className={`badge ${cls}`} title={urgency.reason || urgency.level}>
      <span className="urgency-dot" />
      {urgency.level}
    </span>
  )
}

function getInitials(name) {
  if (!name || typeof name !== 'string') return '??'
  const parts = name.trim().split(/\s+/)
  return parts.map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '??'
}

// ─── Shared Task Form Modal with Workload Balancing Advisory ───────────────────
function TaskFormModal({ initialData, tasks, submitLabel, modalHeading, onClose, onSubmit }) {
  const [form, setForm]     = useState(initialData)
  const [errors, setErrors] = useState({})

  // Compute workload metrics and recommendation for currently selected assignee
  const workloadMetrics = getTeamWorkloadMetrics(EMPLOYEES, tasks)
  const recommendation = getWorkloadRecommendation(form.assignee, EMPLOYEES, tasks)

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

          {/* Assign To with Workload Balancing Indication */}
          <div className="form-group">
            <label className="form-label" htmlFor="tf-assignee">Assign To</label>
            <select
              id="tf-assignee"
              name="assignee"
              className="form-input form-select"
              value={form.assignee}
              onChange={handleChange}
            >
              {EMPLOYEE_NAMES.map((emp) => {
                const count = workloadMetrics.breakdown.find((b) => b.name === emp)?.activeCount || 0
                return (
                  <option key={emp} value={emp}>
                    {emp} ({count} active {count === 1 ? 'task' : 'tasks'})
                  </option>
                )
              })}
            </select>

            {/* Workload Advisory Notice */}
            <div className={`workload-advisory ${recommendation.isHigh ? 'advisory-high' : 'advisory-normal'}`}>
              <div className="advisory-main">
                <span className="advisory-status">
                  {recommendation.isHigh ? '⚠️ High workload' : '✓ Capacity available'}
                </span>
                <span className="advisory-desc">
                  — {recommendation.text}
                </span>
              </div>
              {recommendation.suggestion && (
                <div className="advisory-suggestion">
                  💡 {recommendation.suggestion}
                </div>
              )}
            </div>
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
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
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
              type="text"
              className={`form-input ${errors.deadline ? 'input-error' : ''}`}
              placeholder="e.g. Today, 5:00 PM or 2026-03-30"
              value={form.deadline}
              onChange={handleChange}
            />
            {errors.deadline && <span className="error-msg">{errors.deadline}</span>}
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-create">
              {submitLabel}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

// ─── Delete Confirmation Modal ─────────────────────────────────────────────────
function DeleteConfirmModal({ task, onClose, onConfirm }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box modal-box-sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Delete Task</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">✕</button>
        </div>
        <div className="modal-form">
          <p className="delete-confirm-text">
            Are you sure you want to delete <strong>"{task.title}"</strong>? This action cannot be undone.
          </p>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="btn-delete-confirm" onClick={() => onConfirm(task.id)}>
              Delete Task
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Tasks Page with Urgency Filtering and Column ──────────────────────────────
function TasksPage({ tasks, onEdit, onDelete, onStatusChange }) {
  const [search,         setSearch]         = useState('')
  const [filterStatus,   setFilterStatus]   = useState('All')
  const [filterPriority, setFilterPriority] = useState('All')
  const [filterUrgency,  setFilterUrgency]  = useState('All')
  const [filterAssignee, setFilterAssignee] = useState('All')

  const allAssignees = ['All', ...Array.from(new Set(tasks.map((t) => t.assignee).filter(Boolean)))]

  const visible = tasks.filter((task) => {
    const urgency         = calculateTaskUrgency(task)
    const matchesSearch   = (task.title || '').toLowerCase().includes(search.toLowerCase())
    const matchesStatus   = filterStatus   === 'All' || task.status   === filterStatus
    const matchesPriority = filterPriority === 'All' || task.priority === filterPriority
    const matchesUrgency  = filterUrgency  === 'All' || urgency.level === filterUrgency
    const matchesAssignee = filterAssignee === 'All' || task.assignee === filterAssignee
    return matchesSearch && matchesStatus && matchesPriority && matchesUrgency && matchesAssignee
  })

  const nextStatus = { 'To Do': 'In Progress', 'In Progress': 'Completed', 'Completed': 'To Do' }

  return (
    <section className="tasks-page">
      {/* Toolbar */}
      <div className="tasks-toolbar">
        <div className="search-box">
          <span className="search-icon"><IconSearch /></span>
          <input
            type="text"
            className="search-input"
            placeholder="Search tasks by title…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch('')} aria-label="Clear search">✕</button>
          )}
        </div>

        <div className="filters-row">
          <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
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
          <select className="filter-select" value={filterUrgency} onChange={(e) => setFilterUrgency(e.target.value)}>
            <option value="All">All Urgency</option>
            <option value="Critical">Critical</option>
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

      {/* Desktop Table with Urgency Column */}
      <div className="task-table-wrapper">
        <table className="task-table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Assigned To</th>
              <th>Deadline</th>
              <th>Priority</th>
              <th>Urgency</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={7} className="no-results-cell">No tasks match your search or filters.</td>
              </tr>
            ) : (
              visible.map((task) => {
                const urgency = calculateTaskUrgency(task)
                const isOverdue = urgency.level === 'Critical' && urgency.reason.includes('overdue')
                return (
                  <tr key={task.id}>
                    <td className="task-title-cell">{task.title}</td>
                    <td>
                      <div className="assignee-cell">
                        <div className="assignee-avatar">
                          {getInitials(task.assignee)}
                        </div>
                        <span>{task.assignee || 'Unassigned'}</span>
                      </div>
                    </td>
                    <td>
                      <div className={`deadline-cell ${isOverdue ? 'deadline-overdue' : ''}`}>
                        <IconClock />
                        <span>{task.deadline || 'No deadline'}</span>
                      </div>
                    </td>
                    <td><PriorityBadge priority={task.priority} /></td>
                    <td><UrgencyBadge urgency={urgency} /></td>
                    <td><StatusBadge status={task.status} /></td>
                    <td>
                      <div className="action-btns" style={{ justifyContent: 'flex-end' }}>
                        <button
                          className="action-btn action-status"
                          title={`Advance to "${nextStatus[task.status] || 'To Do'}"`}
                          onClick={() => onStatusChange(task.id, nextStatus[task.status] || 'To Do')}
                          aria-label="Advance status"
                        >
                          <IconRefresh />
                        </button>
                        <button
                          className="action-btn action-edit"
                          title="Edit task"
                          onClick={() => onEdit(task)}
                          aria-label="Edit task"
                        >
                          <IconEdit />
                        </button>
                        <button
                          className="action-btn action-delete"
                          title="Delete task"
                          onClick={() => onDelete(task)}
                          aria-label="Delete task"
                        >
                          <IconTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="task-cards-mobile">
        {visible.length === 0 ? (
          <p className="no-results-mobile">No tasks match your search or filters.</p>
        ) : (
          visible.map((task) => {
            const urgency = calculateTaskUrgency(task)
            const isOverdue = urgency.level === 'Critical' && urgency.reason.includes('overdue')
            return (
              <div key={task.id} className="task-card-mobile">
                <div className="task-card-top">
                  <span className="task-card-title">{task.title}</span>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <PriorityBadge priority={task.priority} />
                    <UrgencyBadge urgency={urgency} />
                  </div>
                </div>
                <div className="task-card-meta">
                  <div className="assignee-cell">
                    <div className="assignee-avatar">
                      {getInitials(task.assignee)}
                    </div>
                    <span>{task.assignee || 'Unassigned'}</span>
                  </div>
                  <div className={`deadline-cell ${isOverdue ? 'deadline-overdue' : ''}`}>
                    <IconClock />
                    <span>{task.deadline || 'No deadline'}</span>
                  </div>
                </div>
                <div className="task-card-footer">
                  <StatusBadge status={task.status} />
                  <div className="action-btns">
                    <button
                      className="action-btn action-status"
                      title={`Advance to "${nextStatus[task.status] || 'To Do'}"`}
                      onClick={() => onStatusChange(task.id, nextStatus[task.status] || 'To Do')}
                      aria-label="Advance status"
                    >
                      <IconRefresh />
                    </button>
                    <button
                      className="action-btn action-edit"
                      title="Edit task"
                      onClick={() => onEdit(task)}
                      aria-label="Edit task"
                    >
                      <IconEdit />
                    </button>
                    <button
                      className="action-btn action-delete"
                      title="Delete task"
                      onClick={() => onDelete(task)}
                      aria-label="Delete task"
                    >
                      <IconTrash />
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </section>
  )
}

// ─── Team Page ─────────────────────────────────────────────────────────────────
function TeamPage({ tasks, onEdit, onDelete, onStatusChange }) {
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const nextStatus = { 'To Do': 'In Progress', 'In Progress': 'Completed', 'Completed': 'To Do' }

  // Workload metrics calculated dynamically from live state
  const { breakdown } = getTeamWorkloadMetrics(EMPLOYEES, tasks)
  const employeeStats = breakdown.map((emp) => {
    const myTasks = tasks.filter((t) => t.assignee === emp.name)
    return {
      ...emp,
      myTasks,
      pending: emp.activeCount,
      done: emp.completedCount,
      total: emp.totalCount,
      workload: emp.capacityPct,
    }
  })

  function handleCardClick(empName) {
    setSelectedEmployee((prev) => (prev === empName ? null : empName))
  }

  const selectedStats = employeeStats.find((e) => e.name === selectedEmployee)

  return (
    <section className="team-page">
      {/* ── Employee Card Grid ── */}
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
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCardClick(emp.name) }}
            >
              {emp.isHigh && (
                <span className="high-workload-badge">High Load</span>
              )}

              <div className="emp-avatar" style={{ backgroundColor: emp.color }}>
                {emp.initials}
              </div>

              <div className="emp-card-body">
                <h3 className="emp-name">{emp.name}</h3>
                <p className="emp-role">{emp.role}</p>
              </div>

              <div className="emp-stats">
                <div className="emp-stat">
                  <span className="emp-stat-value">{emp.pending}</span>
                  <span className="emp-stat-label">Pending</span>
                </div>
                <div className="emp-stat-divider" />
                <div className="emp-stat">
                  <span className="emp-stat-value">{emp.done}</span>
                  <span className="emp-stat-label">Done</span>
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
                  <span className="workload-label">Capacity</span>
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

              <p className="emp-click-hint">
                {isSelected ? 'Hide assigned tasks' : 'View assigned tasks'}
              </p>
            </div>
          )
        })}
      </div>

      {/* ── Expanded task panel for selected employee ── */}
      {selectedStats && (
        <div className="emp-task-panel">
          <div className="section-header">
            <div>
              <h2 className="section-title">
                Tasks assigned to {selectedStats.name}
              </h2>
              <span className="section-subtitle">{selectedStats.role}</span>
            </div>
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
                      <th>Urgency</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedStats.myTasks.map((task) => {
                      const urgency = calculateTaskUrgency(task)
                      return (
                        <tr key={task.id}>
                          <td className="task-title-cell">{task.title}</td>
                          <td>
                            <div className="deadline-cell">
                              <IconClock />
                              <span>{task.deadline || 'No deadline'}</span>
                            </div>
                          </td>
                          <td><PriorityBadge priority={task.priority} /></td>
                          <td><UrgencyBadge urgency={urgency} /></td>
                          <td><StatusBadge status={task.status} /></td>
                          <td>
                            <div className="action-btns" style={{ justifyContent: 'flex-end' }}>
                              <button
                                className="action-btn action-status"
                                title={`Advance to "${nextStatus[task.status] || 'To Do'}"`}
                                onClick={() => onStatusChange(task.id, nextStatus[task.status] || 'To Do')}
                                aria-label="Advance status"
                              >
                                <IconRefresh />
                              </button>
                              <button
                                className="action-btn action-edit"
                                title="Edit task"
                                onClick={() => onEdit(task)}
                                aria-label="Edit task"
                              >
                                <IconEdit />
                              </button>
                              <button
                                className="action-btn action-delete"
                                title="Delete task"
                                onClick={() => onDelete(task)}
                                aria-label="Delete task"
                              >
                                <IconTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="task-cards-mobile">
                {selectedStats.myTasks.map((task) => (
                  <div key={task.id} className="task-card-mobile">
                    <div className="task-card-top">
                      <span className="task-card-title">{task.title}</span>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <PriorityBadge priority={task.priority} />
                        <UrgencyBadge urgency={calculateTaskUrgency(task)} />
                      </div>
                    </div>
                    <div className="deadline-cell">
                      <IconClock />
                      <span>{task.deadline || 'No deadline'}</span>
                    </div>
                    <div className="task-card-footer">
                      <StatusBadge status={task.status} />
                      <div className="action-btns">
                        <button
                          className="action-btn action-status"
                          title={`Advance to "${nextStatus[task.status] || 'To Do'}"`}
                          onClick={() => onStatusChange(task.id, nextStatus[task.status] || 'To Do')}
                          aria-label="Advance status"
                        >
                          <IconRefresh />
                        </button>
                        <button
                          className="action-btn action-edit"
                          title="Edit task"
                          onClick={() => onEdit(task)}
                          aria-label="Edit task"
                        >
                          <IconEdit />
                        </button>
                        <button
                          className="action-btn action-delete"
                          title="Delete task"
                          onClick={() => onDelete(task)}
                          aria-label="Delete task"
                        >
                          <IconTrash />
                        </button>
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

// ─── App Component ─────────────────────────────────────────────────────────────
function App() {
  const [activeNav, setActiveNav]     = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // ── All tasks live in state synced with database ────────────
  const [tasks, setTasks] = useState(initialTasks)

  // Fetch tasks on initial mount
  useEffect(() => {
    let isMounted = true
    api.getTasks()
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setTasks(data)
        }
      })
      .catch((err) => {
        console.error('Failed to load tasks from API:', err)
      })
    return () => {
      isMounted = false
    }
  }, [])

  // ── Modal state: null | 'create' | 'edit' | 'delete' ─────────
  const [modalMode,  setModalMode]  = useState(null)
  const [activeTask, setActiveTask] = useState(null)

  // ── Derived dashboard summary counts ─────────────────────────
  const totalTasks = tasks.length
  const inProgress = tasks.filter((t) => t.status === 'In Progress').length
  const completed  = tasks.filter((t) => t.status === 'Completed').length
  const overdue    = tasks.filter(isTaskOverdue).length

  const summaryCards = [
    { label: 'Total Tasks', value: totalTasks, icon: <IconTotalTasks />, colorClass: 'card-total' },
    { label: 'In Progress', value: inProgress, icon: <IconInProgress />, colorClass: 'card-progress' },
    { label: 'Completed',   value: completed,  icon: <IconCompleted />,  colorClass: 'card-completed' },
    { label: 'Overdue',     value: overdue,    icon: <IconOverdue />,    colorClass: 'card-overdue' },
  ]

  // Team workload metrics from workflow engine
  const { breakdown: dashboardTeamStats } = getTeamWorkloadMetrics(EMPLOYEES, tasks)

  // Today's Action Plan: prioritizes overdue, high-priority due today, and nearest deadlines
  const actionPlan = getTodaysActionPlan(tasks, 4)

  const nextStatusCycle = { 'To Do': 'In Progress', 'In Progress': 'Completed', 'Completed': 'To Do' }

  // ── Handlers ─────────────────────────────────────────────────
  function closeModal() { setModalMode(null); setActiveTask(null) }

  async function handleCreateTask(formData) {
    const tempId = Date.now()
    const optimisticTask = { id: tempId, ...formData }
    setTasks((prev) => [optimisticTask, ...prev])
    closeModal()

    try {
      const savedTask = await api.createTask(formData)
      if (savedTask && savedTask.id) {
        setTasks((prev) => prev.map((t) => (t.id === tempId ? savedTask : t)))
      }
      await api.createActivity(`${formData.assignee || 'Someone'} created "${formData.title}"`, 'create').catch(() => {})
    } catch (err) {
      console.error('Failed to create task via API:', err)
    }
  }

  function handleEditOpen(task) {
    let deadlineValue = task.deadline || ''
    if (task.deadline) {
      const parsed = new Date(task.deadline)
      if (!isNaN(parsed.getTime())) {
        const y = parsed.getFullYear()
        const m = String(parsed.getMonth() + 1).padStart(2, '0')
        const d = String(parsed.getDate()).padStart(2, '0')
        deadlineValue = `${y}-${m}-${d}`
      }
    }
    setActiveTask({ ...task, deadline: deadlineValue })
    setModalMode('edit')
  }

  async function handleEditSave(formData) {
    const targetId = activeTask.id
    setTasks((prev) =>
      prev.map((t) => (t.id === targetId ? { ...t, ...formData } : t))
    )
    closeModal()

    try {
      await api.updateTask(targetId, formData)
      await api.createActivity(`Updated task "${formData.title}"`, 'edit').catch(() => {})
    } catch (err) {
      console.error('Failed to update task via API:', err)
    }
  }

  function handleDeleteOpen(task) {
    setActiveTask(task)
    setModalMode('delete')
  }

  async function handleDeleteConfirm(taskId) {
    const deletedTask = tasks.find((t) => t.id === taskId)
    setTasks((prev) => prev.filter((t) => t.id !== taskId))
    closeModal()

    try {
      await api.deleteTask(taskId)
      if (deletedTask) {
        await api.createActivity(`Deleted task "${deletedTask.title}"`, 'delete').catch(() => {})
      }
    } catch (err) {
      console.error('Failed to delete task via API:', err)
    }
  }

  async function handleStatusChange(taskId, newStatus) {
    const task = tasks.find((t) => t.id === taskId)
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    )

    try {
      await api.updateTask(taskId, { status: newStatus })
      const assigneeName = task?.assignee || 'Someone'
      await api.createActivity(`${assigneeName} moved "${task?.title}" to ${newStatus}`, 'status').catch(() => {})
    } catch (err) {
      console.error('Failed to update status via API:', err)
    }
  }

  return (
    <div className="app-layout">

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-badge">TF</div>
          <div className="logo-titles">
            <span className="logo-text">TaskFlow</span>
            <span className="logo-subtext">Small Business Hub</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeNav === item.id ? 'nav-active' : ''}`}
              onClick={() => {
                setActiveNav(item.id)
                setSidebarOpen(false)
              }}
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

      {/* ── Main Wrapper ────────────────────────────────────────────────────── */}
      <div className="main-wrapper">
        <header className="top-header">
          <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle navigation">
            ☰
          </button>
          <h1 className="header-title">
            {navItems.find((n) => n.id === activeNav)?.label}
          </h1>
          <div className="header-right">
            <button className="btn-create" onClick={() => setModalMode('create')}>
              <IconPlus />
              <span>Create Task</span>
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
              {/* Summary Cards */}
              <section className="summary-grid">
                {summaryCards.map((card) => (
                  <div key={card.label} className={`summary-card ${card.colorClass}`}>
                    <div className="card-icon-wrap">{card.icon}</div>
                    <div className="card-info">
                      <span className="card-value">{card.value}</span>
                      <span className="card-label">{card.label}</span>
                    </div>
                  </div>
                ))}
              </section>

              {/* ── Smart Workflow: Today's Action Plan ── */}
              <section className="action-plan-section">
                <div className="section-header">
                  <div>
                    <div className="action-plan-tag">
                      <span className="live-dot" />
                      <span>Smart Workflow</span>
                    </div>
                    <h2 className="section-title">Today's Action Plan</h2>
                    <p className="section-subtitle">Prioritized focus based on overdue status, deadlines, and urgency</p>
                  </div>
                  <span className="task-count">{actionPlan.length} prioritized</span>
                </div>

                {actionPlan.length === 0 ? (
                  <div className="action-plan-empty">
                    <span className="empty-check">✓</span>
                    <span>All urgent tasks are completed. Your priority queue is clear!</span>
                  </div>
                ) : (
                  <div className="action-plan-grid">
                    {actionPlan.map((task, idx) => (
                      <div key={task.id} className={`action-plan-card ${task.isOverdue ? 'plan-overdue' : ''}`}>
                        <div className="plan-rank">#{idx + 1}</div>
                        <div className="plan-content">
                          <div className="plan-header">
                            <span className="plan-title">{task.title}</span>
                            <UrgencyBadge urgency={task.urgency} />
                          </div>
                          <div className="plan-meta">
                            <div className="assignee-cell">
                              <div className="assignee-avatar">
                                {getInitials(task.assignee)}
                              </div>
                              <span>{task.assignee || 'Unassigned'}</span>
                            </div>
                            <div className="plan-meta-right">
                              <PriorityBadge priority={task.priority} />
                              <div className={`deadline-cell ${task.isOverdue ? 'deadline-overdue' : ''}`}>
                                <IconClock />
                                <span>{task.deadline || 'No deadline'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="plan-actions">
                          <button
                            className="btn-action-plan"
                            title={`Advance to "${nextStatusCycle[task.status] || 'In Progress'}"`}
                            onClick={() => handleStatusChange(task.id, nextStatusCycle[task.status] || 'In Progress')}
                          >
                            Advance
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Split Dashboard: Today's Tasks + Team Workload */}
              <div className="dashboard-grid">
                {/* Left column: Today's Tasks */}
                <section className="tasks-section">
                  <div className="section-header">
                    <div>
                      <h2 className="section-title">Today's Tasks</h2>
                      <p className="section-subtitle">Active assignments and upcoming deadlines</p>
                    </div>
                    <div className="section-actions">
                      <span className="task-count">{tasks.length} total</span>
                      <button className="btn-link" onClick={() => setActiveNav('tasks')}>
                        View all tasks →
                      </button>
                    </div>
                  </div>

                  <div className="task-table-wrapper">
                    <table className="task-table">
                      <thead>
                        <tr>
                          <th>Task</th>
                          <th>Assigned To</th>
                          <th>Deadline</th>
                          <th>Priority</th>
                          <th>Urgency</th>
                          <th>Status</th>
                          <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tasks.slice(0, 6).map((task) => {
                          const urgency = calculateTaskUrgency(task)
                          const isOverdue = urgency.level === 'Critical' && urgency.reason.includes('overdue')
                          return (
                            <tr key={task.id}>
                              <td className="task-title-cell">{task.title}</td>
                              <td>
                                <div className="assignee-cell">
                                  <div className="assignee-avatar">
                                    {getInitials(task.assignee)}
                                  </div>
                                  <span>{task.assignee || 'Unassigned'}</span>
                                </div>
                              </td>
                              <td>
                                <div className={`deadline-cell ${isOverdue ? 'deadline-overdue' : ''}`}>
                                  <IconClock />
                                  <span>{task.deadline || 'No deadline'}</span>
                                </div>
                              </td>
                              <td><PriorityBadge priority={task.priority} /></td>
                              <td><UrgencyBadge urgency={urgency} /></td>
                              <td><StatusBadge status={task.status} /></td>
                              <td>
                                <div className="action-btns" style={{ justifyContent: 'flex-end' }}>
                                  <button
                                    className="action-btn action-status"
                                    title="Advance status"
                                    onClick={() => handleStatusChange(task.id, nextStatusCycle[task.status] || 'To Do')}
                                    aria-label="Advance status"
                                  >
                                    <IconRefresh />
                                  </button>
                                  <button
                                    className="action-btn action-edit"
                                    title="Edit task"
                                    onClick={() => handleEditOpen(task)}
                                    aria-label="Edit task"
                                  >
                                    <IconEdit />
                                  </button>
                                  <button
                                    className="action-btn action-delete"
                                    title="Delete task"
                                    onClick={() => handleDeleteOpen(task)}
                                    aria-label="Delete task"
                                  >
                                    <IconTrash />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="task-cards-mobile">
                    {tasks.slice(0, 6).map((task) => {
                      const urgency = calculateTaskUrgency(task)
                      const isOverdue = urgency.level === 'Critical' && urgency.reason.includes('overdue')
                      return (
                        <div key={task.id} className="task-card-mobile">
                          <div className="task-card-top">
                            <span className="task-card-title">{task.title}</span>
                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                              <PriorityBadge priority={task.priority} />
                              <UrgencyBadge urgency={urgency} />
                            </div>
                          </div>
                          <div className="task-card-meta">
                            <div className="assignee-cell">
                              <div className="assignee-avatar">
                                {getInitials(task.assignee)}
                              </div>
                              <span>{task.assignee || 'Unassigned'}</span>
                            </div>
                            <div className={`deadline-cell ${isOverdue ? 'deadline-overdue' : ''}`}>
                              <IconClock />
                              <span>{task.deadline || 'No deadline'}</span>
                            </div>
                          </div>
                          <div className="task-card-footer">
                            <StatusBadge status={task.status} />
                            <div className="action-btns">
                              <button
                                className="action-btn action-status"
                                title="Advance status"
                                onClick={() => handleStatusChange(task.id, nextStatusCycle[task.status] || 'To Do')}
                                aria-label="Advance status"
                              >
                                <IconRefresh />
                              </button>
                              <button
                                className="action-btn action-edit"
                                title="Edit task"
                                onClick={() => handleEditOpen(task)}
                                aria-label="Edit task"
                              >
                                <IconEdit />
                              </button>
                              <button
                                className="action-btn action-delete"
                                title="Delete task"
                                onClick={() => handleDeleteOpen(task)}
                                aria-label="Delete task"
                              >
                                <IconTrash />
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </section>

                {/* Right column: Team Workload (Smart Balancing) */}
                <section className="workload-widget-section">
                  <div className="section-header">
                    <div>
                      <h2 className="section-title">Team Workload</h2>
                      <p className="section-subtitle">Active member workload & balance</p>
                    </div>
                    <button className="btn-link" onClick={() => setActiveNav('team')}>
                      Manage team →
                    </button>
                  </div>

                  <div className="workload-widget-list">
                    {dashboardTeamStats.map((emp) => (
                      <div
                        key={emp.name}
                        className="workload-widget-item"
                        onClick={() => setActiveNav('team')}
                        title={`View ${emp.name}'s tasks`}
                      >
                        <div className="workload-widget-user">
                          <div className="workload-widget-userinfo">
                            <div className="assignee-avatar" style={{ backgroundColor: emp.color, color: '#ffffff', border: 'none' }}>
                              {emp.initials}
                            </div>
                            <div>
                              <div className="workload-widget-name">{emp.name}</div>
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{emp.role}</div>
                            </div>
                          </div>
                          <span className="workload-widget-stat">
                            {emp.activeCount} active {emp.isHigh && <span style={{ color: '#dc2626', fontWeight: 600 }}>· High</span>}
                          </span>
                        </div>
                        <div className="workload-widget-bar-track">
                          <div
                            className={`workload-widget-bar-fill ${emp.isHigh ? 'fill-high' : ''}`}
                            style={{ width: `${emp.capacityPct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
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

      {/* ── Modals with Workload Advisory Support ────────────────────────────── */}
      {modalMode === 'create' && (
        <TaskFormModal
          initialData={blankForm}
          tasks={tasks}
          submitLabel="Create Task"
          modalHeading="New Task"
          onClose={closeModal}
          onSubmit={handleCreateTask}
        />
      )}

      {modalMode === 'edit' && activeTask && (
        <TaskFormModal
          initialData={activeTask}
          tasks={tasks}
          submitLabel="Save Changes"
          modalHeading="Edit Task"
          onClose={closeModal}
          onSubmit={handleEditSave}
        />
      )}

      {modalMode === 'delete' && activeTask && (
        <DeleteConfirmModal
          task={activeTask}
          onClose={closeModal}
          onConfirm={handleDeleteConfirm}
        />
      )}

    </div>
  )
}

export default App
