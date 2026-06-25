import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { createNewPassword } from '../services/authService';
import { Lock, EyeOff, Eye } from 'lucide-react';
import SplitScreenLayout from '../components/SplitScreenLayout';
import PasswordChangedModal from '../components/PasswordChangedModal';
import Logo from '../components/Logo';
import {
  PASSWORD_COMPLEXITY_ERROR,
  PASSWORD_LENGTH_ERROR,
  isValidPasswordComplexity,
  isValidPasswordLength,
} from '../utils/validation';

const PASSWORD_MAX_LENGTH = 12;

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  const {
    email,
    phone_number
  } = location.state || {};

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");
  const [passwordError, setPasswordError] =
    useState("");
  const [confirmPasswordError, setConfirmPasswordError] =
    useState("");

  const handlePasswordChange = (value: string) => {
    const nextPassword = value.slice(0, PASSWORD_MAX_LENGTH);

    if (value.length > PASSWORD_MAX_LENGTH) {
      setPasswordError(PASSWORD_LENGTH_ERROR);
    } else if (nextPassword && !isValidPasswordLength(nextPassword)) {
      setPasswordError(PASSWORD_LENGTH_ERROR);
    } else if (nextPassword && !isValidPasswordComplexity(nextPassword)) {
      setPasswordError(PASSWORD_COMPLEXITY_ERROR);
    } else {
      setPasswordError("");
    }

    setPassword(nextPassword);
  };

  const handleConfirmPasswordChange = (value: string) => {
    const nextConfirmPassword = value.slice(0, PASSWORD_MAX_LENGTH);

    if (value.length > PASSWORD_MAX_LENGTH) {
      setConfirmPasswordError("Confirm Password must be 8 to 12 characters");
    } else if (nextConfirmPassword && !isValidPasswordLength(nextConfirmPassword)) {
      setConfirmPasswordError("Confirm Password must be 8 to 12 characters");
    } else {
      setConfirmPasswordError("");
    }

    setConfirmPassword(nextConfirmPassword);
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setError("");
    setPasswordError("");
    setConfirmPasswordError("");

    if (!isValidPasswordLength(password)) {
      setPasswordError(PASSWORD_LENGTH_ERROR);
      return;
    }

    if (!isValidPasswordComplexity(password)) {
      setPasswordError(PASSWORD_COMPLEXITY_ERROR);
      return;
    }

    if (!isValidPasswordLength(confirmPassword)) {
      setConfirmPasswordError("Confirm Password must be 8 to 12 characters");
      return;
    }

    if (password !== confirmPassword) {

      setError(
        "Passwords do not match"
      );

      return;
    }

    try {

      setLoading(true);

      const email_or_phone =
        email || phone_number;

      await createNewPassword(
        email_or_phone,
        password,
        confirmPassword
      );

      setIsModalOpen(true);

    } catch (error: any) {

      setError(
        error?.response?.data?.detail ||
        "Failed to reset password"
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <>
      <SplitScreenLayout>
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
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  className={`block w-full pl-11 pr-10 py-3.5 border bg-[#FCFCFD] rounded-lg text-[15px] placeholder-gray-400 focus:outline-none focus:ring-1 tracking-[0.25em] ${
                    passwordError
                      ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
                      : 'border-gray-100 focus:ring-brand-green focus:border-brand-green'
                  }`}
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
            {passwordError ? (
              <p id="reset-password-error" className="text-red-500 text-sm mb-5">
                {passwordError}
              </p>
            ) : (
              <p className="text-[11px] text-gray-500 mb-5">
                Must be 8 to 12 characters with a number and special character.
              </p>
            )}

            <div className="mb-2">
              <label className="block text-[13px] font-semibold text-[#1F2937] mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" strokeWidth={2} />
                </div>
                <input
                  type={
                    showConfirmPassword
                      ? 'text'
                      : 'password'
                  }
                  value={confirmPassword}
                  onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                  className={`block w-full pl-11 pr-10 py-3.5 border bg-[#FCFCFD] rounded-lg text-[15px] placeholder-gray-400 focus:outline-none focus:ring-1 tracking-[0.25em] ${
                    confirmPasswordError
                      ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
                      : 'border-gray-100 focus:ring-brand-green focus:border-brand-green'
                  }`}
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
            {confirmPasswordError ? (
              <p id="reset-confirm-password-error" className="text-red-500 text-sm mb-8">
                {confirmPasswordError}
              </p>
            ) : (
              <p className="text-[11px] text-gray-500 mb-8">
                Both Passwords must Match.
              </p>
            )}
            {error && (
              <div className="mb-4">
                <p className="text-red-500 text-sm">
                  {error}
                </p>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-green hover:bg-brand-green-hover text-white font-bold py-3.5 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {
                loading
                  ? "Updating..."
                  : "Reset Password"
              }
            </button>
          </form>
        </div>
      </SplitScreenLayout>

      <PasswordChangedModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default ResetPassword;
