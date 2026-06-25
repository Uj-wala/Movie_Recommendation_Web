import React, { useEffect, useRef, useState } from "react";
import {getTeacherDashboard,type TeacherDashboard,} from "../../../services/teacherProfileService";
import {
  Star,
  ChevronDown,
} from "lucide-react";
import teacherIcon1 from "../../../assets/Teacher_icon_1.jpeg";
import teacherIcon2 from "../../../assets/Teacher_icon_2.jpeg";
import teacherIcon3 from "../../../assets/Teacher_icon_3.jpeg";
import teacherIcon4 from "../../../assets/Teacher_icon_4.jpeg";
import teacherIcon5 from "../../../assets/Teacher_icon_5.jpeg";
import teacherIcon6 from "../../../assets/Teacher_icon_6.jpeg";
import teacherIcon7 from "../../../assets/Teacher_icon_7.jpeg";
import teacherIcon8 from "../../../assets/Teacher_icon_8.jpeg";
import activityIcon1 from "../../../assets/teacher_module_recent_activity_1.jpeg";
import activityIcon2 from "../../../assets/teacher_module_recent_activity_2.jpeg";
import activityIcon3 from "../../../assets/teacher_module_recent_activity_3.jpeg";
import activityIcon4 from "../../../assets/teacher_module_recent_activity_4.jpeg";
import { useNavigate, useOutletContext } from "react-router-dom";
import teacherProfile from "../../../assets/teacher_profile.jpeg";
import type { TeacherLayoutContext } from "../Layout/TeacherLayout";
import { ProfileMenu } from "../../profile";
import Logout from "../../../components/Logout";
 
interface StatCard {
  id: number;
  title: string;
  value: string;
  icon: string;
}
 
const statsData: StatCard[] = [
  { id: 1, title: "Enrolled Courses", value: "957", icon: teacherIcon1 },
  { id: 2, title: "Active Courses", value: "19", icon: teacherIcon2 },
  { id: 3, title: "Course Instructors", value: "241", icon: teacherIcon3 },
  { id: 4, title: "Completed Courses", value: "951", icon: teacherIcon4 },
  { id: 5, title: "Students", value: "1,674,767", icon: teacherIcon5 },
  { id: 6, title: "Online Courses", value: "3", icon: teacherIcon6 },
  { id: 7, title: "USD Total Earning", value: "$7,461,767", icon: teacherIcon7 },
  { id: 8, title: "Course Sold", value: "56,489", icon: teacherIcon8 },
];
 
interface ActivityItem {
  title: string;
  subtitle: string;
  time: string;
  icon: string;
}
 
const activities: ActivityItem[] = [
  {
    title: "Kevin comments on your lecture",
    subtitle: "What is ux in 2021 ui/ux design with figma",
    time: "Just now",
    icon: activityIcon1,
  },
  {
    title: "John gives a 5 star rating on your course",
    subtitle: "2021 ui/ux design with figma",
    time: "5 mins ago",
    icon: activityIcon2,
  },
  {
    title: "Sraboni purchased your course",
    subtitle: "2021 ui/ux design with figma",
    time: "6 mins ago",
    icon: activityIcon3,
  },
  {
    title: "Arif purchased your course",
    subtitle: "2021 ui/ux design with figma",
    time: "7 mins ago",
    icon: activityIcon4,
  },
];
const revenueSvgPoints = [
  { x: 68, y: 82, value: 104000, day: "Aug 01" },
  { x: 94, y: 74, value: 111000, day: "Aug 03" },
  { x: 125, y: 96, value: 95000, day: "Aug 05" },
  { x: 146, y: 92, value: 101000, day: "Aug 06" },
  { x: 170, y: 128, value: 51749, day: "7th Aug" },
  { x: 199, y: 110, value: 89000, day: "Aug 09" },
  { x: 231, y: 136, value: 63000, day: "Aug 11" },
  { x: 260, y: 122, value: 73000, day: "Aug 13" },
  { x: 291, y: 142, value: 61000, day: "Aug 15" },
  { x: 321, y: 126, value: 78000, day: "Aug 17" },
  { x: 352, y: 154, value: 50000, day: "Aug 19" },
  { x: 382, y: 133, value: 69000, day: "Aug 20" },
  { x: 411, y: 107, value: 86000, day: "Aug 22" },
  { x: 444, y: 173, value: 40000, day: "Aug 24" },
  { x: 474, y: 135, value: 68000, day: "Aug 26" },
  { x: 504, y: 153, value: 52000, day: "Aug 28" },
  { x: 536, y: 96, value: 98000, day: "Aug 30" },
  { x: 562, y: 119, value: 82000, day: "Aug 31" },
];

const revenueLinePath =
  "M68 82 C83 74 94 72 108 80 C121 89 130 102 146 92 C158 84 160 106 170 128 C181 155 191 120 199 110 C211 94 219 118 231 136 C242 154 251 120 260 122 C274 125 279 147 291 142 C305 136 309 112 321 126 C334 142 342 166 352 154 C362 142 366 133 382 133 C396 132 398 112 411 107 C426 102 430 163 444 173 C459 184 462 151 474 135 C489 116 493 155 504 153 C518 151 524 100 536 96 C548 92 552 104 562 119";

const revenueFillPath = `${revenueLinePath} L562 252 L68 252 Z`;

const RevenueChart = () => {
  const [hoverPoint, setHoverPoint] = useState<(typeof revenueSvgPoints)[number] | null>(null);

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const scaleX = 590 / rect.width;
    const mouseX = (event.clientX - rect.left) * scaleX;
    const closest = revenueSvgPoints.reduce((best, point) =>
      Math.abs(point.x - mouseX) < Math.abs(best.x - mouseX) ? point : best
    );
    setHoverPoint(closest);
  };

  return (
    <svg
      viewBox="0 0 590 290"
      className="h-[290px] w-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoverPoint(null)}
    >
      {[
        ["1m", 26],
        ["500k", 67],
        ["100k", 108],
        ["50k", 148],
        ["10k", 190],
        ["1k", 230],
        ["0", 270],
      ].map(([label, y]) => (
        <text
          key={label}
          x="8"
          y={Number(y)}
          fill="#A3ACBD"
          fontFamily="Inter"
          fontSize="15"
          dominantBaseline="middle"
        >
          {label}
        </text>
      ))}

      {[
        ["Aug 01", 68],
        ["Aug 10", 212],
        ["Aug 20", 382],
        ["Aug 31", 536],
      ].map(([label, x]) => (
        <text
          key={label}
          x={Number(x)}
          y="278"
          fill="#A3ACBD"
          fontFamily="Inter"
          fontSize="15"
          textAnchor="middle"
        >
          {label}
        </text>
      ))}

      <path d={revenueFillPath} fill="#EEF0FF" opacity="0.72" />
      <path
        d={revenueLinePath}
        fill="none"
        stroke="#4F46E5"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {hoverPoint && (
        <>
          <line
            x1={hoverPoint.x}
            y1="0"
            x2={hoverPoint.x}
            y2="252"
            stroke="#4F46E5"
            strokeWidth="1.5"
            strokeDasharray="9 8"
          />
          <circle cx={hoverPoint.x} cy={hoverPoint.y} r="7" fill="#4F46E5" stroke="#FFFFFF" strokeWidth="4" />
          <g transform={`translate(${Math.max(78, Math.min(hoverPoint.x - 54, 452))} ${Math.max(16, hoverPoint.y - 92)})`}>
            <rect width="108" height="66" fill="#1D2026" />
            <text x="54" y="27" fill="#FFFFFF" fontFamily="Inter" fontSize="17" fontWeight="600" textAnchor="middle">
              {hoverPoint.value.toLocaleString()}
            </text>
            <text x="54" y="49" fill="#B8C0CC" fontFamily="Inter" fontSize="13" textAnchor="middle">
              {hoverPoint.day}
            </text>
            <path d="M47 66 L61 66 L54 74 Z" fill="#1D2026" />
          </g>
        </>
      )}
    </svg>
  );
};

const profileViewBars = [
  63, 84, 37, 89, 42, 63, 29, 51, 43,
];

const ProfileViewChart = () => {
  const chartHeight = 222;
  const baseline = 230;
  const barWidth = 15;
  const gap = 10;

  return (
    <svg viewBox="0 0 225 240" className="h-[240px] w-full">
      {profileViewBars.map((value, index) => {
        const x = index * (barWidth + gap) + 3;
        const greenHeight = (value / 100) * chartHeight;

        return (
          <g key={index}>
            <rect
              x={x}
              y={8}
              width={barWidth}
              height={chartHeight}
              fill="#EAF4EF"
            />
            <rect
              x={x}
              y={baseline - greenHeight}
              width={barWidth}
              height={greenHeight}
              fill="#238B45"
            />
          </g>
        );
      })}
    </svg>
  );
};

const CourseOverviewChart = () => (
  <svg viewBox="0 0 596 330" className="h-[335px] w-full">
    <defs>
      <filter id="courseGreenLineShadow" x="-10%" y="-10%" width="125%" height="125%">
        <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#238B45" floodOpacity="0.18" />
      </filter>
    </defs>
    {[
      ["1m", 28],
      ["500k", 72],
      ["100k", 114],
      ["50k", 156],
      ["10k", 200],
      ["1k", 244],
      ["0", 287],
    ].map(([label, y]) => (
      <text
        key={label}
        x="4"
        y={Number(y)}
        fill="#A3ACBD"
        fontFamily="Inter"
        fontSize="13"
        dominantBaseline="middle"
      >
        {label}
      </text>
    ))}

    {[
      ["Sun", 74],
      ["Mon", 168],
      ["Tue", 262],
      ["Wed", 356],
      ["Thi", 450],
      ["Fri", 544],
      ["Sat", 586],
    ].map(([label, x]) => (
      <text
        key={label}
        x={Number(x)}
        y="320"
        fill="#A3ACBD"
        fontFamily="Inter"
        fontSize="14"
        textAnchor="middle"
      >
        {label}
      </text>
    ))}

    <path d="M64 86 C95 164 122 127 145 92 C175 43 196 173 236 148 C270 126 285 220 319 168 C347 126 359 184 389 177 C419 170 430 184 457 170 C493 151 514 174 548 194 C569 207 584 166 590 142 L606 142 L606 286 L64 286 Z" fill="#F0F1FF" opacity="0.75" />

    <path
      d="M64 86 C95 164 122 127 145 92 C175 43 196 173 236 148 C270 126 285 220 319 168 C347 126 359 184 389 177 C419 170 430 184 457 170 C493 151 514 174 548 194 C569 207 584 166 590 142"
      fill="none"
      stroke="#4F46E5"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <path
      d="M64 139 C100 169 123 156 150 138 C177 119 188 144 216 88 C244 32 278 123 296 150 C324 190 319 260 350 212 C371 179 386 293 431 244 C465 206 474 61 517 97 C548 124 553 133 578 170 C593 194 604 236 606 256"
      fill="none"
      stroke="#238B45"
      strokeWidth="7"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.12"
      filter="url(#courseGreenLineShadow)"
    />

    <path
      d="M64 139 C100 169 123 156 150 138 C177 119 188 144 216 88 C244 32 278 123 296 150 C324 190 319 260 350 212 C371 179 386 293 431 244 C465 206 474 61 517 97 C548 124 553 133 578 170 C593 194 604 236 606 256"
      fill="none"
      stroke="#238B45"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const RatingSparkline = () => (
  <svg viewBox="0 0 241 100" className="h-full w-full">
    <rect width="241" height="100" fill="#F1FFF6" />
    <path
      d="M8 55 C22 80 30 13 49 17 C66 20 63 78 82 64 C101 49 121 52 132 71 C145 93 155 44 178 38 C197 33 196 78 211 71 C226 64 220 29 239 45"
      fill="none"
      stroke="#238B45"
      strokeWidth="3.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const RatingStars = ({ filled, half = false, size = 16 }: { filled: number; half?: boolean; size?: number }) => (
  <div className="flex gap-[4px]">
    {[0, 1, 2, 3, 4].map((starIndex) => {
      const isFilled = starIndex < filled;
      const isHalf = half && starIndex === filled;

      return (
        <span key={starIndex} className="relative inline-flex" style={{ width: size, height: size }}>
          <Star size={size} fill="none" color="#238B45" strokeWidth={2.2} />
          {(isFilled || isHalf) && (
            <span
              className="absolute left-0 top-0 overflow-hidden"
              style={{ width: isHalf ? size / 2 : size, height: size }}
            >
              <Star size={size} fill="#238B45" color="#238B45" strokeWidth={2.2} />
            </span>
          )}
        </span>
      );
    })}
  </div>
);

const ratingRows = [
  { label: "5 Star", percent: "56%", width: 56, filled: 5 },
  { label: "4 Star", percent: "37%", width: 37, filled: 4 },
  { label: "3 Star", percent: "8%", width: 8, filled: 3 },
  { label: "2 Star", percent: "1%", width: 1, filled: 2 },
  { label: "1 Star", percent: "<1%", width: 2, filled: 1 },
];

type PeriodDropdownProps = {
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

const PeriodDropdown: React.FC<PeriodDropdownProps> = ({ value, options, onChange }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      buttonRef.current?.focus();
      return;
    }

    if ((event.key === "Enter" || event.key === " ") && document.activeElement === buttonRef.current) {
      event.preventDefault();
      setOpen((current) => {
        const nextOpen = !current;
        if (!current) {
          window.setTimeout(() => optionRefs.current[0]?.focus(), 0);
        }
        return nextOpen;
      });
      return;
    }

    if (!open) return;

    const currentIndex = optionRefs.current.findIndex((item) => item === document.activeElement);

    if (event.key === "ArrowDown") {
      event.preventDefault();
      const nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
      optionRefs.current[nextIndex]?.focus();
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      const previousIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
      optionRefs.current[previousIndex]?.focus();
    }
  };

  return (
    <div className="relative" ref={dropdownRef} onKeyDown={handleKeyDown}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-1 h-[19px] font-['Inter'] text-[11.56px] font-normal leading-[18.17px] tracking-[-0.01em] text-right text-[#6E7485]"
      >
        {value}
        <ChevronDown size={16} />
      </button>
      {open && (
        <div
          className="absolute right-0 top-[24px] z-30 w-[110px] rounded-md border border-[#E5E7EB] bg-white py-1 shadow-md"
          role="menu"
          onMouseLeave={() => setOpen(false)}
        >
          {options.map((option, index) => (
            <button
              key={option}
              ref={(element) => {
                optionRefs.current[index] = element;
              }}
              type="button"
              role="menuitem"
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className={`block w-full px-3 py-2 text-center font-['Inter'] text-[11.56px] leading-[18.17px] hover:bg-[#F1FFF6] focus:bg-[#F1FFF6] focus:outline-none ${
                option === value ? "text-[#238B45] font-medium" : "text-[#6E7485] font-normal"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
 
const TeacherDashboard: React.FC = () => {
  const { setActiveTab } = useOutletContext<TeacherLayoutContext>();
  const userName =
    localStorage.getItem("userName") ||
    localStorage.getItem("full_name") ||
    localStorage.getItem("name") ||
    "Teacher";
 const navigate = useNavigate();
  const userEmail =
    localStorage.getItem("userEmail") ||
    localStorage.getItem("email") ||
    localStorage.getItem("phone_number") ||
    "teacher@thestackly.com";
  const [dashboardData, setDashboardData] =useState<TeacherDashboard | null>(null);
 const [isDashboardLoading, setIsDashboardLoading] = useState(false);
 const [dropdownOpen, setDropdownOpen] = useState(false);
 const [activityPeriod, setActivityPeriod] = useState("Today");
 const [revenuePeriod, setRevenuePeriod] = useState("This Month");
 const [profilePeriod, setProfilePeriod] = useState("Today");
 const [ratingPeriod, setRatingPeriod] = useState("This Week");
 const [overviewPeriod, setOverviewPeriod] = useState("This Week");

 useEffect(() => {
  const fetchDashboard = async () => {
    try {
      setIsDashboardLoading(true);

      const response = await getTeacherDashboard();

      console.log("Dashboard Response:", response);

      setDashboardData(response);
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setIsDashboardLoading(false);
    }
  };

  fetchDashboard();
}, []);
  return (
    <div className="w-full min-h-screen bg-[#FAFAFA] p-8">
 
      {/* Header */}
 
      <div className="flex justify-between items-start mb-8">
 
        <div className="w-[384px] h-[64px] flex flex-col gap-1">
          <h1 className="w-[500px] h-[36px] text-[28px] font-semibold leading-[100%] text-black">
            Welcome back, {dashboardData?.full_name || userName}! 👋
          </h1>
 
          <p className="w-[384px] h-[24px] text-[#8B8B8B] text-[16px] font-normal leading-[100%] flex items-center">
            Here's what's happening in your profile today.
          </p>
        </div>
        {/* Top Bar */}
      <div className="flex mt-[-32px] mr-[-32px] justify-end items-center px-8 py-3">
        <Logout redirectTo="/" toastDuration={5000} dismissExistingToasts>
          {({ logout }) => (
            <ProfileMenu
              userEmail={userEmail}
              userName={userName}
              userRole="Teacher"
              avatarSrc={teacherProfile}
              onProfileClick={() => navigate("/teacher/profile")}
              onSettingsClick={() => setActiveTab("settings")}
              onLogoutClick={logout}
            />
          )}
        </Logout>
      </div>
      </div>
 
      {/* Stats */}
 
      <div className="grid grid-cols-4 gap-6">
 
        {statsData.map((card) => (
          <div
            key={card.id}
            className="w-[278px] h-[104px] bg-white border border-[#EFEFEF] rounded-xl p-[22px] flex items-center gap-[22px]"
          >
            <div className="w-16 h-16 flex items-center justify-center">
              <img
                src={card.icon}
                alt=""
                className="w-14 h-14 object-contain"
              />
            </div>
 
            <div className="w-[165px] h-[56px] flex flex-col gap-[6px]">
              <h3 className={`w-[165px] h-[30px] font-['Inter'] text-[22px] ${card.value === "3" || card.value === "$7,461,767" ? "font-semibold" : "font-normal"} leading-[30px] text-[#1D2026]`}>
                {card.value}
              </h3>
 
              <p className="w-[165px] h-[20px] font-['Inter'] text-[12.5px] font-normal leading-[20px] tracking-[-0.01em] text-[#4E5566]">
                {card.title}
              </p>
            </div>
          </div>
        ))}
      </div>
 
      {/* Progress Banner */}
 
      <div className="w-[1184px] h-[132px] bg-[#F1FFF6] mt-8 flex items-center gap-12 px-[30px] py-[26px]">
 
        <div className="w-full h-[80px] flex items-center justify-between">
        <div className="flex items-center gap-4">
 
          <img
            src={teacherProfile}
            alt=""
            className="w-[80px] h-[80px] rounded-[40px] object-cover"
          />
 
          <div className="w-[180px] h-[47px] flex flex-col gap-1">
            <h3 className="w-[180px] h-[24px] font-poppins text-[18px] font-semibold leading-[21.47px] text-[#141414]">
              {dashboardData?.full_name || userName}
            </h3>
 
            <p className="w-[180px] h-[19px] font-poppins text-[14px] font-normal leading-[18.17px] tracking-[-0.01em] text-[#141414] opacity-50">
              {userEmail}
            </p>
          </div>
        </div>
 
        <div className="w-[517.73px] h-[19px] flex items-center gap-[19.82px]">
 
          <span className="w-[52px] h-[17px] font-['Inter'] text-[13px] font-medium leading-[16.52px] tracking-[-0.01em] text-right text-[#141414] opacity-60">
            1/4 Steps
          </span>
 
          <div className="w-[257.64px] h-[13.21px] bg-[#DDEEDD] rounded-full">
            <div className="w-[25%] h-full bg-[#238B45] rounded-full" />
          </div>
 
          <span className="w-[168.45px] h-[19px] font-poppins text-[16px] font-semibold leading-[18.17px] text-[#141414]">
            25% Completed
          </span>
        </div>
 
        <button onClick={()=>navigate("/teacher/profile-update")} className="w-[170px] h-[54px] rounded-[8px] flex items-center justify-center gap-2 bg-[#238B45] text-white text-sm font-medium hover:bg-[#036724] active:bg-[#42CE70] transition-colors">
          Edit Biography
        </button>
        </div>
      </div>
 
      {/* Row 1 */}
 
      <div className="grid grid-cols-[395px_500px_249px] gap-5 mt-5">
 
        {/* Recent Activity */}
 
        <div className="w-[395px] h-[350.12px] bg-white rounded-xl overflow-hidden">
 
          <div className="h-[45.42px] flex justify-between items-center px-[16.52px] py-[13.21px]">
            <h3 className="w-[96px] h-[19px] font-['Inter'] text-[13.21px] font-bold leading-[18.17px] text-[#1D2026]">Recent Activity</h3>
            <PeriodDropdown
              value={activityPeriod}
              options={["Today", "This Week", "This Month"]}
              onChange={setActivityPeriod}
            />
          </div>
 
          <div className="max-h-[304px] overflow-y-auto scrollbar-none">
            {activities.map((item, index) => (
              <div
                key={index}
                className="w-[395px] h-[75.77px] flex gap-[9.91px] px-[16.52px] py-[9.91px]"
              >
                <div className="flex h-10 w-10 items-center justify-center flex-shrink-0">
                  <img
                    src={item.icon}
                    alt="activity icon"
                    className="h-8 w-8 object-contain"
                  />
                </div>
 
                <div className="w-[315px] pt-[1px]">
                  {index === 0 ? (
                    <p className="w-[280.76px] h-[37px] font-['Inter'] text-[14px] tracking-[-0.01em] text-[#4E5566]">
                      <span className="font-semibold leading-[16.52px] text-[#1D2026]">Kevin</span>{" "}
                      <span className="font-normal leading-[18.17px]">comments on your lecture “What is ux” in</span>
                      <br />
                      <span className="font-semibold leading-[16.52px] text-[#1D2026]">“2021 ui/ux design with figma”</span>
                    </p>
                  ) : (
                    <p className="w-[280.76px] h-[37px] font-['Inter'] text-[14px] font-normal leading-[18.17px] tracking-[-0.01em] text-[#4E5566]">
                      <span className="font-semibold leading-[16.52px] text-[#1D2026]">
                        {item.title.split(" ")[0]}
                      </span>{" "}
                      {item.title.split(" ").slice(1).join(" ")} “{item.subtitle}”
                    </p>
                  )}
                  <span className="mt-[8px] block w-[280.76px] h-[14px] font-['Inter'] text-[12px] font-normal leading-[13.21px] tracking-normal text-[#8C94A3]">
                    {item.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
 
        {/* Revenue */}
 
        <div className="w-[500px] h-[350.12px] bg-white rounded-xl overflow-hidden">
 
          <div className="w-[500px] h-[45.42px] flex justify-between items-center px-[16.52px] py-[13.21px] bg-white">
            <h3 className="w-[55px] h-[19px] font-['Inter'] text-[13.21px] font-bold leading-[18.17px] text-[#1D2026]">
              Revenue
            </h3>
 
            <PeriodDropdown
              value={revenuePeriod}
              options={["Today", "This Week", "This Month", "This Year"]}
              onChange={setRevenuePeriod}
            />
          </div>
 
          <div className="px-4">
            <RevenueChart />
          </div>
        </div>
 
        {/* Profile View */}
 
        <div className="w-[249px] h-[350.12px] bg-white rounded-xl overflow-hidden">
 
          <div className="w-[249px] h-[45.42px] flex justify-between items-center px-[16.52px] py-[13.21px]">
            <h3 className="w-[76px] h-[19px] font-['Inter'] text-[13.21px] font-bold leading-[18.17px] text-[#1D2026]">
              Profile View
            </h3>
 
            <PeriodDropdown
              value={profilePeriod}
              options={["Today", "This Week", "This Month"]}
              onChange={setProfilePeriod}
            />
          </div>
 
          <div className="px-[16.52px] pt-[8px]">
            <ProfileViewChart />
          </div>
 
          <div className="w-[224.61px] h-[52px] mx-auto mt-[-6px] flex flex-col gap-[6px]">
            <h2 className="w-[224.61px] h-[26px] font-['Inter'] text-[22px] font-medium leading-[26px] text-[#1D2026]">
              $7,443
            </h2>
 
            <p className="w-[224.61px] h-[20px] font-['Inter'] text-[14px] font-normal leading-[20px] tracking-[-0.01em] text-[#6E7485]">
              USD Dollar you earned.
            </p>
          </div>
        </div>
      </div>
 
      {/* Row 2 */}
 
      <div className="w-[1184px] h-[396px] grid grid-cols-[462.61px_701.57px] gap-[19.82px] mt-5">
 
        {/* Rating */}
 
        <div className="w-[462.61px] h-[400.56px] bg-white rounded-xl flex flex-col gap-[18.17px] pb-[16.52px] overflow-hidden">
 
          <div className="w-[462.61px] h-[45.42px] flex justify-between items-center px-[16.52px] py-[13.21px]">
 
            <h3 className="w-[160px] h-[19px] font-['Inter'] text-[13.21px] font-bold leading-[18.17px] text-[#1D2026]">
              Overall Course Rating
            </h3>
 
            <PeriodDropdown
              value={ratingPeriod}
              options={["Today", "This Week", "This Month"]}
              onChange={setRatingPeriod}
            />
          </div>
 
          <div className="w-[429.58px] h-[149.48px] mx-auto flex items-center gap-[19.82px]">
 
            <div className="w-[148.64px] h-[149.48px] bg-[#F1FFF6] flex flex-col items-center gap-[13.21px] py-[28.08px]">
 
              <h1 className="w-[148.64px] h-[40px] font-['Inter'] text-[33.03px] font-semibold leading-[39.64px] tracking-[-0.01em] text-center text-[#1D2026]">
                4.6
              </h1>
 
              <div className="w-[89.18px] h-[16.52px] flex items-center justify-center">
                <RatingStars filled={4} half size={16.5} />
              </div>
 
              <p className="w-[148.64px] h-[17px] font-['Inter'] text-[11.56px] font-medium leading-[16.52px] tracking-[-0.01em] text-center text-[#1D2026]">
                Overall Rating
              </p>
            </div>
 
            <div className="w-[261.12px] h-[149.48px] bg-[#F1FFF6] flex items-center">
              <div className="w-[261.12px] h-[100.33px]">
                <RatingSparkline />
              </div>
            </div>
          </div>
 
          <div className="w-[429.58px] h-[134.64px] mx-auto flex flex-col gap-[9.91px] border-t border-[#E9EAF0] pt-[11px]">
 
            {ratingRows.map((row) => (
              <div
                key={row.label}
                className="w-[429.58px] h-[19px] flex items-center justify-between"
              >
                <div className="flex w-[120px] items-center gap-[8px]">
                  <RatingStars filled={row.filled} size={14.5} />
                  <span className="font-['Inter'] text-[13px] font-normal leading-[18px] text-[#6E7485] whitespace-nowrap">
                    {row.label}
                  </span>
                </div>
 
                <div className="w-[252px] h-[7px] bg-[#E8EAF0]">
                  <div
                    className="h-full bg-[#238B45]"
                    style={{
                      width: `${row.width}%`,
                    }}
                  />
                </div>
 
                <span className="font-['Inter'] text-[13px] font-medium leading-[18px] w-[34px] text-right text-[#1D2026]">
                  {row.percent}
                </span>
              </div>
            ))}
          </div>
        </div>
 
        {/* Course Overview */}
 
        <div className="w-[701.57px] h-[396.36px] bg-white rounded-xl overflow-hidden">
 
          <div className="w-[701.57px] h-[45.42px] flex justify-between items-center px-[16.52px] py-[13.21px]">
            <h3 className="font-['Inter'] text-[13.21px] font-bold leading-[18.17px] text-[#1D2026]">
              Course Overview
            </h3>
 
            <PeriodDropdown
              value={overviewPeriod}
              options={["Today", "This Week", "This Month"]}
              onChange={setOverviewPeriod}
            />
          </div>
 
          <div className="px-4">
            <CourseOverviewChart />
          </div>
        </div>
      </div>
 
    </div>
  );
};

export default TeacherDashboard;
