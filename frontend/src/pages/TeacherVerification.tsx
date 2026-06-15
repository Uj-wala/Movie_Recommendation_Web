import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import SplitScreenLayout from '../components/SplitScreenLayout';
import SuccessModal from '../components/SuccessModal';
import Logo from '../components/Logo';
import {
  saveTeacherVerification
} from '../services/PhoneRegistrationService';

const TeacherVerification = () => {
  const [schoolName, setSchoolName] = useState('');
  const [subject, setSubject] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teacherId, setTeacherId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);

      const userId = localStorage.getItem('user_id');
      if (!userId) {
        setError('User session not found. Please register again.');
        return;
      }


      const response = await saveTeacherVerification({
        user_id: userId,
        school_name: schoolName,
        subject_ids: subject,
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
                  className="block w-full px-4 py-3.5 border border-gray-200 rounded-lg text-[14px] text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green shadow-sm"
                  placeholder="Public School"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  onInput={(e) => {
                    e.currentTarget.value = e.currentTarget.value.replace(/[^a-zA-Z\s]/g, '');
                  }}
                  required
                />
              </div>

              {/* Subject */}
              <div className="mb-8">
                <label className="block text-[14px] font-bold text-[#1F2937] mb-3">
                  Subject
                </label>
                <input
                  type="text"
                  className="block w-full px-4 py-3.5 border border-gray-200 rounded-lg text-[14px] text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green shadow-sm"
                  placeholder="Enter the subject"
                  value={subject.join(', ')}
                  onChange={(e) => setSubject(e.target.value.split(',').map((item) => item.trim()).filter(Boolean))}
                  // onInput={(e) => {
                  //   e.currentTarget.value = e.currentTarget.value.replace(/[^a-zA-Z\s]/g, '');
                  // }}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
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
