import React, { useRef, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
 
import {
  Star,
  ChevronDown,
} from "lucide-react";
import icon322 from "../../../assets/icons/Frame 322.png";
import icon323 from "../../../assets/icons/Frame 323.png";
import icon324 from "../../../assets/icons/Frame 324.png";
import icon325 from "../../../assets/icons/Frame 325.png";
import icon322_1 from "../../../assets/icons/Frame 322 (1).png";
import icon322_2 from "../../../assets/icons/Frame 322 (2).png";
import icon322_3 from "../../../assets/icons/Frame 322 (3).png";
import icon322_4 from "../../../assets/icons/Frame 322 (4).png";
import activityIcon1 from "../../../assets/icons/Icons.png";
import activityIcon2 from "../../../assets/icons/Icons (1).png";
import activityIcon3 from "../../../assets/icons/Icons (2).png";
import avatarImage from "../../../assets/icons/Avatar.png";
import { useNavigate } from "react-router-dom";
import profilePictureDefault from "../../../assets/UpdateProfileIcons/profilepicturedefault.svg";
import downarrow from "../../../assets/UpdateProfileIcons/DownArrow.svg";
 
interface StatCard {
  id: number;
  title: string;
  value: string;
  icon: string;
  bgColor: string;
}
 
const statsData: StatCard[] = [
  { id: 1, title: "Enrolled Courses", value: "957", icon: icon322, bgColor: "bg-[#F1FFF6]" },
  { id: 2, title: "Active Courses", value: "19", icon: icon323, bgColor: "bg-[#F4F1FF]" },
  { id: 3, title: "Course Instructors", value: "241", icon: icon325, bgColor: "bg-[#F1FFF6]" },
  { id: 4, title: "Completed Courses", value: "951", icon: icon324, bgColor: "bg-[#F1FFF6]" },
  { id: 5, title: "Students", value: "1,674,767", icon: icon322_1, bgColor: "bg-[#FFF3F3]" },
  { id: 6, title: "Online Courses", value: "3", icon: icon322_2, bgColor: "bg-[#F1FFF6]" },
  { id: 7, title: "USD Total Earning", value: "$7,461,767", icon: icon322_3, bgColor: "bg-[#F8F8F8]" },
  { id: 8, title: "Course Sold", value: "56,489", icon: icon322_4, bgColor: "bg-[#F4F1FF]" },
];
 
const revenueData = [
  { day: "Aug 01", revenue: 110000 },
  { day: "Aug 05", revenue: 95000 },
  { day: "Aug 07", revenue: 51749 },
  { day: "Aug 10", revenue: 85000 },
  { day: "Aug 15", revenue: 65000 },
  { day: "Aug 20", revenue: 76000 },
  { day: "Aug 25", revenue: 43000 },
  { day: "Aug 31", revenue: 98000 },
];
 
const profileData = [
  { value: 60 },
  { value: 82 },
  { value: 35 },
  { value: 85 },
  { value: 42 },
  { value: 60 },
  { value: 28 },
  { value: 50 },
  { value: 42 },
];
 
const overviewData = [
  { day: "Sun", blue: 140, green: 60 },
  { day: "Mon", blue: 170, green: 80 },
  { day: "Tue", blue: 55, green: 180 },
  { day: "Wed", blue: 90, green: 20 },
  { day: "Thu", blue: 70, green: 10 },
  { day: "Fri", blue: 85, green: 170 },
  { day: "Sat", blue: 130, green: 5 },
];
 
const miniChart = [
  { value: 30 },
  { value: 80 },
  { value: 40 },
  { value: 60 },
  { value: 70 },
  { value: 50 },
  { value: 90 },
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
    icon: activityIcon3,
  },
];
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-black text-white px-4 py-2 rounded-lg shadow-lg">
        <p className="font-semibold">
          {payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
 
  return null;
};
 
const TeacherDashboard: React.FC = () => {
  const userName =
    localStorage.getItem("full_name") ||
    localStorage.getItem("name") ||
    "John_doe";
 const navigate = useNavigate();
  const userEmail =
    localStorage.getItem("email") ||
    localStorage.getItem("phone_number") ||
    "john.doe@gmail.com";
 const [dropdownOpen, setDropdownOpen] = useState(false);
 const dropdownRef = useRef<HTMLDivElement>(null);
  return (
    <div className="w-full min-h-screen bg-[#FAFAFA] p-8">
 
      {/* Header */}
 
      <div className="flex justify-between items-start mb-8">
 
        <div>
          <h1 className="text-[30px] font-semibold">
            Welcome back, Larah! 👋
          </h1>
 
          <p className="text-[#8B8B8B] mt-2">
            Here's what's happening in your profile today.
          </p>
        </div>
        {/* Top Bar */}
      <div className="flex mt-[-32px] mr-[-32px] justify-end items-center px-8 py-3">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <img
              src={ profilePictureDefault}
              alt={userName}
              className="w-9 h-9 rounded-full object-cover bg-white border border-gray-200"
            />
            <span className="text-sm font-semibold text-gray-800">
              {userName.toUpperCase()}
            </span>
            <img src={downarrow} alt="downarrow" className="w-[18px] h-[18px] bg-[#D9D9D9] p-1 rounded-[9px]" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
              
              {/* Signed in as */}
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-xs text-gray-400">Signed in as</p>
                <p className="text-sm font-bold text-gray-800 truncate">{userEmail}</p>
              </div>

              {/* Menu items */}
              <div className="py-1">
                <button
                  onClick={() => {setDropdownOpen(false) ;navigate("/teacher/dashboard");}}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"

                >
                  My Profile
                </button>
                <button
                  onClick={() => {setDropdownOpen(false);navigate("/teacher/settings");}}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Settings
                </button>
              </div>

              {/* Log Out */}
              <div className="border-t border-gray-100 py-1">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    
                    navigate("/");
                    // handle logout here
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Log Out
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
      </div>
 
      {/* Stats */}
 
      <div className="grid grid-cols-4 gap-5">
 
        {statsData.map((card) => (
          <div
            key={card.id}
            className="bg-white border border-[#EFEFEF] rounded-xl p-5 flex items-center gap-4"
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.bgColor}`}
            >
              <img
                src={card.icon}
                alt=""
                className="w-8 h-8 object-contain"
              />
            </div>
 
            <div>
              <h3 className="text-lg font-semibold">
                {card.value}
              </h3>
 
              <p className="text-xs text-gray-500">
                {card.title}
              </p>
            </div>
          </div>
        ))}
      </div>
 
      {/* Progress Banner */}
 
      <div className="bg-[#EDF8F0] rounded-2xl p-6 mt-8 flex items-center justify-between">
 
        <div className="flex items-center gap-4">
 
          <img
            src={avatarImage}
            alt=""
            className="w-16 h-16 rounded-full"
          />
 
          <div>
            <h3 className="font-semibold">
              Vako Shivili
            </h3>
 
            <p className="text-sm text-gray-500">
              vako.shivili@gmail.com
            </p>
          </div>
        </div>
 
        <div className="flex items-center gap-5">
 
          <span className="text-xs text-gray-500">
            1/4 Steps
          </span>
 
          <div className="w-[260px] h-[12px] bg-[#DDEEDD] rounded-full">
            <div className="w-[25%] h-full bg-[#238B45] rounded-full" />
          </div>
 
          <span className="font-semibold">
            25% Completed
          </span>
        </div>
 
        <button onClick={()=>navigate("/teacher/profile-update")} className=" text-white px-6 py-3 rounded-lg font-medium transition bg-[#238B45] cursor-pointer text-white text-sm font-medium hover:bg-[#036724] active:bg-[#42CE70] transition-colorshover:shadow-lg">
          Edit Biography
        </button>
      </div>
 
      {/* Row 1 */}
 
      <div className="grid grid-cols-[350px_442px_258px] gap-5 mt-5">
 
        {/* Recent Activity */}
 
        <div className="bg-white rounded-xl p-5 h-[350px] overflow-hidden">
 
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-semibold">Recent Activity</h3>
            <button className="flex items-center gap-1 text-sm font-medium text-gray-500">
              Today
              <ChevronDown size={16} />
            </button>
          </div>
 
          <div className="max-h-[260px] overflow-y-auto pr-2 scrollbar-none">
            {activities.map((item, index) => (
              <div
                key={index}
                className="flex min-h-[56px] gap-[8px] py-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#238B45] flex-shrink-0">
                  <img
                    src={item.icon}
                    alt="activity icon"
                    className="h-8 w-8 object-contain"
                  />
                </div>
 
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.subtitle}</p>
                  <span className="text-xs text-gray-400">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
 
        {/* Revenue */}
 
        <div className="bg-white rounded-xl p-5 h-[350px]">
 
          <div className="flex justify-between mb-4">
            <h3 className="font-semibold text-lg">
              Revenue
            </h3>
 
            <button className="flex items-center gap-1 text-sm">
              This Month
              <ChevronDown size={16} />
            </button>
          </div>
 
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
 
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#4F46E5"
                strokeWidth={3}
                fill="#EEF2FF"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
 
        {/* Profile View */}
 
        <div className="bg-white rounded-xl p-5 h-[350px]">
 
          <div className="flex justify-between mb-4">
            <h3 className="font-semibold">
              Profile View
            </h3>
 
            <ChevronDown size={16} />
          </div>
 
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={profileData}>
              <Tooltip content={<CustomTooltip />} />
 
              <Bar
                dataKey="value"
                fill="#238B45"
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
 
          <h2 className="text-3xl font-bold">
            $7,443
          </h2>
 
          <p className="text-gray-500 text-sm">
            USD Dollar you earned.
          </p>
        </div>
      </div>
 
      {/* Row 2 */}
 
      <div className="grid grid-cols-[442px_628px] gap-5 mt-5">
 
        {/* Rating */}
 
        <div className="bg-white rounded-xl p-5 h-[400px]">
 
          <div className="flex justify-between mb-5">
 
            <h3 className="font-semibold">
              Overall Course Rating
            </h3>
 
            <span className="text-sm">
              This Week
            </span>
          </div>
 
          <div className="flex gap-4">
 
            <div className="w-[170px] h-[170px] bg-[#F1FFF6] rounded-xl flex flex-col items-center justify-center">
 
              <h1 className="text-6xl font-bold">
                4.6
              </h1>
 
              <div className="flex mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    fill="#22C55E"
                    color="#22C55E"
                  />
                ))}
              </div>
 
              <p className="text-sm mt-2">
                Overall Rating
              </p>
            </div>
 
            <div className="flex-1 bg-[#F1FFF6] rounded-xl">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={miniChart}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#238B45"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
 
          <div className="mt-6 space-y-3">
 
            {[
              ["5 Star", 56, 5],
              ["4 Star", 37, 4],
              ["3 Star", 8, 3],
              ["2 Star", 1, 2],
              ["1 Star", 0.5, 1],
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ].map(([label, value, starCount]: any) => (
              <div
                key={label}
                className="flex items-center gap-3"
              >
                <div className="flex gap-1 w-20">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      fill={i < starCount ? "#238B45" : "#D1D5DB"}
                      color={i < starCount ? "#238B45" : "#D1D5DB"}
                    />
                  ))}
                </div>
 
                <div className="flex-1 h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-[#238B45] rounded-full"
                    style={{
                      width: `${value}%`,
                    }}
                  />
                </div>
 
                <span className="text-sm font-medium w-12 text-right">
                  {value}%
                </span>
              </div>
            ))}
          </div>
        </div>
 
        {/* Course Overview */}
 
        <div className="bg-white rounded-xl p-5 h-[400px]">
 
          <div className="flex justify-between mb-5">
            <h3 className="font-semibold text-lg">
              Course Overview
            </h3>
 
            <span className="text-sm">This Week</span>
          </div>
 
          <ResponsiveContainer width="100%" height={330}>
            <LineChart data={overviewData}>
              <XAxis dataKey="day" stroke="#D1D5DB" />
              <YAxis stroke="#D1D5DB" />
              <Tooltip content={<CustomTooltip />} />
 
              <Line
                type="monotone"
                dataKey="blue"
                stroke="#4F46E5"
                strokeWidth={3}
                dot={false}
              />
 
              <Line
                type="monotone"
                dataKey="green"
                stroke="#238B45"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
 
    </div>
  );
};

export default TeacherDashboard;