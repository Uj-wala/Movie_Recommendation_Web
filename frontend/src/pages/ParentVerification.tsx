import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SplitScreenLayout from '../components/SplitScreenLayout';
import Logo from '../components/Logo';
import {
  getApiErrorMessage,
  saveParentVerification,
} from '../services/PhoneRegistrationService';

const ParentVerification = () => {
  const navigate = useNavigate();

  const [studentReferenceId, setStudentReferenceId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedStudentReferenceId = studentReferenceId.trim();

    if (!trimmedStudentReferenceId) {
      setError('Student ID is required.');
      return;
    }

    try {
      setLoading(true);

      const userId = localStorage.getItem('user_id');

      if (!userId) {
        setError('User session not found. Please register again.');
        return;
      }

      const response = await saveParentVerification({
        user_id: userId,
        student_reference_id: trimmedStudentReferenceId,
      });

      navigate('/registration-success', {
        state: {
          title: 'Registration Successful!!!',
          message: `Your parent verification has been submitted successfully.${
            response?.parent_id
              ? `\nParent ID: ${response.parent_id}`
              : ''
          }`,
          buttonText: 'Go to Login',
          redirectUrl: '/login',
        },
      });
    } catch (err: any) {
      console.error('Parent verification failed:', err);

      setError(
        getApiErrorMessage(err) ||
          'Submission failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SplitScreenLayout fitViewport>
      <div className="w-full max-w-md pt-4 sm:pt-8 pb-12">
        <div className="flex justify-center w-full mb-8">
          <Logo />
        </div>

        <div className="w-full bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8 border border-gray-50">
          <h1 className="text-[24px] sm:text-[28px] font-bold text-[#111111] mb-8 font-sans">
            Parent Verification
          </h1>

          {error && (
            <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form className="w-full" onSubmit={handleSubmit}>
            <div className="mb-8">
              <label className="block text-[14px] font-bold text-[#1F2937] mb-3">
                Student ID
              </label>

              <input
                type="text"
                placeholder="Enter Student ID"
                value={studentReferenceId}
                onChange={(e) =>
                  setStudentReferenceId(e.target.value)
                }
                required
                className="block w-full px-4 py-3.5 border border-gray-200 rounded-lg text-[14px] text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green shadow-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#248943] hover:bg-[#1d6e35] text-white font-bold py-3 px-10 rounded-lg transition-colors text-[15px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : 'Continue'}
            </button>
          </form>
        </div>
      </div>
    </SplitScreenLayout>
  );
};

export default ParentVerification;