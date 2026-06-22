import React, { useEffect, useState } from 'react';
import './EditRoleModal.css';
import { X } from 'lucide-react';
import type { UserOrRole } from '../../types';

const NAME_MAX_LENGTH = 24;
const DEFAULT_PERMISSIONS = {
  viewCourses: true,
  attemptQuiz: true,
  viewDashboard: true,
  manageUsers: false,
  createCourses: false,
  accessReports: false,
};

interface EditRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data?: UserOrRole) => void;
  user: UserOrRole | null;
  existingEmails?: string[];
}

const EditRoleModal: React.FC<EditRoleModalProps> = ({ isOpen, onClose, onSave, user, existingEmails = [] }) => {
  const [permissions, setPermissions] = useState(DEFAULT_PERMISSIONS);
  const [selectedRole, setSelectedRole] = useState(user?.role || "");
  const [nameVal, setNameVal] = useState(user?.name || "");
  const [emailVal, setEmailVal] = useState(user?.email || "");
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    setPermissions(DEFAULT_PERMISSIONS);
    setSelectedRole(user?.role || "");
    setNameVal(user?.name || "");
    setEmailVal(user?.email || "");
    setEmailError("");
    setNameError("");
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleCheckboxChange = (key: keyof typeof permissions) => {
    setPermissions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const validateEmail = (email: string) => {
    return String(email)
      .trim()
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const isDuplicateEmail = (email: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const currentUserEmail = user?.email?.trim().toLowerCase();

    return existingEmails.some((existingEmail) => {
      const normalizedExistingEmail = existingEmail.trim().toLowerCase();
      return normalizedExistingEmail === normalizedEmail && normalizedExistingEmail !== currentUserEmail;
    });
  };

  const validateName = (name: string) => {
    const trimmedName = String(name).trim();

    if (!trimmedName) {
      return "Please enter a name";
    }

    if (trimmedName.length > NAME_MAX_LENGTH) {
      return `${roleLabelPrefix || "Name"} cannot exceed ${NAME_MAX_LENGTH} characters`;
    }

    return "";
  };

  const handleSave = () => {
    let hasError = false;
    const hasSelectedRole = selectedRole && selectedRole !== 'Choose Role Type';

    if (!hasSelectedRole) {
      return;
    }

    const nextNameError = validateName(nameVal);
    if (nextNameError) {
      setNameError(nextNameError);
      hasError = true;
    } else {
      setNameError("");
    }

    if (!validateEmail(emailVal)) {
      setEmailError("Please enter a valid email address");
      hasError = true;
    } else if (isDuplicateEmail(emailVal)) {
      setEmailError("This email is already added");
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

  const hasSelectedRole = selectedRole && selectedRole !== 'Choose Role Type';
  const roleLabelPrefix = hasSelectedRole
    ? selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)
    : "";

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

        {hasSelectedRole && (
          <div className="input-row">
            <div className="input-group">
              <label className="input-label">{roleLabelPrefix} Name:</label>
              <input 
                type="text" 
                className={`text-input ${nameError ? 'input-error' : ''}`} 
                placeholder={`Enter ${roleLabelPrefix.toLowerCase()} name`} 
                value={nameVal}
                onChange={(e) => {
                  const nextName = e.target.value;

                  if (nextName.length > NAME_MAX_LENGTH) {
                    setNameError(`${roleLabelPrefix} Name cannot exceed ${NAME_MAX_LENGTH} characters`);
                    setNameVal(nextName.slice(0, NAME_MAX_LENGTH));
                    return;
                  }

                  setNameVal(nextName);
                  if (nameError) setNameError("");
                }}
              />
              {nameError && <span className="error-text" style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{nameError}</span>}
            </div>
            <div className="input-group">
              <label className="input-label">{roleLabelPrefix} Email ID:</label>
              <input 
                type="email" 
                className={`text-input ${emailError ? 'input-error' : ''}`} 
                placeholder={`Enter ${roleLabelPrefix.toLowerCase()} email id`} 
                value={emailVal}
                onChange={(e) => {
                  const nextEmail = e.target.value.trim();
                  setEmailVal(nextEmail);
                  setEmailError(
                    nextEmail && !validateEmail(nextEmail)
                      ? "Please enter a valid email address"
                      : nextEmail && isDuplicateEmail(nextEmail)
                        ? "This email is already added"
                      : ""
                  );
                }}
              />
              {emailError && <span className="error-text" style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{emailError}</span>}
            </div>
          </div>
        )}

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
