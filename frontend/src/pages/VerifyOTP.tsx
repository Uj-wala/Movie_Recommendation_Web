import React, { useRef, useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import SplitScreenLayout from '../components/SplitScreenLayout';
import Logo from '../components/Logo';
import { useNavigate, useLocation } from "react-router-dom";
import { verifyOTP } from "../services/authService";
import {
  forgotPassword
} from "../services/authService";

const OTP_EXPIRY_SECONDS = 300;

const VerifyOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(OTP_EXPIRY_SECONDS);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  const location = useLocation();

  const { email, phone_number } =
    location.state || {};

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const handleResend =
    async () => {

      try {
        setError("");

        await forgotPassword(
          email,
          phone_number
        );

        setTimer(OTP_EXPIRY_SECONDS);

        setOtp([
          '',
          '',
          '',
          '',
          '',
          ''
        ]);

      } catch (error) {

        console.error(error);
      }
    };

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '');

    const newOtp = [...otp];
    newOtp[index] = digit.slice(0, 1);
    setOtp(newOtp);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      setError("");

      const otpCode =
        otp.join("");

      if (timer <= 0) {
        setError(
          "OTP Expired"
        );

        return;
      }

      if (
        otpCode.length !== 6
      ) {

        setError(
          "Please enter a valid OTP"
        );

        return;
      }

      try {

        setLoading(true);

        await verifyOTP(
          email,
          phone_number,
          otpCode
        );

        navigate(
          "/reset-password",
          {
            state: {
              email,
              phone_number,
            },
          }
        );

      } catch (error: any) {

        setError(
          error?.response?.data?.detail ||
          "OTP verification failed"
        );

      } finally {

        setLoading(false);
      }
    };

  const formattedTimer = `${Math.floor(timer / 60)
    .toString()
    .padStart(2, "0")}:${(timer % 60).toString().padStart(2, "0")}`;

  return (
    <SplitScreenLayout>
      {/* Back Button */}
      <div className="absolute top-6 left-6 sm:top-12 sm:left-12 lg:left-16 xl:left-24 z-10">
        <Link to="/forgot-password" className="flex items-center text-gray-700 hover:text-gray-900 font-semibold font-sans">
          <div className="flex items-center justify-center w-6 h-6 border border-gray-400 rounded-full mr-2">
            <ArrowLeft className="w-3.5 h-3.5 text-gray-700" strokeWidth={2} />
          </div>
          Back
        </Link>
      </div>

      <div className="w-full max-w-md pt-4 sm:pt-8 pb-12">
        {/* Logo */}
        <div className="flex justify-center w-full mb-8">
          <Logo />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 mt-6 sm:mt-0 text-left">Forgot Password</h1>
        <p className="text-gray-500 mb-8 text-xs sm:text-sm text-left">
          Enter your received OTP to reset your Password
        </p>

        <form className="w-full text-left" onSubmit={handleVerifyOtp}>
          <label className="block text-base font-bold text-[#1a123f] mb-4">
            Enter OTP Received
          </label>
          <div className="flex gap-2 sm:gap-3 mb-6 justify-between sm:justify-start">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={otp[index]}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-11 h-11 sm:w-12 sm:h-12 text-center text-lg sm:text-xl font-bold border border-gray-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green"
              />
            ))}
          </div>
          {timer === 0 && !error && (
            <div className="mb-4">
              <p className="text-red-500 text-sm">OTP Expired</p>
            </div>
          )}
          {error && (
            <div className="mb-4">
              <p className="text-red-500 text-sm">
                {error}
              </p>
            </div>
          )}

          <p className="text-sm text-gray-500 mb-6 mt-2">
            Didn't Receive any code?{' '}
            <button
              type="button"
              className={`font-semibold ${timer === 0 ? 'text-brand-green' : 'text-brand-green cursor-not-allowed opacity-80'}`}
              onClick={handleResend}
              disabled={timer > 0}
            >
              Request a new Code
            </button>
            {timer > 0 && <span className="text-gray-500"> in {formattedTimer}</span>}
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#299555] hover:bg-[#238148] text-white font-semibold py-3 px-4 rounded-lg transition-colors mt-2 disabled:opacity-50"
          >
            {
              loading
                ? "Verifying..."
                : "Verify OTP"
            }
          </button>
        </form>
      </div>
    </SplitScreenLayout>
  );
};

export default VerifyOTP;
