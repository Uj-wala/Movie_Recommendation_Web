import React, { useEffect, useState } from 'react';
import './Header.css';
import { Menu } from 'lucide-react';
import adminProfile from '../../../../assets/admin_profile.jpeg';
import { ProfileMenu } from '../../../profile';
import Logout from '../../../../components/Logout';
import api from '../../../../api/axios';

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
  const displayEmail = userEmail || localStorage.getItem("userEmail") || "";
  const [authenticatedName, setAuthenticatedName] = useState("");
  const displayName =
    authenticatedName ||
    localStorage.getItem("userName") ||
    localStorage.getItem("full_name") ||
    localStorage.getItem("name") ||
    formatNameFromEmail(displayEmail);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;

    let isMounted = true;

    api.get<{ name?: string }>(`/admin/users/${userId}`)
      .then(({ data }) => {
        const name = data.name?.trim();
        if (!name || !isMounted) return;

        localStorage.setItem("userName", name);
        setAuthenticatedName(name);
      })
      .catch((error) => {
        console.error("Unable to load authenticated admin details", error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

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
