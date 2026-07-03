import { useState } from 'react';
import { ArrowLeft, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import SplitScreenLayout from '../components/SplitScreenLayout';
import Logo from '../components/Logo';
import _PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { forgotPassword } from "../services/authService";
import {
  EMAIL_FORMAT_ERROR,
  EMAIL_MAX_LENGTH,
  EMAIL_MAX_LENGTH_ERROR,
  hasReachedEmailMaxLength,
  isValidEmailFormat,
  isUnregisteredMobileNumberError,
  limitEmailInput,
  UNREGISTERED_MOBILE_NUMBER_ERROR,
} from "../utils/validation";
const PhoneInput = (_PhoneInput as any).default || _PhoneInput;

type PhoneCountry = {
  dialCode?: string;
};

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [mobile, setMobile] = useState('');
  const [mobileError, setMobileError] = useState('');
  const isEmailDisabled = Boolean(mobile.trim());
  const isMobileDisabled = Boolean(email.trim());
  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const handleForgotPassword =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      setError("");
      setMobileError("");
      setSuccess("");

      if (!email.trim() && !mobile.trim()) {
        setError("Please fill all required fields.");
        return;
      }

      if (email.trim() && !isValidEmailFormat(email)) {
        setError(EMAIL_FORMAT_ERROR);
        return;
      }

      try {

        setLoading(true);

        const payload: any = {};

        if (email.trim()) {
          payload.email =
            email.trim();
        }

        if (mobile.trim()) {
          payload.phone_number =
            `+${mobile.trim()}`;
        }

        const response =
          await forgotPassword(
            payload.email,
            payload.phone_number
          );

        setSuccess(
          response.message
        );

        navigate(
          "/verify-otp",
          {
            state: {
              email,
              phone_number: payload.phone_number || '',
            },
          }
        );

      } catch (error: any) {
        const detail = error?.response?.data?.detail;

        if (mobile.trim() && isUnregisteredMobileNumberError(detail)) {
          setMobileError(UNREGISTERED_MOBILE_NUMBER_ERROR);
          return;
        }

        setError(
          detail ||
          "Failed to send OTP"
        );

      } finally {

        setLoading(false);
      }
    };

  return (
    <SplitScreenLayout>
      {/* Back Button */}
      <div className="absolute top-12 left-12 lg:left-16 xl:left-24 z-10">
        <Link to="/login" className="flex items-center text-gray-700 hover:text-gray-900 font-semibold font-sans">
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
          Enter your registered email ID to reset your password
        </p>

        <form className="w-full" onSubmit={handleForgotPassword} noValidate>
          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-900 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="email"
                maxLength={EMAIL_MAX_LENGTH}
                className={`block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green transition-colors disabled:cursor-not-allowed ${isEmailDisabled
                    ? 'bg-gray-200 text-gray-400 opacity-70'
                    : 'bg-white'
                  }`}
                placeholder="Enter Your Email Address"
                value={email}
                disabled={isEmailDisabled}
                onChange={(e) => {
                  const limitedEmail = limitEmailInput(e.target.value);
                  setEmail(limitedEmail);
                  if (limitedEmail.trim()) setMobileError('');
                  setEmailError(
                    hasReachedEmailMaxLength(e.target.value)
                      ? EMAIL_MAX_LENGTH_ERROR
                      : '',
                  );
                }}
              />
            </div>
            {emailError && (
              <p className="mt-1 text-sm text-red-500">{emailError}</p>
            )}
          </div>

          <div className="relative mb-4 mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-400 font-medium text-xs">Or Reset with</span>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-xs font-bold text-gray-900 mb-2">
              Mobile Number
            </label>
            <div className="w-full h-[46px]">
              <PhoneInput
                country={'in'}
                value={mobile}
                onChange={(phone: string, country: PhoneCountry) => {
                  const dialCode = (country?.dialCode || '').replace(/\D/g, '');
                  const phoneDigits = phone.replace(/\D/g, '');
                  const hasSubscriberNumber = phoneDigits.length > dialCode.length;
                  const nextMobile = hasSubscriberNumber ? phoneDigits : '';

                  setMobile(nextMobile);
                  setMobileError('');
                }}
                enableSearch={true}
                countryCodeEditable={false}
                disabled={isMobileDisabled}
                inputProps={{
                  name: 'phone',
                  autoComplete: 'tel',
                  disabled: isMobileDisabled,
                }}
                inputStyle={{
                  backgroundColor: isMobileDisabled ? '#e5e7eb' : undefined,
                  color: isMobileDisabled ? '#9ca3af' : undefined,
                  opacity: isMobileDisabled ? 0.7 : undefined,
                  cursor: isMobileDisabled ? 'not-allowed' : undefined,
                }}
                buttonStyle={{
                  backgroundColor: isMobileDisabled ? '#e5e7eb' : undefined,
                  opacity: isMobileDisabled ? 0.7 : undefined,
                  cursor: isMobileDisabled ? 'not-allowed' : undefined,
                }}
                containerClass="!w-full !h-full"
                inputClass={`!w-full !h-full !rounded-md !text-sm disabled:!cursor-not-allowed focus:!outline-none focus:!ring-1 ${mobileError
                    ? '!border-red-400 focus:!ring-red-400 focus:!border-red-400'
                    : '!border-gray-200 focus:!ring-brand-green focus:!border-brand-green'
                  } ${isMobileDisabled
                    ? '!bg-gray-200 !text-gray-400 !opacity-70'
                    : '!bg-white'
                  }`}
                buttonClass={`${mobileError ? '!border-red-400' : '!border-gray-200'} !rounded-l-md disabled:!cursor-not-allowed ${isMobileDisabled
                    ? '!bg-gray-200 !opacity-70'
                    : '!bg-gray-50'
                  }`}
              />
            </div>
            {mobileError && (
              <p className="mt-2 text-sm text-red-600">{mobileError}</p>
            )}
          </div>

          {error && (
            <div className="mb-4">
              <p className="text-red-500 text-sm">
                {error}
              </p>
            </div>
          )}

          {success && (
            <div className="mb-4">
              <p className="text-green-600 text-sm">
                {success}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-green hover:bg-brand-green-hover text-white font-bold py-3 px-4 rounded-md transition-colors disabled:opacity-50"
          >
            {
              loading
                ? "Sending OTP..."
                : "Reset Password"
            }
          </button>
        </form>
      </div>
    </SplitScreenLayout>
  );
};

export default ForgotPassword;
