import React, { useState } from 'react';
import './UserTable.css';
import EditRoleModal from '../EditRoleModal/EditRoleModal';
import EditStatusModal from '../EditStatusModal/EditStatusModal';
import SuccessModal from '../../../../components/SuccessModal';
import type { User } from '../../types';
import { toggleUserActiveStatus } from '../../../../services/adminService';
interface UserTableProps {
  users: User[];
  fetchUserDetails: () => Promise<void>;
  showAddRoleAction?: boolean;
  customEditLabel?: string;
  isRolesSection?: boolean;
}

const UserTable: React.FC<UserTableProps> = ({ users, fetchUserDetails, showAddRoleAction, customEditLabel, isRolesSection }) => {
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

  const handleSaveSuccess = () => {
    // const activeUser = isModalOpen ? selectedUser : selectedStatusUser;

    // if (activeUser && updatedData) {
    //   const roleName = updatedData.role_name && updatedData.role_name !== 'Choose Role Type'
    //     ? updatedData.role_name.charAt(0).toUpperCase() + updatedData.role_name.slice(1)
    //     : updatedData.role_name || '';

    //   setUsers(users.map(u =>
    //     u.id === activeUser.id ? { ...u, ...updatedData, role: roleName } as User : u
    //   ));
    // }
    fetchUserDetails();
    setIsModalOpen(false);
    setIsStatusModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  const handleToggleStatus = async (user: User) => {
    const res = await toggleUserActiveStatus((user.id != undefined ? user.id : ''), !user.is_active);
    console.log("Toggle status response::", res)
    if (res && res.status === 200) {
      fetchUserDetails();
    }
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
      </table>

      <div className="user-table-scroll">
        <table className="user-table user-table-body">
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role_name}</td>
                <td>
                  <span className={`status-badge ${user.is_active ? 'status-active' : 'status-blocked'}`}>
                    {user.is_active ? 'Active' : 'Blocked'}
                  </span>
                </td>
                <td>
                  <div className="actions-cell">
                    {user.is_active ? (
                      <>
                        {showAddRoleAction && (
                          <>
                            <span className="action-add-role" onClick={() => handleEditClick(user)}>Add Role</span>
                            <div className="action-divider"></div>
                          </>
                        )}
                        <span className="action-edit" onClick={() => handleEditClick(user)}>{customEditLabel || 'Edit'}</span>
                        <div className="action-divider"></div>
                        <span className="action-disable" onClick={() => handleToggleStatus(user)}>Disable</span>
                      </>
                    ) : (
                      <>
                        <span className="action-edit" onClick={() => handleEditClick(user)}>{customEditLabel || 'Edit'}</span>
                        <div className="action-divider"></div>
                        <span className="action-activate" onClick={() => handleToggleStatus(user)}>Activate</span>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
          fetchUserDetails={fetchUserDetails}
          user={selectedStatusUser}
        />
      )}

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        message="Your role changes has updated successfully."
        title="Congratulations!"
      />
    </div>
  );
};

export default UserTable;
