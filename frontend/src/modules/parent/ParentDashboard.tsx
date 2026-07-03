import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileMenu } from "../profile";
import Logout from "../../components/Logout";
import { useLogoNavigation } from "../../hooks/useLogoNavigation";
import { getParentDashboard } from "../../services/ParentDashboardProfileService";
import { handleSidebarKeyDown } from "../../utils/sidebarKeyboardNavigation";

const ParentDashboard = () => {
  const navigate = useNavigate();
  const handleLogoClick = useLogoNavigation();

  // State Management
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isFilterActive, setIsFilterActive] = useState(false);
  interface ParentDashboardResponse {
    parent_id: string;
    parent_name: string;
    parent_email: string;
    parent_phone_number: string;
    profile_image_url: string | null;
    role: string | null;

    child: {
      id: string;
      name: string;
      registration_number: string;
      grade: string | null;
      school_name: string | null;
    };

    progress: {
      course_completion_percentage: number;
    };

    tests: {
      pending: number;
      ongoing: number;
      completed: number;
    };
  }

  const [dashboardData, setDashboardData] =
    useState<ParentDashboardResponse | null>(null);

  // User Profile Data
  const profile = {
    name:
      dashboardData?.parent_name || "",
    email:
      dashboardData?.parent_email || "",
    phone:
      dashboardData?.parent_phone_number || "",
    image:
      dashboardData?.profile_image_url || undefined,
  };

  const handleProfileClick = () => {
    navigate("/parent/profile");
  };

  const handleSettingsClick = () => {
    setActiveTab("Settings");
  };

  const handleMenuItemClick = (itemName: string) => {
    // Parent dashboard modules are highlight-only until their pages are available.
    setActiveTab(itemName);
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

  const fetchDashboardData = async () => {
    try {
      const response = await getParentDashboard();
      setDashboardData(response);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  // Fetch dashboard data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-[#FDFFFE] font-['Poppins',sans-serif] antialiased text-gray-900">

      {/* SIDEBAR NAVIGATION */}
      <aside className="flex h-full w-[278px] min-w-[278px] flex-col border-r border-gray-100 px-[16px] pt-[32px]">

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
        <nav
          aria-label="Parent dashboard"
          className="mt-[48px] flex w-[246px] flex-col gap-[8px]"
          onKeyDown={handleSidebarKeyDown}
        >
          {menuItems.map((item) => {
            const isActive = activeTab === item.name;
            return (
              <button
                key={item.name}
                type="button"
                data-sidebar-item
                aria-current={isActive ? "page" : undefined}
                onClick={() => handleMenuItemClick(item.name)}
                className={`flex h-[48px] w-[246px] cursor-pointer items-center gap-[12px] rounded-[12px] border-none py-[12px] pl-[16px] pr-[16px] text-left outline-none transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#238B45] ${isActive ? "bg-[#EEF8F1] opacity-100" : "bg-transparent opacity-70"
                  }`}
              >
                <img
                  src={item.icon}
                  alt={item.name}
                  className={`${item.iconClassName} object-contain`}
                />

                <div
                  className={`h-[24px] min-w-0 flex-1 whitespace-nowrap font-['Poppins',sans-serif] text-[16px] leading-none ${isActive ? "font-semibold text-[#238B45]" : `font-normal ${item.inactiveTextColor}`
                    }`}
                >
                  {item.name}
                </div>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden pl-9 pr-12">

        {/* TOP INTERACTIVE NAVBAR */}
        <div className="w-full pt-[21px] flex items-start justify-between">

          {/* Main Welcome Message Banner */}
          <div className="mt-[84px] flex h-[64px] w-[384px] flex-col gap-[4px]">
            <h1 className="m-0 h-[36px] w-[384px] font-['Poppins',sans-serif] text-[28px] font-semibold leading-none text-black">
              {dashboardData?.parent_name
                ? `Welcome back, ${dashboardData.parent_name}! 👋`
                : "Welcome back! 👋"}
            </h1>
            <p className="m-0 h-[24px] w-[384px] font-['Poppins',sans-serif] text-[16px] font-normal leading-none text-[#8B8B8B]">
              Here's what's happening in your profile today.
            </p>
          </div>

          <Logout redirectTo="/login" toastDuration={3000}>
            {({ logout }) => (
              <ProfileMenu
                userEmail={profile.email}
                userName={profile.name}
                userRole={dashboardData?.role || ""}
                avatarSrc={profile.image}
                onProfileClick={handleProfileClick}
                onSettingsClick={handleSettingsClick}
                onLogoutClick={logout}
              />
            )}
          </Logout>
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
