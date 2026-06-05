import React, { useState } from "react";
import { X, AlertTriangle, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { verifyBlockedAccount } from "../services/authService";

interface AccountBlockedModalProps {
  isOpen: boolean;
  onClose: () => void;
  identifier: string;
  blockedData: any;
}

const AccountBlockedModal: React.FC<AccountBlockedModalProps> = ({
  isOpen,
  onClose,
  identifier,
}) => {
  const [securityQuestion, setSecurityQuestion] =
    useState("");

  const [securityAnswer, setSecurityAnswer] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-8 relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center text-center mt-4">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Account Blocked
          </h2>

          <p className="text-gray-500 text-sm mb-8 max-w-sm">
            Your account has been temporarily blocked due to multiple failed
            login attempts. To reset your password, please answer your security
            question.
          </p>

          <form
            className="w-full text-left"
            onSubmit={async (e) => {

              e.preventDefault();

              if (!securityQuestion) {
                setError(
                  "Please select a security question"
                );
                return;
              }

              if (!securityAnswer.trim()) {
                setError(
                  "Please enter your security answer"
                );
                return;
              }

              try {

                setLoading(true);
                setError("");

                const response =
                  await verifyBlockedAccount(
                    identifier,
                    securityQuestion,
                    securityAnswer
                  );

                console.log(
                  "Verification Success:",
                  response
                );

                navigate(
                  "/forgot-password",
                  {
                    state: {
                      email_or_phone: identifier,
                      fromBlockedAccount: true
                    }
                  }
                );

                onClose();

              } catch (error: any) {

                setError(
                  error?.response?.data?.detail ||
                  "Verification failed"
                );

              } finally {

                setLoading(false);
              }
            }}
          >
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-900 mb-2">
                Security Question
              </label>
              <div className="relative">
                <select
                  value={securityQuestion}
                  onChange={(e) =>
                    setSecurityQuestion(e.target.value)
                  }
                  className="block w-full appearance-none px-3 py-3 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green"
                >
                  <option value="">
                    Select a Security Question
                  </option>

                  <option value="favorite_food">
                    What is your Favorite Food?
                  </option>

                  <option value="favorite_country">
                    What is your Favorite Country?
                  </option>

                  <option value="favorite_sport">
                    What is your Favorite Sport?
                  </option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-xs font-bold text-gray-900 mb-2">
                Answer
              </label>
              <input
                type="text"
                value={securityAnswer}
                onChange={(e) =>
                  setSecurityAnswer(
                    e.target.value
                  )
                }
                className="block w-full px-3 py-3 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green"
                placeholder="Type your answer here"
              />
            </div>
            {error && (
              <div className="mb-4">
                <p className="text-red-500 text-sm">
                  {error}
                </p>
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-brand-green hover:bg-brand-green-hover text-white font-bold py-3 px-4 rounded-md transition-colors mb-4"
            >
              {
                loading
                  ? "Verifying..."
                  : "Verify & Reset Password"
              }            </button>

            <div className="text-center text-sm">
              <span className="text-gray-400">
                Can't remember your answer?{" "}
              </span>
              <a
                href="#"
                className="text-red-400 hover:text-red-500 font-medium"
              >
                Contact Support
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccountBlockedModal;
