import React, { useEffect, useState } from "react";
import { Mail, Lock, User, ChevronDown, Eye, EyeOff, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import SplitScreenLayout from "../components/SplitScreenLayout";
import Logo from "../components/Logo";
import LegalModal from "../components/LegalModal";
import _PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import {
  emailRegistration,
  phoneRegistration,
  getApiErrorMessage,
} from "../services/PhoneRegistrationService";
import type { PhoneRegistrationData } from "../services/PhoneRegistrationService";
import {
  EMAIL_FORMAT_ERROR,
  PASSWORD_COMPLEXITY_ERROR,
  PASSWORD_LENGTH_ERROR,
  isValidEmailFormat,
  isValidPasswordComplexity,
  isValidPasswordLength,
} from "../utils/validation";

const PhoneInput = (_PhoneInput as any).default || _PhoneInput;
const FULL_NAME_MAX_LENGTH = 24;
const PASSWORD_MAX_LENGTH = 12;
const SECURITY_ANSWER_MAX_LENGTH = 8;
type RegistrationFormDraft = {
  registrationType: "email" | "phone";
  phoneNumber: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  securityQuestion: string;
  securityAnswer: string;
  agreeToTerms: boolean;
};
const INITIAL_REGISTRATION_FORM_DRAFT: RegistrationFormDraft = {
  registrationType: "phone",
  phoneNumber: "",
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  securityQuestion: "",
  securityAnswer: "",
  agreeToTerms: false,
};
const REGISTRATION_FORM_DRAFT_KEY = "registration_form_draft";
const isRegistrationType = (value: string | null): value is "email" | "phone" =>
  value === "email" || value === "phone";
const getSavedRegistrationDraft = (): RegistrationFormDraft => {
  try {
    const savedDraft = sessionStorage.getItem(REGISTRATION_FORM_DRAFT_KEY);
    const storedRegistrationType = localStorage.getItem("registration_type");

    if (!savedDraft) {
      return {
        ...INITIAL_REGISTRATION_FORM_DRAFT,
        registrationType: isRegistrationType(storedRegistrationType)
          ? storedRegistrationType
          : INITIAL_REGISTRATION_FORM_DRAFT.registrationType,
      };
    }

    return {
      ...INITIAL_REGISTRATION_FORM_DRAFT,
      ...JSON.parse(savedDraft),
      ...(isRegistrationType(storedRegistrationType)
        ? { registrationType: storedRegistrationType }
        : {}),
    };
  } catch {
    return { ...INITIAL_REGISTRATION_FORM_DRAFT };
  }
};
const saveRegistrationDraft = (draft: RegistrationFormDraft) => {
  registrationFormDraft = draft;
  sessionStorage.setItem(REGISTRATION_FORM_DRAFT_KEY, JSON.stringify(draft));
};
let registrationFormDraft: RegistrationFormDraft = getSavedRegistrationDraft();
const hasRegistrationDraftValues = () =>
  Boolean(
    registrationFormDraft.phoneNumber ||
      registrationFormDraft.fullName ||
      registrationFormDraft.email ||
      registrationFormDraft.password ||
      registrationFormDraft.confirmPassword ||
      registrationFormDraft.securityQuestion ||
      registrationFormDraft.securityAnswer ||
      registrationFormDraft.agreeToTerms
  );
const TERMS_OF_USE_CONTENT = [
  "By creating an AIcademy account, you agree to use the platform responsibly and only for lawful educational purposes. You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.",
  "You agree not to misuse the service, attempt unauthorized access, interfere with platform security, upload harmful content, or use the platform in a way that disrupts learning experiences for other users.",
  "AIcademy may update, suspend, or discontinue parts of the service when needed to maintain quality, security, or compliance. Continued use of the platform after updates means you accept the updated terms.",
  "Educational content and platform materials are provided to support learning. They should not be copied, redistributed, sold, or used outside the platform unless permission is granted.",
  "If you violate these terms, AIcademy may restrict or terminate access to protect users, data, and the integrity of the service.",
];
const PRIVACY_POLICY_CONTENT = [
  "AIcademy collects the information required to create and manage your account, such as your name, email address or phone number, password, role selection, and profile details provided during registration.",
  "We use this information to provide access to learning features, verify accounts, personalize the experience, communicate important updates, and improve platform reliability and security.",
  "We do not sell your personal information. Information may be shared only with trusted service providers or when required to comply with legal obligations, protect users, or operate the platform safely.",
  "Reasonable technical and organizational measures are used to protect user information. You should also keep your password secure and avoid sharing account access with others.",
  "You may request support for account or privacy-related questions through the appropriate AIcademy support channel.",
];

const Register = () => {
  const defaultRegistrationType =
    hasRegistrationDraftValues() ? registrationFormDraft.registrationType : "phone";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationType, setRegistrationType] = useState<"email" | "phone">(
    defaultRegistrationType
  );

  const [phoneNumber, setPhoneNumber] = useState(registrationFormDraft.phoneNumber);
  const [fullName, setFullName] = useState(registrationFormDraft.fullName);
  const [fullNameError, setFullNameError] = useState("");
  const [email, setEmail] = useState(registrationFormDraft.email);
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState(registrationFormDraft.password);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(
    registrationFormDraft.confirmPassword
  );
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState(
    registrationFormDraft.securityQuestion
  );
  const [securityAnswer, setSecurityAnswer] = useState(
    registrationFormDraft.securityAnswer
  );
  const [securityAnswerError, setSecurityAnswerError] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(
    registrationFormDraft.agreeToTerms
  );
  const [activeLegalModal, setActiveLegalModal] = useState<
    "terms" | "privacy" | null
  >(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const blockClipboardAction = (e: React.SyntheticEvent<HTMLInputElement>) => {
    e.preventDefault();
  };

  const blockClipboardShortcut = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.ctrlKey || e.metaKey) && ["c", "x", "v"].includes(e.key.toLowerCase())) {
      e.preventDefault();
    }
  };

  useEffect(() => {
    saveRegistrationDraft({
      registrationType,
      phoneNumber,
      fullName,
      email,
      password,
      confirmPassword,
      securityQuestion,
      securityAnswer,
      agreeToTerms,
    });
  }, [
    registrationType,
    phoneNumber,
    fullName,
    email,
    password,
    confirmPassword,
    securityQuestion,
    securityAnswer,
    agreeToTerms,
  ]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !fullName ||
      (registrationType === "phone" ? !phoneNumber : !email) ||
      !password ||
      !confirmPassword ||
      !securityQuestion ||
      !securityAnswer
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (!agreeToTerms) {
      alert("Please agree to terms and privacy policy");
      return;
    }

    if (fullName.length > FULL_NAME_MAX_LENGTH) {
      setFullNameError(`Full Name cannot exceed ${FULL_NAME_MAX_LENGTH} characters`);
      return;
    }

    if (registrationType === "email" && email.trim() && !isValidEmailFormat(email)) {
      setEmailError(EMAIL_FORMAT_ERROR);
      return;
    }

    if (!isValidPasswordLength(password)) {
      setPasswordError(PASSWORD_LENGTH_ERROR);
      return;
    }

    if (!isValidPasswordComplexity(password)) {
      setPasswordError(PASSWORD_COMPLEXITY_ERROR);
      return;
    }

    if (!isValidPasswordLength(confirmPassword)) {
      setConfirmPasswordError("Confirm Password must be 8 to 12 characters");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (securityAnswer.length > SECURITY_ANSWER_MAX_LENGTH) {
      setSecurityAnswerError(
        `Security answer cannot exceed ${SECURITY_ANSWER_MAX_LENGTH} characters`
      );
      return;
    }

    const formattedPhone = phoneNumber.startsWith("+")
      ? phoneNumber
      : `+${phoneNumber}`;

    const payload: PhoneRegistrationData = {
      full_name: fullName,
      ...(registrationType === "phone"
        ? { phone_number: formattedPhone }
        : { email }),
      password,
      confirm_password: confirmPassword,
      security_question: securityQuestion,
      security_answer: securityAnswer,
      // role_id: "student",
      agree_to_terms: agreeToTerms,
    };

    try {
      saveRegistrationDraft({
        registrationType,
        phoneNumber,
        fullName,
        email,
        password,
        confirmPassword,
        securityQuestion,
        securityAnswer,
        agreeToTerms,
      });

      setLoading(true);

      const response =
        registrationType === "phone"
          ? await phoneRegistration(payload)
          : await emailRegistration(payload);
      console.log("Registration response:", response);

      const registeredUser = response?.data || response;
      const userId = registeredUser?.user_id || registeredUser?.id;
      const registeredPhone = registeredUser?.phone_number || formattedPhone;
      const registeredEmail = registeredUser?.email || email;

      if (userId) {
        localStorage.setItem("user_id", String(userId));
      }

      if (registrationType === "phone") {
        localStorage.setItem("phone_number", registeredPhone);
      } else {
        localStorage.setItem("email", registeredEmail);
      }

      localStorage.setItem("registration_type", registrationType);

      alert("Registration successful. Please select your role.");

      navigate("/select-role", {
        state: {
          user_id: userId,
          phone_number: registrationType === "phone" ? registeredPhone : null,
          email: registrationType === "email" ? registeredEmail : null,
          registration_type: registrationType,
        },
      });
    } catch (error: any) {
      console.error(error);
      alert(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
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
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mb-10 justify-between w-full">
          <button
            type="button"
            className={`pb-4 text-sm font-bold border-b-2 transition-colors ${registrationType === "email"
              ? "border-brand-green text-brand-green"
              : "border-transparent text-gray-900"
              }`}
            onClick={() => setRegistrationType("email")}
          >
            Email Registration
          </button>

          <button
            type="button"
            className={`pb-4 text-sm font-bold border-b-2 transition-colors ${registrationType === "phone"
              ? "border-brand-green text-brand-green"
              : "border-transparent text-gray-900"
              }`}
            onClick={() => setRegistrationType("phone")}
          >
            Phone Registration
          </button>
        </div>

        <div className="flex flex-col items-center mb-8">
          <Logo />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 mt-6 text-center">
            Create your Account
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm text-center">
            Create your AIcademy account to start learning
          </p>
        </div>

        <form className="w-full" onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-700 mb-2">
              Full Name
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-gray-400" />
              </div>

              <input
                type="text"
                required
                value={fullName}
                onCopy={blockClipboardAction}
                onCut={blockClipboardAction}
                onPaste={blockClipboardAction}
                onContextMenu={blockClipboardAction}
                onKeyDown={blockClipboardShortcut}
                onChange={(e) => {
                  const sanitizedName = e.target.value.replace(/[^a-zA-Z\s]/g, "");

                  if (sanitizedName.length > FULL_NAME_MAX_LENGTH) {
                    setFullNameError(`Full Name cannot exceed ${FULL_NAME_MAX_LENGTH} characters`);
                  } else {
                    setFullNameError("");
                  }

                  setFullName(sanitizedName.slice(0, FULL_NAME_MAX_LENGTH));
                }}
                className="block w-full pl-10 pr-3 py-3 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green"
                placeholder="Enter the full name "
              />
            </div>
            {fullNameError && (
              <p className="mt-1 text-xs font-medium text-red-600">
                {fullNameError}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-700 mb-2">
              {registrationType === "email" ? "Email Address" : "Phone Number"}
            </label>

            <div className="relative">
              {registrationType === "email" ? (
                <>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>

                  <input
                    type="email"
                    required={registrationType === 'email'}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (!e.target.value.trim() || isValidEmailFormat(e.target.value)) {
                        setEmailError("");
                      }
                    }}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green"
                    placeholder="Enter Your Email Address"
                  />
                  {emailError && (
                    <p className="mt-1 text-xs font-medium text-red-600">
                      {emailError}
                    </p>
                  )}
                </>
              ) : (
                <div className="w-full h-[46px]">
                  <PhoneInput
                    country="in"
                    value={phoneNumber}
                    onChange={(phone: string) => setPhoneNumber(phone)}
                    enableSearch={true}
                    countryCodeEditable={false}
                    disableCountryCode={false}
                    disableDropdown={false}
                    inputProps={{
                      name: "phone",
                      required: true,
                    }}
                    containerClass="!w-full !h-full"
                    inputClass="!w-full !h-full !border-gray-100 !shadow-[0_2px_10px_rgba(0,0,0,0.02)] !rounded-md !text-sm focus:!outline-none focus:!ring-1 focus:!ring-brand-green focus:!border-brand-green"
                    buttonClass="!bg-gray-50 !border-gray-100 !shadow-[0_2px_10px_rgba(0,0,0,0.02)] !rounded-l-md"

                  />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                Password
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>

                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onCopy={blockClipboardAction}
                  onCut={blockClipboardAction}
                  onPaste={blockClipboardAction}
                  onContextMenu={blockClipboardAction}
                  onKeyDown={blockClipboardShortcut}
                  onChange={(e) => {
                    const nextPassword = e.target.value;

                    if (nextPassword.length > PASSWORD_MAX_LENGTH) {
                      setPasswordError(PASSWORD_LENGTH_ERROR);
                    } else {
                      setPasswordError("");
                    }

                    setPassword(nextPassword.slice(0, PASSWORD_MAX_LENGTH));
                  }}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green tracking-[0.2em]"
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => {
                    setShowPassword((current) => {
                      const next = !current;

                      if (next) {
                        setShowConfirmPassword(false);
                      }

                      return next;
                    });
                  }}
                >
                  {showPassword ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="mt-1 text-xs font-medium text-red-600">
                  {passwordError}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                Confirm Password
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>

                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    const nextConfirmPassword = e.target.value;

                    if (nextConfirmPassword.length > PASSWORD_MAX_LENGTH) {
                      setConfirmPasswordError("Confirm Password must be 8 to 12 characters");
                    } else {
                      setConfirmPasswordError("");
                    }

                    setConfirmPassword(
                      nextConfirmPassword.slice(0, PASSWORD_MAX_LENGTH)
                    );
                  }}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green tracking-[0.2em]"
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => {
                    setShowConfirmPassword((current) => {
                      const next = !current;

                      if (next) {
                        setShowPassword(false);
                      }

                      return next;
                    });
                  }}
                >
                  {showConfirmPassword ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
              </div>
              {confirmPasswordError && (
                <p className="mt-1 text-xs font-medium text-red-600">
                  {confirmPasswordError}
                </p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-700 mb-2">
              Security Question
            </label>

            <div className="relative">
              <select required value={securityQuestion} onChange={(e) => setSecurityQuestion(e.target.value)} className="block w-full pl-3 pr-10 py-3 text-sm border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-md appearance-none focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green bg-white">
                <option value="">Select a Security Question</option>
                <option value="favorite_food">What is your Favorite Food?</option>
                <option value="favorite_country">What is your Favorite Country?</option>
                <option value="favorite_sport">What is your Favorite Sport?</option>
              </select>

              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <input
              type="text"
              required
              value={securityAnswer}
              onChange={(e) => {
                if (/\s/.test(e.target.value)) {
                  setSecurityAnswerError("Security answer cannot contain spaces");
                }

                const sanitizedAnswer = e.target.value.replace(/\s/g, "");

                if (sanitizedAnswer.length > SECURITY_ANSWER_MAX_LENGTH) {
                  setSecurityAnswerError(
                    `Security answer cannot exceed ${SECURITY_ANSWER_MAX_LENGTH} characters`
                  );
                } else if (!/\s/.test(e.target.value)) {
                  setSecurityAnswerError("");
                }

                setSecurityAnswer(
                  sanitizedAnswer.slice(0, SECURITY_ANSWER_MAX_LENGTH)
                );
              }}
              className="block w-full px-3 py-3 text-sm border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-md focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green"
              placeholder="Enter your answer"
            />
            {securityAnswerError && (
              <p className="mt-1 text-xs font-medium text-red-600">
                {securityAnswerError}
              </p>
            )}
          </div>

          <div className="flex items-center mb-6">
            <input
              id="terms"
              type="checkbox"
              required
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="h-4 w-4 text-brand-green focus:ring-brand-green border-gray-300 rounded"
            />

            <label htmlFor="terms" className="ml-2 block text-xs text-gray-700">
              I agree to the{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveLegalModal("terms");
                }}
                className="text-brand-green underline decoration-brand-green underline-offset-2"
              >
                Terms of use
              </a>{" "}
              and our{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveLegalModal("privacy");
                }}
                className="text-brand-green underline decoration-brand-green underline-offset-2"
              >
                privacy policy.
              </a>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-green hover:bg-brand-green-hover text-white font-bold py-3 px-4 rounded-md transition-colors mb-4 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <div className="text-center text-sm font-medium mb-6">
            <span className="text-gray-900">Already have an account? </span>
            <Link to="/login" className="text-[#FF6B6B] hover:text-[#ff5252]">
              Login
            </Link>
          </div>
        </form>
        </div>
      </SplitScreenLayout>

      <LegalModal
        isOpen={activeLegalModal === "terms"}
        title="Terms of Use"
        sections={TERMS_OF_USE_CONTENT}
        onClose={() => setActiveLegalModal(null)}
      />
      <LegalModal
        isOpen={activeLegalModal === "privacy"}
        title="Privacy Policy"
        sections={PRIVACY_POLICY_CONTENT}
        onClose={() => setActiveLegalModal(null)}
      />
    </>
  );
};

export default Register;
