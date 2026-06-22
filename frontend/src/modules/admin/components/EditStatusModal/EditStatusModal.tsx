import React, { useState } from 'react';
import './EditStatusModal.css';
import { X } from 'lucide-react';
import type { UserOrRole } from '../../types';

interface EditStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data?: UserOrRole) => void;
  user: UserOrRole | null;
}

const EditStatusModal: React.FC<EditStatusModalProps> = ({ isOpen, onClose, onSave, user }) => {
  const [status, setStatus] = useState(user?.status === 'Active' ? 'Active' : 'Deactivate');
  const [selectedRole, setSelectedRole] = useState(user?.role?.toLowerCase() || 'student');
  const [userName, setUserName] = useState(user?.name || "Kumar Gandham");

  if (!isOpen) return null;

  const handleSave = () => {
    if (onSave) {
      onSave({ 
        name: userName,
        role: selectedRole, 
        status: status === 'Active' ? 'Active' : 'Blocked' 
      });
    } else {
      onClose();
    }
  };

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
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>

        <div className="status-input-group">
          <label className="status-input-label">Role:</label>
          <select 
            className="status-dropdown" 
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="parent">Parent</option>
            <option value="admin">Admin</option>
          </select>
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
          <button className="status-btn-save" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default EditStatusModal;
