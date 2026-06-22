  import { Link } from "react-router-dom";
  import logo from "../../../../assets/sidebar_icons/Learning_Logo.svg";
  import dashboard from "../../../../assets/sidebar_icons/dashboard.svg";
  import courses from "../../../../assets/sidebar_icons/courses.svg";
  import students from "../../../../assets/sidebar_icons/students.svg";
  import assignments from "../../../../assets/sidebar_icons/assignments.svg";
  import settings from "../../../../assets/sidebar_icons/settings.svg";


  const navItems = [
    {
      label: "Dashboard",
      id: "dashboard",
      icon: dashboard,
    },      
    {
      label: "My Courses",
      id: "courses",
      icon: courses,
    },
    {
      label: "Students",
      id: "students",
      icon: students,
    },
    {
      label: "Assignments",
      id: "assignments",
      icon: assignments,
    },
    {
      label: "Settings",
      id: "settings",
      icon: settings,
    },
  ];

  type SidebarProps = {
    activeTab?: string;
    setActiveTab?: (tab: string) => void;
  };

  export default function Sidebar({ activeTab = "dashboard", setActiveTab }: SidebarProps) {
    return (
      <aside className="font-poppins w-[278px] min-h-screen bg-[#FFFFFF] flex flex-col shrink-0">
        {/* Logo */}
        <div className="px-6 pt-8 pb-8">
          <Link to="/" className="flex items-center gap-4 mb-2">
            <div className="w-7 h-7 bg-white rounded-md flex items-center justify-center">
              <img src={logo} alt="logo" />
            </div>
            <span className="w-[134px] h-[24px] text-[#238B45] text-[24px] font-semibold leading-[100%] flex items-center">
              E-Learning
            </span>
          </Link>
          <p className="w-[134px] h-[30px] ml-[47px] text-[#292D32] font-semibold text-[11px] leading-[100%] px-4 bg-[#F5F5F5] rounded-[5px] whitespace-nowrap flex items-center justify-center">
            Teacher Dashboard
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 flex flex-col gap-[5px]">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab?.(item.id)}
              className={`group flex w-[246px] h-[48px] items-center gap-3 rounded-[12px] px-4 py-3 text-left text-[16px] leading-[100%] transition-colors ${
                isActive
                  ? "bg-[#F1FFF6] text-[#238B45] font-semibold"
                  : "text-[#292D32] opacity-70 font-normal hover:bg-[#ECECEC] hover:text-[#292D32]"
              }`}
            >
              <img 
                className={`h-6 w-6 transition-all duration-200 brightness-0 saturate-100 ${
                  isActive ? "[filter:invert(41%)_sepia(97%)_saturate(392%)_hue-rotate(90deg)_brightness(94%)_contrast(91%)]" : ""
                }`}
                src={item.icon} 
                alt="Teacher Icons" 
              />
              {item.label}
            </button>
          )})}
        </nav>
      </aside>
    );
  }
