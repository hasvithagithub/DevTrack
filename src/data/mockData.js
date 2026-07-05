// Realistic Mock Data for DevTrack SDMS

export const orgInfo = {
  name: "DevTrack Enterprise",
  domain: "devtrack.internal",
  memberCount: 24,
  repoCount: 8,
  createdDate: "2024-01-15",
  plan: "Premium Enterprise",
  licenseExpires: "2027-12-31"
};

export const developers = [
  {
    id: "dev-1",
    name: "John Smith",
    username: "jsmith",
    email: "john.smith@company.com",
    role: "Lead Architect",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    repoCount: 5,
    commitCount: 342,
    issuesAssigned: 4,
    pullRequests: 28,
    lastActive: "2026-07-05T18:45:00Z",
    status: "Active",
    bio: "Lead Software Architect with 10+ years of experience in distributed systems and cloud architecture. Loves Go, Rust, and React.",
    department: "Core Platform",
    location: "San Francisco, CA"
  },
  {
    id: "dev-2",
    name: "Sarah Wilson",
    username: "swilson",
    email: "sarah.wilson@company.com",
    role: "Senior Frontend Developer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    repoCount: 4,
    commitCount: 289,
    issuesAssigned: 2,
    pullRequests: 42,
    lastActive: "2026-07-05T19:30:00Z",
    status: "Active",
    bio: "Frontend engineer dedicated to building beautiful, responsive, and user-centric web applications. Specialist in React, Tailwind, and Framer Motion.",
    department: "Product & UI",
    location: "Austin, TX"
  },
  {
    id: "dev-3",
    name: "David Kumar",
    username: "dkumar",
    email: "david.kumar@company.com",
    role: "Senior Backend Developer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    repoCount: 6,
    commitCount: 412,
    issuesAssigned: 5,
    pullRequests: 19,
    lastActive: "2026-07-05T19:15:00Z",
    status: "Active",
    bio: "Java/Go backend engineer focusing on microservices, API performance, and database optimization. Keeper of clean code.",
    department: "Core Platform",
    location: "Seattle, WA"
  },
  {
    id: "dev-4",
    name: "Priya Sharma",
    username: "psharma",
    email: "priya.sharma@company.com",
    role: "DevOps Lead",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
    repoCount: 8,
    commitCount: 154,
    issuesAssigned: 1,
    pullRequests: 12,
    lastActive: "2026-07-05T17:50:00Z",
    status: "Active",
    bio: "DevOps and Cloud Infrastructure specialist. Building CI/CD pipelines, Kubernetes clusters, and monitoring tools.",
    department: "Infrastructure",
    location: "New York, NY"
  },
  {
    id: "dev-5",
    name: "Alex Chen",
    username: "achen",
    email: "alex.chen@company.com",
    role: "Full Stack Engineer",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face",
    repoCount: 3,
    commitCount: 198,
    issuesAssigned: 3,
    pullRequests: 15,
    lastActive: "2026-07-04T16:20:00Z",
    status: "Offline",
    bio: "Product-minded full-stack engineer. Enjoys Next.js, Node.js, and Postgres database tuning.",
    department: "Product & UI",
    location: "Remote"
  },
  {
    id: "dev-6",
    name: "Emily Johnson",
    username: "ejohnson",
    email: "emily.johnson@company.com",
    role: "QA Automation Engineer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    repoCount: 4,
    commitCount: 87,
    issuesAssigned: 1,
    pullRequests: 22,
    lastActive: "2026-07-05T15:10:00Z",
    status: "Active",
    bio: "Quality assurance wizard. Automation test suite builder with Playwright and Cypress. Breaking things so they can be built stronger.",
    department: "Product & UI",
    location: "Chicago, IL"
  }
];

export const repositories = [
  {
    id: "repo-1",
    name: "EmployeePortal",
    description: "The main portal dashboard for company employees. Serves profile management, benefits selection, directory search, and company news feeds.",
    owner: "DevTrack Enterprise",
    visibility: "Private",
    language: "JavaScript",
    langColor: "#f1e05a",
    stars: 12,
    forks: 4,
    branchesCount: 8,
    contributorsCount: 4,
    openIssuesCount: 3,
    openPRsCount: 2,
    lastUpdated: "2026-07-05T19:22:00Z",
    storageUsed: "245 MB",
    contributors: ["jsmith", "swilson", "achen", "ejohnson"],
    weeklyCommits: 34
  },
  {
    id: "repo-2",
    name: "HRMS",
    description: "Human Resource Management System. Handles employee onboarding, time tracking, performance reviews, and department structures.",
    owner: "DevTrack Enterprise",
    visibility: "Private",
    language: "Java",
    langColor: "#b07219",
    stars: 8,
    forks: 2,
    branchesCount: 5,
    contributorsCount: 3,
    openIssuesCount: 4,
    openPRsCount: 1,
    lastUpdated: "2026-07-05T18:45:00Z",
    storageUsed: "480 MB",
    contributors: ["dkumar", "jsmith", "ejohnson"],
    weeklyCommits: 18
  },
  {
    id: "repo-3",
    name: "InventorySystem",
    description: "Real-time warehousing and stock control system. Incorporates barcode scanning and predictive restocking alerts.",
    owner: "DevTrack Enterprise",
    visibility: "Internal",
    language: "Go",
    langColor: "#00ADD8",
    stars: 15,
    forks: 6,
    branchesCount: 6,
    contributorsCount: 4,
    openIssuesCount: 2,
    openPRsCount: 3,
    lastUpdated: "2026-07-05T19:05:00Z",
    storageUsed: "120 MB",
    contributors: ["dkumar", "jsmith", "psharma", "achen"],
    weeklyCommits: 29
  },
  {
    id: "repo-4",
    name: "PayrollSystem",
    description: "Financial system responsible for compensation packages, direct deposits, tax calculations, and quarterly reports.",
    owner: "DevTrack Enterprise",
    visibility: "Private",
    language: "Python",
    langColor: "#3572A5",
    stars: 5,
    forks: 1,
    branchesCount: 4,
    contributorsCount: 3,
    openIssuesCount: 5,
    openPRsCount: 1,
    lastUpdated: "2026-07-04T12:00:00Z",
    storageUsed: "95 MB",
    contributors: ["dkumar", "jsmith", "ejohnson"],
    weeklyCommits: 12
  },
  {
    id: "repo-5",
    name: "CustomerInsight",
    description: "Data analytics backend utilizing customer telemetry to generate engagement graphs and churn risk models.",
    owner: "DevTrack Enterprise",
    visibility: "Private",
    language: "Python",
    langColor: "#3572A5",
    stars: 22,
    forks: 8,
    branchesCount: 7,
    contributorsCount: 3,
    openIssuesCount: 1,
    openPRsCount: 2,
    lastUpdated: "2026-07-05T17:15:00Z",
    storageUsed: "320 MB",
    contributors: ["achen", "dkumar", "psharma"],
    weeklyCommits: 45
  },
  {
    id: "repo-6",
    name: "DevTrack-CLI",
    description: "Command-line tool for developers to interact with the Gitea servers and track issues right from the terminal.",
    owner: "DevTrack Enterprise",
    visibility: "Public",
    language: "Go",
    langColor: "#00ADD8",
    stars: 45,
    forks: 14,
    branchesCount: 9,
    contributorsCount: 5,
    openIssuesCount: 2,
    openPRsCount: 0,
    lastUpdated: "2026-07-05T19:35:00Z",
    storageUsed: "18 MB",
    contributors: ["jsmith", "psharma", "swilson", "dkumar", "achen"],
    weeklyCommits: 22
  }
];

export const commits = [
  {
    hash: "3fa8f92",
    shortHash: "3fa8f92",
    message: "Implemented Repository Page dashboard view",
    author: "Sarah Wilson",
    authorUsername: "swilson",
    repository: "EmployeePortal",
    branch: "main",
    filesChanged: 8,
    insertions: 243,
    deletions: 48,
    dateTime: "2026-07-05T19:22:00Z"
  },
  {
    hash: "a4e8d31",
    shortHash: "a4e8d31",
    message: "Fixed Authentication Bug in OAuth redirection",
    author: "John Smith",
    authorUsername: "jsmith",
    repository: "EmployeePortal",
    branch: "feature/auth",
    filesChanged: 3,
    insertions: 45,
    deletions: 12,
    dateTime: "2026-07-05T18:40:00Z"
  },
  {
    hash: "8f2d5e9",
    shortHash: "8f2d5e9",
    message: "Updated Dashboard UI with sleek dark cards",
    author: "Sarah Wilson",
    authorUsername: "swilson",
    repository: "EmployeePortal",
    branch: "main",
    filesChanged: 4,
    insertions: 112,
    deletions: 19,
    dateTime: "2026-07-05T18:15:00Z"
  },
  {
    hash: "2b9c7d4",
    shortHash: "2b9c7d4",
    message: "Go SDK update and configuration clean up",
    author: "David Kumar",
    authorUsername: "dkumar",
    repository: "InventorySystem",
    branch: "main",
    filesChanged: 12,
    insertions: 512,
    deletions: 223,
    dateTime: "2026-07-05T19:05:00Z"
  },
  {
    hash: "c5e4f2a",
    shortHash: "c5e4f2a",
    message: "Added Login Module validation fields",
    author: "Sarah Wilson",
    authorUsername: "swilson",
    repository: "EmployeePortal",
    branch: "feature/auth",
    filesChanged: 2,
    insertions: 89,
    deletions: 4,
    dateTime: "2026-07-05T17:30:00Z"
  },
  {
    hash: "5e9d2c1",
    shortHash: "5e9d2c1",
    message: "Setup Prometheus metrics pipeline configurations",
    author: "Priya Sharma",
    authorUsername: "psharma",
    repository: "DevTrack-CLI",
    branch: "main",
    filesChanged: 6,
    insertions: 190,
    deletions: 34,
    dateTime: "2026-07-05T19:35:00Z"
  },
  {
    hash: "bc4d2f8",
    shortHash: "bc4d2f8",
    message: "Optimized database index query on employee roles",
    author: "David Kumar",
    authorUsername: "dkumar",
    repository: "HRMS",
    branch: "main",
    filesChanged: 2,
    insertions: 18,
    deletions: 2,
    dateTime: "2026-07-05T18:45:00Z"
  },
  {
    hash: "e5a6f7b",
    shortHash: "e5a6f7b",
    message: "Adjusted Kubernetes Deployment manifest resource limits",
    author: "Priya Sharma",
    authorUsername: "psharma",
    repository: "InventorySystem",
    branch: "develop",
    filesChanged: 1,
    insertions: 22,
    deletions: 22,
    dateTime: "2026-07-05T17:10:00Z"
  },
  {
    hash: "da4c2b9",
    shortHash: "da4c2b9",
    message: "Refactored user dashboard widgets in mobile view",
    author: "Alex Chen",
    authorUsername: "achen",
    repository: "CustomerInsight",
    branch: "main",
    filesChanged: 7,
    insertions: 145,
    deletions: 92,
    dateTime: "2026-07-05T16:50:00Z"
  },
  {
    hash: "7f8e9a2",
    shortHash: "7f8e9a2",
    message: "Added integration tests for tax computations",
    author: "Emily Johnson",
    authorUsername: "ejohnson",
    repository: "PayrollSystem",
    branch: "main",
    filesChanged: 5,
    insertions: 320,
    deletions: 12,
    dateTime: "2026-07-04T12:00:00Z"
  },
  {
    hash: "4e2a8d9",
    shortHash: "4e2a8d9",
    message: "Fixed edge case of negative stock values in API",
    author: "David Kumar",
    authorUsername: "dkumar",
    repository: "InventorySystem",
    branch: "main",
    filesChanged: 2,
    insertions: 38,
    deletions: 6,
    dateTime: "2026-07-04T10:15:00Z"
  },
  {
    hash: "1d2e3f4",
    shortHash: "1d2e3f4",
    message: "Initial commit containing basic scaffolding",
    author: "John Smith",
    authorUsername: "jsmith",
    repository: "DevTrack-CLI",
    branch: "main",
    filesChanged: 15,
    insertions: 1024,
    deletions: 0,
    dateTime: "2026-07-01T09:00:00Z"
  }
];

export const branches = [
  {
    id: "br-1",
    name: "main",
    repository: "EmployeePortal",
    protected: true,
    latestCommit: "3fa8f92",
    latestCommitMsg: "Implemented Repository Page dashboard view",
    createdBy: "jsmith",
    ahead: 0,
    behind: 0,
    lastUpdated: "2026-07-05T19:22:00Z",
    mergeStatus: "Merged"
  },
  {
    id: "br-2",
    name: "feature/auth",
    repository: "EmployeePortal",
    protected: false,
    latestCommit: "a4e8d31",
    latestCommitMsg: "Fixed Authentication Bug in OAuth redirection",
    createdBy: "swilson",
    ahead: 3,
    behind: 1,
    lastUpdated: "2026-07-05T18:40:00Z",
    mergeStatus: "Open"
  },
  {
    id: "br-3",
    name: "main",
    repository: "HRMS",
    protected: true,
    latestCommit: "bc4d2f8",
    latestCommitMsg: "Optimized database index query on employee roles",
    createdBy: "dkumar",
    ahead: 0,
    behind: 0,
    lastUpdated: "2026-07-05T18:45:00Z",
    mergeStatus: "Merged"
  },
  {
    id: "br-4",
    name: "main",
    repository: "InventorySystem",
    protected: true,
    latestCommit: "2b9c7d4",
    latestCommitMsg: "Go SDK update and configuration clean up",
    createdBy: "dkumar",
    ahead: 0,
    behind: 0,
    lastUpdated: "2026-07-05T19:05:00Z",
    mergeStatus: "Merged"
  },
  {
    id: "br-5",
    name: "develop",
    repository: "InventorySystem",
    protected: false,
    latestCommit: "e5a6f7b",
    latestCommitMsg: "Adjusted Kubernetes Deployment manifest resource limits",
    createdBy: "psharma",
    ahead: 4,
    behind: 2,
    lastUpdated: "2026-07-05T17:10:00Z",
    mergeStatus: "Open"
  },
  {
    id: "br-6",
    name: "main",
    repository: "PayrollSystem",
    protected: true,
    latestCommit: "7f8e9a2",
    latestCommitMsg: "Added integration tests for tax computations",
    createdBy: "jsmith",
    ahead: 0,
    behind: 0,
    lastUpdated: "2026-07-04T12:00:00Z",
    mergeStatus: "Merged"
  },
  {
    id: "br-7",
    name: "bugfix/tax-calc-rounding",
    repository: "PayrollSystem",
    protected: false,
    latestCommit: "77a8b9c",
    latestCommitMsg: "Fixed float rounding in salary tax calculation",
    createdBy: "ejohnson",
    ahead: 1,
    behind: 0,
    lastUpdated: "2026-07-05T11:00:00Z",
    mergeStatus: "Open"
  },
  {
    id: "br-8",
    name: "main",
    repository: "CustomerInsight",
    protected: true,
    latestCommit: "da4c2b9",
    latestCommitMsg: "Refactored user dashboard widgets in mobile view",
    createdBy: "achen",
    ahead: 0,
    behind: 0,
    lastUpdated: "2026-07-05T16:50:00Z",
    mergeStatus: "Merged"
  },
  {
    id: "br-9",
    name: "main",
    repository: "DevTrack-CLI",
    protected: true,
    latestCommit: "5e9d2c1",
    latestCommitMsg: "Setup Prometheus metrics pipeline configurations",
    createdBy: "jsmith",
    ahead: 0,
    behind: 0,
    lastUpdated: "2026-07-05T19:35:00Z",
    mergeStatus: "Merged"
  }
];

export const pullRequests = [
  {
    id: "pr-1",
    title: "Implement SSO and Github Auth Flow",
    repository: "EmployeePortal",
    author: "Sarah Wilson",
    authorUsername: "swilson",
    reviewer: "John Smith",
    status: "Open",
    commentsCount: 6,
    createdDate: "2026-07-04T15:20:00Z",
    mergedDate: null,
    sourceBranch: "feature/auth",
    targetBranch: "main",
    description: "This PR introduces SSO via OAuth2 and sets up Auth0 endpoints for employee sign-in. Resolves issue #21.",
    reviews: [
      { author: "John Smith", status: "REQUEST_CHANGES", text: "Please verify session invalidation on logout." }
    ]
  },
  {
    id: "pr-2",
    title: "Kubernetes configuration adjustment for scaling limits",
    repository: "InventorySystem",
    author: "Priya Sharma",
    authorUsername: "psharma",
    reviewer: "David Kumar",
    status: "Open",
    commentsCount: 3,
    createdDate: "2026-07-05T11:30:00Z",
    mergedDate: null,
    sourceBranch: "develop",
    targetBranch: "main",
    description: "Aligns pod resource limits with our new prod standards to prevent out-of-memory crashes during high loads.",
    reviews: []
  },
  {
    id: "pr-3",
    title: "UI Enhancements for Dark Mode compatibility",
    repository: "EmployeePortal",
    author: "Sarah Wilson",
    authorUsername: "swilson",
    reviewer: "Alex Chen",
    status: "Merged",
    commentsCount: 2,
    createdDate: "2026-07-05T09:00:00Z",
    mergedDate: "2026-07-05T18:15:00Z",
    sourceBranch: "feature/dark-mode",
    targetBranch: "main",
    description: "Refactors custom cards and charts to use CSS variables and Tailwind class-based dark overrides.",
    reviews: [
      { author: "Alex Chen", status: "APPROVED", text: "Stunning visual improvements!" }
    ]
  },
  {
    id: "pr-4",
    title: "Database index query and query tuning",
    repository: "HRMS",
    author: "David Kumar",
    authorUsername: "dkumar",
    reviewer: "John Smith",
    status: "Merged",
    commentsCount: 0,
    createdDate: "2026-07-05T18:00:00Z",
    mergedDate: "2026-07-05T18:45:00Z",
    sourceBranch: "feature/db-optim",
    targetBranch: "main",
    description: "Adds B-tree index on org_id and employee_code parameters. Fixes performance bottleneck on company directory queries.",
    reviews: []
  },
  {
    id: "pr-5",
    title: "Rounding calculation fix for negative balances",
    repository: "PayrollSystem",
    author: "Emily Johnson",
    authorUsername: "ejohnson",
    reviewer: "David Kumar",
    status: "Open",
    commentsCount: 1,
    createdDate: "2026-07-05T13:40:00Z",
    mergedDate: null,
    sourceBranch: "bugfix/tax-calc-rounding",
    targetBranch: "main",
    description: "Ensures rounding occurs towards zero for negative tax items, avoiding off-by-one errors on payroll pay slips.",
    reviews: []
  }
];

export const issues = [
  {
    id: "iss-1",
    title: "Login Error during OAuth token callback",
    repository: "EmployeePortal",
    priority: "High",
    labels: ["bug", "security"],
    assignedDeveloper: "Sarah Wilson",
    assignedUsername: "swilson",
    status: "Open",
    commentsCount: 4,
    createdDate: "2026-07-05T10:15:00Z",
    description: "Users occasionally face a 500 error after authentication completion from Gitea. Token extraction appears to fail on empty fields."
  },
  {
    id: "iss-2",
    title: "Dashboard Loading Issue in Safari browser",
    repository: "EmployeePortal",
    priority: "Medium",
    labels: ["bug", "frontend"],
    assignedDeveloper: "Sarah Wilson",
    assignedUsername: "swilson",
    status: "In Progress",
    commentsCount: 2,
    createdDate: "2026-07-05T11:45:00Z",
    description: "Charts fail to render inside WebKit engine due to flexbox calculations. Works fine on Chrome and Firefox."
  },
  {
    id: "iss-3",
    title: "Repository Permission Bug for read-only roles",
    repository: "InventorySystem",
    priority: "High",
    labels: ["bug", "backend"],
    assignedDeveloper: "David Kumar",
    assignedUsername: "dkumar",
    status: "Open",
    commentsCount: 5,
    createdDate: "2026-07-05T09:12:00Z",
    description: "Read-only collaborators are able to delete tags using custom curl commands on endpoints. Urgent security issue."
  },
  {
    id: "iss-4",
    title: "Add pagination support to Audit logs query panel",
    repository: "DevTrack-CLI",
    priority: "Low",
    labels: ["enhancement"],
    assignedDeveloper: "John Smith",
    assignedUsername: "jsmith",
    status: "Closed",
    commentsCount: 1,
    createdDate: "2026-07-04T08:20:00Z",
    description: "Audit logs are loading thousands of rows at once. Let's limit the query results page size to 50 rows.",
    closedDate: "2026-07-05T14:10:00Z"
  },
  {
    id: "iss-5",
    title: "Update API endpoint docs for billing webhooks",
    repository: "PayrollSystem",
    priority: "Medium",
    labels: ["documentation"],
    assignedDeveloper: "Emily Johnson",
    assignedUsername: "ejohnson",
    status: "Open",
    commentsCount: 0,
    createdDate: "2026-07-05T15:00:00Z",
    description: "Webhook payloads have changed with the new stripe configurations, but Swagger schema is outdated."
  },
  {
    id: "iss-6",
    title: "Prometheus exporter crashes on OOM metrics",
    repository: "DevTrack-CLI",
    priority: "High",
    labels: ["bug", "infrastructure"],
    assignedDeveloper: "Priya Sharma",
    assignedUsername: "psharma",
    status: "Open",
    commentsCount: 3,
    createdDate: "2026-07-05T16:15:00Z",
    description: "Metrics cache exceeds default heap limits when loading weekly activity stats. Needs memory limit bump."
  }
];

export const activityLogs = [
  {
    id: "act-1",
    type: "Commit Pushed",
    actor: "Sarah Wilson",
    actorUsername: "swilson",
    target: "EmployeePortal",
    details: "pushed 1 commit to main (3fa8f92)",
    time: "2026-07-05T19:22:00Z"
  },
  {
    id: "act-2",
    type: "Pull Request Created",
    actor: "Priya Sharma",
    actorUsername: "psharma",
    target: "InventorySystem",
    details: "created PR #2 'Kubernetes configuration scaling limits'",
    time: "2026-07-05T19:10:00Z"
  },
  {
    id: "act-3",
    type: "Commit Pushed",
    actor: "David Kumar",
    actorUsername: "dkumar",
    target: "InventorySystem",
    details: "pushed 2 commits to main (2b9c7d4)",
    time: "2026-07-05T19:05:00Z"
  },
  {
    id: "act-4",
    type: "Issue Opened",
    actor: "John Smith",
    actorUsername: "jsmith",
    target: "EmployeePortal",
    details: "opened issue #1 'Login Error during OAuth token callback'",
    time: "2026-07-05T18:45:00Z"
  },
  {
    id: "act-5",
    type: "Pull Request Merged",
    actor: "John Smith",
    actorUsername: "jsmith",
    target: "HRMS",
    details: "merged PR #4 'Database index query and query tuning'",
    time: "2026-07-05T18:45:00Z"
  },
  {
    id: "act-6",
    type: "Pull Request Merged",
    actor: "Sarah Wilson",
    actorUsername: "swilson",
    target: "EmployeePortal",
    details: "merged PR #3 'UI Enhancements for Dark Mode compatibility'",
    time: "2026-07-05T18:15:00Z"
  },
  {
    id: "act-7",
    type: "Issue Closed",
    actor: "John Smith",
    actorUsername: "jsmith",
    target: "DevTrack-CLI",
    details: "closed issue #4 'Add pagination support to Audit logs'",
    time: "2026-07-05T14:10:00Z"
  },
  {
    id: "act-8",
    type: "Developer Joined",
    actor: "Admin",
    actorUsername: "admin",
    target: "DevTrack SDMS",
    details: "added Emily Johnson as QA Automation Engineer",
    time: "2026-07-03T10:00:00Z"
  },
  {
    id: "act-9",
    type: "Repository Created",
    actor: "John Smith",
    actorUsername: "jsmith",
    target: "DevTrack-CLI",
    details: "created repository DevTrack-CLI",
    time: "2026-07-01T08:30:00Z"
  }
];

export const notifications = [
  {
    id: "not-1",
    message: "John Smith merged your Pull Request #3 on EmployeePortal",
    type: "pr_merged",
    read: false,
    time: "2026-07-05T18:15:00Z"
  },
  {
    id: "not-2",
    message: "David Kumar requested your review on Pull Request #2 on InventorySystem",
    type: "review_requested",
    read: false,
    time: "2026-07-05T11:30:00Z"
  },
  {
    id: "not-3",
    message: "John Smith assigned you issue #1: 'Login Error during OAuth token callback'",
    type: "issue_assigned",
    read: false,
    time: "2026-07-05T10:15:00Z"
  },
  {
    id: "not-4",
    message: "A new repository 'DevTrack-CLI' was created by John Smith",
    type: "repo_created",
    read: true,
    time: "2026-07-01T08:30:00Z"
  },
  {
    id: "not-5",
    message: "Emily Johnson opened issue #5: 'Update API endpoint docs'",
    type: "issue_opened",
    read: true,
    time: "2026-07-05T15:00:00Z"
  }
];

export const auditLogs = [
  {
    id: "aud-1",
    action: "User Created",
    user: "Admin",
    target: "Emily Johnson (ejohnson)",
    ip: "192.168.12.45",
    dateTime: "2026-07-03T10:00:00Z"
  },
  {
    id: "aud-2",
    action: "Role Assigned",
    user: "Admin",
    target: "Priya Sharma -> DevOps Lead",
    ip: "192.168.12.45",
    dateTime: "2026-07-02T14:30:00Z"
  },
  {
    id: "aud-3",
    action: "Repo Permission Change",
    user: "Admin",
    target: "HRMS set to PRIVATE",
    ip: "192.168.12.45",
    dateTime: "2026-06-28T09:12:00Z"
  },
  {
    id: "aud-4",
    action: "SSO Config Updated",
    user: "Admin",
    target: "OAuth2 Provider Gitea Enabled",
    ip: "192.168.12.12",
    dateTime: "2026-06-25T11:00:00Z"
  }
];

// Helper database functions to simulate queries
export const getRepoDetail = (name) => {
  const repo = repositories.find(r => r.name.toLowerCase() === name.toLowerCase());
  if (!repo) return null;
  
  // Attach relational data
  const repoCommits = commits.filter(c => c.repository.toLowerCase() === name.toLowerCase());
  const repoPRs = pullRequests.filter(pr => pr.repository.toLowerCase() === name.toLowerCase());
  const repoIssues = issues.filter(i => i.repository.toLowerCase() === name.toLowerCase());
  const repoBranches = branches.filter(b => b.repository.toLowerCase() === name.toLowerCase());
  const repoActivities = activityLogs.filter(a => a.target.toLowerCase() === name.toLowerCase());
  
  return {
    ...repo,
    commits: repoCommits,
    pullRequests: repoPRs,
    issues: repoIssues,
    branches: repoBranches,
    activities: repoActivities
  };
};

export const getDevProfile = (username) => {
  const dev = developers.find(d => d.username.toLowerCase() === username.toLowerCase());
  if (!dev) return null;
  
  const devCommits = commits.filter(c => c.authorUsername.toLowerCase() === username.toLowerCase());
  const devPRs = pullRequests.filter(p => p.authorUsername.toLowerCase() === username.toLowerCase());
  const devIssues = issues.filter(i => i.assignedUsername.toLowerCase() === username.toLowerCase());
  const devActivities = activityLogs.filter(a => a.actorUsername.toLowerCase() === username.toLowerCase());
  
  return {
    ...dev,
    commits: devCommits,
    pullRequests: devPRs,
    issues: devIssues,
    activities: devActivities
  };
};

export const attendanceLogs = [
  { id: "att-1", developerId: "dev-1", name: "John Smith", username: "jsmith", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face", date: "2026-07-05", status: "Present", clockIn: "08:50 AM", clockOut: "05:30 PM", workHours: 8.67 },
  { id: "att-2", developerId: "dev-2", name: "Sarah Wilson", username: "swilson", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face", date: "2026-07-05", status: "Late", clockIn: "09:35 AM", clockOut: "06:15 PM", workHours: 8.67 },
  { id: "att-3", developerId: "dev-3", name: "David Kumar", username: "dkumar", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", date: "2026-07-05", status: "Remote", clockIn: "09:00 AM", clockOut: "05:00 PM", workHours: 8.00 },
  { id: "att-4", developerId: "dev-4", name: "Priya Sharma", username: "psharma", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face", date: "2026-07-05", status: "Present", clockIn: "08:45 AM", clockOut: "06:00 PM", workHours: 9.25 },
  { id: "att-5", developerId: "dev-5", name: "Alex Chen", username: "achen", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face", date: "2026-07-05", status: "Absent", clockIn: "--", clockOut: "--", workHours: 0 },
  { id: "att-6", developerId: "dev-6", name: "Emily Johnson", username: "ejohnson", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face", date: "2026-07-05", status: "Present", clockIn: "08:55 AM", clockOut: "05:15 PM", workHours: 8.33 },
  
  // Previous day
  { id: "att-7", developerId: "dev-1", name: "John Smith", username: "jsmith", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face", date: "2026-07-04", status: "Present", clockIn: "08:52 AM", clockOut: "05:40 PM", workHours: 8.80 },
  { id: "att-8", developerId: "dev-2", name: "Sarah Wilson", username: "swilson", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face", date: "2026-07-04", status: "Present", clockIn: "08:58 AM", clockOut: "05:30 PM", workHours: 8.53 },
  { id: "att-9", developerId: "dev-3", name: "David Kumar", username: "dkumar", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", date: "2026-07-04", status: "Late", clockIn: "09:40 AM", clockOut: "06:30 PM", workHours: 8.83 },
  { id: "att-10", developerId: "dev-4", name: "Priya Sharma", username: "psharma", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face", date: "2026-07-04", status: "Remote", clockIn: "09:00 AM", clockOut: "05:00 PM", workHours: 8.00 },
  { id: "att-11", developerId: "dev-5", name: "Alex Chen", username: "achen", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face", date: "2026-07-04", status: "Present", clockIn: "08:50 AM", clockOut: "05:30 PM", workHours: 8.67 },
  { id: "att-12", developerId: "dev-6", name: "Emily Johnson", username: "ejohnson", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face", date: "2026-07-04", status: "Present", clockIn: "08:48 AM", clockOut: "05:00 PM", workHours: 8.20 }
];
