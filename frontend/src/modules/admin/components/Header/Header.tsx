import React, { useState, useRef, useEffect } from 'react';
import './Header.css';
import { ChevronDown, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import adminProfile from '../../../../assets/admin_profile.jpeg';

interface HeaderProps {
  setActiveTab?: (tab: string) => void;
  handleLogout?: () => void;
  userEmail?: string;
  profileImage?: string | null;
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

const Header: React.FC<HeaderProps> = ({ setActiveTab, handleLogout, userEmail, profileImage, toggleSidebar }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const displayEmail = userEmail || localStorage.getItem("userEmail") || "kumar@icruise.com";
  const displayName =
    localStorage.getItem("userName") ||
    localStorage.getItem("full_name") ||
    localStorage.getItem("name") ||
    formatNameFromEmail(displayEmail);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
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
    setIsDropdownOpen(false);
    toast.dismiss();
    const logoutToastId = toast.success("Logged out successfully", {
      duration: 5000,
    });
    window.setTimeout(() => toast.dismiss(logoutToastId), 5000);
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="header-container">
      {toggleSidebar && (
        <button className="hamburger-btn" onClick={toggleSidebar}>
          <Menu size={24} color="#0F172A" />
        </button>
      )}
      <div className="profile-section" ref={dropdownRef}>
        <div className="profile-info" onClick={toggleDropdown} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
          <div className="profile-photo" style={{ 
            backgroundImage: `url(${profileImage || adminProfile})`,
            backgroundColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0F172A',
            fontSize: '18px',
            fontWeight: '600'
          }}>
          </div>
          <div className="profile-text">
            <span className="profile-name">{displayName}</span>
            <span className="profile-email">{displayEmail}</span>
          </div>
          <div className="dropdown-icon">
            <ChevronDown size={12} color="#4B4B4B" strokeWidth={3} />
          </div>
        </div>

        {isDropdownOpen && (
          <div className="profile-dropdown">
            <div className="dropdown-header">
              <span className="dropdown-text-light">Signed in as</span>
              <span className="dropdown-text-bold">{displayEmail}</span>
            </div>
            <div className="dropdown-links">
              <div className="dropdown-item" onClick={() => {
                if (setActiveTab) setActiveTab('profile');
                setIsDropdownOpen(false);
              }}>My Profile</div>
              <div className="dropdown-item" onClick={() => {
                if (setActiveTab) setActiveTab('settings');
                setIsDropdownOpen(false);
              }}>Settings</div>
            </div>
            <div className="dropdown-divider"></div>
            <div className="dropdown-item dropdown-logout" onClick={handleLogoutClick}>Log Out</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
