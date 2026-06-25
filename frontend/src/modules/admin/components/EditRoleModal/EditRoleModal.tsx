import React, { useEffect, useState } from 'react';
import './EditRoleModal.css';
import { X } from 'lucide-react';
import type { UserOrRole } from '../../types';
import { fetchDropdownData } from '../../../../services/ListApiService';
import { createRole, fetchPermissions, fetchPermissionsByRoleId } from '../../../../services/adminService';

const NAME_MAX_LENGTH = 24;

interface EditRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (userData: UserOrRole) => void;
  user: UserOrRole | null;
  existingEmails?: string[];
}
type RoleOption = {
  id: string;
  name: string;
};

type PermissionOption = {
  id: string;
  name: string;
  description: string;
};

const EditRoleModal: React.FC<EditRoleModalProps> = ({ isOpen, onClose, onSave, user, existingEmails = [] }) => {
  const [permissionOptions, setPermissionOptions] = useState<PermissionOption[]>([]);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([]);
  const [loading, setLoading]=useState(false)
  const [selectedRole, setSelectedRole] = useState<RoleOption>({
    id: user?.role_id ?? "",
    name: user?.role_name ?? "",
  });
  const [nameVal, setNameVal] = useState(user?.name || "");
  const [emailVal, setEmailVal] = useState(user?.email || "");
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [role, setRole] = useState<RoleOption[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    // setPermissions(DEFAULT_PERMISSIONS);
    const initialRole = {
      id: user?.role_id ?? "",
      name: user?.role_name ?? "",
    };

    setSelectedRole(initialRole);
    if (initialRole.id) {
      fetchRolePermissions(initialRole.id);
    } else {
      setSelectedPermissionIds([]);
    }
    setNameVal(user?.name || "");
    setEmailVal(user?.email || "");
    setEmailError("");
    setNameError("");
    fetchData();
    fetchPremmissions();
  }, [isOpen, user]);

  const fetchData = async () => {
    try {
      const res = await fetchDropdownData("/dropdowns/roles");
      setRole(res);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  }
  const fetchPremmissions = async () => {
    try {
      const res = await fetchPermissions();
      setPermissionOptions(res?.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  }
  const fetchRolePermissions = async (roleId: string) => {
    try {
      const res = await fetchPermissionsByRoleId(roleId);

      const permissionIds = res?.data.permissions.map(
        (permission: { id: string; name: string }) => permission.id
      );

      setSelectedPermissionIds(permissionIds);
    } catch (error) {
      console.error("Error fetching role permissions:", error);
      setSelectedPermissionIds([]);
    }
  };

  if (!isOpen) return null;
  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissionIds((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
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
  const handleRoleChange = async (roleId: string) => {
    const nextRole =
      role?.find((r) => r.id === roleId) || { id: "", name: "" };

    setSelectedRole(nextRole);

    if (nextRole.id) {
      await fetchRolePermissions(nextRole.id);
    } else {
      setSelectedPermissionIds([]);
    }
  };
  const handleSave = async () => {
    let hasError = false;
    const hasSelectedRole = selectedRole && selectedRole.id !== 'Choose Role Type';

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
    setLoading(true)
    try {
      const payload = {
        name: nameVal,
        email: emailVal,
        role_id: selectedRole.id,
        permissions: selectedPermissionIds
      }
      const res = await createRole(payload);
      console.log("res",res)
      const userData: UserOrRole = {
        id: res?.data?.user?.id ?? "",
        name: res?.data?.user?.name,
        email: res?.data?.user?.email,
        role_id: res?.data?.user?.role_id,
        registration_number: res?.data?.user?.registration_number,
        role_name: selectedRole.name,
        permissions: selectedPermissionIds,
      };

      onSave?.(userData);

    } catch (error: any) {
      console.log("Error Creating Role :::", error)
    }finally{
      setLoading(false)
    }
  };

  const hasSelectedRole = selectedRole.id;
  const roleLabelPrefix = hasSelectedRole
    ? selectedRole.name.charAt(0).toUpperCase() + selectedRole.name.slice(1)
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
            value={selectedRole.id || "Choose Role Type"}
            onChange={(e) => handleRoleChange(e.target.value)}
          >
            <option disabled value="Choose Role Type">Choose Role Type</option>
            {/* <option value="Student">Student</option>
            <option value="Teacher">Teacher</option>
            <option value="Parent">Parent</option> */}
            {role.map((role) => <option key={role.id} value={role.id}>{role.name.charAt(0).toUpperCase() + role.name.slice(1)}</option>)}
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
          {/* <div className="permissions-list">
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
          </div> */}
          <div className="permissions-list">
            {permissionOptions?.map((permission) => (
              <label key={permission.id} className="checkbox-item">
                <input
                  type="checkbox"
                  className="checkbox-input"
                  checked={selectedPermissionIds.includes(permission.id)}
                  onChange={() => handlePermissionToggle(permission.id)}
                />
                <span className="checkbox-label">
                  {permission.name
                    .toLowerCase()
                    .split("_")
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={handleSave} disabled={loading}>{loading ? "Creating..." : "Create New Role"}</button>
        </div>
      </div>
    </div>
  );
};

export default EditRoleModal;
