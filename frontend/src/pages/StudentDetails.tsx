import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import SplitScreenLayout from '../components/SplitScreenLayout';
import Logo from '../components/Logo';

const StudentDetails = () => {
  const navigate = useNavigate();
  const [isGradeOpen, setIsGradeOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGrade) {
      alert("Please select a grade.");
      return;
    }
    navigate('/success');
  };

  const grades = [
    { value: "1", label: "grade 1" },
    { value: "2", label: "grade 2" },
    { value: "3", label: "grade 3" },
    { value: "4", label: "grade 4" },
    { value: "5", label: "grade 5" },
    { value: "6", label: "grade 6" },
    { value: "7", label: "grade 7" },
    { value: "8", label: "grade 8" },
    { value: "9", label: "grade 9" },
    { value: "10", label: "grade 10" },
    { value: "11", label: "1st year university" },
    { value: "12", label: "2nd year university" },
    { value: "13", label: "3rd year university" },
    { value: "14", label: "4th year university" },
    { value: "15", label: "Graduate studies" },
    { value: "16", label: "Adult Learner" },
    { value: "18", label: "Others" },
  ];

  return (
    <>
      <SplitScreenLayout>
        {/* Back Button */}
        <div className="absolute top-6 left-6 sm:top-12 sm:left-12 lg:left-16 xl:left-24 z-10">
          <Link to="/verify-account?role=student" className="flex items-center text-gray-700 hover:text-gray-900 font-semibold font-sans">
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
              <div className="mb-6 relative">
                <label className="block text-[14px] font-bold text-[#1F2937] mb-3">
                  Select Grade of Student
                </label>
                <div className="relative">
                  <div
                    className="block w-full pl-4 pr-10 py-3.5 border border-gray-200 rounded-lg text-[14px] text-gray-700 bg-white shadow-sm cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#248943] focus:border-[#248943]"
                    onClick={() => setIsGradeOpen(!isGradeOpen)}
                    tabIndex={0}
                  >
                    {selectedGrade ? grades.find(g => g.value === selectedGrade)?.label : <span className="text-gray-500">Select Grade</span>}
                  </div>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <svg className={`h-4 w-4 text-gray-500 transition-transform ${isGradeOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {isGradeOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto custom-scrollbar">
                      {grades.map((grade) => (
                        <div
                          key={grade.value}
                          className={`px-4 py-3 text-[14px] cursor-pointer transition-colors ${selectedGrade === grade.value
                              ? 'bg-[#248943] text-white'
                              : 'text-gray-700 hover:bg-green-50'
                            }`}
                          onClick={() => {
                            setSelectedGrade(grade.value);
                            setIsGradeOpen(false);
                          }}
                        >
                          {grade.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-[14px] font-bold text-[#1F2937] mb-3">
                  Work Place
                </label>
                <input
                  type="text"
                  className="block w-full px-4 py-3.5 border border-gray-200 rounded-lg text-[14px] text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#248943] focus:border-[#248943] shadow-sm"
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

