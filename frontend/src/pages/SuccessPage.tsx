import { Link, useLocation } from 'react-router-dom';
import SplitScreenLayout from '../components/SplitScreenLayout';

const SuccessPage = () => {
  const location = useLocation();
const state = location.state as {
  title?: string;
  message?: string;
  buttonText?: string;
  redirectUrl?: string;
  role?: string;
  registrationNumber?: string;
} | null;

const title = state?.title || "Registration Successful!!!";
const message =
  state?.message || "Your profile has been submitted successfully.";
const buttonText = state?.buttonText || "Go to Login";
const redirectUrl = state?.redirectUrl || "/login";

const role =
  state?.role ||
  localStorage.getItem("selected_role");
const registrationNumber =
  state?.registrationNumber ||
  localStorage.getItem("registration_number");

  return (
    <>
      <SplitScreenLayout>
        {/* Background content for the SplitScreenLayout */}
        <div className="w-full h-full opacity-50 pointer-events-none"></div>
      </SplitScreenLayout>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[460px] p-10 relative animate-in fade-in zoom-in duration-200">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-[34px] font-bold text-[#333333] mb-2 font-sans tracking-tight">{title}</h2>
            <p className="text-[#666666] text-[15px] mb-10 whitespace-pre-line break-words">
              {message}
            </p>

            {registrationNumber && (
  <div className="mb-6 text-center">
    <p className="text-gray-500 text-sm">
      {role ? `${role} Registration Number` : "Registration Number"}
    </p>

    <h3 className="text-2xl font-bold text-[#299555] mt-2">
      {registrationNumber}
    </h3>
  </div>
)}

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
    </>
  );
};

export default SuccessPage;
