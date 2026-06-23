import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import sidebarImage from '../assets/sidebar_image.jpeg';

type RoleOption = { id: string; name: string };

const enumRoles: RoleOption[] = [
  { id: 'student', name: 'student' },
  { id: 'parent', name: 'parent' },
  { id: 'teacher', name: 'teacher' },
];

const roleDisplayOrder: Record<string, number> = {
  student: 0,
  parent: 1,
  teacher: 2,
};

const getRoleKey = (roleName: string) => roleName.trim().toLowerCase();

const formatRoleName = (roleName: string) => {
  const normalizedRole = getRoleKey(roleName);

  return normalizedRole
    ? normalizedRole.charAt(0).toUpperCase() + normalizedRole.slice(1)
    : roleName;
};

const sortRolesByDisplayOrder = (roles: RoleOption[]) =>
  [...roles].sort((firstRole, secondRole) => {
    const firstOrder =
      roleDisplayOrder[getRoleKey(firstRole.name)] ?? Number.MAX_SAFE_INTEGER;
    const secondOrder =
      roleDisplayOrder[getRoleKey(secondRole.name)] ?? Number.MAX_SAFE_INTEGER;

    return firstOrder - secondOrder;
  });

const getStoredRole = (roles: RoleOption[]) => {
  const storedRoleId = sessionStorage.getItem('selected_role_id');
  const storedRoleName = sessionStorage.getItem('selected_role');

  return (
    roles.find(role => role.id === storedRoleId) ||
    roles.find(role => getRoleKey(role.name) === getRoleKey(storedRoleName || '')) ||
    null
  );
};

const SelectRole = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const roles = sortRolesByDisplayOrder(enumRoles);
  const successMessage =
    typeof location.state?.successMessage === 'string'
      ? location.state.successMessage
      : '';
  const [selectedRole, setSelectedRole] = useState<{
    id: string;
    name: string;
  } | null>(() => getStoredRole(roles));
  const [roleError, setRoleError] = useState('');

  const storeSelectedRole = (role: RoleOption) => {
    sessionStorage.setItem('selected_role_id', role.id);
    sessionStorage.setItem('selected_role', role.name.toLowerCase());
    localStorage.setItem('selected_role_id', role.id);
    localStorage.setItem('selected_role', role.name.toLowerCase());
  };

  const handleContinue = () => {
    if (!selectedRole) {
      setRoleError('Please select a role to continue.');
      return;
    }

    storeSelectedRole(selectedRole);
    navigate(
      `/confirm-role?role=${selectedRole.name.toLowerCase()}&role_id=${selectedRole.id}`
    );
  };

  return (
    <div className="h-screen w-screen overflow-auto bg-white">
      <div className="proportional-layout">
        <div className="proportional-content flex flex-col justify-center items-center px-6 py-12 sm:px-16 lg:px-24 xl:px-32 relative">
          <div className="w-full max-w-md flex flex-col items-center">
            {/* Logo */}
            <Logo />

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 font-sans self-start text-left w-full mt-8 sm:mt-0">Select Role</h1>
            <p className="text-gray-500 mb-8 text-xs sm:text-sm self-start text-left w-full">
              Select a Role to continue with your account
            </p>

            {successMessage && (
              <div className="w-full mb-6 rounded-md border border-green-200 bg-green-50 px-4 py-3">
                <p className="text-sm font-medium text-green-700">{successMessage}</p>
              </div>
            )}

            <form className="w-full text-left" onSubmit={(e) => e.preventDefault()}>
              <label className="block text-sm font-bold text-[#1a123f] mb-4">
                Choose Your Role
              </label>

              <div className="flex flex-col gap-4 mb-8">
                {roles.map(role => (
                  <label key={role.id} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value={role.id}
                      checked={selectedRole?.id === role.id}
                      onChange={(e) => {
                        const nextRole = roles.find(r => r.id === e.target.value) || null;
                        setSelectedRole(nextRole);
                        setRoleError('');

                        if (nextRole) {
                          storeSelectedRole(nextRole);
                        }
                      }}
                      className="w-4 h-4 text-brand-green border-gray-300 focus:ring-brand-green"
                    />
                    <span className="ml-3 text-sm font-semibold text-gray-900">{formatRoleName(role.name)}</span>
                  </label>
                ))}
              </div>

              {roleError && (
                <p className="text-red-500 text-sm mb-4">{roleError}</p>
              )}

              <button
                type="button"
                onClick={handleContinue}
                className="w-full block text-center bg-brand-green hover:bg-brand-green-hover text-white font-bold py-3 px-4 rounded-md transition-colors"
              >
                Create Account
              </button>
            </form>
          </div>
        </div>

        <div className="proportional-sidebar min-h-screen flex items-center justify-center overflow-hidden">
          <img
            src={sidebarImage}
            alt="Learning Illustration"
            className="proportional-sidebar-image"
          />
        </div>
      </div>
    </div>
  );
};

export default SelectRole;
