import React from 'react';
import './Header.css';
import { Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import adminProfile from '../../../../assets/admin_profile.jpeg';
import { ProfileMenu } from '../../../profile';

interface HeaderProps {
  setActiveTab?: (tab: string) => void;
  handleLogout?: () => void;
  userEmail?: string;
  toggleSidebar?: () => void;
}

const formatNameFromEmail = (email: string) => {
  const localPart = email.split("@")[0] || "";
  const words = localPart
    .replace(/[._-]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) return "Admin";

  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const Header: React.FC<HeaderProps> = ({ setActiveTab, handleLogout, userEmail, toggleSidebar }) => {
  const navigate = useNavigate();

  const displayEmail = userEmail || localStorage.getItem("userEmail") || "kumar@icruise.com";
  const displayName =
    localStorage.getItem("userName") ||
    localStorage.getItem("full_name") ||
    localStorage.getItem("name") ||
    formatNameFromEmail(displayEmail);

  const handleProfileClick = () => {
    if (setActiveTab) setActiveTab('dashboard');
  };

  const handleSettingsClick = () => {
    if (setActiveTab) setActiveTab('settings');
  };

  const handleLogoutClick = () => {
    if (handleLogout) handleLogout();
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("full_name");
    localStorage.removeItem("name");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_role");
    toast.dismiss();
    const logoutToastId = toast.success("Logged out successfully", {
      duration: 5000,
    });
    window.setTimeout(() => toast.dismiss(logoutToastId), 5000);
    navigate("/login", { replace: true });
  };

  return (
    <div className="header-container">
      {toggleSidebar && (
        <button className="hamburger-btn" onClick={toggleSidebar}>
          <Menu size={24} color="#0F172A" />
        </button>
      )}
      <ProfileMenu
        userEmail={displayEmail}
        userName={displayName}
        userRole="Admin"
        avatarSrc={adminProfile}
        onProfileClick={handleProfileClick}
        onSettingsClick={handleSettingsClick}
        onLogoutClick={handleLogoutClick}
      />
    </div>
  );
};

export default Header;
