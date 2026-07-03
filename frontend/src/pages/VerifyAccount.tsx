import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SplitScreenLayout from "../components/SplitScreenLayout";
import Logo from "../components/Logo";

import {
  verifyPhoneOtpWithFallback,
  resendPhoneOtpWithFallback,
  sendEmailOtp,
  verifyEmailOtp,
  getApiErrorMessage,
} from "../services/PhoneRegistrationService";

const OTP_TIMER_SECONDS = 5 * 60;
const formatTimer = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};

const VerifyAccount = () => {
  const navigate = useNavigate();

  const phoneNumber = localStorage.getItem("phone_number");
  const email = localStorage.getItem("email");
  const registrationType = localStorage.getItem("registration_type") || "phone";
  const role = localStorage.getItem("selected_role") || "student";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(OTP_TIMER_SECONDS);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const hasSentInitialOtp = useRef(false);

  useEffect(() => {
    const sendOtpOnPageLoad = async () => {
      if (hasSentInitialOtp.current) {
        return;
      }

      hasSentInitialOtp.current = true;

      try {
        setError("");
        setOtpSent(false);

        if (registrationType === "phone") {
          if (!phoneNumber) {
            setError("Phone number missing. Please register again.");
            return;
          }

          const response = await resendPhoneOtpWithFallback(phoneNumber);
          localStorage.setItem("phone_number", response.phone_number);
          setOtpSent(true);
        } else {
          if (!email) {
            setError("Email missing. Please register again.");
            return;
          }

          await sendEmailOtp(email);
          setOtpSent(true);
        }
      } catch (error: any) {
        setError(getApiErrorMessage(error));
      }
    };

    sendOtpOnPageLoad();
  }, []);

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "");

    const newOtp = [...otp];
    newOtp[index] = digit.slice(0, 1);
    setOtp(newOtp);
    if (newOtp.join("").length === 6) setError("");

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    try {
      setError("");
      setOtpSent(false);

      if (registrationType === "phone") {
        if (!phoneNumber) {
          setError("Phone number missing. Please register again.");
          return;
        }

        const response = await resendPhoneOtpWithFallback(phoneNumber);
        localStorage.setItem("phone_number", response.phone_number);
      } else {
        if (!email) {
          setError("Email missing. Please register again.");
          return;
        }

        await sendEmailOtp(email);
      }

      setOtp(["", "", "", "", "", ""]);
      setOtpSent(true);
      setTimer(OTP_TIMER_SECONDS);
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      setError(getApiErrorMessage(error));
    }
  };

  const handleVerifyAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError("");

      const otpCode = otp.join("");

      if (!otpCode.length) {
        setError("Please fill all required fields.");
        return;
      }

      if (otpCode.length !== 6) {
        setError("Please enter a valid 6-digit OTP.");
        return;
      }

      setLoading(true);

      if (registrationType === "phone") {
        if (!phoneNumber) {
          setError("Phone number missing. Please register again.");
          return;
        }

        const response = await verifyPhoneOtpWithFallback(phoneNumber, otpCode);
        localStorage.setItem("phone_number", response.phone_number);
      } else {
        if (!email) {
          setError("Email missing. Please register again.");
          return;
        }

        await verifyEmailOtp(email, otpCode);
      }

      localStorage.removeItem("phone_number");
      localStorage.removeItem("email");
      localStorage.removeItem("registration_type");

      if (role === "teacher") {
        navigate("/teacher-verification");
      } else if (role === "parent") {
        navigate("/parent-verification");
      } else {
        navigate("/student-details");
      }
    } catch (error: any) {
      setError(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SplitScreenLayout fitViewport>
      <div className="w-full max-w-md flex flex-col items-center">
        <Logo />

        <h1 className="text-2xl sm:text-3xl font-bold text-[#262626] mb-2 font-sans self-start text-left w-full mt-8 sm:mt-0">
          Verify your Account
        </h1>

        <p className="text-gray-500 mb-8 text-xs sm:text-sm self-start text-left w-full">
          Verify your account to start learning courses.
        </p>

        <div className="w-full mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm font-medium text-red-700">
            Important: Once your account is verified, you cannot go back to the previous page.
          </p>
        </div>

        <form className="w-full text-left" onSubmit={handleVerifyAccount}>
          <label className="block text-base font-bold text-[#1a123f] mb-2">
            Enter OTP sent to your {registrationType === "phone" ? "phone" : "email"}
          </label>

          <p className="text-xs text-gray-500 mb-4">
            {registrationType === "phone"
              ? `OTP sent to ${phoneNumber || ""}`
              : `OTP sent to ${email || ""}`}
          </p>

          <div className="flex gap-2 sm:gap-3 mb-6 justify-between sm:justify-start">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
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

          <p className="text-sm text-gray-500 mb-6">
            Didn&apos;t receive any code?{" "}
            <button
              type="button"
              className={`font-semibold ${timer === 0
                ? "text-brand-green"
                : "text-brand-green cursor-not-allowed opacity-80"
                }`}
              onClick={handleResend}
              disabled={timer > 0}
            >
              Request a new Code
            </button>
            {timer > 0 && (
              <span className="text-gray-500">
                {" "}
                in {formatTimer(timer)}
              </span>
            )}
          </p>

          {otpSent && timer > 0 && (
            <p className="text-green-600 text-sm mb-4">
              OTP sent successfully.
            </p>
          )}

          {timer === 0 && (
            <p className="text-red-500 text-sm mb-4">
              OTP expired.
            </p>
          )}

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full block text-center bg-[#299555] hover:bg-[#238148] text-white font-semibold py-3 px-4 rounded-lg transition-colors mt-2 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify Account"}
          </button>
        </form>
      </div>
    </SplitScreenLayout>
  );
};

export default VerifyAccount;
