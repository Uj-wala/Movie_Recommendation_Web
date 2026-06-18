import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import SplitScreenLayout from '../components/SplitScreenLayout';
import Logo from '../components/Logo';
import { fetchDropdownData } from '../services/ListApiService';

const SelectRole = () => {
  // const roles = ['Student', 'Parent', 'Teacher'];
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
  const [selectedRole, setSelectedRole] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const fetchRoles = async () => {
    try {
      const data = await fetchDropdownData('/dropdowns/roles');
      const storedRoleId = localStorage.getItem('selected_role_id');
      const storedRoleName = localStorage.getItem('selected_role')?.trim().toLowerCase();
      const restoredRole =
        data.find((role: { id: string; name: string }) => role.id === storedRoleId) ||
        data.find(
          (role: { id: string; name: string }) =>
            role.name.trim().toLowerCase() === storedRoleName
        ) ||
        data[1] ||
        null;

      setRoles(data);
      setSelectedRole(restoredRole);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <SplitScreenLayout>
      {/* Back Button */}
      <div className="absolute top-6 left-6 sm:top-12 sm:left-12 lg:left-16 xl:left-24 z-10">
        <Link to="/register" className="flex items-center text-gray-700 hover:text-gray-900 font-semibold font-sans">
          <div className="flex items-center justify-center w-6 h-6 border border-gray-400 rounded-full mr-2">
            <ArrowLeft className="w-3.5 h-3.5 text-gray-700" strokeWidth={2} />
          </div>
          Back
        </Link>
      </div>

      <div className="w-full max-w-md flex flex-col items-center">
        {/* Logo */}
        <Logo />

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 font-sans self-start text-left w-full mt-8 sm:mt-0">Select Role</h1>
        <p className="text-gray-500 mb-8 text-xs sm:text-sm self-start text-left w-full">
          Select a Role to continue with your account
        </p>

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
                    const nextRole = roles.find(r => r.id === e.target.value) || roles[1] || null;
                    setSelectedRole(nextRole);

                    if (nextRole) {
                      localStorage.setItem('selected_role_id', nextRole.id);
                      localStorage.setItem('selected_role', nextRole.name.toLowerCase());
                    }
                  }}
                  className="w-4 h-4 text-brand-green border-gray-300 focus:ring-brand-green"
                />
                <span className="ml-3 text-sm font-semibold text-gray-900">{role.name}</span>
              </label>
            ))}
          </div>

          <Link
            to={`/confirm-role?role=${selectedRole?.name?.toLowerCase()}&role_id=${selectedRole?.id}`}
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
