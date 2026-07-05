import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './hooks/ThemeContext';
import MainLayout from './layouts/MainLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Repositories from './pages/Repositories';
import RepoDetails from './pages/RepoDetails';
import Developers from './pages/Developers';
import DevProfile from './pages/DevProfile';
import Commits from './pages/Commits';
import Branches from './pages/Branches';
import PullRequests from './pages/PullRequests';
import Issues from './pages/Issues';
import Analytics from './pages/Analytics';
import Activity from './pages/Activity';
import Notifications from './pages/Notifications';
import Admin from './pages/Admin';
import Settings from './pages/Settings';
import Attendance from './pages/Attendance';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth Route */}
          <Route path="/login" element={<Login />} />

          {/* Core Layout Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Repositories */}
            <Route path="repositories" element={<Repositories />} />
            <Route path="repositories/:name" element={<RepoDetails />} />

            {/* Developers */}
            <Route path="developers" element={<Developers />} />
            <Route path="developers/:username" element={<DevProfile />} />
            <Route path="attendance" element={<Attendance />} />

            {/* Git Logs */}
            <Route path="commits" element={<Commits />} />
            <Route path="branches" element={<Branches />} />
            <Route path="pull-requests" element={<PullRequests />} />
            <Route path="issues" element={<Issues />} />

            {/* Visual Analytics */}
            <Route path="analytics" element={<Analytics />} />
            <Route path="activity" element={<Activity />} />
            <Route path="notifications" element={<Notifications />} />

            {/* Admin and Configurations */}
            <Route path="admin" element={<Admin />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Catch All Redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
