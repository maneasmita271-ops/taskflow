/**
 * TaskFlow Smart Workflow Engine
 * Deterministic, rule-based workflow utilities:
 * 1. Task Urgency Calculation
 * 2. Team Workload Balancing & Recommendation
 * 3. Today's Action Plan Prioritization
 *
 * No external AI or APIs. Pure deterministic JavaScript.
 */

/**
 * Parses deadline string into the relative number of calendar days from today.
 * Supports "Today, 3:00 PM", "Tomorrow, 10:00 AM", "Yesterday", and ISO/standard date strings.
 *
 * @param {string} deadlineStr
 * @returns {number|null} Relative days (negative = overdue, 0 = today, 1 = tomorrow, etc.)
 */
export function parseDeadlineToDays(deadlineStr) {
  if (!deadlineStr || typeof deadlineStr !== 'string') return null

  const trimmed = deadlineStr.trim()
  if (!trimmed) return null

  if (/^today/i.test(trimmed)) return 0
  if (/^tomorrow/i.test(trimmed)) return 1
  if (/^yesterday/i.test(trimmed)) return -1

  const parsed = new Date(trimmed)
  if (!isNaN(parsed.getTime())) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const target = new Date(parsed)
    target.setHours(0, 0, 0, 0)

    const diffMs = target.getTime() - today.getTime()
    return Math.round(diffMs / (1000 * 60 * 60 * 24))
  }

  return null
}

/**
 * Checks whether an unfinished task is past its deadline.
 *
 * @param {Object} task
 * @returns {boolean}
 */
export function isTaskOverdue(task) {
  if (!task) return false
  if (task.status === 'Completed' || task.status === 'Done') return false

  const days = parseDeadlineToDays(task.deadline)
  if (days !== null) {
    return days < 0
  }

  return false
}

/**
 * Calculates a deterministic urgency level and priority score for a task.
 * Factors considered:
 * - Current completion status (Completed tasks have 0 urgency)
 * - Priority level (High, Medium, Low)
 * - Days remaining until deadline
 * - Overdue status
 *
 * @param {Object} task
 * @returns {{ level: 'Critical'|'High'|'Medium'|'Low'|'Completed', score: number, reason: string }}
 */
export function calculateTaskUrgency(task) {
  if (!task) {
    return { level: 'Low', score: 0, reason: 'No task data' }
  }

  if (task.status === 'Completed' || task.status === 'Done') {
    return { level: 'Completed', score: 0, reason: 'Task completed' }
  }

  const priority = (task.priority || 'Medium').toLowerCase()
  const days = parseDeadlineToDays(task.deadline)
  const priorityWeight = priority === 'high' ? 30 : priority === 'medium' ? 18 : 8

  // 1. Overdue tasks are always Critical
  if (days !== null && days < 0) {
    const daysOverdue = Math.abs(days)
    const score = 100 + daysOverdue * 10 + priorityWeight
    return {
      level: 'Critical',
      score,
      reason: daysOverdue === 1 ? '1 day overdue' : `${daysOverdue} days overdue`,
    }
  }

  // 2. Due Today
  if (days === 0) {
    if (priority === 'high') {
      return { level: 'Critical', score: 90 + priorityWeight, reason: 'High priority due today' }
    }
    if (priority === 'medium') {
      return { level: 'High', score: 75 + priorityWeight, reason: 'Due today' }
    }
    return { level: 'Medium', score: 60 + priorityWeight, reason: 'Due today' }
  }

  // 3. Due Tomorrow
  if (days === 1) {
    if (priority === 'high') {
      return { level: 'Critical', score: 80 + priorityWeight, reason: 'High priority due tomorrow' }
    }
    if (priority === 'medium') {
      return { level: 'High', score: 65 + priorityWeight, reason: 'Due tomorrow' }
    }
    return { level: 'Medium', score: 50 + priorityWeight, reason: 'Due tomorrow' }
  }

  // 4. Due in 2–3 days
  if (days !== null && days <= 3) {
    if (priority === 'high') {
      return { level: 'High', score: 60 + priorityWeight, reason: `Due in ${days} days` }
    }
    if (priority === 'medium') {
      return { level: 'Medium', score: 45 + priorityWeight, reason: `Due in ${days} days` }
    }
    return { level: 'Low', score: 35 + priorityWeight, reason: `Due in ${days} days` }
  }

  // 5. Due in > 3 days or unparsed
  if (priority === 'high') {
    return { level: 'Medium', score: 40 + priorityWeight, reason: 'High priority upcoming task' }
  }

  if (priority === 'medium') {
    return { level: 'Low', score: 25 + priorityWeight, reason: 'Normal priority upcoming' }
  }

  return { level: 'Low', score: 15 + priorityWeight, reason: 'Flexible deadline' }
}

/**
 * Computes workload distribution across all employees.
 *
 * @param {Array<Object>} employees Array of employee objects { name, role, initials, color }
 * @param {Array<Object>} tasks Array of all tasks
 * @returns {Object} Workload metrics and per-employee breakdown
 */
export function getTeamWorkloadMetrics(employees, tasks) {
  if (!Array.isArray(employees)) return { breakdown: [], recommended: null, averageActive: 0 }

  const taskList = Array.isArray(tasks) ? tasks : []

  const breakdown = employees.map((emp) => {
    const myTasks = taskList.filter((t) => t.assignee === emp.name)
    const activeTasks = myTasks.filter((t) => t.status !== 'Completed' && t.status !== 'Done')
    const completedTasks = myTasks.filter((t) => t.status === 'Completed' || t.status === 'Done')

    const activeCount = activeTasks.length
    const totalCount = myTasks.length

    // Max threshold for visual / threshold calculations (5 tasks = 100% capacity)
    const capacityPct = Math.min(Math.round((activeCount / 5) * 100), 100)
    const isHigh = activeCount >= 3

    return {
      ...emp,
      activeCount,
      completedCount: completedTasks.length,
      totalCount,
      capacityPct,
      isHigh,
    }
  })

  const totalActive = breakdown.reduce((acc, curr) => acc + curr.activeCount, 0)
  const averageActive = employees.length > 0 ? (totalActive / employees.length) : 0

  // Find candidate with lowest active task count for delegation recommendation
  let recommended = null
  if (breakdown.length > 0) {
    recommended = [...breakdown].sort((a, b) => a.activeCount - b.activeCount)[0]
  }

  return {
    breakdown,
    recommended,
    averageActive: Math.round(averageActive * 10) / 10,
    totalActive,
  }
}

/**
 * Generates an assignment recommendation and workload alert for the selected assignee.
 *
 * @param {string} selectedAssigneeName Name of employee currently selected in task form
 * @param {Array<Object>} employees
 * @param {Array<Object>} tasks
 * @returns {Object} Recommendation advisory
 */
export function getWorkloadRecommendation(selectedAssigneeName, employees, tasks) {
  const { breakdown, recommended } = getTeamWorkloadMetrics(employees, tasks)
  const selected = breakdown.find((e) => e.name === selectedAssigneeName)

  if (!selected) {
    return {
      isHigh: false,
      activeCount: 0,
      recommendedName: recommended?.name || '',
      recommendedCount: recommended?.activeCount || 0,
      text: '',
    }
  }

  const activeCount = selected.activeCount
  const isHigh = activeCount >= 3

  let text = `${selected.name} currently has ${activeCount} active task${activeCount === 1 ? '' : 's'}.`
  let suggestion = null

  if (isHigh && recommended && recommended.name !== selected.name && recommended.activeCount < activeCount) {
    suggestion = `Consider assigning to ${recommended.name} (${recommended.activeCount} active).`
  }

  return {
    isHigh,
    activeCount,
    recommendedName: recommended?.name || '',
    recommendedCount: recommended?.activeCount || 0,
    text,
    suggestion,
  }
}

/**
 * Generates Today's Action Plan from tasks:
 * Prioritizes:
 * 1. Overdue tasks (highest urgency)
 * 2. Urgent / High priority tasks due today
 * 3. Important tasks with the nearest deadlines
 *
 * @param {Array<Object>} tasks
 * @param {number} [limit=5] Max tasks to return in the action plan
 * @returns {Array<Object>} Top actionable prioritized tasks with urgency metadata
 */
export function getTodaysActionPlan(tasks, limit = 5) {
  if (!Array.isArray(tasks)) return []

  // Only consider actionable, non-completed tasks
  const actionable = tasks.filter((t) => t.status !== 'Completed' && t.status !== 'Done')

  const scoredTasks = actionable.map((task) => {
    const urgency = calculateTaskUrgency(task)
    const isOverdue = urgency.level === 'Critical' && urgency.reason.includes('overdue')
    const days = parseDeadlineToDays(task.deadline)

    return {
      ...task,
      urgency,
      isOverdue,
      daysRemaining: days,
    }
  })

  // Sort descending by calculated score
  scoredTasks.sort((a, b) => b.urgency.score - a.urgency.score)

  return scoredTasks.slice(0, limit)
}
