 import { useState, useRef, useEffect } from "react";
import { useLocation, Outlet, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { LuImagePlus } from "react-icons/lu";
 
type NavItem = {
  label: string;
  id: string;
  icon: string;
};
 
type ChildDetail = {
  id: string;
  childName: string;
  studentId: string;
  schoolName: string;
  grade: string;
};
 
export default function ParentProfile() {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
 
  // State Management for active view strictly controlled within this page layout
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const currentPath = pathSegments[pathSegments.length - 1] || "dashboard";
 
  const isDashboardRoot =
    currentPath.toLowerCase() === "dashboard" ||
    currentPath.toLowerCase() === "parentprofile" ||
    currentPath.toLowerCase() === "parentdashboard";
   
  // Using a local state fallback to handle inner-tab switching cleanly without page redirects
  const [localActiveTab, setLocalActiveTab] = useState<string>("");
 
  const activeTab = localActiveTab || (isDashboardRoot ? "dashboard" : currentPath);
 
  // State Management
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [relationship, setRelationship] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
 
  // Form State Data Mapping
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
 
  const [children, setChildren] = useState<ChildDetail[]>([
    { id: crypto.randomUUID(), childName: "", studentId: "", schoolName: "", grade: "" }
  ]);
 
  const [userName] = useState("Easin Arafat");
  const [userEmail] = useState("kumar@elearn.com");
 
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
 
  const navItems: NavItem[] = [
    { label: "Dashboard", id: "dashboard", icon: "/dashboard.png" },
    { label: "Child Courses", id: "child-courses", icon: "/Child course.png" },
    { label: "Child Progress", id: "child-progress", icon: "/child progress.png" },
    { label: "Attendance", id: "attendance", icon: "/Attendance.png" },
    { label: "Assessments", id: "assessments", icon: "/Assesment.png" },
    { label: "Settings", id: "settings", icon: "/Setting.png" },
  ];
 
  const addChild = () => {
    if (!isEditing) return;
    setChildren([
      ...children,
      { id: crypto.randomUUID(), childName: "", studentId: "", schoolName: "", grade: "" }
    ]);
  };
 
  const handleChildInputChange = (index: number, field: keyof ChildDetail, value: string) => {
    const updatedChildren = [...children];
    updatedChildren[index] = { ...updatedChildren[index], [field]: value };
    setChildren(updatedChildren);
  };
 
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditing) return;
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };
 
  const handleSave = () => {
    setIsEditing(false);
    setShowSuccessModal(true);
  };
 
  const getHeaderTitle = () => {
    switch (activeTab) {
      case "child-courses": return "Child Courses Workspace";
      case "child-progress": return "Child Progress Trackers";
      case "attendance": return "Student Attendance Log";
      case "assessments": return "Performance Assessments";
      case "settings": return "Account Settings Configuration";
      default: return "Manage Profile Details";
    }
  };
 
  return (
    <div className="min-h-screen w-screen bg-[#FDFFFE] font-['Poppins',sans-serif] antialiased text-gray-900 flex overflow-hidden">
     
      {/* SIDEBAR PANEL */}
      <aside className="w-[280px] min-w-[280px] h-screen border-transparent flex flex-col pt-8 px-6 bg-white shrink-0 sticky top-0 font-['Poppins',sans-serif]">
        <button
          onClick={() => { setLocalActiveTab("dashboard"); navigate("/ParentDashboard"); }}
          className="flex items-start gap-3 w-full text-left cursor-pointer transition-all hover:opacity-80 active:scale-98 rounded-lg p-1"
        >
          <img
            src="/Frame 1000002962.png"
            alt="E-Learning Logo"
            className="h-6 w-6 object-contain"
          />
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold leading-none text-[#238B45]">
              E-Learning
            </h2>
            <span className="inline-flex items-center justify-center rounded-[4px] bg-[#F5F5F5]" style={{ padding: "8px 9px", fontSize: "10px", fontWeight: 700, color: "#292D32" }}>
              Parent Dashboard
            </span>
          </div>
        </button>
 
        <nav className="flex-1 mt-12">
          <ul className="space-y-1.5">
            {navItems.map((item) => {
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setLocalActiveTab(item.id)}
                    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-[16px] font-normal font-['Poppins',sans-serif] transition-all duration-200 ${
                      activeTab === item.id
                        ? "bg-[#E8F5E9] text-[#15803D]"
                        : "text-[#64748B] hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <img
                      src={item.icon}
                      alt={item.label}
                      className="w-[22px] h-[22px] object-contain"
                    />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
 
      {/* CORE WORKSPACE VIEW */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative bg-[#FDFFFE] font-['Poppins',sans-serif]">
       
        {/* SHARED DYNAMIC HEADER TOOLBAR */}
        <header className="w-full h-[100px] min-h-[100px] px-12 flex items-center justify-between border-b border-transparent bg-white">
          <div>
            <h1 className="text-[28px] font-bold tracking-tight text-[#0F172A]">
              {getHeaderTitle()}
            </h1>
            <p className="text-sm text-[#94A3B8] mt-1">
              {activeTab === "dashboard" ? "Manage your Account Details" : "View and manage active information screens"}
            </p>
          </div>
 
          <div className="relative" ref={dropdownRef}>
            <div
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 bg-white p-1.5 rounded-xl cursor-pointer transition-all select-none "
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-pink-100 flex items-center justify-center border border-gray-50 shadow-sm">
                <img
                  src={profileImage || "image.png"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-bold text-[#475569] leading-tight">{fullName || userName}</p>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5">{emailAddress || userEmail}</p>
              </div>
              <div className="text-[10px] text-gray-400 ml-1 pr-1 flex items-center justify-center">
                <svg
                  width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"
                  className={`transform transition-transform duration-200 ${showDropdown ? "rotate-180" : "rotate-0"}`}
                >
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
 
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-transparent z-50 overflow-hidden">
                <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/50">
                  <p className="text-[11px] text-gray-400 font-medium">Signed in as</p>
                  <p className="text-xs font-bold text-gray-900 mt-0.5 truncate">{emailAddress || userEmail}</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => { setShowDropdown(false); setLocalActiveTab("dashboard"); navigate("/ParentDashboard"); }}
                    className="block w-full text-center px-5 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    My Profile
                  </button>
                  <button
                    onClick={() => { setShowDropdown(false); setLocalActiveTab("settings"); }}
                    className="block w-full text-center px-5 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Settings
                  </button>
                </div>
                <div className="border-t border-gray-100 py-1">
                  <button
                    onClick={() => { setShowDropdown(false); alert("Logging out cleanly..."); }}
                    className="w-full text-center px-5 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50/50 transition-colors"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>
 
        {/* SCROLLABLE WORKSPACE CONTAINER */}
        <main className="flex-1 overflow-y-auto px-12 py-10 bg-[#FDFFFE]">
          <div className="w-full max-w-[1000px]">
           
            <Outlet />
 
            {/* PROFILE FORM - Only visible on 'dashboard' tab */}
            {activeTab === "dashboard" && (
              <div className="bg-white rounded-3xl border border-transparent p-8 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
               
                {/* PROFILE PHOTO ROW */}
                <div className="flex flex-col sm:flex-row items-center gap-8 mb-10 pb-6 border-b border-gray-100 relative">
                 
                  {/* IMAGING CONTAINER */}
                  <label className={`w-[110px] h-[110px] rounded-[20px] bg-[#F8FAFC] border-2 border-dashed border-[#CBD5E1] flex flex-col items-center justify-center p-3 text-center transition-all select-none group relative overflow-hidden ${isEditing ? "cursor-pointer hover:bg-[#F1F5F9] hover:border-[#16A34A]" : "cursor-not-allowed opacity-80"}`}>
                    {profileImage ? (
                      <img src={profileImage} alt="Profile Preview" className="w-full h-full object-cover rounded-[16px]" />
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <LuImagePlus size={28} className="text-[#94A3B8] group-hover:text-[#16A34A] transition-colors mb-1.5" />
                        <span className="text-[12px] font-semibold text-[#64748B] leading-tight tracking-tight">
                          Upload your photo
                        </span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={!isEditing}
                    />
                  </label>
 
                  <div className="text-left flex-1">
                    <h3 className="text-[18px] font-bold text-[#0F172A] tracking-tight">Profile Photo</h3>
                    <p className="text-sm text-[#94A3B8] mt-1 font-medium">Upload a new photo or change your existing one</p>
                  </div>
                 
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="sm:absolute sm:right-0 inline-flex items-center gap-2 h-11 px-5 bg-[#238B45] hover:bg-[#1C6E36] text-white rounded-xl text-xs font-semibold transition-all shadow-sm"
                    >
                      <FiEdit size={14} className="text-white" />
                      <span>Edit Details</span>
                    </button>
                  )}
                </div>
 
                {/* PARENT INFORMATION BLOCK */}
                <section className="mb-12">
                  <h2 className="text-[16px] font-semibold text-[#0F172A] mb-6 tracking-tight">Parent Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div>
                      <label className="block text-xs font-semibold text-[#475569] mb-2">Full Name</label>
                      <input
                        type="text"
                        value={fullName}
                        disabled={!isEditing}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                        className={`w-full h-11 border rounded-xl px-4 text-xs font-medium outline-none transition-all ${isEditing ? "bg-white border-[#CBD5E1] focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A] text-gray-800" : "bg-gray-50/50 border-gray-100 text-gray-500 cursor-not-allowed"}`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#475569] mb-2">Phone Number</label>
                      <input
                        type="text"
                        value={phoneNumber}
                        disabled={!isEditing}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Enter your phone number"
                        className={`w-full h-11 border rounded-xl px-4 text-xs font-medium outline-none transition-all ${isEditing ? "bg-white border-[#CBD5E1] focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A] text-gray-800" : "bg-gray-50/50 border-gray-100 text-gray-500 cursor-not-allowed"}`}
                      />
                    </div>
                    <div className="relative">
                      <label className="block text-xs font-semibold text-[#475569] mb-2">Password</label>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        disabled={!isEditing}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className={`w-full h-11 border rounded-xl px-4 pr-12 text-xs font-medium outline-none transition-all ${isEditing ? "bg-white border-[#CBD5E1] focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A] text-gray-800" : "bg-gray-50/50 border-gray-100 text-gray-500 cursor-not-allowed"}`}
                      />
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-4 bottom-3 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? <FaEye size={14} /> : <FaEyeSlash size={14} />}
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <label className="block text-xs font-semibold text-[#475569] mb-2">Confirm Password</label>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        disabled={!isEditing}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                        className={`w-full h-11 border rounded-xl px-4 pr-12 text-xs font-medium outline-none transition-all ${isEditing ? "bg-white border-[#CBD5E1] focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A] text-gray-800" : "bg-gray-50/50 border-gray-100 text-gray-500 cursor-not-allowed"}`}
                      />
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((v) => !v)}
                          className="absolute right-4 bottom-3 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showConfirmPassword ? <FaEye size={14} /> : <FaEyeSlash size={14} />}
                        </button>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#475569] mb-2">Email Address</label>
                      <input
                        type="email"
                        value={emailAddress}
                        disabled={!isEditing}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        placeholder="Enter your email address"
                        className={`w-full h-11 border rounded-xl px-4 text-xs font-medium outline-none transition-all ${isEditing ? "bg-white border-[#CBD5E1] focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A] text-gray-800" : "bg-gray-50/50 border-gray-100 text-gray-500 cursor-not-allowed"}`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#475569] mb-2">Relationship</label>
                      <div className="relative">
                        <select
                          value={relationship}
                          disabled={!isEditing}
                          onChange={(e) => setRelationship(e.target.value)}
                          className={`w-full h-11 border rounded-xl pl-4 pr-10 text-xs font-medium appearance-none outline-none transition-all ${isEditing ? "bg-white border-[#CBD5E1] focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A] text-gray-800" : "bg-gray-50/50 border-gray-100 text-gray-500 cursor-not-allowed"}`}
                        >
                          <option value="">Choose Relation Type</option>
                          <option value="Father">Father</option>
                          <option value="Mother">Mother</option>
                          <option value="Brother / Sister">Brother / Sister</option>
                          <option value="Guardian">Guardian</option>
                        </select>
                        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 flex items-center justify-center">
                          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
 
                {/* CHILD DETAILS REPEATER */}
                <section className="pt-4 border-t border-transparent">
                  <h2 className="text-[16px] font-semibold text-[#0F172A] mb-6 tracking-tight">Child Details</h2>
                  <div className="space-y-10">
                    {children.map((child, index) => (
                      <div key={child.id} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pb-6 border-b border-transparent last:border-b-0 last:pb-0">
                        <div>
                          <label className="block text-xs font-semibold text-[#475569] mb-2">
                            Child Name {index + 1}
                          </label>
                          <input
                            type="text"
                            value={child.childName}
                            disabled={!isEditing}
                            onChange={(e) => handleChildInputChange(index, "childName", e.target.value)}
                            placeholder="Enter your child's name"
                            className={`w-full h-11 border rounded-xl px-4 text-xs font-medium outline-none transition-all ${isEditing ? "bg-white border-[#CBD5E1] focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A] text-gray-800" : "bg-gray-50/50 border-gray-100 text-gray-500 cursor-not-allowed"}`}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#475569] mb-2">Student ID</label>
                          <input
                            type="text"
                            value={child.studentId}
                            disabled={!isEditing}
                            onChange={(e) => handleChildInputChange(index, "studentId", e.target.value)}
                            placeholder="Enter your child's student ID"
                            className={`w-full h-11 border rounded-xl px-4 text-xs font-medium outline-none transition-all ${isEditing ? "bg-white border-[#CBD5E1] focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A] text-gray-800" : "bg-gray-50/50 border-gray-100 text-gray-500 cursor-not-allowed"}`}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#475569] mb-2">School Name</label>
                          <input
                            type="text"
                            value={child.schoolName}
                            disabled={!isEditing}
                            onChange={(e) => handleChildInputChange(index, "schoolName", e.target.value)}
                            placeholder="Enter your child's school name"
                            className={`w-full h-11 border rounded-xl px-4 text-xs font-medium outline-none transition-all ${isEditing ? "bg-white border-[#CBD5E1] focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A] text-gray-800" : "bg-gray-50/50 border-gray-100 text-gray-500 cursor-not-allowed"}`}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#475569] mb-2">Choose Child Grade</label>
                          <div className="relative">
                            <select
                              value={child.grade}
                              disabled={!isEditing}
                              onChange={(e) => handleChildInputChange(index, "grade", e.target.value)}
                              className={`w-full h-11 border rounded-xl pl-4 pr-10 text-xs font-medium appearance-none outline-none transition-all ${isEditing ? "bg-white border-[#CBD5E1] focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A] text-gray-800" : "bg-gray-50/50 border-gray-100 text-gray-500 cursor-not-allowed"}`}
                            >
                              <option value="">Choose Child Grade</option>
                              <option>Grade 1</option>
                              <option>Grade 2</option>
                              <option>Grade 3</option>
                              <option>Grade 4</option>
                              <option>Grade 5</option>
                              <option>Grade 6</option>
                              <option>Grade 7</option>
                              <option>Grade 8</option>
                              <option>Grade 9</option>
                              <option>Grade 10</option>
                              <option>1st year university</option>
                              <option>2nd year university</option>
                              <option>3rd year university</option>
                              <option>4th year university</option>
                              <option>Graduate studies</option>
                              <option>Adult learner</option>
                              <option>Other</option>
                            </select>
                            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 flex items-center justify-center">
                              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                 
                  <button
                    type="button"
                    onClick={addChild}
                    className="mt-6 inline-flex items-center gap-2 h-12 px-6 bg-[#238B45] hover:bg-[#1C6E36] text-white rounded-lg text-xs font-semibold transition-all shadow-sm"
                  >
                    <span className="text-sm leading-none">+</span> Add Another Child
                  </button>
                </section>
 
                {/* FOOTER FORM ACTIONS */}
                {isEditing && (
                  <div className="flex justify-end gap-3 mt-12 pt-6 border-t border-gray-100">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="h-10 px-5 border border-gray-200 text-gray-600 bg-white rounded-xl text-xs font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="h-10 px-5 bg-[#238B45] hover:bg-[#1C6E36] text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
                    >
                      Save Permissions
                    </button>
                  </div>
                )}
              </div>
            )}
 
            {/* Empty views layout for other active tabs */}
            {activeTab !== "dashboard" && (
              <div className="w-full min-h-[300px] flex items-center justify-center border border-dashed border-transparent rounded-3xl bg-white/50">
                {/* Kept empty on page purpose per request */}
              </div>
            )}
 
          </div>
        </main>
      </div>
 
      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-[4px] flex items-center justify-center z-50 p-4 transition-all duration-200 font-['Poppins',sans-serif]">
          <div className="bg-white w-[600px] h-[520px] rounded-[24px] p-10 relative shadow-[0_12px_40px_rgba(0,0,0,0.08)] flex flex-col justify-between items-center text-center border border-gray-100">
           
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-6 right-6 w-8 h-8 rounded-full flex items-center justify-center bg-[#FADCDD] text-[#E11D48] hover:opacity-80 transition-opacity duration-150"
              aria-label="Close modal"
            >
              <span className="text-[14px] font-bold leading-none select-none">✕</span>
            </button>
 
            <div className="space-y-2 mt-4 text-left w-full self-start px-2">
              <h2 className="text-[36px] font-bold text-[#0F172A] tracking-tight">
                Congratulations!
              </h2>
              <p className="text-[15px] text-[#64748B] font-medium">
                your Profile has been Updated successfully.
              </p>
            </div>
 
            <div className="w-[220px] h-[220px] flex items-center justify-center my-2">
              <img
                src="/Group 1000002268.png"
                alt="Celebration Thumbs Up"
                className="w-full h-full object-contain"
              />
            </div>
 
            <div className="w-full">
              <button
                onClick={() => { setShowSuccessModal(false); setLocalActiveTab("dashboard"); navigate("/ParentDashboard"); }}
                className="flex items-center justify-center w-full h-14 bg-[#238B45] hover:bg-[#1C6E36] text-white rounded-[12px] font-semibold text-[16px] tracking-wide transition-colors shadow-sm"
              >
                Visit My Profile Screen
              </button>
            </div>
 
          </div>
        </div>
      )}
    </div>
  );
}