  import { NavLink } from "react-router-dom";
  import logo from "../../assets/sidebar_icons/Learning_Logo.svg";
  import dashboard from "../../assets/sidebar_icons/dashboard.svg";
  import courses from "../../assets/sidebar_icons/courses.svg";
  import students from "../../assets/sidebar_icons/students.svg";
  import assignments from "../../assets/sidebar_icons/assignments.svg";
  import settings from "../../assets/sidebar_icons/settings.svg";


  const navItems = [
    {
      label: "Dashboard",
      path: "teacher/dashboard",
      icon: dashboard,
    },      
    {
      label: "My Courses",
      path: "/teacher/courses",
      icon: courses,
    },
    {
      label: "Students",
      path: "teacher/students",
      icon: students,
    },
    {
      label: "Assignments",
      path: "teacher/assignments",
      icon: assignments,
    },
    {
      label: "Settings",
      path: "teacher/settings",
      icon: settings,
    },
  ];

  export default function Sidebar() {
    return (
      <aside className="font-poppins w-[278px] min-h-screen bg-[#FFFFFF] flex flex-col shrink-0">
        {/* Logo */}
        <div className="px-5 pt-6 pb-8 ">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 bg-white rounded-md flex items-center justify-center">
              <img src={logo} alt="logo" />
            </div>
            <span className="text-[#238B45] text-[24px] font-medium text-base leading-tight">E-Learning</span>
          </div>
          <p className="w-[108px] h-[24px] ml-[40px] text-[#000] font-medium text-[9px] px-3 bg-[#F5F5F5] rounded-[4px] whitespace-nowrap flex items-center justify-center">Teacher Dashboard</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#F1FFF6] text-[#238B45]"
                    : "text-[#000] hover:bg-[#ECECEC] hover:text-[#000]"
                }`
              }
            >
              <img 
                className="h-6 w-6 transition-all duration-200 brightness-0 saturate-100 
                          group-aria-[current=page]:[filter:invert(41%)_sepia(97%)_saturate(392%)_hue-rotate(90deg)_brightness(94%)_contrast(91%)]" 
                src={item.icon} 
                alt="Teacher Icons" 
              />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    );
  }