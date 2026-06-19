import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  handleLogout?: () => void;
  userEmail?: string;
  profileImage?: string | null;
  setProfileImage?: (image: string | null) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, handleLogout, userEmail, profileImage }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />
      )}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="main-content">
        <Header setActiveTab={setActiveTab} handleLogout={handleLogout} userEmail={userEmail} profileImage={profileImage} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
