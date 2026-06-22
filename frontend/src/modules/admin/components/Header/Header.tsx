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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownItemRefs = useRef<Array<HTMLButtonElement | null>>([]);
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

  const handleSettingsClick = () => {
    if (setActiveTab) setActiveTab('settings');
    setIsDropdownOpen(false);
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

  const dropdownActions = [
    {
      label: "My Profile",
      className: "dropdown-item",
      onSelect: () => setIsDropdownOpen(false),
    },
    {
      label: "Settings",
      className: "dropdown-item",
      onSelect: handleSettingsClick,
    },
    {
      label: "Log Out",
      className: "dropdown-item dropdown-logout",
      onSelect: handleLogoutClick,
    },
  ];

  const handleProfileDropdownKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setIsDropdownOpen(false);
      dropdownButtonRef.current?.focus();
      return;
    }

    if ((event.key === "Enter" || event.key === " ") && !isDropdownOpen) {
      event.preventDefault();
      setIsDropdownOpen(true);
      window.setTimeout(() => dropdownItemRefs.current[0]?.focus(), 0);
      return;
    }

    if (!isDropdownOpen) return;

    const currentIndex = dropdownItemRefs.current.findIndex(
      (item) => item === document.activeElement
    );

    if (event.key === "ArrowDown") {
      event.preventDefault();
      const nextIndex = currentIndex < dropdownActions.length - 1 ? currentIndex + 1 : 0;
      dropdownItemRefs.current[nextIndex]?.focus();
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      const previousIndex = currentIndex > 0 ? currentIndex - 1 : dropdownActions.length - 1;
      dropdownItemRefs.current[previousIndex]?.focus();
    }
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
      <div className="profile-section" ref={dropdownRef} onKeyDown={handleProfileDropdownKeyDown}>
        <button
          ref={dropdownButtonRef}
          type="button"
          className="profile-info profile-trigger"
          onClick={toggleDropdown}
          aria-haspopup="menu"
          aria-expanded={isDropdownOpen}
        >
          <div className="profile-photo" style={{ 
            backgroundImage: `url(${adminProfile})`,
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
        </button>

        {isDropdownOpen && (
          <div
            className="profile-dropdown"
            role="menu"
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <div className="dropdown-header">
              <span className="dropdown-text-light">Signed in as</span>
              <span className="dropdown-text-bold">{displayEmail}</span>
            </div>
            <div className="dropdown-links">
              {dropdownActions.slice(0, 2).map((item, index) => (
                <button
                  key={item.label}
                  ref={(element) => {
                    dropdownItemRefs.current[index] = element;
                  }}
                  type="button"
                  role="menuitem"
                  className={item.className}
                  onClick={item.onSelect}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="dropdown-divider"></div>
            <button
              ref={(element) => {
                dropdownItemRefs.current[2] = element;
              }}
              type="button"
              role="menuitem"
              className="dropdown-item dropdown-logout"
              onClick={handleLogoutClick}
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
