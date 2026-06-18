import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import Layout from './components/layout/Layout';
import UserManagement from './pages/UserManagement/UserManagement';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import RolesPermissions from './pages/RolesPermissions';
import ManageProfile from './pages/ManageProfile/ManageProfile';
import Login from './pages/Login/Login';
import { Toaster } from 'react-hot-toast';


function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [userEmail, setUserEmail] = useState(() => {
    return localStorage.getItem('userEmail') || '';
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const activeTab = location.pathname.split('/')[1] || 'dashboard';

  const setActiveTab = (tab: string) => {
    navigate(`/${tab}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    setIsAuthenticated(false);
    setUserEmail('');
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      handleLogout={handleLogout}
      userEmail={userEmail}
      profileImage={profileImage}
      setProfileImage={setProfileImage}
    >
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: 'Poppins',
            fontWeight: 500,
            color: '#0F172A',
            padding: '16px',
            borderRadius: '8px',
          },
          success: {
            iconTheme: {
              primary: '#238B45',
              secondary: '#FFFFFF',
            },
          },
        }}
      />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<UserManagement setActiveTab={setActiveTab} />} />
        <Route path="/roles" element={<RolesPermissions />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={
          <ManageProfile 
            setActiveTab={setActiveTab} 
            userEmail={userEmail} 
            profileImage={profileImage}
            setProfileImage={setProfileImage}
          />
        } />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const handleLogin = (email: string) => {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userEmail', email);
    navigate('/dashboard');
  };
  return <Login onLogin={handleLogin} />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
