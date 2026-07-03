import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Send, User, UserPlus, X } from "lucide-react";
import "./SuccessModal.css";
import adminPopUpLogo from "../assets/admin_pop_up.jpeg";

type SuccessMember = {
  name?: string;
  email?: string;
  role_name?: string;
  registration_number?:string;
};

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  buttonText?: string;
  redirectUrl?: string;
  onPrimaryAction?: () => void;
  variant?: "default" | "memberAdded";
  member?: SuccessMember | null;
  onAddAnother?: () => void;
  role?: string; registrationNumber?: string; 
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  title = "Success!",
  message = "Your details have been submitted successfully.",
  buttonText = "Continue",
  redirectUrl = "/",
  onPrimaryAction,
  variant = "default",
  member,
  onAddAnother,
  role,
  registrationNumber,
}) => {
  if (!isOpen) return null;

  if (variant === "memberAdded") {
    const displayName = member?.name?.trim() || "";
    const firstName = displayName.split(" ")[0] || "";
    const displayEmail = member?.email?.trim() || "";
    const displayRole = member?.role_name?.trim() || "";
    const displayRegistrationNumber = member?.registration_number?.trim() || "";

    return (
      <div className="success-modal-overlay member-success-overlay">
        <div className="member-success-modal" role="dialog" aria-modal="true" aria-labelledby="member-success-title">
          <button className="member-success-close" onClick={onClose} aria-label="Close modal">
            <X size={20} strokeWidth={2} />
          </button>

          <div className="member-success-icon-wrap" aria-hidden="true">
            <img className="member-success-logo" src={adminPopUpLogo} alt="" />
          </div>

          <h2 className="member-success-title" id="member-success-title">
            Member Added Successfully!
          </h2>
          <p className="member-success-subtitle">
            {firstName ? `Invitation has been sent to ${firstName}` : "Invitation has been sent"}
          </p>

          <div className="member-details-card">
            <div className="member-avatar" aria-hidden="true">
              <User size={31} strokeWidth={2.1} />
            </div>
            <div className="member-details-content">
              {displayName && <h3 className="member-name">{displayName}</h3>}
              <div className="member-meta-grid">
                {displayEmail && <div className="member-meta-item">
                  <span>Email</span>
                  <strong>{displayEmail}</strong>
                </div>}
                {displayRole && <div className="member-meta-item">
                  <span>Role</span>
                  <strong className="member-role-pill">
                    <User size={11} strokeWidth={2} />
                    {displayRole}
                  </strong>
                </div>}
                {displayRegistrationNumber && <div className="member-meta-item">
                  <span>Employee ID</span>
                  <strong>{displayRegistrationNumber}</strong>
                </div>}
              </div>
            </div>
          </div>

          <div className="member-next-card">
            <Send className="member-next-icon" size={22} strokeWidth={2.2} />
            <div>
              <h3>What happens next?</h3>
              <ul>
                {displayEmail && <li>An email invitation has been sent to {displayEmail}</li>}
                <li>They will receive login credentials and onboarding instructions</li>
                <li>Account status will change from "Pending" to "Active" once they accept</li>
                <li>You can track their status in the members list below</li>
              </ul>
            </div>
          </div>

          <div className="member-success-actions">
            <button className="member-secondary-btn" onClick={onClose}>
              <Eye size={16} strokeWidth={2.1} />
              View Members List
            </button>
            <button className="member-primary-btn" onClick={onAddAnother || onClose}>
              <UserPlus size={16} strokeWidth={2.1} />
              Add Another Member
            </button>
          </div>
        </div>
      </div>
    );
  }

  const actionButton = onPrimaryAction ? (
    <button
      type="button"
      onClick={onPrimaryAction}
      className="w-full rounded-xl bg-[#299555] px-4 py-4 text-[16px] font-bold text-white shadow-sm transition-colors hover:bg-[#238148]"
    >
      {buttonText}
    </button>
  ) : (
    <Link
      to={redirectUrl}
      onClick={onClose}
      className="w-full inline-block text-center bg-[#299555] hover:bg-[#238148] text-white font-bold py-4 px-4 rounded-xl text-[16px] transition-colors shadow-sm"
    >
      {buttonText}
    </Link>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
  <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[460px] p-10 relative animate-in fade-in zoom-in duration-200">
    <button
      type="button"
      onClick={onClose}
      aria-label="Close success message"
      className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-2xl leading-none text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#299555]/40"
    >
      &times;
    </button>

    <div className="flex flex-col items-center text-center">
      {/* Title */}
      <h2 className="text-[34px] font-bold text-[#333333] mb-2 font-sans tracking-tight">
        {title}
      </h2>

      {/* Message */}
      <p className="text-[#666666] text-[15px] whitespace-pre-line break-words">
        {message}
      </p>

      {/* Registration Number */}
      {registrationNumber && (
        <div className="mt-6 mb-8 text-center">
          <p className="text-gray-500 text-sm font-medium">
            {role
              ? `${role.charAt(0).toUpperCase() + role.slice(1)} Registration Number`
              : "Registration Number"}
          </p>

          <h3 className="text-2xl font-bold text-[#299555] mt-2">
            {registrationNumber}
          </h3>
        </div>
      )}

      {/* Success Image */}
      <div className="relative w-[180px] h-[180px] mb-10 flex items-center justify-center">
        <img
          src="/Group%201000002268.png"
          alt="Success Thumbs Up"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Button */}
      {actionButton}
    </div>
  </div>
</div>
  );
};

export default SuccessModal;
