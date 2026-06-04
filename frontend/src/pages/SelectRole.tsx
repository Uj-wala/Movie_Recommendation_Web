import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import SplitScreenLayout from '../components/SplitScreenLayout';
import Logo from '../components/Logo';

const SelectRole = () => {
  const [selectedRole, setSelectedRole] = useState('Student');
  const roles = ['Student', 'Parent', 'Teacher'];

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
              <label key={role} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value={role}
                  checked={selectedRole === role}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-4 h-4 text-brand-green border-gray-300 focus:ring-brand-green"
                />
                <span className="ml-3 text-sm font-semibold text-gray-900">{role}</span>
              </label>
            ))}
          </div>

          <Link
            to={`/confirm-role?role=${selectedRole.toLowerCase()}`}
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
