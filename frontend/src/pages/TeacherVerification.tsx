import React, { useEffect, useState } from 'react';
import SplitScreenLayout from '../components/SplitScreenLayout';
import SuccessModal from '../components/SuccessModal';
import Logo from '../components/Logo';
import {
  saveTeacherVerification
} from '../services/PhoneRegistrationService';
import { fetchDropdownData } from '../services/ListApiService';
 
const sanitizeInstitutionName = (value: string) =>
  value.replace(/[^a-zA-Z0-9\s'.&(),\/-]/g, '');
 
const MAX_SCHOOL_NAME_LENGTH = 30;
const visibleSubjectNames = [
  'English',
  'Computer Science',
  'Data Analytics',
  'AI Chart Tools',
  'Data Science',
];
const defaultSelectedSubjectNames = ['English', 'AI Chart Tools'];
 
const getSubjectKey = (subjectName: string) => subjectName.trim().toLowerCase();

type SubjectOption = { id: string; name: string };

const filterVisibleSubjects = (subjects: SubjectOption[]) =>
  visibleSubjectNames
    .map((subjectName) =>
      subjects.find(
        (subject) => getSubjectKey(subject.name) === getSubjectKey(subjectName)
      )
    )
    .filter((subject): subject is SubjectOption => Boolean(subject));
 
const TeacherVerification = () => {
  const [schoolName, setSchoolName] = useState('');
  const [schoolNameError, setSchoolNameError] = useState('');
  const [availableSubjects, setAvailableSubjects] = useState<SubjectOption[]>([]);
  const [subjectIds, setSubjectIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teacherId, setTeacherId] = useState('');

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        setError('');
        setLoadingSubjects(true);

        const subjects = await fetchDropdownData('/dropdowns/subjects');
        const visibleSubjects = filterVisibleSubjects(subjects);

        setAvailableSubjects(visibleSubjects);
        setSubjectIds(
          visibleSubjects
            .filter((subject) =>
              defaultSelectedSubjectNames.some(
                (subjectName) =>
                  getSubjectKey(subject.name) === getSubjectKey(subjectName)
              )
            )
            .map((subject) => subject.id)
        );
      } catch {
        setError('Unable to load subjects. Please try again.');
      } finally {
        setLoadingSubjects(false);
      }
    };

    loadSubjects();
  }, []);
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
 
    if (schoolName.length > MAX_SCHOOL_NAME_LENGTH) {
      setSchoolNameError(`School Name must not exceed ${MAX_SCHOOL_NAME_LENGTH} characters.`);
      return;
    }
 
    try {
      setLoading(true);
 
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        setError('User session not found. Please register again.');
        return;
      }
 
      if (!subjectIds.length) {
        setError('Please select a subject.');
        return;
      }
 
      const response = await saveTeacherVerification({
        user_id: userId,
        school_name: schoolName,
        subject_ids: subjectIds,
      });
 
      setTeacherId(response.teacher_id);
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
 
  const handleSchoolNameChange = (value: string) => {
    const sanitizedValue = sanitizeInstitutionName(value);
 
    if (sanitizedValue.length > MAX_SCHOOL_NAME_LENGTH) {
      setSchoolNameError(`School Name must not exceed ${MAX_SCHOOL_NAME_LENGTH} characters.`);
      setSchoolName(sanitizedValue.slice(0, MAX_SCHOOL_NAME_LENGTH));
      return;
    }
 
    setSchoolNameError('');
    setSchoolName(sanitizedValue);
  };
 
  return (
    <>
      <SplitScreenLayout fitViewport>
        <div className="w-full max-w-[460px] pt-4 sm:pt-8 pb-12">
          <div className="flex justify-center w-full mb-8">
            <Logo />
          </div>
 
          <div className="w-full bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8 border border-gray-50">
 
            <h1 className="text-[24px] sm:text-[28px] font-bold text-[#111111] mb-8 font-sans">Teacher Verification</h1>
 
            {/* ✅ Error message */}
            {error && (
              <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
 
            <form className="w-full" onSubmit={handleSubmit}>
 
              {/* School Name */}
              <div className="mb-6">
                <label className="block text-[14px] font-bold text-[#1F2937] mb-3">
                  School Name
                </label>
                <input
                  type="text"
                  className={`block w-full px-4 py-3.5 border rounded-lg text-[14px] text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-1 shadow-sm ${
                    schoolNameError
                      ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
                      : 'border-gray-200 focus:ring-brand-green focus:border-brand-green'
                  }`}
                  placeholder="Enter School Name"
                  value={schoolName}
                  onChange={(e) => handleSchoolNameChange(e.target.value)}
                  aria-invalid={Boolean(schoolNameError)}
                  aria-describedby={schoolNameError ? 'school-name-error' : undefined}
                  required
                />
                {schoolNameError && (
                  <p id="school-name-error" className="mt-2 text-sm text-red-600">
                    {schoolNameError}
                  </p>
                )}
              </div>
 
              {/* Subject */}
              <div className="mb-8">
                <label className="block text-[14px] font-bold text-[#1F2937] mb-3">
                  Subject
                </label>
                <div className="space-y-2">
                  {availableSubjects.map((subject) => (
                    <label key={subject.id} className="flex items-center text-[14px] text-[#1F2937]">
                      <input
                        type="checkbox"
                        checked={subjectIds.includes(subject.id)}
                        onChange={(e) => {
                          setSubjectIds((currentSubjectIds) =>
                            e.target.checked
                              ? [...currentSubjectIds, subject.id]
                              : currentSubjectIds.filter((id) => id !== subject.id)
                          );
                        }}
                        className="h-4 w-4 text-brand-green focus:ring-brand-green border-gray-300 rounded mr-3"
                      />
                      {subject.name}
                    </label>
                  ))}
                </div>
                {loadingSubjects && (
                  <p className="mt-2 text-sm text-gray-500">Loading subjects...</p>
                )}
              </div>
 
              <button
                type="submit"
                disabled={loading || loadingSubjects}
                className="bg-[#299555] hover:bg-[#238148] text-white font-bold py-3 px-10 rounded-lg transition-colors text-[15px] disabled:opacity-50"
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
        message={`You can now access the platform${teacherId ? `\nTeacher ID: ${teacherId}` : ''}`}
        buttonText="Go to Login"
        redirectUrl="/login"
      />
    </>
  );
};
 
export default TeacherVerification;
