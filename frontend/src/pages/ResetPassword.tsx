import React, { useState } from 'react';
import { ArrowLeft, Lock, EyeOff, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import SplitScreenLayout from '../components/SplitScreenLayout';
import PasswordChangedModal from '../components/PasswordChangedModal';
import Logo from '../components/Logo';

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  return (
    <>
      <SplitScreenLayout>
        {/* Back Button */}
        <div className="absolute top-12 left-12 lg:left-16 xl:left-24 z-10">
          <Link to="/verify-otp" className="flex items-center text-gray-700 hover:text-gray-900 font-semibold font-sans">
            <div className="flex items-center justify-center w-6 h-6 border border-gray-400 rounded-full mr-2">
              <ArrowLeft className="w-3.5 h-3.5 text-gray-700" strokeWidth={2} />
            </div>
            Back
          </Link>
        </div>

        <div className="w-full max-w-[420px] flex flex-col items-center">
          {/* Logo */}
          <Logo />

          <h1 className="text-[32px] font-bold text-gray-900 mb-2 font-sans self-start text-left w-full mt-8">Create New Password</h1>
          <p className="text-gray-500 mb-8 text-[15px] self-start text-left w-full">
            Your New Password must be different from the<br />previously used passwords.
          </p>

          <form className="w-full text-left" onSubmit={handleSubmit}>
            <div className="mb-2">
              <label className="block text-[13px] font-semibold text-[#1F2937] mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" strokeWidth={2} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="block w-full pl-11 pr-10 py-3.5 border border-gray-100 bg-[#FCFCFD] rounded-lg text-[15px] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green tracking-[0.25em]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <Eye className="w-[18px] h-[18px]" strokeWidth={2.5} />
                  ) : (
                    <EyeOff className="w-[18px] h-[18px]" strokeWidth={2.5} />
                  )}
                </button>
              </div>
            </div>
            <p className="text-[11px] text-gray-500 mb-5">Must be at least 8-12 characters.</p>

            <div className="mb-2">
              <label className="block text-[13px] font-semibold text-[#1F2937] mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" strokeWidth={2} />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="block w-full pl-11 pr-10 py-3.5 border border-gray-100 bg-[#FCFCFD] rounded-lg text-[15px] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green tracking-[0.25em]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <Eye className="w-[18px] h-[18px]" strokeWidth={2.5} />
                  ) : (
                    <EyeOff className="w-[18px] h-[18px]" strokeWidth={2.5} />
                  )}
                </button>
              </div>
            </div>
            <p className="text-[11px] text-gray-500 mb-8">Both Passwords must Match.</p>

            <button
              type="submit"
              className="w-full bg-brand-green hover:bg-brand-green-hover text-white font-bold py-3.5 px-4 rounded-lg transition-colors"
            >
              Reset Password
            </button>
          </form>
        </div>
      </SplitScreenLayout>

      <PasswordChangedModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default ResetPassword;
