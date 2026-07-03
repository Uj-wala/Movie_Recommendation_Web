import React, { useState } from 'react';
import SplitScreenLayout from '../components/SplitScreenLayout';
import Logo from '../components/Logo';
import SuccessModal from '../components/SuccessModal';
import { saveParentVerification } from "../services/PhoneRegistrationService";

const ParentVerification = () => {
  const [studentRegistrationNumber, setStudentRegistrationNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [parentId, setParentId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!studentRegistrationNumber.trim()) {
      setError('Please fill all required fields.');
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
        student_registration_number: studentRegistrationNumber,
      });

      setParentId(response.parent_id);
      setIsModalOpen(true);

    } catch (err: any) {
      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        if (typeof detail === 'string') {
          setError(detail);
        } else if (Array.isArray(detail)) {
          setError(detail.map((e: any) => e.msg).join(', '));
        } else {
          setError('Submission failed. Please try again.');
        }
      } else {
        setError('Submission failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SplitScreenLayout fitViewport>
        <div className="w-full max-w-md pt-4 sm:pt-8 pb-12">
          <div className="flex justify-center w-full mb-8">
            <Logo />
          </div>

          <div className="w-full bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8 border border-gray-50">

            <h1 className="text-[24px] sm:text-[28px] font-bold text-[#111111] mb-8 font-sans">Parent Verification</h1>

            {/* ✅ Error message */}
            {error && (
              <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <form className="w-full" onSubmit={handleSubmit} noValidate>

              {/* Student ID */}
              <div className="mb-8">
                <label className="block text-[14px] font-bold text-[#1F2937] mb-3">
                  Student ID
                </label>
                <input
                  type="text"
                  className="block w-full px-4 py-3.5 border border-gray-200 rounded-lg text-[14px] text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green shadow-sm"
                  placeholder="Enter Student Registration Number"
                  value={studentRegistrationNumber}
                  onChange={(e) => setStudentRegistrationNumber(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-[#248943] hover:bg-[#1d6e35] text-white font-bold py-3 px-10 rounded-lg transition-colors text-[15px] disabled:opacity-50"
              >
                {loading ? 'Please wait...' : 'Continue'}
              </button>

            </form>
          </div>
        </div>
      </SplitScreenLayout>

      <SuccessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Registration Successful!!!"
        message={`Your parent verification has been submitted successfully.${parentId ? `\nParent ID: ${parentId}` : ''}`}
        role={localStorage.getItem("selected_role") || ""}
        registrationNumber={localStorage.getItem("registration_number") || ""}
        buttonText="Go to Login"
        redirectUrl="/login"
      />

      
    </>
  );
};

export default ParentVerification;
