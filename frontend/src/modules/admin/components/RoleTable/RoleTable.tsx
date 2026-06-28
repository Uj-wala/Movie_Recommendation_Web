import React, { useState } from 'react';
import './RoleTable.css';
import EditRoleModal from '../EditRoleModal/EditRoleModal';
import EditStatusModal from '../EditStatusModal/EditStatusModal';
import SuccessModal from '../../../../components/SuccessModal';
import type { Role, UserOrRole } from '../../types';

interface RoleTableProps {
  roles: Role[];
  setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
}

const RoleTable: React.FC<RoleTableProps> = ({ roles, setRoles }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedStatusRole, setSelectedStatusRole] = useState<Role | null>(null);

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleEditClick = (role: Role) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRole(null);
  };

  const handleStatusClick = (role: Role) => {
    setSelectedStatusRole(role);
    setIsStatusModalOpen(true);
  };

  const handleCloseStatusModal = () => {
    setIsStatusModalOpen(false);
    setSelectedStatusRole(null);
  };

  const handleSaveSuccess = (updatedData?: UserOrRole) => {
    const activeRole = isModalOpen ? selectedRole : selectedStatusRole;

    if (activeRole && updatedData) {
      setRoles(roles.map(r => 
        r.id === activeRole.id ? { ...r, ...updatedData } : r
      ));
    }
    
    setIsModalOpen(false);
    setIsStatusModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="role-table-wrapper">
      <table className="role-table">
        <thead>
          <tr>
            <th>Role Name</th>
            <th>Description</th>
            <th>Permissions</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id}>
              <td>{role.name}</td>
              <td>{role.description}</td>
              <td>{role.permissions}</td>
              <td>
                <span className={`status-badge ${role.status === 'Active' ? 'status-active' : 'status-blocked'}`}>
                  {role.status === 'Active' ? 'Active' : 'Blocked'}
                </span>
              </td>
              <td>
                <div className="actions-cell">
                  {role.status === 'Active' ? (
                    <>
                      <span className="action-edit" onClick={() => handleEditClick(role)}>Edit</span>
                      <div className="action-divider"></div>
                      <span className="action-disable" onClick={() => handleStatusClick(role)}>Disable</span>
                    </>
                  ) : (
                    <span className="action-activate" onClick={() => handleStatusClick(role)}>Activate</span>
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
          user={selectedRole ? { id: selectedRole.id, name: selectedRole.name, status: selectedRole.status } : null}
        />
      )}

      {isStatusModalOpen && (
        <EditStatusModal 
          isOpen={isStatusModalOpen} 
          onClose={handleCloseStatusModal} 
          onSave={handleSaveSuccess}
          fetchUserDetails={async () => {}}
          user={selectedStatusRole as UserOrRole}
        />
      )}

      {isSuccessModalOpen && (
        <SuccessModal
          isOpen={isSuccessModalOpen}
          onClose={() => setIsSuccessModalOpen(false)}
          title="Congratulations!"
          message="Your role changes has updated successfully."
        />
      )}
    </div>
  );
};

export default RoleTable;
