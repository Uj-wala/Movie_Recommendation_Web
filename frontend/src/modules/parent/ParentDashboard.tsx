import { useState, useRef, useEffect } from "react";
import type { KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ChevronDown } from "lucide-react";
import parentProfileImage from "../../assets/parent_profile .jpeg";

const ParentDashboard = () => {
  const navigate = useNavigate();

  // State Management
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isFilterActive, setIsFilterActive] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownItemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // User Profile Data
  const [profile] = useState(() => ({
    name:
      localStorage.getItem("userName") ||
      localStorage.getItem("full_name") ||
      localStorage.getItem("name") ||
      "Easin Arafat",
    email: localStorage.getItem("userEmail") || "parent@thestackly.com",
    image: localStorage.getItem("profileImage") || parentProfileImage,
  }));

  // Dropdown Auto-Close Handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Profile Menu Navigation Actions
  const handleDropdownAction = (actionName: string) => {
    setIsProfileOpen(false); 

    if (actionName === "My Profile") {
      navigate("/parent/profile");
    } else if (actionName === "Settings") {
      // Future settings logic
    } else if (actionName === "Log Out") {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
      localStorage.removeItem("full_name");
      localStorage.removeItem("name");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_role");
      setActiveTab("Dashboard");
      toast.success("Logged out successfully", {
        id: "auth-logout-success",
        duration: 3000,
      });
      navigate("/login", { replace: true });
    }
  };

  const dropdownActions = [
    { label: "My Profile", onSelect: () => handleDropdownAction("My Profile") },
    { label: "Settings", onSelect: () => handleDropdownAction("Settings") },
    { label: "Log Out", onSelect: () => handleDropdownAction("Log Out") },
  ];

  const handleProfileDropdownKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setIsProfileOpen(false);
      dropdownButtonRef.current?.focus();
      return;
    }

    if ((event.key === "Enter" || event.key === " ") && !isProfileOpen) {
      event.preventDefault();
      setIsProfileOpen(true);
      window.setTimeout(() => dropdownItemRefs.current[0]?.focus(), 0);
      return;
    }

    if (!isProfileOpen) return;

    const currentIndex = dropdownItemRefs.current.findIndex((item) => item === document.activeElement);

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

  const handleLogoClick = () => {
    navigate("/");
  };

  // Sidebar Menu 
  const menuItems = [
    {
      name: "Dashboard",
      icon: "/dashboard.png",
      iconClassName: "h-[20px] w-[20px]",
      textClassName: "w-[91px]",
      rightPadding: "pr-[47px]",
      inactiveTextColor: "text-[#292D32]",
    },
    {
      name: "Child Courses",
      icon: "/Child course.png",
      iconClassName: "h-[20px] w-[16px]",
      textClassName: "w-[111px]",
      rightPadding: "pr-[16px]",
      inactiveTextColor: "text-[#292D32]",
    },
    {
      name: "Child Progress",
      icon: "/child progress.png",
      iconClassName: "h-[20px] w-[20px]",
      textClassName: "w-[115px]",
      rightPadding: "pr-[47px]",
      inactiveTextColor: "text-[#1F1F1F]",
    },
    {
      name: "Attendance",
      icon: "/Attendance.png",
      iconClassName: "h-[20px] w-[22px]",
      textClassName: "w-[95px]",
      rightPadding: "pr-[47px]",
      inactiveTextColor: "text-[#1F1F1F]",
    },
    {
      name: "Assessments",
      icon: "/Assesment.png",
      iconClassName: "h-[20px] w-[18px]",
      textClassName: "w-[105px]",
      rightPadding: "pr-[16px]",
      inactiveTextColor: "text-[#292D32]",
    },
    {
      name: "Settings",
      icon: "/Setting.png",
      iconClassName: "h-[20px] w-[19px]",
      textClassName: "w-[65px]",
      rightPadding: "pr-[47px]",
      inactiveTextColor: "text-[#292D32]",
    },
  ];

  return (
    <div className="h-screen w-screen bg-[#FDFFFE] font-['Poppins',sans-serif] antialiased text-gray-900 flex overflow-hidden">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="flex h-screen w-[278px] min-w-[278px] flex-col border-r border-gray-100 px-[16px] pt-[32px]">
        
        {/* Brand Header & Logo */}
        <button
          type="button"
          onClick={handleLogoClick}
          className="ml-[24px] flex h-[56px] w-[174px] cursor-pointer items-start gap-[12px] border-none bg-transparent p-0 text-left outline-none"
        >
          <img
            src="/Frame 1000002962.png"
            alt="E-Learning Logo"
            className="w-6 h-6 object-contain"
          />

          <div className="flex h-[56px] w-[138px] flex-col">
            <h2 className="m-0 h-[24px] w-[138px] font-['Poppins',sans-serif] text-[24px] font-bold leading-none text-[#238B45]">
              E-Learning
            </h2>

            
            <div className="mt-[8px] box-border flex h-[28px] w-[122px] shrink-0 items-center justify-center whitespace-nowrap rounded-[4px] bg-[#F5F5F5] px-[10px] py-[8px] font-['Poppins',sans-serif] text-[11px] font-bold leading-none text-[#4B4B4B]">
              Parent Dashboard
            </div>
          </div>
        </button>

        {/* Sidebar Navigation Items */}
        <div className="mt-[48px] flex w-[246px] flex-col gap-[8px]">
          {menuItems.map((item) => {
            const isActive = activeTab === item.name;
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => setActiveTab(item.name)}
                className={`flex h-[48px] w-[246px] cursor-pointer items-center gap-[12px] rounded-[12px] border-none py-[12px] pl-[16px] pr-[16px] text-left outline-none transition-all ${
                  isActive ? "bg-[#EEF8F1] opacity-100" : "bg-transparent opacity-70"
                }`}
              >
                <img 
                  src={item.icon} 
                  alt={item.name} 
                  className={`${item.iconClassName} object-contain`}
                />
                
                <div
                  className={`h-[24px] min-w-0 flex-1 whitespace-nowrap font-['Poppins',sans-serif] text-[16px] leading-none ${
                    isActive ? "font-semibold text-[#238B45]" : `font-normal ${item.inactiveTextColor}`
                  }`}
                >
                  {item.name}
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen pl-9 pr-12">
        
        {/* TOP INTERACTIVE NAVBAR */}
        <div className="w-full pt-9 flex items-start justify-between">
          
          {/* Main Welcome Message Banner */}
          <div className="mt-[84px] flex h-[64px] w-[384px] flex-col gap-[4px]">
              <h1 className="m-0 h-[36px] w-[384px] font-['Poppins',sans-serif] text-[28px] font-semibold leading-none text-black">
                Welcome back, Larah! 👋
              </h1>
              <p className="m-0 h-[24px] w-[384px] font-['Poppins',sans-serif] text-[16px] font-normal leading-none text-[#8B8B8B]">
                Here's what's happening in your profile today.
              </p>
          </div>

          {/* User Account Menu Header */}
          <div className="relative" ref={dropdownRef} onKeyDown={handleProfileDropdownKeyDown}>
            <button
              ref={dropdownButtonRef}
              type="button"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex h-[40px] cursor-pointer select-none items-center gap-[10px] rounded-xl border-none bg-transparent p-0 outline-none transition-colors"
              aria-haspopup="menu"
              aria-expanded={isProfileOpen}
            >
              <img
                src={profile.image}
                alt={profile.name}
                className="h-[40px] w-[42px] rounded-[11px] object-cover"
              />
              <div className="flex w-[120px] flex-col gap-[3px] text-left text-[#000000]">
                <h4 className="m-0 h-[15px] w-[62px] overflow-hidden text-ellipsis whitespace-nowrap font-['Nunito',sans-serif] text-[11px] font-semibold leading-[100%] text-[#000000]">
                  {profile.name}
                </h4>
                <p className="m-0 h-[15px] w-[120px] whitespace-nowrap font-['Nunito',sans-serif] text-[13px] font-normal leading-[100%] text-[#000000] opacity-50">
                  {profile.email}
                </p>
              </div>
              <div className="ml-1 flex h-[17px] w-[17px] items-center justify-center rounded-[9px] bg-[#D9D9D9] transition-transform duration-200">
                <ChevronDown
                  size={12}
                  strokeWidth={3}
                  className={`text-[#4B4B4B] ${isProfileOpen ? "rotate-180" : ""}`}
                />
              </div>
            </button>

            {/* Account Settings Menu Dropdown */}
            {isProfileOpen && (
              <div
                className="absolute right-0 mt-2 bg-white border border-[#EAECF0] rounded-lg shadow-lg z-50 overflow-hidden w-[220px]"
                role="menu"
                onMouseLeave={() => setIsProfileOpen(false)}
              >
                <div className="p-3 border-b border-[#EAECF0] text-left">
                  <p className="text-[11px] text-[#667085]">Signed in as</p>
                  <p className="truncate font-bold text-gray-900 text-xs">
                    {profile.email}
                  </p>
                </div>
                <div className="py-1">
                  <button 
                    ref={(element) => {
                      dropdownItemRefs.current[0] = element;
                    }}
                    type="button"
                    role="menuitem"
                    onClick={() => handleDropdownAction("My Profile")}
                    className="w-full cursor-pointer border-none bg-transparent px-4 py-2 text-left text-sm text-gray-700 outline-none transition-colors hover:bg-[#EEF8F1] hover:text-brand-green focus:bg-[#EEF8F1] focus:text-brand-green"
                  >
                    My Profile
                  </button>
                  <button 
                    ref={(element) => {
                      dropdownItemRefs.current[1] = element;
                    }}
                    type="button"
                    role="menuitem"
                    onClick={() => handleDropdownAction("Settings")}
                    className="w-full cursor-pointer border-none bg-transparent px-4 py-2 text-left text-sm text-gray-700 outline-none transition-colors hover:bg-[#EEF8F1] hover:text-brand-green focus:bg-[#EEF8F1] focus:text-brand-green"
                  >
                    Settings
                  </button>
                </div>
                <div className="border-t border-[#EAECF0] py-1 text-left">
                  <button 
                    ref={(element) => {
                      dropdownItemRefs.current[2] = element;
                    }}
                    type="button"
                    role="menuitem"
                    onClick={() => handleDropdownAction("Log Out")}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 focus:bg-red-50 transition-colors font-medium cursor-pointer border-none bg-transparent outline-none text-sm"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SEARCH AND FILTER */}
        <div className="w-[1090px] max-w-full">
            <div className="mt-9 flex h-[96px] w-full items-center gap-[24px] rounded-[12px] bg-white p-[24px]">
              
              {/* Main Search Input field */}
              <div className="flex h-[48px] w-[876px] items-center rounded-[8px] bg-[#F5F5F5] px-4">
                <img
                  src="/search.png"
                  alt="Search Icon"
                  className="h-5 w-5 object-contain"
                />
                <input
                  type="text"
                  placeholder="Search by user name, user ID..."
                  className="ml-3 w-full bg-transparent outline-none border-none font-['Poppins'] text-base font-normal text-[#292D32]"
                />
              </div>

              {/* Data Filtering Utility Button */}
              <button
                type="button"
                onClick={() => setIsFilterActive(!isFilterActive)}
                aria-pressed={isFilterActive}
                className="box-border flex h-[48px] w-[142px] flex-shrink-0 cursor-pointer items-center justify-between rounded-[8px] border-none bg-[#F5F5F5] px-[24px] py-[15px] opacity-100 outline-none"
              >
                <svg
                  className="h-[28px] w-[28px] flex-shrink-0"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M4.25 5.61C6.27 8.2 10 13 10 13V19C10 19.55 10.45 20 11 20H13C13.55 20 14 19.55 14 19V13C14 13 17.72 8.2 19.74 5.61C20.25 4.95 19.78 4 18.95 4H5.04C4.21 4 3.74 4.95 4.25 5.61Z"
                    fill="#238B45"
                  />
                </svg>
            
                <div className="h-[18px] w-[55px] font-['Poppins',sans-serif] text-[18px] font-semibold leading-none text-[#4B4B4B]">
                  Filters
                </div>
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
