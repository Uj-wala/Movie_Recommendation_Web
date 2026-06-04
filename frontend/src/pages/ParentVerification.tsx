import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import SplitScreenLayout from '../components/SplitScreenLayout';
import Logo from '../components/Logo';

const ParentVerification = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/teacher-verification');
  };

  return (
    <>
      <SplitScreenLayout>
        {/* Back Button */}
        <div className="absolute top-6 left-6 sm:top-12 sm:left-12 lg:left-16 xl:left-24 z-10">
          <Link to="/confirm-role" className="flex items-center text-gray-700 hover:text-gray-900 font-semibold font-sans">
            <div className="flex items-center justify-center w-6 h-6 border border-gray-400 rounded-full mr-2">
              <ArrowLeft className="w-3.5 h-3.5 text-gray-700" strokeWidth={2} />
            </div>
            Back
          </Link>
        </div>

        <div className="w-full max-w-md pt-4 sm:pt-8 pb-12">
          <div className="flex justify-center w-full mb-8">
            <Logo />
          </div>

          <div className="w-full bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8 border border-gray-50">

            <h1 className="text-[24px] sm:text-[28px] font-bold text-[#111111] mb-8 font-sans">Parent Verification</h1>

            <form className="w-full" onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-[14px] font-bold text-[#1F2937] mb-3">
                  Enter Child Name:
                </label>
                <input
                  type="text"
                  className="block w-full px-4 py-3.5 border border-gray-200 rounded-lg text-[14px] text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green shadow-sm"
                  placeholder="John Cena"
                  onInput={(e) => {
                    e.currentTarget.value = e.currentTarget.value.replace(/[^a-zA-Z\s]/g, '');
                  }}
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-[14px] font-bold text-[#1F2937] mb-3">
                  Child Grade
                </label>
                <input
                  type="text"
                  className="block w-full px-4 py-3.5 border border-gray-200 rounded-lg text-[14px] text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green shadow-sm"
                  placeholder="Plus 2"
                  required
                />
              </div>

              <div className="mb-8">
                <label className="block text-[14px] font-bold text-[#1F2937] mb-3">
                  Student ID
                </label>
                <input
                  type="text"
                  className="block w-full px-4 py-3.5 border border-gray-200 rounded-lg text-[14px] text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green shadow-sm"
                  placeholder="AI245836AP"
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-[#248943] hover:bg-[#1d6e35] text-white font-bold py-3 px-10 rounded-lg transition-colors text-[15px]"
              >
                Continue
              </button>
            </form>
          </div>
        </div>
      </SplitScreenLayout>
    </>
  );
};

export default ParentVerification;
