export const EMPLOYEES = [
  { name: 'Priya Sharma', role: 'Sales Manager',        initials: 'PS', color: '#4f6ef7' },
  { name: 'Arjun Mehta',  role: 'Operations Lead',      initials: 'AM', color: '#10b981' },
  { name: 'Sara Nair',    role: 'Marketing Specialist',  initials: 'SN', color: '#f59e0b' },
  { name: 'Rahul Gupta',  role: 'Customer Support',     initials: 'RG', color: '#8b5cf6' },
]

export const INITIAL_TASKS = [
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

export const INITIAL_ACTIVITY = [
  { id: 'a1', text: 'Rahul Gupta completed "Schedule team standup for next week"', time: 'Today', type: 'complete', createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 'a2', text: 'Priya Sharma started "Update product inventory spreadsheet"', time: 'Today', type: 'progress', createdAt: new Date(Date.now() - 7200000).toISOString() },
  { id: 'a3', text: 'Arjun Mehta assigned to "Reply to pending customer emails"', time: 'Today', type: 'create', createdAt: new Date(Date.now() - 10800000).toISOString() },
]
