import React, { useContext, ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppContext } from './AppContext';
import TopNav from './components/TopNav';
import Sidebar from './components/Sidebar';
import Dashboard from './views/Dashboard';
import TasksView from './views/TasksView';
import EarningsView from './views/EarningsView';
import MessagesView from './views/MessagesView';
import ProfileSettings from './views/ProfileSettings';
import TaskInfoView from './views/TaskInfoView';
import AuthView from './views/AuthView';
import { ToastProvider } from './components/Toast';
import './App.css';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { session, loading } = useContext(AppContext);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--sidebar-bg)', color: 'white', fontSize: '18px' }}>
        Loading...
      </div>
    );
  }

  if (!session) return <Navigate to="/auth" />;

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <TopNav />
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/auth" element={<AuthView />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute><TasksView /></ProtectedRoute>} />
          <Route path="/task-info" element={<ProtectedRoute><TaskInfoView /></ProtectedRoute>} />
          <Route path="/earnings" element={<ProtectedRoute><EarningsView /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><MessagesView /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
        </Routes>
      </Router>
    </ToastProvider>
  );
};

export default App;
