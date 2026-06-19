import React, { useState } from 'react';
import './EditRoleModal.css';
import { X } from 'lucide-react';
import type { UserOrRole } from '../../types';

interface EditRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data?: UserOrRole) => void;
  user: UserOrRole | null;
}

const EditRoleModal: React.FC<EditRoleModalProps> = ({ isOpen, onClose, onSave, user }) => {
  const [permissions, setPermissions] = useState({
    viewCourses: true,
    attemptQuiz: true,
    viewDashboard: true,
    manageUsers: false,
    createCourses: false,
    accessReports: false,
  });
  const [selectedRole, setSelectedRole] = useState(user?.role || "");
  const [nameVal, setNameVal] = useState(user?.name || "");
  const [emailVal, setEmailVal] = useState(user?.email || "");
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");

  if (!isOpen) return null;

  const handleCheckboxChange = (key: keyof typeof permissions) => {
    setPermissions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const validateName = (name: string) => {
    return String(name).trim().match(/^[A-Za-z\s]+$/);
  };

  const handleSave = () => {
    let hasError = false;

    if (!validateName(nameVal)) {
      setNameError("Please enter a valid name (letters and spaces only)");
      hasError = true;
    } else {
      setNameError("");
    }

    if (!validateEmail(emailVal)) {
      setEmailError("Please enter a valid email address");
      hasError = true;
    } else {
      setEmailError("");
    }

    if (hasError) return;
    
    if (onSave) {
      onSave({ name: nameVal, email: emailVal, role: selectedRole, permissions });
    } else {
      onClose();
    }
  };

  const roleLabelPrefix = selectedRole && selectedRole !== 'Choose Role Type' 
    ? selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1) 
    : 'Teacher';

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">{user && user.name ? 'Edit Role' : 'Create a New Role'}</h2>
          <X className="modal-close" size={24} onClick={onClose} />
        </div>

        <div className="role-section">
          <label className="section-label">Select Role:</label>
          <select 
            className="dropdown-select" 
            value={selectedRole || "Choose Role Type"} 
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option disabled value="Choose Role Type">Choose Role Type</option>
            <option value="Student">Student</option>
            <option value="Teacher">Teacher</option>
            <option value="Parent">Parent</option>
          </select>
        </div>

        <div className="input-row">
          <div className="input-group">
            <label className="input-label">{roleLabelPrefix} Name:</label>
            <input 
              type="text" 
              className={`text-input ${nameError ? 'input-error' : ''}`} 
              placeholder="Enter your name" 
              value={nameVal}
              onChange={(e) => {
                setNameVal(e.target.value);
                if (nameError) setNameError("");
              }}
            />
            {nameError && <span className="error-text" style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{nameError}</span>}
          </div>
          <div className="input-group">
            <label className="input-label">{roleLabelPrefix} Email ID:</label>
            <input 
              type="text" 
              className={`text-input ${emailError ? 'input-error' : ''}`} 
              placeholder="Enter your email id" 
              value={emailVal}
              onChange={(e) => {
                setEmailVal(e.target.value);
                if (emailError) setEmailError("");
              }}
            />
            {emailError && <span className="error-text" style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{emailError}</span>}
          </div>
        </div>

        <div className="permissions-section">
          <h3 className="permissions-title">Permissions</h3>
          <div className="permissions-list">
            <label className="checkbox-item">
              <input 
                type="checkbox" 
                className="checkbox-input" 
                checked={permissions.viewCourses}
                onChange={() => handleCheckboxChange('viewCourses')}
              />
              <span className="checkbox-label">View Courses</span>
            </label>
            <label className="checkbox-item">
              <input 
                type="checkbox" 
                className="checkbox-input" 
                checked={permissions.attemptQuiz}
                onChange={() => handleCheckboxChange('attemptQuiz')}
              />
              <span className="checkbox-label">Attempt Quiz</span>
            </label>
            <label className="checkbox-item">
              <input 
                type="checkbox" 
                className="checkbox-input" 
                checked={permissions.viewDashboard}
                onChange={() => handleCheckboxChange('viewDashboard')}
              />
              <span className="checkbox-label">View Dashboard</span>
            </label>
            <label className="checkbox-item">
              <input 
                type="checkbox" 
                className="checkbox-input" 
                checked={permissions.manageUsers}
                onChange={() => handleCheckboxChange('manageUsers')}
              />
              <span className="checkbox-label">Manage Users</span>
            </label>
            <label className="checkbox-item">
              <input 
                type="checkbox" 
                className="checkbox-input" 
                checked={permissions.createCourses}
                onChange={() => handleCheckboxChange('createCourses')}
              />
              <span className="checkbox-label">Create Courses</span>
            </label>
            <label className="checkbox-item">
              <input 
                type="checkbox" 
                className="checkbox-input" 
                checked={permissions.accessReports}
                onChange={() => handleCheckboxChange('accessReports')}
              />
              <span className="checkbox-label">Access Reports</span>
            </label>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={handleSave}>Save Permissions</button>
        </div>
      </div>
    </div>
  );
};

export default EditRoleModal;
