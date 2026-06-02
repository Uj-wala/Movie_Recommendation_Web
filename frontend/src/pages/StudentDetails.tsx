import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import SplitScreenLayout from '../components/SplitScreenLayout';
import Logo from '../components/Logo';

const StudentDetails = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/parent-verification');
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

          <div className="w-full bg-white rounded-2xl shadow-xl shadow-green-50/50 p-6 sm:p-8 pt-8 sm:pt-10 border border-gray-50">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 font-sans">Student Details</h1>

            <form className="w-full" onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-[14px] font-bold text-[#1F2937] mb-3">
                  Select Grade of Student
                </label>
                <div className="relative">
                  <select
                    className="block w-full pl-4 pr-10 py-3.5 border border-gray-200 rounded-lg text-[14px] text-gray-700 appearance-none focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green bg-white shadow-sm"
                    defaultValue=""
                    required
                  >
                    <option value="" disabled hidden>Select Grade</option>
                    <option value="6">6th Grade</option>
                    <option value="7">7th Grade</option>
                    <option value="8">8th Grade</option>
                    <option value="9">9th Grade</option>
                    <option value="10">10th Grade</option>
                    <option value="11">11th Grade</option>
                    <option value="12">12th Grade</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-[14px] font-bold text-[#1F2937] mb-3">
                  Work Place
                </label>
                <input
                  type="text"
                  className="block w-full px-4 py-3.5 border border-gray-200 rounded-lg text-[14px] text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green shadow-sm"
                  placeholder="public School"
                  required
                />
              </div>

              <div className="mb-8">
                <label className="block text-[14px] font-bold text-[#1F2937] mb-3">
                  School Name
                </label>
                <input
                  type="text"
                  className="block w-full px-4 py-3.5 border border-gray-200 rounded-lg text-[14px] text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green shadow-sm"
                  placeholder="public School"
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

export default StudentDetails;
