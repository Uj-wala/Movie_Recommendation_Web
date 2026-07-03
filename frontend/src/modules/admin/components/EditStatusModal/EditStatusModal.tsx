import React, { useEffect, useMemo, useState } from 'react';
import './EditStatusModal.css';
import { X } from 'lucide-react';
import type { UserOrRole } from '../../types';
import { fetchDropdownData } from '../../../../services/ListApiService';
import { editUser } from '../../../../services/adminService';

const USER_NAME_MAX_LENGTH = 24;

interface EditStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data?: UserOrRole) => void;
  fetchUserDetails: () => Promise<void>;
  user: UserOrRole | null;
}

const EditStatusModal: React.FC<EditStatusModalProps> = ({ isOpen, onClose, onSave, fetchUserDetails, user }) => {
  const [status, setStatus] = useState(user?.is_active ? 'Active' : 'Deactivate');
  const [selectedRole, setSelectedRole] = useState(user?.role_id || '');
  const [userName, setUserName] = useState(user?.name || "");
  const [userNameError, setUserNameError] = useState("");
  const [roleError, setRoleError] = useState("");
  const [role, setRole] = useState<{ id: string, name: string }[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const initialStatus = user?.is_active ? 'Active' : 'Deactivate';
  const hasChanges = useMemo(
    () =>
      userName.trim() !== (user?.name || "").trim() ||
      selectedRole !== (user?.role_id || "") ||
      status !== initialStatus,
    [initialStatus, selectedRole, status, user?.name, user?.role_id, userName]
  );

  const handleSave = async() => {
    if (isSaving) return;
    if (!hasChanges) return;
    if (!userName.trim() && !selectedRole && !status) {
      setUserNameError("Please fill all required fields.");
      setRoleError("");
      return;
    }
    if (!userName.trim() || !selectedRole || !status) {
      setUserNameError(userName.trim() ? "" : "User Name is required.");
      setRoleError(selectedRole ? "" : "Please select a role.");
      return;
    }
    setIsSaving(true);
    try {
      await editUser((user?.id ? user?.id : ''), {
        role_id: selectedRole,
        is_active: status === 'Active'
      });
      const updatedUser = {
        ...user,
        name: userName,
        role_id: selectedRole,
        is_active: status === 'Active' ? 1 : 0,
      };
      if (onSave) {
        await onSave(updatedUser);
      } else {
        await fetchUserDetails();
        onClose();
      }
    } finally {
      setIsSaving(false);
    }
  };
  useEffect(() => {
    if (!isOpen) return;

    setUserName(user?.name || "");
    setSelectedRole(user?.role_id || "");
    setStatus(user?.is_active ? "Active" : "Deactivate");
    setUserNameError("");
    setRoleError("");

    let cancelled = false;
    fetchDropdownData('/dropdowns/roles')
      .then((response) => {
        if (!cancelled) setRole(response);
      })
      .catch((error) => console.error('Error fetching roles:', error));

    return () => {
      cancelled = true;
    };
  }, [isOpen, user]);

  if (!isOpen) return null;

  return (
    <div className="status-modal-overlay">
      <div className="status-modal-content">
        <div className="status-modal-header">
          <h2 className="status-modal-title">Edit User Role</h2>
          <X className="status-modal-close" size={24} onClick={onClose} />
        </div>

        <div className="status-input-group">
          <label className="status-input-label">User Name:</label>
          <input
            type="text"
            className="status-text-input"
            placeholder="Enter User Name"
            value={userName}
            onChange={(e) => {
              const nextUserName = e.target.value;

              if (nextUserName.length > USER_NAME_MAX_LENGTH) {
                setUserNameError(`User Name cannot exceed ${USER_NAME_MAX_LENGTH} characters`);
                setUserName(nextUserName.slice(0, USER_NAME_MAX_LENGTH));
                return;
              }

              setUserName(nextUserName);
              if (userNameError) {
                setUserNameError(nextUserName.trim() ? "" : "User Name is required.");
              }
            }}
          />
          {userNameError && (
            <span className="status-error-text">{userNameError}</span>
          )}
        </div>

        <div className="status-input-group">
          <label className="status-input-label">Role:</label>
          <select
            className="status-dropdown"
            value={selectedRole}
            onChange={(e) => {
              setSelectedRole(e.target.value);
              if (e.target.value) setRoleError("");
            }}
          >
            {/* <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="parent">Parent</option>
            <option value="admin">Admin</option> */}
            {role.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
          {roleError && (
            <span className="status-error-text">{roleError}</span>
          )}
        </div>

        <div className="status-input-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '24px' }}>
          <label className="status-input-label" style={{ minWidth: '60px' }}>Status:</label>
          <div className="status-radio-group">
            <label className="status-radio-item">
              <input
                type="radio"
                name="userStatus"
                value="Active"
                checked={status === 'Active'}
                onChange={() => setStatus('Active')}
                className="status-radio-input"
              />
              <span className={`status-radio-label ${status === 'Active' ? 'active-text' : 'deactive-text'}`}>Active</span>
            </label>
            <label className="status-radio-item">
              <input
                type="radio"
                name="userStatus"
                value="Deactivate"
                checked={status === 'Deactivate'}
                onChange={() => setStatus('Deactivate')}
                className="status-radio-input"
              />
              <span className="status-radio-label deactive-text">Deactivate</span>
            </label>
          </div>
        </div>

        <div className="status-modal-actions">
          <button className="status-btn-cancel" onClick={onClose}>Cancel</button>
          <button className="status-btn-save" onClick={handleSave} disabled={isSaving || !hasChanges}>
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditStatusModal;
