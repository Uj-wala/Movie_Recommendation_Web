import React from 'react';
import './Header.css';
import { Menu } from 'lucide-react';
import adminProfile from '../../../../assets/admin_profile.jpeg';
import { ProfileMenu } from '../../../profile';
import Logout from '../../../../components/Logout';

interface HeaderProps {
  setActiveTab?: (tab: string) => void;
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

const Header: React.FC<HeaderProps> = ({ setActiveTab, userEmail, toggleSidebar }) => {
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

  return (
    <div className="header-container">
      {toggleSidebar && (
        <button className="hamburger-btn" onClick={toggleSidebar}>
          <Menu size={24} color="#0F172A" />
        </button>
      )}
      <Logout
        redirectTo="/login"
        toastDuration={5000}
        dismissExistingToasts
        dismissSuccessAfterMs={5000}
      >
        {({ logout }) => (
          <ProfileMenu
            userEmail={displayEmail}
            userName={displayName}
            userRole="Admin"
            avatarSrc={adminProfile}
            onProfileClick={handleProfileClick}
            onSettingsClick={handleSettingsClick}
            onLogoutClick={logout}
          />
        )}
      </Logout>
    </div>
  );
};

export default Header;
