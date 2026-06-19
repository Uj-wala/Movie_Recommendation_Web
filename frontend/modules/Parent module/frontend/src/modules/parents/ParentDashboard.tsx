 import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, ChevronDown } from "lucide-react";

const ParentDashboard = () => {
  const navigate = useNavigate();

  // State Management
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isFilterActive, setIsFilterActive] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // User Profile Data
  const [profile] = useState({
    name: "Easin Arafat",
    email: "kumar@elearn.com",
    image: "image.png",
  });

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
      navigate("/parentprofile");
    } else if (actionName === "Settings") {
      // Future settings logic
    } else if (actionName === "Log Out") {
      setActiveTab("Dashboard");
    }
  };

  const handleLogoClick = () => {
    setActiveTab("Dashboard");
  };

  // Sidebar Menu 
  const menuItems = [
    { name: "Dashboard", icon: "/dashboard.png" },
    { name: "Child Courses", icon: "/Child course.png" },
    { name: "Child Progress", icon: "/child progress.png" },
    { name: "Attendance", icon: "/Attendance.png" },
    { name: "Assessments", icon: "/Assesment.png" },
    { name: "Settings", icon: "/Setting.png" },
  ];

  return (
    <div className="h-screen w-screen bg-[#FDFFFE] font-['Poppins',sans-serif] antialiased text-gray-900 flex overflow-hidden">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-[278px] min-w-[278px] h-screen p-9 flex flex-col gap-9 border-r border-gray-100">
        
        {/* Brand Header & Logo */}
        <button
          type="button"
          onClick={handleLogoClick}
          className="flex items-start gap-[12px] p-0 bg-transparent border-none outline-none cursor-pointer"
        >
          <img
            src="/Frame 1000002962.png"
            alt="E-Learning Logo"
            className="w-6 h-6 object-contain"
          />

          <div className="flex flex-col">
            <h2 className="text-[24px] font-bold leading-none text-[#238B45] m-0">
              E-Learning
            </h2>

            
            <div className="mt-[8px] w-fit rounded-[4px] bg-[#F5F5F5] px-[9px] py-[8px] text-[10px] font-bold leading-none text-[#292D32]">
              Parent Dashboard
            </div>
          </div>
        </button>

        {/* Sidebar Navigation Items */}
        <div className="flex flex-col gap-2 w-full">
          {menuItems.map((item) => {
            const isActive = activeTab === item.name;
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => setActiveTab(item.name)}
                className={`flex h-[52px] items-center gap-3 rounded-xl px-4 transition-all cursor-pointer border-none outline-none text-left w-full ${
                  isActive ? "bg-[#EEF8F1]" : "bg-transparent"
                }`}
              >
                <img 
                  src={item.icon} 
                  alt={item.name} 
                  className="w-5 h-5 object-contain"
                />
                
                <div
                  className={`text-base leading-none ${
                    isActive ? "font-semibold text-brand-green" : "font-normal text-[#292D32]"
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
          {activeTab === "Dashboard" ? (
            <div className="w-full max-w-[384px] h-[64px] mt-[84px] flex flex-col gap-1">
              <h1 className="text-[28px] font-semibold leading-[36px] text-black m-0">
                Welcome back, Larah!👋
              </h1>
              <p className="text-[#667085] text-base font-normal leading-6 m-0">
                Here's what's happening in your profile today.
              </p>
            </div>
          ) : (
            <div />
          )}

          {/* User Account Menu Header */}
          <div className="relative" ref={dropdownRef}>
            <div
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 cursor-pointer select-none rounded-lg p-1 transition-colors hover:bg-gray-50 w-[167px] h-[42px] opacity-80"
            >
              <img
                src={profile.image}
                alt={profile.name}
                className="h-10 w-10 rounded-md object-cover"
              />
              <div>
                <h4 className="text-xs font-semibold text-[#344054] m-0">
                  {profile.name}
                </h4>
                <p className="text-[10px] text-[#98A2B3] m-0">
                  {profile.email}
                </p>
              </div>
              <div className="flex items-center justify-center rounded-full p-1 transition-transform duration-200 ml-auto bg-[#4B4B4B]">
                <ChevronDown
                  size={12}
                  className={`text-white ${isProfileOpen ? "rotate-180" : ""}`}
                />
              </div>
            </div>

            {/* Account Settings Menu Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 bg-white border border-[#EAECF0] rounded-lg shadow-lg z-50 overflow-hidden w-[220px]">
                <div className="p-3 border-b border-[#EAECF0] text-left">
                  <p className="text-[11px] text-[#667085]">Signed in as</p>
                  <p className="truncate font-bold text-gray-900 text-xs">
                    {profile.email}
                  </p>
                </div>
                <div className="py-1">
                  <button 
                    type="button"
                    onClick={() => handleDropdownAction("My Profile")}
                    className="w-full text-center px-4 py-2 text-gray-700 hover:bg-[#EEF8F1] hover:text-brand-green transition-colors cursor-pointer border-none bg-transparent outline-none text-sm"
                  >
                    My Profile
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleDropdownAction("Settings")}
                    className="w-full text-center px-4 py-2 text-gray-700 hover:bg-[#EEF8F1] hover:text-brand-green transition-colors cursor-pointer border-none bg-transparent outline-none text-sm"
                  >
                    Settings
                  </button>
                </div>
                <div className="border-t border-[#EAECF0] py-1 text-left">
                  <button 
                    type="button"
                    onClick={() => handleDropdownAction("Log Out")}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors font-medium cursor-pointer border-none bg-transparent outline-none text-sm"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SEARCH AND FILTER */}
        {activeTab === "Dashboard" && (
          <div className="w-full max-w-[1090px]">
            <div className="w-full h-24 mt-9 rounded-xl py-6 px-0 bg-white flex items-center gap-6">
              
              {/* Main Search Input field */}
              <div className="flex items-center bg-[#F5F5F5] px-4 w-full max-w-[876px] h-12 rounded-lg ml-3">
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
                className="flex items-center cursor-pointer transition-all hover:opacity-90 border-none outline-none flex-shrink-0 w-[142px] h-12 rounded-lg py-[15px] px-6 justify-center gap-3 bg-[#F5F5F5]"
              >
                <Filter
                  size={20}
                  className="fill-brand-green text-brand-green"
                  strokeWidth={0} 
                />
            
                <div className="font-['Poppins',_sans-serif] font-semibold text-base text-[#4A4A4A]">
                  Filters
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentDashboard;