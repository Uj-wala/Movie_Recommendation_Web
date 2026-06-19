import React from 'react';
import './UserManagement/UserManagement.css';



const RolesPermissions: React.FC = () => {
  return (
    <div className="user-management-page" style={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
      <div className="page-header">
        <h1 className="page-title">Roles & Permissions</h1>
        <p className="page-subtitle">your Roles and Permissions message</p>
      </div>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px', color: '#4B4B4B', fontFamily: 'Poppins', fontWeight: 500 }}>
        this is your Roles and Permissions
      </div>
    </div>
  );
};

export default RolesPermissions;
