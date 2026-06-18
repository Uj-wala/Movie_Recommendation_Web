
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import SplitScreenLayout from '../components/SplitScreenLayout';
import Logo from '../components/Logo';
import { confirmRole, getApiErrorMessage } from '../services/PhoneRegistrationService';

const ConfirmRole = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const storedRole = localStorage.getItem('selected_role');
  const storedRoleId = localStorage.getItem('selected_role_id');
  const role = searchParams.get('role') || storedRole || 'Student';
  const roleId = searchParams.get('role_id') || storedRoleId;
  // Capitalize the role
  const displayRole = role.charAt(0).toUpperCase() + role.slice(1);

  useEffect(() => {
    if (roleId) {
      localStorage.setItem('selected_role_id', roleId);
      localStorage.setItem('selected_role', role.toLowerCase());
    }
  }, [role, roleId]);

  const getNextRoute = () => {
    return `/verify-account?role=${role.toLowerCase()}&role_id=${roleId}`;
  };

  const handleConfirmDetails = async () => {
    try {
      setError('');
      setLoading(true);

      const selectedRole = role.toLowerCase();
      const userId = localStorage.getItem('user_id');

      if (!userId) {
        setError('User session not found. Please register again.');
        return;
      }

      if (!roleId) {
        setError('Role ID not found. Please select your role again.');
        return;
      }

      await confirmRole({
        user_id: userId,
        role_id: roleId,
      });

      localStorage.setItem('selected_role', selectedRole);
      localStorage.setItem('selected_role_id', roleId);
      navigate(getNextRoute());
    } catch (error: any) {
      setError(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SplitScreenLayout fitViewport>
      {/* Back Button */}
      <div className="absolute top-6 left-6 sm:top-12 sm:left-12 lg:left-16 xl:left-24 z-10">
        <Link
          to="/select-role"
          onClick={() => {
            if (roleId) {
              localStorage.setItem('selected_role_id', roleId);
              localStorage.setItem('selected_role', role.toLowerCase());
            }
          }}
          className="flex items-center text-gray-700 hover:text-gray-900 font-semibold font-sans"
        >
          <div className="flex items-center justify-center w-6 h-6 border border-gray-400 rounded-full mr-2">
            <ArrowLeft className="w-3.5 h-3.5 text-gray-700" strokeWidth={2} />
          </div>
          Back
        </Link>
      </div>

      <div className="w-full max-w-md pt-4 sm:pt-8 pb-12">
        {/* Logo */}
        <div className="flex justify-center w-full mb-8">
          <Logo />
        </div>

        {/* Card */}
        <div className="w-full bg-white rounded-2xl shadow-xl shadow-green-50/50 p-6 sm:p-8 pt-8 sm:pt-10 border border-gray-50">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 font-sans">Confirm your Role</h1>

          <div className="mb-10">
            <label className="block text-xs font-bold text-gray-900 mb-2">
              Confirm your Role
            </label>
            <div className="bg-[#defaeb] border border-[#a3e9c4] rounded-md px-4 py-3 text-sm font-semibold text-gray-800">
              {displayRole}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Are you sure?</h2>
            <p className="text-sm text-gray-500">
              This will Determine your Dashboard access
            </p>
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/select-role"
              onClick={() => {
                if (roleId) {
                  localStorage.setItem('selected_role_id', roleId);
                  localStorage.setItem('selected_role', role.toLowerCase());
                }
              }}
              className="flex-1 text-center bg-white border border-brand-green text-brand-green hover:bg-green-50 font-bold py-3 px-4 rounded-md transition-colors"
            >
              Change Role
            </Link>
            <button
              type="button"
              onClick={handleConfirmDetails}
              disabled={loading}
              className="flex-1 text-center bg-brand-green hover:bg-brand-green-hover text-white font-bold py-3 px-4 rounded-md transition-colors"
            >
              {loading ? 'Please wait...' : 'Confirm Details'}
            </button>
          </div>
        </div>
      </div>
    </SplitScreenLayout>
  );
};

export default ConfirmRole;
