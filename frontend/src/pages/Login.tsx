import React, { useEffect, useRef, useState } from "react";
import { Mail, Lock, EyeOff, Eye, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SplitScreenLayout from "../components/SplitScreenLayout";
import Logo from "../components/Logo";
import AccountBlockedModal from "../components/AccountBlockedModal";
import Captcha from "../components/Captcha";
import type { CaptchaHandle } from "../components/Captcha";
import LegalModal from "../components/LegalModal";
import _PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { getSocialAuthUrl, loginUser } from "../services/authService";
import type { SocialAuthProvider } from "../services/authService";
import {
  EMAIL_FORMAT_ERROR,
  PASSWORD_LENGTH_ERROR,
  isValidEmailFormat,
  isValidPasswordLength,
} from "../utils/validation";
const PhoneInput = (_PhoneInput as any).default || _PhoneInput;
const TERMS_OF_USE_CONTENT = [
  "By using Alcademy, you agree to use the platform responsibly and only for lawful educational purposes. You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.",
  "You agree not to misuse the service, attempt unauthorized access, interfere with platform security, upload harmful content, or use the platform in a way that disrupts learning experiences for other users.",
  "Alcademy may update, suspend, or discontinue parts of the service when needed to maintain quality, security, or compliance. Continued use of the platform after updates means you accept the updated terms.",
  "Educational content and platform materials are provided to support learning. They should not be copied, redistributed, sold, or used outside the platform unless permission is granted.",
  "If you violate these terms, Alcademy may restrict or terminate access to protect users, data, and the integrity of the service.",
];
const PRIVACY_POLICY_CONTENT = [
  "Alcademy collects the information required to create, manage, and secure your account, such as your email address or phone number, password, and profile details provided during registration.",
  "We use this information to provide access to learning features, verify accounts, personalize the experience, communicate important updates, and improve platform reliability and security.",
  "We do not sell your personal information. Information may be shared only with trusted service providers or when required to comply with legal obligations, protect users, or operate the platform safely.",
  "Reasonable technical and organizational measures are used to protect user information. You should also keep your password secure and avoid sharing account access with others.",
  "You may request support for account or privacy-related questions through the appropriate Alcademy support channel.",
];
const getLoginErrorMessage = (detail: any) => {
  if (Array.isArray(detail)) {
    return detail[0]?.msg || "Validation failed";
  }

  if (typeof detail !== "string") {
    return "Login failed";
  }

  const normalizedDetail = detail.toLowerCase();

  if (
    normalizedDetail.includes("user not found") ||
    normalizedDetail.includes("not found") ||
    normalizedDetail.includes("does not exist") ||
    normalizedDetail.includes("not registered")
  ) {
    return "Please sign in";
  }

  if (
    normalizedDetail.includes("invalid credentials") ||
    normalizedDetail.includes("incorrect password") ||
    normalizedDetail.includes("wrong password") ||
    normalizedDetail.includes("invalid password")
  ) {
    return "Incorrect password";
  }

  return detail;
};

const Login = () => {
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const isEmailDisabled = Boolean(phoneNumber.trim());
  const isPhoneDisabled = Boolean(email.trim());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [identifier, setIdentifier] =
    useState("");

  const [blockedData, setBlockedData] =
    useState<any>(null);

  const [password, setPassword] =
    useState("");
  const [passwordError, setPasswordError] =
    useState("");

  const [loading, setLoading] =
    useState(false);
  const [socialAuthLoading, setSocialAuthLoading] =
    useState<SocialAuthProvider | null>(null);

  const [error, setError] =
    useState("");
  const [activeLegalModal, setActiveLegalModal] = useState<
    "terms" | "privacy" | null
  >(null);
  const captchaRef = useRef<CaptchaHandle>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const socialAuthError = location.state?.socialAuthError;

    if (socialAuthError) {
      setError(socialAuthError);
    }
  }, [location.state]);

  // For demonstration, let's open the modal if email is 'block@test.com'
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setEmailError("");
    setPasswordError("");

    const identifier =
      email.trim() ||
      phoneNumber.trim();

    setIdentifier(identifier);

    if (!identifier) {

      setError(
        "Email or phone number is required"
      );

      return;
    }

    if (email.trim() && !isValidEmailFormat(email)) {
      setEmailError(EMAIL_FORMAT_ERROR);
      return;
    }

    if (!isValidPasswordLength(password)) {
      setPasswordError(PASSWORD_LENGTH_ERROR);
      return;
    }

    if (!captchaRef.current?.validate()) {
      setError("Incorrect CAPTCHA.");
      return;
    }

    try {

      setLoading(true);

      console.log(
        "Login Identifier:",
        identifier
      );

      const response =
        await loginUser(
          identifier,
          password
        );

      localStorage.setItem(
        "access_token",
        response.access_token
      );

      localStorage.setItem(
        "refresh_token",
        response.refresh_token
      );

      alert("Login successful.");

      navigate("/dashboard");

    } catch (error: any) {

      const detail =
        error?.response?.data?.detail;

      if (
        detail?.action ===
        "RESET_BLOCKED_ACCOUNT"
      ) {

        setBlockedData(detail);

        setIsModalOpen(true);

        return;
      }

      setError(getLoginErrorMessage(detail));

    } finally {

      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: SocialAuthProvider) => {
    try {
      setError("");
      setSocialAuthLoading(provider);
      window.location.assign(getSocialAuthUrl(provider));
    } catch {
      setSocialAuthLoading(null);
      setError("Social authentication failed. Please try again.");
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);

    if (value.trim() && !isValidEmailFormat(value)) {
      setEmailError(EMAIL_FORMAT_ERROR);
      return;
    }

    setEmailError("");
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);

    if (value && !isValidPasswordLength(value)) {
      setPasswordError(PASSWORD_LENGTH_ERROR);
      return;
    }

    setPasswordError("");
  };

  return (
    <>
      <SplitScreenLayout>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="absolute top-6 left-6 sm:top-8 sm:left-8 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.08)] hover:bg-gray-50 transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>
        <div className="w-full max-w-md pt-4 sm:pt-8 pb-12">
          {/* Logo */}
          <div className="flex justify-center w-full mb-8">
            <Logo />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 mt-6 sm:mt-0">
            Welcome to Alcademy
          </h1>
          <p className="text-gray-500 mb-8 text-xs sm:text-sm">
            Login to access your Alcademy account
          </p>

          <form className="w-full" onSubmit={handleLogin} noValidate>
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-900 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  disabled={isEmailDisabled}
                  style={{
                    backgroundColor: isEmailDisabled ? '#e5e7eb' : undefined,
                    color: isEmailDisabled ? '#9ca3af' : undefined,
                    opacity: isEmailDisabled ? 0.7 : undefined,
                    cursor: isEmailDisabled ? 'not-allowed' : undefined,
                  }}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  required={!phoneNumber}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-1 ${
                    emailError
                      ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
                      : 'border-gray-200 focus:ring-brand-green focus:border-brand-green'
                  } ${
                    isEmailDisabled
                      ? 'bg-gray-200 text-gray-400 opacity-70 cursor-not-allowed'
                      : 'bg-white'
                  }`}
                  placeholder="Enter Your Email Address"
                  aria-invalid={Boolean(emailError)}
                  aria-describedby={emailError ? "login-email-error" : undefined}
                />
              </div>
              {emailError && (
                <p id="login-email-error" className="mt-2 text-sm text-red-600">
                  {emailError}
                </p>
              )}
            </div>

            <div className="relative mb-4 mt-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-400 font-medium text-xs">
                  Or login with
                </span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-900 mb-2">
                Phone Number
              </label>
              <div className="w-full h-[46px]">
                <PhoneInput
                  country={'in'}
                  value={phoneNumber}
                  disabled={isPhoneDisabled}
                  inputProps={{
                    required: !email,
                    disabled: isPhoneDisabled
                  }}
                  inputStyle={{
                    backgroundColor: isPhoneDisabled ? '#e5e7eb' : undefined,
                    color: isPhoneDisabled ? '#9ca3af' : undefined,
                    opacity: isPhoneDisabled ? 0.7 : undefined,
                    cursor: isPhoneDisabled ? 'not-allowed' : undefined,
                  }}
                  buttonStyle={{
                    backgroundColor: isPhoneDisabled ? '#e5e7eb' : undefined,
                    opacity: isPhoneDisabled ? 0.7 : undefined,
                    cursor: isPhoneDisabled ? 'not-allowed' : undefined,
                  }}
                  onChange={(phone: string) => {

                    const formattedPhone =
                      `+${phone}`;

                    setPhoneNumber(formattedPhone);
                  }}
                  enableSearch={true}
                  containerClass="!w-full !h-full"
                  inputClass={`!w-full !h-full !border-gray-200 !rounded-md !text-sm focus:!outline-none focus:!ring-1 focus:!ring-brand-green focus:!border-brand-green ${
                    isPhoneDisabled
                      ? '!bg-gray-200 !text-gray-400 !opacity-70 !cursor-not-allowed'
                      : '!bg-white'
                  }`}
                  buttonClass={`!border-gray-200 !rounded-l-md ${
                    isPhoneDisabled
                      ? '!bg-gray-200 !opacity-70 !cursor-not-allowed'
                      : '!bg-gray-50'
                  }`}
                />
              </div>
            </div>

            <div className="mb-2">
              <label className="block text-xs font-bold text-gray-900 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  className={`block w-full pl-10 pr-10 py-3 border rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-1 tracking-[0.2em] ${
                    passwordError
                      ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
                      : 'border-gray-200 focus:ring-brand-green focus:border-brand-green'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p id="login-password-error" className="mt-2 text-sm text-red-600">
                  {passwordError}
                </p>
              )}
            </div>

            {error && (
              <div className="mb-4">
                <p className="text-red-500 text-sm">
                  {error}
                </p>
              </div>
            )}

            <p className="text-xs text-[#ffb700] font-bold mb-5">
              Note : Password will be Valid for 45 days only.
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-brand-green focus:ring-brand-green border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900 font-medium"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-[#ff7b72] hover:text-[#e06961]"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <Captcha
              ref={captchaRef}
              onPrivacyClick={() => setActiveLegalModal("privacy")}
              onTermsClick={() => setActiveLegalModal("terms")}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-green hover:bg-brand-green-hover text-white font-bold py-3 px-4 rounded-md transition-colors mb-6 disabled:opacity-50"
            >
              {
                loading
                  ? "Signing In..."
                  : "Login to Your Account"
              }
            </button>

            <div className="text-center text-sm mb-6">
              <span className="text-gray-900 font-bold">
                Don't have an account?{" "}
              </span>
              <Link
                to="/register"
                className="text-[#ff7b72] hover:text-[#e06961] font-bold"
              >
                Sign up
              </Link>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-400 font-medium text-xs">
                  Or login with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <button
                type="button"
                disabled={socialAuthLoading !== null}
                onClick={() => handleSocialLogin("microsoft")}
                className="flex items-center justify-center py-2 px-4 border border-[#a8b8e0] rounded-md shadow-sm bg-white hover:bg-gray-50 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 23 23"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 1h10v10H1V1z"
                    fill="#f25022"
                  />
                  <path d="M12 1h10v10H12V1z" fill="#7fba00" />
                  <path d="M1 12h10v10H1V12z" fill="#00a4ef" />
                  <path d="M12 12h10v10H12V12z" fill="#ffb900" />
                </svg>
              </button>
              <button
                type="button"
                disabled={socialAuthLoading !== null}
                onClick={() => handleSocialLogin("google")}
                className="flex items-center justify-center py-2 px-4 border border-[#a8b8e0] rounded-md shadow-sm bg-white hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 48 48">
                  <path
                    fill="#FFC107"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                </svg>
              </button>
              <button
                type="button"
                disabled={socialAuthLoading !== null}
                onClick={() => handleSocialLogin("apple")}
                className="flex items-center justify-center py-2 px-4 border border-[#a8b8e0] rounded-md shadow-sm bg-white hover:bg-gray-50 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 384 512"
                  fill="currentColor"
                >
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </SplitScreenLayout>

      <AccountBlockedModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        identifier={identifier}
        blockedData={blockedData}
      />
      <LegalModal
        isOpen={activeLegalModal === "privacy"}
        title="Privacy Policy"
        sections={PRIVACY_POLICY_CONTENT}
        onClose={() => setActiveLegalModal(null)}
      />
      <LegalModal
        isOpen={activeLegalModal === "terms"}
        title="Terms of Use"
        sections={TERMS_OF_USE_CONTENT}
        onClose={() => setActiveLegalModal(null)}
      />
    </>
  );
};

export default Login;
