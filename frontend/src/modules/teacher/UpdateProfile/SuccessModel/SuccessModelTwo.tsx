import React from 'react';
import { Link } from 'react-router-dom';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  buttonText?: string;
  redirectUrl?: string;
}

const SuccessModalTwo: React.FC<SuccessModalProps> = ({
  isOpen,
  title = "Congratulations!",
  message = "Your Profile has been Updated successfully.",
  buttonText = "Visit My Profile Screen",
  redirectUrl = "/teacher/dashboard"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[460px] p-10 relative animate-in fade-in zoom-in duration-200">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-[34px] font-bold text-[#333333] mb-2 font-sans tracking-tight">{title}</h2>
          <p className="text-[#666666] text-[15px] mb-10">
            {message}
          </p>

          <div className="relative w-[180px] h-[180px] mb-10 flex items-center justify-center">
            <img
              src="/Group%201000002268.png"
              alt="Success Thumbs Up"
              className="w-full h-full object-contain"
            />
          </div>

          <Link
            to={redirectUrl}
            className="w-full inline-block text-center bg-[#299555] hover:bg-[#238148] text-white font-bold py-4 px-4 rounded-xl text-[16px] transition-colors shadow-sm"
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuccessModalTwo;
