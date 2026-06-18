import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SplitScreenLayout from '../components/SplitScreenLayout';
import Logo from '../components/Logo';

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

const SelectRole = () => {
  const location = useLocation();
  const roles = sortRolesByDisplayOrder(enumRoles);
  const successMessage =
    typeof location.state?.successMessage === 'string'
      ? location.state.successMessage
      : '';
  const [selectedRole, setSelectedRole] = useState<{
    id: string;
    name: string;
  } | null>(null);

  return (
    <SplitScreenLayout fitViewport>

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

                    if (nextRole) {
                      localStorage.setItem('selected_role_id', nextRole.id);
                      localStorage.setItem('selected_role', nextRole.name.toLowerCase());
                    }
                  }}
                  className="w-4 h-4 text-brand-green border-gray-300 focus:ring-brand-green"
                />
                <span className="ml-3 text-sm font-semibold text-gray-900">{formatRoleName(role.name)}</span>
              </label>
            ))}
          </div>

          <Link
            to={selectedRole ? `/confirm-role?role=${selectedRole.name.toLowerCase()}&role_id=${selectedRole.id}` : "#"}
            onClick={() => {
              if (selectedRole) {
                localStorage.setItem('selected_role_id', selectedRole.id);
                localStorage.setItem('selected_role', selectedRole.name.toLowerCase());
              }
            }}
            className="w-full block text-center bg-brand-green hover:bg-brand-green-hover text-white font-bold py-3 px-4 rounded-md transition-colors"
          >
            Create Account
          </Link>
        </form>
      </div>
    </SplitScreenLayout>
  );
};

export default SelectRole;
