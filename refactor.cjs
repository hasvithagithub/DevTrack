const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

// List of all mock data exports
const mockExports = ['orgInfo', 'repositories', 'developers', 'commits', 'issues', 'pullRequests', 'branches', 'notifications', 'activityLogs', 'auditLogs', 'getDevProfile', 'getRepoDetail'];

function refactorFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find mockData import
  const importRegex = /import\s+\{\s*([^}]+)\s*\}\s+from\s+['"]\.\.\/data\/mockData['"];?/g;
  const match = importRegex.exec(content);
  
  if (!match) return;

  const importedVars = match[1].split(',').map(s => s.trim());
  
  // Replace import
  let hookImports = [];
  importedVars.forEach(v => {
    if (v === 'orgInfo') hookImports.push('useOrgInfo');
    if (v === 'repositories') hookImports.push('useRepositories');
    if (v === 'developers') hookImports.push('useDevelopers');
    if (v === 'commits') hookImports.push('useAllCommits');
    if (v === 'issues') hookImports.push('useAllIssues');
    if (v === 'pullRequests') hookImports.push('useAllPullRequests');
    if (v === 'branches') hookImports.push('useAllBranches');
    if (v === 'notifications') hookImports.push('useNotifications');
    if (v === 'activityLogs') hookImports.push('useActivityLogs');
    if (v === 'auditLogs') hookImports.push('useAuditLogs');
    // For specific getters, they usually need params, so we handle them manually or provide a generic wrapper
    if (v === 'getDevProfile') hookImports.push('useDevProfile');
    if (v === 'getRepoDetail') hookImports.push('useRepoDetail');
  });
  
  // Create the new import statement
  // Note: For components, path to hooks is usually '../hooks/useDevTrackQueries'
  let hookPath = '../hooks/useDevTrackQueries';
  
  content = content.replace(importRegex, `import { ${hookImports.join(', ')} } from '${hookPath}';`);

  // Now inject the hook calls at the top of the component
  // Component usually starts with `const ComponentName = () => {` or `const ComponentName = ({...}) => {`
  const compStartRegex = /(const\s+[A-Za-z0-9_]+\s*=\s*\([^)]*\)\s*=>\s*\{)/;
  
  let hookCalls = '';
  importedVars.forEach(v => {
    if (v === 'orgInfo') hookCalls += `\n  const { data: orgInfo = {} } = useOrgInfo();`;
    if (v === 'repositories') hookCalls += `\n  const { data: repositories = [] } = useRepositories();`;
    if (v === 'developers') hookCalls += `\n  const { data: developers = [] } = useDevelopers();`;
    if (v === 'commits') hookCalls += `\n  const { data: commits = [] } = useAllCommits();`;
    if (v === 'issues') hookCalls += `\n  const { data: issues = [] } = useAllIssues();`;
    if (v === 'pullRequests') hookCalls += `\n  const { data: pullRequests = [] } = useAllPullRequests();`;
    if (v === 'branches') hookCalls += `\n  const { data: branches = [] } = useAllBranches();`;
    if (v === 'notifications') hookCalls += `\n  const { data: notifications = [] } = useNotifications();`;
    if (v === 'activityLogs') hookCalls += `\n  const { data: activityLogs = [] } = useActivityLogs();`;
    if (v === 'auditLogs') hookCalls += `\n  const { data: auditLogs = [] } = useAuditLogs();`;
    // getDevProfile and getRepoDetail require id, usually pulled from useParams. We won't inject these automatically to avoid breaking, they must be done manually.
  });

  if (hookCalls) {
    content = content.replace(compStartRegex, `$1${hookCalls}`);
  }

  // Handle specific manual overrides
  if (filePath.includes('RepoDetails.jsx')) {
    content = content.replace(/const repo = getRepoDetail\(id\);/g, 'const { data: repo } = useRepoDetail(id);');
  }
  if (filePath.includes('DevProfile.jsx')) {
    content = content.replace(/const dev = getDevProfile\(username\);/g, 'const { data: dev } = useDevProfile(username);');
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Refactored ${filePath}`);
}

function walk(dir) {
  let list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    let stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      walk(file);
    } else {
      if (file.endsWith('.jsx')) {
        refactorFile(file);
      }
    }
  });
}

walk(srcDir);
