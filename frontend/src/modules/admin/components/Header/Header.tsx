import React, { useState, useRef, useEffect } from 'react';
import './Header.css';
import { ChevronDown, Menu } from 'lucide-react';

interface HeaderProps {
  setActiveTab?: (tab: string) => void;
  handleLogout?: () => void;
  userEmail?: string;
  profileImage?: string | null;
  toggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ setActiveTab, handleLogout, userEmail = 'admin@elearning.com', profileImage, toggleSidebar }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Format a simple display name from email (e.g., john.doe@example.com -> John Doe)
  const displayName = userEmail.split('@')[0].split(/[._-]/).map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
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
            backgroundImage: profileImage ? `url(${profileImage})` : 'none',
            backgroundColor: profileImage ? 'transparent' : '#E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0F172A',
            fontSize: '18px',
            fontWeight: '600'
          }}>
            {!profileImage && userEmail ? userEmail.charAt(0).toUpperCase() : ''}
          </div>
          <div className="profile-text">
            <span className="profile-name">{displayName}</span>
            <span className="profile-email">{userEmail}</span>
          </div>
          <div className="dropdown-icon">
            <ChevronDown size={12} color="#4B4B4B" strokeWidth={3} />
          </div>
        </div>

        {isDropdownOpen && (
          <div className="profile-dropdown">
            <div className="dropdown-header">
              <span className="dropdown-text-light">Signed in as</span>
              <span className="dropdown-text-bold">{userEmail}</span>
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
            <div className="dropdown-item dropdown-logout" onClick={() => {
              if (handleLogout) handleLogout();
              setIsDropdownOpen(false);
            }}>Log Out</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
