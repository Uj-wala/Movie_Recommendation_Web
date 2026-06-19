import React, { useState } from 'react';
import './UserTable.css';
import EditRoleModal from '../EditRoleModal/EditRoleModal';
import EditStatusModal from '../EditStatusModal/EditStatusModal';
import SuccessModal from '../SuccessModal/SuccessModal';
import type { User, UserOrRole } from '../../types';

interface UserTableProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;

  showAddRoleAction?: boolean;
  customEditLabel?: string;
  isRolesSection?: boolean;
}

const UserTable: React.FC<UserTableProps> = ({ users, setUsers, showAddRoleAction, customEditLabel, isRolesSection }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedStatusUser, setSelectedStatusUser] = useState<User | null>(null);

  const handleEditClick = (user: User) => {
    if (isRolesSection) {
      setSelectedUser(user);
      setIsModalOpen(true);
    } else {
      setSelectedStatusUser(user);
      setIsStatusModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleCloseStatusModal = () => {
    setIsStatusModalOpen(false);
    setSelectedStatusUser(null);
  };

  const handleSaveSuccess = (updatedData?: UserOrRole) => {
    const activeUser = isModalOpen ? selectedUser : selectedStatusUser;

    if (activeUser && updatedData) {
      const roleName = updatedData.role && updatedData.role !== 'Choose Role Type' 
        ? updatedData.role.charAt(0).toUpperCase() + updatedData.role.slice(1) 
        : updatedData.role || '';

      setUsers(users.map(u => 
        u.id === activeUser.id ? { ...u, ...updatedData, role: roleName } as User : u
      ));
    }
    
    setIsModalOpen(false);
    setIsStatusModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="user-table-wrapper">
      <table className="user-table">
        <thead>
          <tr>
            <th>User Name</th>
            <th>Email ID</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <span className={`status-badge ${user.status === 'Active' ? 'status-active' : 'status-blocked'}`}>
                  {user.status === 'Active' ? 'Active' : 'Blocked'}
                </span>
              </td>
              <td>
                <div className="actions-cell">
                  {user.status === 'Active' ? (
                    <>
                      {showAddRoleAction && (
                        <>
                          <span className="action-add-role" onClick={() => handleEditClick(user)}>Add Role</span>
                          <div className="action-divider"></div>
                        </>
                      )}
                      <span className="action-edit" onClick={() => handleEditClick(user)}>{customEditLabel || 'Edit'}</span>
                      <div className="action-divider"></div>
                      <span className="action-disable">Disable</span>
                    </>
                  ) : (
                    <>
                      <span className="action-edit" onClick={() => handleEditClick(user)}>{customEditLabel || 'Edit'}</span>
                      <div className="action-divider"></div>
                      <span className="action-activate">Activate</span>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <EditRoleModal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
          onSave={handleSaveSuccess}
          user={selectedUser} 
        />
      )}

      {isStatusModalOpen && (
        <EditStatusModal 
          isOpen={isStatusModalOpen} 
          onClose={handleCloseStatusModal} 
          onSave={handleSaveSuccess}
          user={selectedStatusUser} 
        />
      )}

      <SuccessModal 
        isOpen={isSuccessModalOpen} 
        onClose={() => setIsSuccessModalOpen(false)} 
        message="Your role changes has updated successfully."
      />
    </div>
  );
};

export default UserTable;
