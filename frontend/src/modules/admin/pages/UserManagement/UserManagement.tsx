import React, { useEffect, useState } from 'react';
import './UserManagement.css';
import { Search, Plus } from 'lucide-react';

import UserTable from '../../components/UserTable/UserTable';
import EditRoleModal from '../../components/EditRoleModal/EditRoleModal';
import SuccessModal from '../../../../components/SuccessModal';
import type { User, UserOrRole } from '../../types';
import api from '../../../../api/axios';
import { fetchDropdownData } from '../../../../services/ListApiService';

interface UserManagementProps {
  setActiveTab?: (tab: string) => void;
}

interface RoleOption {
  id: string;
  name: string;
}

interface FiltersState {
  selectedRoleIds: string[];
  active: boolean;
  deactive: boolean;
}

const UserManagement: React.FC<UserManagementProps> = ({ setActiveTab }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<RoleOption[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [filters, setFilters] = useState<FiltersState>({
    selectedRoleIds: [],
    active: false,
    deactive: false,
  });

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successModalVariant, setSuccessModalVariant] = useState<'default' | 'memberAdded'>('default');
  const [lastAddedMember, setLastAddedMember] = useState<UserOrRole | null>(null);

  const fetchRoles = async () => {
    try {
      const res = await fetchDropdownData('/dropdowns/roles');
      setRoles(res || []);
    } catch (error) {
      console.log('Error fetching roles:', error);
    }
  };

  const fetchUserDetails = async (
    searchValue: string = searchQuery,
    currentFilters: FiltersState = filters
  ) => {
    try {

      const params: Record<string, any> = {};

      if (searchValue.trim()) {
        params.search = searchValue.trim();
      }

      if (currentFilters.selectedRoleIds.length > 0) {
        params.role_ids = currentFilters.selectedRoleIds;
      }

      if (currentFilters.active && !currentFilters.deactive) {
        params.is_active = true;
      } else if (!currentFilters.active && currentFilters.deactive) {
        params.is_active = false;
      }

      const response = await api.get('/admin/users', { params });
      setUsers(response.data || []);
    } catch (error) {
      console.log('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchUserDetails(searchQuery, filters);
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchQuery, filters]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const toggleRoleFilter = (roleId: string) => {
    setFilters((prev) => {
      const alreadySelected = prev.selectedRoleIds.includes(roleId);

      return {
        ...prev,
        selectedRoleIds: alreadySelected
          ? prev.selectedRoleIds.filter((id) => id !== roleId)
          : [...prev.selectedRoleIds, roleId],
      };
    });
  };

  const toggleStatusFilter = (key: 'active' | 'deactive') => {
    setFilters((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleAddRoleClick = () => {
    setIsRoleModalOpen(true);
  };

  const handleSaveRole = (userData?: UserOrRole) => {
    const roleName = userData?.role_name
      ? userData.role_name.charAt(0).toUpperCase() + userData.role_name.slice(1)
      : '';

    fetchUserDetails();

    const isTeacherRole = Boolean(userData) && roleName.toLowerCase() === 'teacher';

    setSuccessModalVariant(isTeacherRole ? 'memberAdded' : 'default');
    setLastAddedMember(isTeacherRole && userData ? { ...userData } : null);

    setIsRoleModalOpen(false);
    setIsSuccessModalOpen(true);

    if (setActiveTab) {
      setActiveTab('users');
    }
  };

  const handleAddAnotherMember = () => {
    setIsSuccessModalOpen(false);
    setIsRoleModalOpen(true);
  };

  return (
    <div className="user-management-page">
      <div className="page-header">
        <h1 className="page-title">User Management</h1>
        <p className="page-subtitle">Manage and view all users</p>
      </div>

      <div className="search-filter-section">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={24} />
          <input
            type="text"
            className="search-input"
            placeholder="Search by user name, user ID..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <div className="filter-wrapper">
          <button
            className="filter-button disabled"
            disabled
            aria-disabled="true"
            type="button"
            onClick={() => setIsFilterOpen((prev) => !prev)}
          >
            <svg
              className="filter-icon"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M4.25 5.61C6.27 8.2 10 13 10 13V19C10 19.55 10.45 20 11 20H13C13.55 20 14 19.55 14 19V13C14 13 17.72 8.2 19.74 5.61C20.25 4.95 19.78 4 18.95 4H5.04C4.21 4 3.74 4.95 4.25 5.61Z"
                fill="currentColor"
              />
            </svg>
            <span className="filter-text">Filters</span>
          </button>

          {isFilterOpen && (
            <div className="filter-dropdown">
              <h4 className="filter-dropdown-title">Roles</h4>

              {roles.length > 0 ? (
                roles.map((role) => (
                  <label className="filter-checkbox-item" key={role.id}>
                    <input
                      type="checkbox"
                      className="filter-checkbox-input"
                      checked={filters.selectedRoleIds.includes(role.id)}
                      onChange={() => toggleRoleFilter(role.id)}
                    />
                    <span className="filter-checkbox-label">{role.name}</span>
                  </label>
                ))
              ) : (
                <p className="filter-empty-text">No roles available</p>
              )}

              <div className="filter-section-divider"></div>

              <h4 className="filter-dropdown-title">Status</h4>

              <label className="filter-checkbox-item">
                <input
                  type="checkbox"
                  className="filter-checkbox-input"
                  checked={filters.active}
                  onChange={() => toggleStatusFilter('active')}
                />
                <span className="filter-checkbox-label">Active</span>
              </label>

              <label className="filter-checkbox-item">
                <input
                  type="checkbox"
                  className="filter-checkbox-input"
                  checked={filters.deactive}
                  onChange={() => toggleStatusFilter('deactive')}
                />
                <span className="filter-checkbox-label">Deactive</span>
              </label>
            </div>
          )}
        </div>
      </div>

      <div className="table-section">
        <div className="table-header-row">
          <h2 className="table-title">User Management</h2>
          <button className="add-role-btn" onClick={handleAddRoleClick}>
            <Plus size={16} />
            <span>Add Role</span>
          </button>
        </div>

        <UserTable
          users={users}
          setUsers={setUsers}
          fetchUserDetails={fetchUserDetails}
        />
      </div>

      <EditRoleModal
        isOpen={isRoleModalOpen}
        onClose={() => {
          setIsRoleModalOpen(false);
          if (setActiveTab) {
            setActiveTab('users');
          }
        }}
        onSave={handleSaveRole}
        user={null}
        existingEmails={users.map((user) => user.email)}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        message="A new role has been created successfully."
        title="Congratulations!"
        buttonText="Continue"
        variant={successModalVariant}
        member={lastAddedMember}
        onAddAnother={handleAddAnotherMember}
      />
    </div>
  );
};

export default UserManagement;