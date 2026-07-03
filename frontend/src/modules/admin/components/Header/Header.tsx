import React, { useEffect, useState } from 'react';
import './Header.css';
import { Menu } from 'lucide-react';
import { ProfileMenu } from '../../../profile';
import Logout from '../../../../components/Logout';
import api from '../../../../api/axios';

interface HeaderProps {
  setActiveTab?: (tab: string) => void;
  userEmail?: string;
  toggleSidebar?: () => void;
}

type AuthenticatedProfile = {
  full_name?: string | null;
  email?: string | null;
  phone_number?: string | null;
  role?: string | null;
  profile_image?: string | null;
};

const Header: React.FC<HeaderProps> = ({ setActiveTab, userEmail, toggleSidebar }) => {
  const [profile, setProfile] = useState<AuthenticatedProfile | null>(null);
  const displayIdentifier = profile?.email || profile?.phone_number || userEmail || "";

  useEffect(() => {
    let isMounted = true;

    api.get<AuthenticatedProfile>("/auth/me")
      .then(({ data }) => {
        if (isMounted) setProfile(data);
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
            userEmail={displayIdentifier}
            userName={profile?.full_name || ""}
            userRole={profile?.role || ""}
            avatarSrc={profile?.profile_image || undefined}
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
