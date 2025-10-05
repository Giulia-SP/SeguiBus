
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import { RouteProvider } from './contexts/RouteContext';
import Login from './components/pages/Login';
import Dashboard from './components/pages/Dashboard';
import RouteDetail from './components/pages/RouteDetail';
import Communication from './components/pages/Communication';
import CrudRoutes from './components/pages/CrudRoutes';
import Header from './components/Header';

const App: React.FC = () => {
  return (
    <AccessibilityProvider>
      <AuthProvider>
        <HashRouter>
          <RouteProvider>
            <Main />
          </RouteProvider>
        </HashRouter>
      </AuthProvider>
    </AccessibilityProvider>
  );
};

const Main: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
      {user && <Header />}
      <main className="p-4 sm:p-6">
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/route/:id" element={user ? <RouteDetail /> : <Navigate to="/login" />} />
          <Route path="/communication" element={user ? <Communication /> : <Navigate to="/login" />} />
          <Route path="/admin/routes" element={user ? <CrudRoutes /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;