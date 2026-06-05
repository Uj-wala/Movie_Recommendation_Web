import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import SplitScreenLayout from '../components/SplitScreenLayout';
import Logo from '../components/Logo';
import { saveStudentDetails } from "../services/PhoneRegistrationService";

const StudentDetails = () => {
  const navigate = useNavigate();
  const [isGradeOpen, setIsGradeOpen] = useState(false);
  
  // State elements
  const [grade, setGrade] = useState('');
  const [workPlace, setWorkPlace] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const grades = [
    { value: "Grade 1", label: "grade 1" },
    { value: "Grade 2", label: "grade 2" },
    { value: "Grade 3", label: "grade 3" },
    { value: "Grade 4", label: "grade 4" },
    { value: "Grade 5", label: "grade 5" },
    { value: "Grade 6", label: "grade 6" },
    { value: "Grade 7", label: "grade 7" },
    { value: "Grade 8", label: "grade 8" },
    { value: "Grade 9", label: "grade 9" },
    { value: "Grade 10", label: "grade 10" },
    { value: "1st year university", label: "1st year university" },
    { value: "2nd year university", label: "2nd year university" },
    { value: "3rd year university", label: "3rd year university" },
    { value: "4th year university", label: "4th year university" },
    { value: "Graduate studies", label: "Graduate studies" },
    { value: "Adult Learner", label: "Adult Learner" },
    { value: "Others", label: "Others" },
  ];

  // Combined and Fixed Handle Submit Action
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!grade) {
      alert("Please select a grade.");
      return;
    }

    try {
      setLoading(true);
      const userId = localStorage.getItem('user_id');

      if (!userId) {
        setError('User session not found. Please register again.');
        return;
      }

      await saveStudentDetails({
        user_id: userId,
        grade,
        work_place: workPlace || null,
        school_name: schoolName,
      });

      navigate('/verify-account?role=student');

    } catch (err: any) {
      console.error(err);
      const detail = err.response?.data?.detail;

      if (
        typeof detail === 'string' &&
        detail.toLowerCase().includes('already exists')
      ) {
        navigate('/verify-account?role=student');
        return;
      }

      if (Array.isArray(detail)) {
        setError(detail.map((e: any) => e.msg).join(", "));
      } else if (typeof detail === "string") {
        setError(detail);
      } else {
        setError("Submission failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

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

            {error && (
              <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <form className="w-full" onSubmit={handleSubmit}>
              
              {/* Select Custom Grade Dropdown */}
              <div className="mb-6">
                <label className="block text-[14px] font-bold text-[#1F2937] mb-3">
                  Select Grade of Student
                </label>
                <div className="relative">
                  <div
                    className="block w-full pl-4 pr-10 py-3.5 border border-gray-200 rounded-lg text-[14px] text-gray-700 bg-white shadow-sm cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#248943] focus:border-[#248943]"
                    onClick={() => setIsGradeOpen(!isGradeOpen)}
                    tabIndex={0}
                  >
                    {grade ? grades.find(g => g.value === grade)?.label : <span className="text-gray-500">Select Grade</span>}
                  </div>
                  
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <svg className={`h-4 w-4 text-gray-500 transition-transform ${isGradeOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {isGradeOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto custom-scrollbar">
                      {grades.map((g) => (
                        <div
                          key={g.value}
                          className={`px-4 py-3 text-[14px] cursor-pointer transition-colors ${grade === g.value
                              ? 'bg-[#248943] text-white'
                              : 'text-gray-700 hover:bg-green-50'
                            }`}
                          onClick={() => {
                            setGrade(g.value);
                            setIsGradeOpen(false);
                          }}
                        >
                          {g.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Work Place */}
              <div className="mb-6">
                <label className="block text-[14px] font-bold text-[#1F2937] mb-3">
                  Work Place
                </label>
                <input
                  type="text"
                  className="block w-full px-4 py-3.5 border border-gray-200 rounded-lg text-[14px] text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#248943] focus:border-[#248943] shadow-sm"
                  placeholder="public School"
                  value={workPlace}
                  onChange={(e) => setWorkPlace(e.target.value)}
                />
              </div>

              {/* School Name */}
              <div className="mb-6">
                <label className="block text-[14px] font-bold text-[#1F2937] mb-3">
                  School Name
                </label>
                <input
                  type="text"
                  className="block w-full px-4 py-3.5 border border-gray-200 rounded-lg text-[14px] text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#248943] focus:border-[#248943] shadow-sm"
                  placeholder="Enter school name"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
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
    </>
  );
};

export default StudentDetails;