import React, { useState } from 'react';
import './UserManagement.css';
import { Search, Plus } from 'lucide-react';
import UserTable from '../../components/UserTable/UserTable';
import EditRoleModal from '../../components/EditRoleModal/EditRoleModal';
import SuccessModal from '../../components/SuccessModal/SuccessModal';
import type { User, UserOrRole } from '../../types';

const INITIAL_USERS = [
  { id: 1, name: 'John Richardson', email: 'John@gmail.com', role: 'Student', status: 'Active' },
  { id: 2, name: 'Sarah Elizabeth', email: 'sarah@gmail.com', role: 'Teacher', status: 'Active' },
  { id: 3, name: 'David Jack Sparrow', email: 'David@emaiil.com', role: 'Parent', status: 'Blocked' },
  { id: 4, name: 'John Richardson', email: 'John@gmail.com', role: 'Student', status: 'Active' },
  { id: 5, name: 'Sarah Elizabeth', email: 'sarah@gmail.com', role: 'Teacher', status: 'Active' },
  { id: 6, name: 'David Jack Sparrow', email: 'David@emaiil.com', role: 'Parent', status: 'Blocked' },
  { id: 7, name: 'John Richardson', email: 'John@gmail.com', role: 'Student', status: 'Active' },
];

interface UserManagementProps {
  setActiveTab?: (tab: string) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ setActiveTab }) => {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const isFilterOpen = false;
  const [filters, setFilters] = useState({
    student: false,
    teacher: false,
    parent: false,
    active: false,
    deactive: false,
  });

  const toggleFilter = (key: keyof typeof filters) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAddRoleClick = () => {
    setIsRoleModalOpen(true);
  };

  const handleSaveRole = (userData?: UserOrRole) => {
    if (userData && userData.name) {
      setUsers([...users, { 
        id: Date.now(), 
        name: userData.name, 
        email: userData.email || '', 
        role: userData.role ? userData.role.charAt(0).toUpperCase() + userData.role.slice(1) : '', 
        status: 'Active' 
      }]);
    }
    setIsRoleModalOpen(false);
    setIsSuccessModalOpen(true);
    if (setActiveTab) setActiveTab('users');
  };

  const getFilteredAndSortedUsers = () => {
    let result = [...users];

    // Apply role filters
    const roleFilters: string[] = [];
    if (filters.student) roleFilters.push('student');
    if (filters.teacher) roleFilters.push('teacher');
    if (filters.parent) roleFilters.push('parent');

    if (roleFilters.length > 0) {
      result = result.filter(user => roleFilters.includes(user.role.toLowerCase()));
    }

    // Apply status filters
    const statusFilters: string[] = [];
    if (filters.active) statusFilters.push('active');
    if (filters.deactive) statusFilters.push('blocked'); // Blocked corresponds to Deactivate visually

    if (statusFilters.length > 0) {
      result = result.filter(user => statusFilters.includes(user.status.toLowerCase()));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(user => 
        user.name.toLowerCase().includes(query) || 
        user.id.toString().includes(query)
      );

      result.sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        
        const aStartsWith = aName.startsWith(query);
        const bStartsWith = bName.startsWith(query);

        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;

        return aName.localeCompare(bName);
      });
    }

    return result;
  };

  const displayedUsers = getFilteredAndSortedUsers();

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
            placeholder="Search by user name, user ID.." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-wrapper">
          <button
            className="filter-button disabled"
            disabled
            aria-disabled="true"
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
              <label className="filter-checkbox-item">
                <input type="checkbox" className="filter-checkbox-input" checked={filters.student} onChange={() => toggleFilter('student')} />
                <span className="filter-checkbox-label">Student</span>
              </label>
              <label className="filter-checkbox-item">
                <input type="checkbox" className="filter-checkbox-input" checked={filters.teacher} onChange={() => toggleFilter('teacher')} />
                <span className="filter-checkbox-label">Teacher</span>
              </label>
              <label className="filter-checkbox-item">
                <input type="checkbox" className="filter-checkbox-input" checked={filters.parent} onChange={() => toggleFilter('parent')} />
                <span className="filter-checkbox-label">Parent</span>
              </label>

              <div className="filter-section-divider"></div>

              <h4 className="filter-dropdown-title">Status</h4>
              <label className="filter-checkbox-item">
                <input type="checkbox" className="filter-checkbox-input" checked={filters.active} onChange={() => toggleFilter('active')} />
                <span className="filter-checkbox-label">Active</span>
              </label>
              <label className="filter-checkbox-item">
                <input type="checkbox" className="filter-checkbox-input" checked={filters.deactive} onChange={() => toggleFilter('deactive')} />
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
        <UserTable users={displayedUsers} setUsers={setUsers} />
      </div>

      <EditRoleModal 
        isOpen={isRoleModalOpen} 
        onClose={() => {
          setIsRoleModalOpen(false);
          if (setActiveTab) setActiveTab('users');
        }} 
        onSave={handleSaveRole}
        user={null}
        existingEmails={users.map((user) => user.email)}
      />
      <SuccessModal 
        isOpen={isSuccessModalOpen} 
        onClose={() => setIsSuccessModalOpen(false)} 
        message="A new role has been created successfully."
      />
    </div>
  );
};

export default UserManagement;
