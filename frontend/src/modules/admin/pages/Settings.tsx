import React from 'react';
import './UserManagement/UserManagement.css';

const Settings: React.FC = () => {
  return (
    <div className="user-management-page" style={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">your settings message</p>
      </div>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px', color: '#4B4B4B', fontFamily: 'Poppins', fontWeight: 500 }}>
        this is your settings
      </div>
    </div>
  );
};

export default Settings;
