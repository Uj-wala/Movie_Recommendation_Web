import React, { useEffect, useMemo, useRef, useState } from 'react';
import './UserTable.css';
import EditRoleModal from '../EditRoleModal/EditRoleModal';
import EditStatusModal from '../EditStatusModal/EditStatusModal';
import SuccessModal from '../../../../components/SuccessModal';
import type { User } from '../../types';
import { toggleUserActiveStatus } from '../../../../services/adminService';

type SortKey = 'name' | 'email' | 'role_name' | 'is_active' | 'actions';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

interface UserTableProps {
  users: User[];
  fetchUserDetails: () => Promise<void>;
  showAddRoleAction?: boolean;
  customEditLabel?: string;
  isRolesSection?: boolean;
}

const PAGE_SIZE_OPTIONS = [10, 25, 50];

const sortColumns: Array<{ key: SortKey; label: string }> = [
  { key: 'name', label: 'Full Name' },
  { key: 'email', label: 'Email ID/Phone' },
  { key: 'role_name', label: 'Role' },
  { key: 'is_active', label: 'Status' },
  { key: 'actions', label: 'Actions' },
];

const getStatusLabel = (user: User) => (user.is_active ? 'Active' : 'Blocked');

const getActionSortValue = (
  user: User,
  showAddRoleAction?: boolean,
  customEditLabel?: string
) => {
  const actions = user.is_active
    ? [showAddRoleAction ? 'Add Role' : '', customEditLabel || 'Edit', 'Disable']
    : [customEditLabel || 'Edit', 'Activate'];

  return actions.filter(Boolean).join(' ');
};

const getSortValue = (
  user: User,
  key: SortKey,
  showAddRoleAction?: boolean,
  customEditLabel?: string
) => {
  switch (key) {
    case 'name':
      return user.name || '';
    case 'email':
      // Email column shows Email ID or Phone, so consider both for sorting
      return user.email || user.phone_number || '';
    case 'role_name':
      return user.role_name || '';
    case 'is_active':
      return getStatusLabel(user);
    case 'actions':
      return getActionSortValue(user, showAddRoleAction, customEditLabel);
    default:
      return '';
  }
};

const UserTable: React.FC<UserTableProps> = ({ users, fetchUserDetails, showAddRoleAction, customEditLabel, isRolesSection }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedStatusUser, setSelectedStatusUser] = useState<User | null>(null);
  const isCompletingSuccessAction = useRef(false);

  const sortedUsers = useMemo(() => {
    if (!sortConfig) {
      return users;
    }

    return [...users].sort((firstUser, secondUser) => {
      const firstValue = getSortValue(firstUser, sortConfig.key, showAddRoleAction, customEditLabel);
      const secondValue = getSortValue(secondUser, sortConfig.key, showAddRoleAction, customEditLabel);
      const comparison = String(firstValue).localeCompare(String(secondValue), undefined, {
        numeric: true,
        sensitivity: 'base',
      });

      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [customEditLabel, showAddRoleAction, sortConfig, users]);

  const totalPages = Math.max(1, Math.ceil(sortedUsers.length / pageSize));
  const pageStartIndex = (currentPage - 1) * pageSize;
  const paginatedUsers = sortedUsers.slice(pageStartIndex, pageStartIndex + pageSize);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const handleSort = (key: SortKey) => {
    setSortConfig((currentSort) => ({
      key,
      direction:
        currentSort?.key === key && currentSort.direction === 'asc'
          ? 'desc'
          : 'asc',
    }));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(event.target.value));
    setCurrentPage(1);
  };

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

  const handleSaveSuccess = async () => {
    await fetchUserDetails();
    setIsModalOpen(false);
    setIsStatusModalOpen(false);
    isCompletingSuccessAction.current = false;
    setIsSuccessModalOpen(true);
  };

  const handleContinue = () => {
    if (isCompletingSuccessAction.current) return;
    isCompletingSuccessAction.current = true;
    setIsSuccessModalOpen(false);
    setSelectedUser(null);
    setSelectedStatusUser(null);
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
            {sortColumns.map((column) => {
              const isActiveSort = sortConfig?.key === column.key;
              const activeDirection = isActiveSort ? sortConfig?.direction : undefined;

              return (
                <th key={column.key} aria-sort={activeDirection ? (activeDirection === 'asc' ? 'ascending' : 'descending') : 'none'}>
                  <button
                    type="button"
                    className={`sort-header-button ${isActiveSort ? 'sort-active' : ''}`}
                    onClick={() => handleSort(column.key)}
                    aria-label={`Sort by ${column.label} ${activeDirection === 'asc' ? 'descending' : 'ascending'}`}
                  >
                    <span>{column.label}</span>
                    <span className="sort-icons" aria-hidden="true">
                      <span className={`sort-icon ${activeDirection === 'asc' ? 'sort-icon-active' : ''}`}>▲</span>
                      <span className={`sort-icon ${activeDirection === 'desc' ? 'sort-icon-active' : ''}`}>▼</span>
                    </span>
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
      </table>

      <div className="user-table-scroll">
        <table className="user-table user-table-body">
          <tbody>
            {paginatedUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email ? user.email : user.phone_number}</td>
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
            {paginatedUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="empty-users-cell">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="user-pagination" aria-label="User table pagination">
        <div className="pagination-details">
          <p className="pagination-summary">
            {sortedUsers.length > 0
              ? `Showing ${pageStartIndex + 1}-${Math.min(pageStartIndex + paginatedUsers.length, sortedUsers.length)} of ${sortedUsers.length}`
              : 'Showing 0 users'}
          </p>

          <label className="page-size-control">
            <span>Count:</span>
            <select
              className="page-size-select"
              value={pageSize}
              onChange={handlePageSizeChange}
              aria-label="Rows per page"
            >
              {PAGE_SIZE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="pagination-controls">
          <button
            type="button"
            className="pagination-button pagination-nav-button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              type="button"
              className={`pagination-button pagination-page-button ${page === currentPage ? 'pagination-current' : ''}`}
              onClick={() => handlePageChange(page)}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            className="pagination-button pagination-nav-button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
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
        onClose={handleContinue}
        onPrimaryAction={handleContinue}
        message="Your changes have been updated successfully."
        title="Congratulations!"
      />
    </div>
  );
};

export default UserTable;
