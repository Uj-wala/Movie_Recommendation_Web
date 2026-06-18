import React from 'react';
import './UserManagement/UserManagement.css';

const Dashboard: React.FC = () => {
  return (
    <div className="user-management-page" style={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">your dashboard message</p>
      </div>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px', color: '#4B4B4B', fontFamily: 'Poppins', fontWeight: 500 }}>
        this is your dashboard
      </div>
    </div>
  );
};

export default Dashboard;
