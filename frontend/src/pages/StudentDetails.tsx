import React, { useEffect, useRef, useState } from 'react';
import SplitScreenLayout from '../components/SplitScreenLayout';
import Logo from '../components/Logo';
import SuccessModal from '../components/SuccessModal';
import { saveStudentDetails } from "../services/PhoneRegistrationService";

const sanitizeInstitutionName = (value: string) =>
  value.replace(/[^a-zA-Z0-9\s'.&(),\/-]/g, '');

const MAX_INSTITUTION_NAME_LENGTH = 100;
const MAX_WORK_PLACE_LENGTH = 100;

const StudentDetails = () => {
  const [isGradeOpen, setIsGradeOpen] = useState(false);
  const [focusedGradeIndex, setFocusedGradeIndex] = useState(0);
  const gradeDropdownRef = useRef<HTMLDivElement>(null);
  const gradeTriggerRef = useRef<HTMLDivElement>(null);
  const gradeOptionRefs = useRef<Array<HTMLDivElement | null>>([]);

  // State elements
  const [grade, setGrade] = useState('');
  const [gradeError, setGradeError] = useState('');
  const [workPlace, setWorkPlace] = useState('');
  const [workPlaceError, setWorkPlaceError] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [schoolNameError, setSchoolNameError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentId, setStudentId] = useState('');
  const isSchoolNameDisabled = Boolean(workPlace.trim());
  const isWorkPlaceDisabled = Boolean(schoolName.trim());

  const handleSchoolNameChange = (value: string) => {
    const sanitizedValue = sanitizeInstitutionName(value);

    if (sanitizedValue.length > MAX_INSTITUTION_NAME_LENGTH) {
      setSchoolNameError(
        `School / University / Institute must not exceed ${MAX_INSTITUTION_NAME_LENGTH} characters.`
      );
      setSchoolName(sanitizedValue.slice(0, MAX_INSTITUTION_NAME_LENGTH));
      return;
    }

    setSchoolNameError('');
    if (sanitizedValue.trim()) setWorkPlaceError('');
    setSchoolName(sanitizedValue);
  };

  const handleWorkPlaceChange = (value: string) => {
    if (value.length > MAX_WORK_PLACE_LENGTH) {
      setWorkPlaceError(
        `Workplace must not exceed ${MAX_WORK_PLACE_LENGTH} characters.`
      );
      setWorkPlace(value.slice(0, MAX_WORK_PLACE_LENGTH));
      return;
    }

    setWorkPlaceError('');
    if (value.trim()) setSchoolNameError('');
    setWorkPlace(value);
  };

  const grades = [
    { value: "Grade 1", label: "Grade 1" },
    { value: "Grade 2", label: "Grade 2" },
    { value: "Grade 3", label: "Grade 3" },
    { value: "Grade 4", label: "Grade 4" },
    { value: "Grade 5", label: "Grade 5" },
    { value: "Grade 6", label: "Grade 6" },
    { value: "Grade 7", label: "Grade 7" },
    { value: "Grade 8", label: "Grade 8" },
    { value: "Grade 9", label: "Grade 9" },
    { value: "Grade 10", label: "Grade 10" },
    { value: "1st year university", label: "1st year university" },
    { value: "2nd year university", label: "2nd year university" },
    { value: "3rd year university", label: "3rd year university" },
    { value: "4th year university", label: "4th year university" },
    { value: "Graduate studies", label: "Graduate studies" },
    { value: "Adult Learner", label: "Adult Learner" },
    { value: "Others", label: "Others" },
  ];

  const selectGrade = (selectedGrade: string) => {
    setGrade(selectedGrade);
    setGradeError('');
    setIsGradeOpen(false);
    gradeTriggerRef.current?.focus();
  };

  const handleGradeKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const selectedGradeIndex = grades.findIndex((g) => g.value === grade);
    const currentIndex =
      focusedGradeIndex >= 0 ? focusedGradeIndex : Math.max(selectedGradeIndex, 0);

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();

      if (isGradeOpen) {
        selectGrade(grades[currentIndex]?.value || grades[0].value);
      } else {
        setFocusedGradeIndex(Math.max(selectedGradeIndex, 0));
        setIsGradeOpen(true);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = isGradeOpen
        ? Math.min(currentIndex + 1, grades.length - 1)
        : Math.max(selectedGradeIndex, 0);

      setFocusedGradeIndex(nextIndex);
      setIsGradeOpen(true);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const nextIndex = Math.max(currentIndex - 1, 0);

      setFocusedGradeIndex(nextIndex);
      setIsGradeOpen(true);
    } else if (e.key === 'Escape') {
      setIsGradeOpen(false);
    } else if (e.key === 'Tab') {
      setIsGradeOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        gradeDropdownRef.current &&
        !gradeDropdownRef.current.contains(event.target as Node)
      ) {
        setIsGradeOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isGradeOpen) {
      gradeOptionRefs.current[focusedGradeIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [focusedGradeIndex, isGradeOpen]);
  // Combined and Fixed Handle Submit Action
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const hasInstitution = Boolean(schoolName.trim() || workPlace.trim());

    if (!grade && !hasInstitution) {
      setError("Please fill all required fields.");
      setGradeError('');
      setSchoolNameError('');
      setWorkPlaceError('');
      return;
    }

    if (!grade || !hasInstitution) {
      setGradeError(grade ? '' : 'Please select a grade.');
      const institutionError = hasInstitution
        ? ''
        : 'School / University / Institute or Workplace is required.';
      setSchoolNameError(institutionError);
      setWorkPlaceError(institutionError);
      return;
    }

    try {
      setLoading(true);
      const userId = localStorage.getItem('user_id');

      if (!userId) {
        setError('User session not found. Please register again.');
        return;
      }

      const response = await saveStudentDetails({
        user_id: userId,
        grade,
        work_place: workPlace.trim() || null,
        school_name: schoolName.trim() || null,
      });
      setStudentId(response.student_id);
      setIsModalOpen(true);

    } catch (err: any) {
      const detail = err.response?.data?.detail;

      if (
        typeof detail === 'string' &&
        detail.toLowerCase().includes('already exists')
      ) {
        setIsModalOpen(true);
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
      <SplitScreenLayout fitViewport>
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
                <div className="relative" ref={gradeDropdownRef}>
                  <div
                    ref={gradeTriggerRef}
                    className="block w-full pl-4 pr-10 py-3.5 border border-gray-200 rounded-lg text-[14px] text-center text-gray-700 bg-white shadow-sm cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#248943] focus:border-[#248943]"
                    role="combobox"
                    aria-haspopup="listbox"
                    aria-expanded={isGradeOpen}
                    aria-controls="grade-options"
                    aria-activedescendant={
                      isGradeOpen ? `grade-option-${focusedGradeIndex}` : undefined
                    }
                    onClick={() => {
                      gradeTriggerRef.current?.focus();
                      const selectedGradeIndex = grades.findIndex((g) => g.value === grade);
                      setFocusedGradeIndex(Math.max(selectedGradeIndex, 0));
                      setIsGradeOpen(!isGradeOpen);
                    }}
                    onKeyDown={handleGradeKeyDown}
                    tabIndex={0}
                  >
                    {grade ? grades.find(g => g.value === grade)?.label : <span className="font-bold text-black">Select Grade</span>}
                  </div>

                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <svg className={`h-4 w-4 text-gray-500 transition-transform ${isGradeOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {isGradeOpen && (
                    <div
                      id="grade-options"
                      role="listbox"
                      className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto custom-scrollbar"
                      onMouseLeave={() => setIsGradeOpen(false)}
                    >
                      {grades.map((g, index) => (
                        <div
                          key={g.value}
                          ref={(element) => {
                            gradeOptionRefs.current[index] = element;
                          }}
                          id={`grade-option-${index}`}
                          role="option"
                          aria-selected={grade === g.value}
                          className={`px-4 py-3 text-[14px] text-center cursor-pointer transition-colors ${grade === g.value || focusedGradeIndex === index
                            ? 'bg-[#248943] text-white'
                            : 'text-gray-700 hover:bg-green-50'
                            }`}
                          onMouseEnter={() => setFocusedGradeIndex(index)}
                          onClick={() => {
                            setFocusedGradeIndex(index);
                            selectGrade(g.value);
                          }}
                        >
                          {g.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {gradeError && (
                  <p className="mt-2 text-sm text-red-600">{gradeError}</p>
                )}
              </div>

              {/* School Name */}
              <div className="mb-6">
                <label className="block text-[14px] font-bold text-[#1F2937] mb-3">
                  School / University / Institute
                </label>
                <input
                  type="text"
                  className={`block w-full px-4 py-3.5 border rounded-lg text-[14px] placeholder-gray-500 focus:outline-none focus:ring-1 shadow-sm disabled:cursor-not-allowed ${schoolNameError
                    ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
                    : 'border-gray-200 focus:ring-[#248943] focus:border-[#248943]'
                    } ${isSchoolNameDisabled
                      ? 'bg-gray-200 text-gray-400 opacity-70'
                      : 'text-gray-700'
                    }`}
                  placeholder="Enter your School / University / Institute"
                  value={schoolName}
                  disabled={isSchoolNameDisabled}
                  onChange={(e) => handleSchoolNameChange(e.target.value)}
                  aria-invalid={Boolean(schoolNameError)}
                  aria-describedby={schoolNameError ? 'institution-name-error' : undefined}
                  required={!workPlace.trim()}
                />
                {schoolNameError && (
                  <p id="institution-name-error" className="mt-2 text-sm text-red-600">
                    {schoolNameError}
                  </p>
                )}
              </div>

              <div className="mb-6 text-center text-[14px] font-bold text-[#1F2937]">
                Or
              </div>

              {/* Work Place */}
              <div className="mb-6">
                <label className="block text-[14px] font-bold text-[#1F2937] mb-3">
                  Workplace
                </label>
                <input
                  type="text"
                  className={`block w-full px-4 py-3.5 border rounded-lg text-[14px] placeholder-gray-500 focus:outline-none focus:ring-1 shadow-sm disabled:cursor-not-allowed ${workPlaceError
                    ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
                    : 'border-gray-200 focus:ring-[#248943] focus:border-[#248943]'
                    } ${isWorkPlaceDisabled
                      ? 'bg-gray-200 text-gray-400 opacity-70'
                      : 'text-gray-700'
                    }`}
                  placeholder="Enter your workplace"
                  value={workPlace}
                  disabled={isWorkPlaceDisabled}
                  onChange={(e) => handleWorkPlaceChange(e.target.value)}
                  aria-invalid={Boolean(workPlaceError)}
                  aria-describedby={workPlaceError ? 'work-place-error' : undefined}
                  required={!schoolName.trim()}
                />
                {workPlaceError && (
                  <p id="work-place-error" className="mt-2 text-sm text-red-600">
                    {workPlaceError}
                  </p>
                )}
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
        message={`Your student profile has been submitted successfully.${studentId ? `\nStudent ID: ${studentId}` : ''}`}
        role={localStorage.getItem("selected_role") || ""}
        registrationNumber={localStorage.getItem("registration_number") || ""}
        buttonText="Go to Login"
        redirectUrl="/login"
      />
    </>
  );
};

export default StudentDetails;
