import { useState, useRef, useEffect } from "react";
import type { KeyboardEvent } from "react";
import { useLocation, Outlet, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiEdit } from "react-icons/fi";
import { LuImagePlus } from "react-icons/lu";
import parentProfileImage from "../../assets/parent_profile .jpeg";
import phoneIcon from "../../assets/UpdateProfileIcons/phone.svg";
import eyeShowIcon from "../../assets/UpdateProfileIcons/eyeshow.svg";
import eyeHideIcon from "../../assets/UpdateProfileIcons/eyehide.svg";
import SuccessModal from "./SuccessModal";
 
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

type FieldErrors = {
  fullName?: string;
  phoneNumber?: string;
  password?: string;
  confirmPassword?: string;
  emailAddress?: string;
  relationship?: string;
};

type ChildFieldErrors = Record<string, Partial<Record<keyof ChildDetail, string>>>;

const PASSWORD_MAX_LENGTH = 12;
const PHONE_MAX_LENGTH = 10;
const NAME_MAX_LENGTH = 24;
const SCHOOL_MAX_LENGTH = 16;
const STUDENT_ID_MAX_LENGTH = 12;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,12}$/;
const studentIdRegex = /^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]*$/;
 
export default function ParentProfile() {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
 
  // State Management for active view strictly controlled within this page layout
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const currentPath = pathSegments[pathSegments.length - 1] || "dashboard";
 
  const isDashboardRoot =
    currentPath.toLowerCase() === "dashboard" ||
    currentPath.toLowerCase() === "profile" ||
    currentPath.toLowerCase() === "parentprofile" ||
    currentPath.toLowerCase() === "parentdashboard";
   
  // Using a local state fallback to handle inner-tab switching cleanly without page redirects
  const [localActiveTab, setLocalActiveTab] = useState<string>("");
 
  const activeTab = localActiveTab || (isDashboardRoot ? "dashboard" : currentPath);
 
  // State Management
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(
    () => localStorage.getItem("profileImage") || parentProfileImage
  );
  const [relationship, setRelationship] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownActiveIndex, setDropdownActiveIndex] = useState(0);
 
  // Form State Data Mapping
  const [fullName, setFullName] = useState(
    () =>
      localStorage.getItem("userName") ||
      localStorage.getItem("full_name") ||
      localStorage.getItem("name") ||
      "Easin Arafat"
  );
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState(
    () => localStorage.getItem("userEmail") || "parent@thestackly.com"
  );
  const [password, setPassword] = useState(
    () => localStorage.getItem("userPassword") || localStorage.getItem("password") || ""
  );
  const [confirmPassword, setConfirmPassword] = useState(
    () => localStorage.getItem("userPassword") || localStorage.getItem("password") || ""
  );
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [childErrors, setChildErrors] = useState<ChildFieldErrors>({});
 
  const [children, setChildren] = useState<ChildDetail[]>([
    { id: crypto.randomUUID(), childName: "", studentId: "", schoolName: "", grade: "" }
  ]);
 
  const displayName = fullName || "Easin Arafat";
  const displayEmail = emailAddress || "parent@thestackly.com";
  const personalLabelCls =
    "block w-auto min-w-[117px] h-[16px] font-poppins text-[16px] font-medium leading-[100%] text-[#030229] mb-2 whitespace-nowrap";
  const personalFieldCls = (disabled: boolean) =>
    `w-[497px] h-[48px] rounded-[8px] px-4 py-3 font-poppins text-sm text-gray-800 bg-gray-50 focus:outline-none ${disabled ? "opacity-60 cursor-not-allowed" : ""}`;
  const personalFieldTextCls =
    "flex-1 font-poppins text-sm text-gray-800 bg-transparent focus:outline-none";
  const errorTextCls = "mt-1 text-[11px] font-medium text-red-500";
 
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

  const removeChild = (index: number) => {
    if (!isEditing || index === 0) return;
    setChildren((current) => current.filter((_, childIndex) => childIndex !== index));
  };

  const updateFieldError = (field: keyof FieldErrors, message = "") => {
    setFieldErrors((current) => ({ ...current, [field]: message || undefined }));
  };

  const updateChildError = (
    childId: string,
    field: keyof ChildDetail,
    message = ""
  ) => {
    setChildErrors((current) => ({
      ...current,
      [childId]: {
        ...current[childId],
        [field]: message || undefined,
      },
    }));
  };

  const validatePassword = (value: string) => {
    if (!value) return "Password is required";
    if (value.length < 8) return "Password must be at least 8 characters";
    if (value.length > PASSWORD_MAX_LENGTH) return "Password cannot exceed 12 characters";
    if (!passwordRegex.test(value)) {
      return "Use uppercase, lowercase, number, and special character";
    }
    return "";
  };

  const handleFullNameChange = (value: string) => {
    if (value.length > NAME_MAX_LENGTH) {
      updateFieldError("fullName", "Full Name cannot exceed 24 characters");
      return;
    }
    setFullName(value);
    updateFieldError("fullName");
  };

  const handlePhoneChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "");
    if (value !== digitsOnly) {
      updateFieldError("phoneNumber", "Phone number allows numbers only");
    }
    if (digitsOnly.length > PHONE_MAX_LENGTH) {
      updateFieldError("phoneNumber", "Phone number cannot exceed 10 digits");
      return;
    }
    setPhoneNumber(digitsOnly);
    if (value === digitsOnly) updateFieldError("phoneNumber");
  };

  const handlePasswordChange = (value: string) => {
    if (value.length > PASSWORD_MAX_LENGTH) {
      updateFieldError("password", "Password cannot exceed 12 characters");
      return;
    }
    setPassword(value);
    updateFieldError("password", validatePassword(value));
    if (confirmPassword && value !== confirmPassword) {
      updateFieldError("confirmPassword", "Passwords do not match");
    } else if (confirmPassword) {
      updateFieldError("confirmPassword");
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    if (value.length > PASSWORD_MAX_LENGTH) {
      updateFieldError("confirmPassword", "Confirm Password cannot exceed 12 characters");
      return;
    }
    setConfirmPassword(value);
    updateFieldError(
      "confirmPassword",
      value !== password ? "Passwords do not match" : ""
    );
  };

  const handleEmailChange = (value: string) => {
    setEmailAddress(value);
    updateFieldError(
      "emailAddress",
      value && !emailRegex.test(value) ? "Enter a valid email address" : ""
    );
  };

  const handleRelationshipChange = (value: string) => {
    setRelationship(value);
    updateFieldError("relationship", value ? "" : "Please select relationship type");
  };
 
  const handleChildInputChange = (index: number, field: keyof ChildDetail, value: string) => {
    const child = children[index];
    if (!child) return;

    if (field === "childName" && value.length > NAME_MAX_LENGTH) {
      updateChildError(child.id, field, "Child Name cannot exceed 24 characters");
      return;
    }

    if (field === "schoolName" && value.length > SCHOOL_MAX_LENGTH) {
      updateChildError(child.id, field, "School Name cannot exceed 16 characters");
      return;
    }

    if (field === "studentId") {
      if (value.length > STUDENT_ID_MAX_LENGTH) {
        updateChildError(child.id, field, "Student ID cannot exceed 12 characters");
        return;
      }

      if (!studentIdRegex.test(value)) {
        updateChildError(
          child.id,
          field,
          "Student ID can contain alphabets, numbers, and special characters only"
        );
        return;
      }
    }

    const updatedChildren = [...children];
    updatedChildren[index] = { ...updatedChildren[index], [field]: value };
    setChildren(updatedChildren);
    updateChildError(child.id, field);
  };
 
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditing) return;
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedImageTypes.includes(file.type)) {
      event.target.value = "";
      toast.error("Please upload only JPG, JPEG, or PNG image files.");
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setProfileImage(imageUrl);
  };
 
  const handleSave = () => {
    const nextErrors: FieldErrors = {
      fullName: fullName ? "" : "Full Name is required",
      phoneNumber: phoneNumber
        ? phoneNumber.length === PHONE_MAX_LENGTH
          ? ""
          : "Phone number must be 10 digits"
        : "Phone number is required",
      password: validatePassword(password),
      confirmPassword: confirmPassword
        ? confirmPassword === password
          ? ""
          : "Passwords do not match"
        : "Please confirm your password",
      emailAddress: emailRegex.test(emailAddress) ? "" : "Enter a valid email address",
      relationship: relationship ? "" : "Please select relationship type",
    };

    const nextChildErrors: ChildFieldErrors = {};
    children.forEach((child) => {
      nextChildErrors[child.id] = {
        childName: child.childName ? "" : "Child Name is required",
        studentId: child.studentId ? "" : "Student ID is required",
        schoolName: child.schoolName ? "" : "School Name is required",
        grade: child.grade ? "" : "Please choose child grade",
      };
    });

    setFieldErrors(nextErrors);
    setChildErrors(nextChildErrors);

    const hasFieldErrors = Object.values(nextErrors).some(Boolean);
    const hasChildErrors = Object.values(nextChildErrors).some((childError) =>
      Object.values(childError).some(Boolean)
    );

    if (hasFieldErrors || hasChildErrors) return;

    localStorage.setItem("userName", fullName);
    localStorage.setItem("full_name", fullName);
    localStorage.setItem("userEmail", emailAddress);
    localStorage.setItem("userPassword", password);
    if (profileImage) {
      localStorage.setItem("profileImage", profileImage);
    }
    setIsEditing(false);
    setShowSuccessModal(true);
  };

  const handleLogout = () => {
    setShowDropdown(false);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("full_name");
    localStorage.removeItem("name");
    localStorage.removeItem("profileImage");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_role");
    toast.success("Logged out successfully", {
      id: "auth-logout-success",
      duration: 3000,
    });
    navigate("/login", { replace: true });
  };

  const handleDropdownSelect = (index: number) => {
    if (index === 0) {
      setShowDropdown(false);
      setLocalActiveTab("dashboard");
      navigate("/parent/profile");
      return;
    }

    if (index === 1) {
      setShowDropdown(false);
      setLocalActiveTab("settings");
      return;
    }

    handleLogout();
  };

  const handleDropdownKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!showDropdown && (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      setDropdownActiveIndex(0);
      setShowDropdown(true);
      return;
    }

    if (!showDropdown) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setDropdownActiveIndex((current) => (current + 1) % 3);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setDropdownActiveIndex((current) => (current + 2) % 3);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setShowDropdown(false);
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleDropdownSelect(dropdownActiveIndex);
    }
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
          type="button"
          onClick={() => navigate("/")}
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
          <div className="flex min-h-[56px] min-w-0 flex-col justify-center">
            <h1 className="m-0 min-h-[24px] max-w-[520px] font-['Poppins',sans-serif] text-[26px] font-semibold leading-[1.1] tracking-[-0.01em] text-black">
              {getHeaderTitle()}
            </h1>
            <p className="mt-[8px] min-h-[12px] max-w-[360px] font-['Poppins',sans-serif] text-[14px] font-normal leading-[1.2] tracking-[-0.01em] text-[#ACACAC]">
              {activeTab === "dashboard" ? "Manage your Account Details" : "View and manage active information screens"}
            </p>
          </div>
 
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => {
                setDropdownActiveIndex(0);
                setShowDropdown(!showDropdown);
              }}
              onKeyDown={handleDropdownKeyDown}
              className="flex h-[40px] items-center gap-[10px] rounded-xl border-none bg-transparent p-0 cursor-pointer transition-all select-none text-left"
              aria-haspopup="menu"
              aria-expanded={showDropdown}
            >
              <div className="flex h-[40px] w-[42px] items-center justify-center overflow-hidden rounded-[11px] bg-transparent">
                <img
                  src={profileImage || parentProfileImage}
                  alt="Profile"
                  className="h-full w-full rounded-[11px] object-cover"
                />
              </div>
              <div className="hidden w-[120px] flex-col gap-[3px] text-left text-[#000000] sm:flex">
                <p className="m-0 h-[15px] w-[62px] overflow-hidden text-ellipsis whitespace-nowrap font-['Nunito',sans-serif] text-[11px] font-semibold leading-[100%] text-[#000000]">{displayName}</p>
                <p className="m-0 h-[15px] w-[120px] whitespace-nowrap font-['Nunito',sans-serif] text-[13px] font-normal leading-[100%] text-[#000000] opacity-50">{displayEmail}</p>
              </div>
              <div className="ml-1 flex h-[17px] w-[17px] items-center justify-center rounded-[9px] bg-[#D9D9D9]">
                <svg
                  width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                  className={`text-[#4B4B4B] transform transition-transform duration-200 ${showDropdown ? "rotate-180" : "rotate-0"}`}
                >
                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>
 
            {showDropdown && (
              <div
                className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-transparent z-50 overflow-hidden"
                role="menu"
                tabIndex={-1}
                onKeyDown={handleDropdownKeyDown}
                onMouseLeave={() => setShowDropdown(false)}
              >
                <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/50">
                  <p className="text-[11px] text-gray-400 font-medium">Signed in as</p>
                  <p className="text-xs font-bold text-gray-900 mt-0.5 truncate">{displayEmail}</p>
                </div>
                <div className="py-1">
                  <button
                    type="button"
                    role="menuitem"
                    onMouseEnter={() => setDropdownActiveIndex(0)}
                    onClick={() => handleDropdownSelect(0)}
                    className={`block w-full px-5 py-2.5 text-left text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 ${
                      dropdownActiveIndex === 0 ? "bg-gray-50" : ""
                    }`}
                  >
                    My Profile
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onMouseEnter={() => setDropdownActiveIndex(1)}
                    onClick={() => handleDropdownSelect(1)}
                    className={`block w-full px-5 py-2.5 text-left text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 ${
                      dropdownActiveIndex === 1 ? "bg-gray-50" : ""
                    }`}
                  >
                    Settings
                  </button>
                </div>
                <div className="border-t border-gray-100 py-1">
                  <button
                    type="button"
                    role="menuitem"
                    onMouseEnter={() => setDropdownActiveIndex(2)}
                    onClick={() => handleDropdownSelect(2)}
                    className={`w-full px-5 py-2.5 text-left text-xs font-bold text-red-500 transition-colors hover:bg-red-50/50 ${
                      dropdownActiveIndex === 2 ? "bg-red-50/50" : ""
                    }`}
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
                <div className="relative mb-10 flex h-[124px] w-[482px] flex-col items-center gap-[24px] border-b border-gray-100 pb-0 sm:flex-row">
                 
                  {/* IMAGING CONTAINER */}
                  <label className={`flex h-[124px] w-[124px] flex-col items-center justify-center gap-[10px] overflow-hidden rounded-[24px] border-[1.5px] border-dashed border-[#4C535F] bg-[#EDF2F6] p-[10px] text-center transition-all select-none group relative ${isEditing ? "cursor-pointer hover:bg-[#E6EDF3] hover:border-[#238B45]" : "cursor-not-allowed opacity-80"}`}>
                    {profileImage ? (
                      <>
                        <img src={profileImage} alt="Profile Preview" className="h-full w-full rounded-[20px] object-cover" />
                        <span className="absolute bottom-[10px] right-[10px] flex h-[30px] w-[30px] items-center justify-center rounded-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.18)]">
                          <LuImagePlus size={18} className="text-[#238B45]" />
                        </span>
                      </>
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
                      accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={!isEditing}
                    />
                  </label>
 
                  <div className="w-[334px] text-left">
                    <h3 className="m-0 h-[24px] w-[334px] font-['Poppins',sans-serif] text-[20px] font-semibold leading-none tracking-[-0.01em] text-black">Profile Photo</h3>
                    <p className="mt-[12px] h-[16px] w-[334px] font-['Poppins',sans-serif] text-[14px] font-normal leading-none tracking-[-0.01em] text-[#4C535F]">Upload a new photo or change your existing one</p>
                  </div>
                 
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="inline-flex h-[48px] w-[170px] items-center justify-center gap-[8px] rounded-[8px] bg-[#238B45] px-[24px] py-[12px] text-sm font-semibold text-white opacity-100 shadow-sm transition-all hover:bg-[#1C6E36] sm:absolute sm:left-[806px] sm:top-0"
                    >
                      <FiEdit size={18} className="text-white" />
                      <span>Edit Details</span>
                    </button>
                  )}
                </div>
 
                {/* PARENT INFORMATION BLOCK */}
                <section className="mb-12 flex h-[360px] w-[1018px] flex-col gap-[24px]">
                  <h2 className="m-0 h-[24px] w-[1018px] font-['Poppins',sans-serif] text-[22px] font-semibold leading-none tracking-[-0.01em] text-black">Parent Information</h2>
                  <div className="grid grid-cols-1 gap-x-[24px] gap-y-[24px] md:grid-cols-2">
                    <div>
                      <label className={personalLabelCls}>Full Name</label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={fullName}
                        disabled={!isEditing}
                        onChange={(e) => handleFullNameChange(e.target.value)}
                        placeholder="Enter your Name"
                        className={personalFieldCls(!isEditing)}
                      />
                      {fieldErrors.fullName && (
                        <p className={errorTextCls}>{fieldErrors.fullName}</p>
                      )}
                    </div>
                    <div>
                      <label className={personalLabelCls}>Phone Number</label>
                      <div className="space-y-2">
                        <div>
                          <div className="flex h-[48px] w-[497px] items-center gap-2 rounded-[8px] bg-gray-50 px-4 py-3">
                            <img src={phoneIcon} alt="phone" className="h-4 w-4 shrink-0" />
                            <input
                              type="text"
                              inputMode="tel"
                              value={phoneNumber}
                              disabled={!isEditing}
                              onChange={(e) => handlePhoneChange(e.target.value)}
                              placeholder="+91XXXXXXXXXX"
                              className={`${personalFieldTextCls} disabled:cursor-not-allowed`}
                            />
                          </div>
                          {fieldErrors.phoneNumber && (
                            <p className={errorTextCls}>{fieldErrors.phoneNumber}</p>
                          )}
                          <div className="mt-1 flex justify-between">
                            <button
                              type="button"
                              disabled={!isEditing}
                              className="h-[16px] w-[147px] border-none bg-transparent p-0 text-left font-poppins text-[12px] font-medium leading-[100%] text-[#238B45] underline disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Add New Phone Number
                            </button>
                            <button
                              type="button"
                              disabled={!isEditing}
                              className="ml-auto h-[16px] w-[138px] border-none bg-transparent p-0 text-left font-poppins text-[12px] font-medium leading-[100%] text-[#238B45] underline disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Update Phone Number
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className={personalLabelCls}>Password</label>
                      <div className={`flex h-[48px] w-[497px] items-center rounded-[8px] bg-gray-50 px-4 py-3 ${!isEditing ? "cursor-not-allowed opacity-60" : ""}`}>
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          name="password"
                          value={password}
                          disabled={!isEditing}
                          onChange={(e) => handlePasswordChange(e.target.value)}
                          onCopy={(e) => e.preventDefault()}
                          onCut={(e) => e.preventDefault()}
                          onPaste={(e) => e.preventDefault()}
                          onContextMenu={(e) => e.preventDefault()}
                          onKeyDown={(e) => {
                            if ((e.ctrlKey || e.metaKey) && ["c", "v", "x"].includes(e.key.toLowerCase())) {
                              e.preventDefault();
                            }
                          }}
                          placeholder="Enter your password"
                          className={`${personalFieldTextCls} disabled:cursor-not-allowed`}
                        />
                        <button
                          type="button"
                          disabled={!isEditing}
                          onClick={() => setShowPassword((current) => !current)}
                          className="cursor-pointer text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
                        >
                          <img className="h-5 w-5" src={showPassword ? eyeShowIcon : eyeHideIcon} alt="eyeicon" />
                        </button>
                      </div>
                      {fieldErrors.password && (
                        <p className={errorTextCls}>{fieldErrors.password}</p>
                      )}
                    </div>
                    <div>
                      <label className={personalLabelCls}>Confirm Password</label>
                      <div className={`flex h-[48px] w-[497px] items-center rounded-[8px] bg-gray-50 px-4 py-3 ${!isEditing ? "cursor-not-allowed opacity-60" : ""}`}>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirmPassword"
                          name="confirmPassword"
                          value={confirmPassword}
                          disabled={!isEditing}
                          onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                          onCopy={(e) => e.preventDefault()}
                          onCut={(e) => e.preventDefault()}
                          onPaste={(e) => e.preventDefault()}
                          onContextMenu={(e) => e.preventDefault()}
                          onKeyDown={(e) => {
                            if ((e.ctrlKey || e.metaKey) && ["c", "v", "x"].includes(e.key.toLowerCase())) {
                              e.preventDefault();
                            }
                          }}
                          placeholder="Confirm your password"
                          className={`${personalFieldTextCls} disabled:cursor-not-allowed`}
                        />
                        <button
                          type="button"
                          disabled={!isEditing}
                          onClick={() => setShowConfirmPassword((current) => !current)}
                          className="cursor-pointer text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
                        >
                          <img className="h-5 w-5" src={showConfirmPassword ? eyeShowIcon : eyeHideIcon} alt="eyeicon" />
                        </button>
                      </div>
                      {fieldErrors.confirmPassword && (
                        <p className={errorTextCls}>{fieldErrors.confirmPassword}</p>
                      )}
                    </div>
                    <div className="col-span-1">
                      <label className={personalLabelCls}>Email Address</label>
                      <div className="space-y-2">
                        <div>
                          <div className="flex h-[48px] w-[497px] items-center rounded-[8px] bg-gray-50 px-4 py-3">
                            <input
                              type="email"
                              value={emailAddress}
                              disabled={!isEditing}
                              onChange={(e) => handleEmailChange(e.target.value)}
                              placeholder="Enter your Email Address"
                              className={`${personalFieldTextCls} disabled:cursor-not-allowed`}
                            />
                          </div>
                          {fieldErrors.emailAddress && (
                            <p className={errorTextCls}>{fieldErrors.emailAddress}</p>
                          )}
                          <div className="mt-1 flex justify-between">
                            <button
                              type="button"
                              disabled={!isEditing}
                              className="h-[16px] w-[147px] border-none bg-transparent p-0 text-left font-poppins text-[12px] font-medium leading-[100%] text-[#238B45] underline disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Add New Email Address
                            </button>
                            <button
                              type="button"
                              disabled={!isEditing}
                              className="ml-auto h-[16px] w-[138px] border-none bg-transparent p-0 text-left font-poppins text-[12px] font-medium leading-[100%] text-[#238B45] underline disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Update Email Address
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex h-[72px] w-[238px] flex-col gap-[8px] opacity-100">
                      <label className="block h-[16px] font-['Poppins',sans-serif] text-[16px] font-medium leading-none text-[#030229]">Relationship</label>
                      <div className="relative">
                        <select
                          value={relationship}
                          disabled={!isEditing}
                          onChange={(e) => handleRelationshipChange(e.target.value)}
                          className={`box-border h-[48px] w-[238px] appearance-none rounded-[8px] border py-[12px] pl-[16px] pr-10 text-xs font-bold outline-none transition-all ${isEditing ? "bg-white border-[#CBD5E1] focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A] text-gray-800" : "bg-gray-50/50 border-gray-100 text-gray-500 cursor-not-allowed"}`}
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
                      {fieldErrors.relationship && (
                        <p className={errorTextCls}>{fieldErrors.relationship}</p>
                      )}
                    </div>
                  </div>
                </section>
 
                {/* CHILD DETAILS REPEATER */}
                <section className="pt-4 border-t border-transparent">
                  <h2 className="mb-6 h-[24px] w-[1018px] font-poppins text-[22px] font-semibold leading-[100%] tracking-[-0.01em] text-[#000000]">Child Details</h2>
                  <div className="w-[1018px] space-y-10">
                    {children.map((child, index) => (
                      <div key={child.id} className="grid w-[1018px] grid-cols-1 gap-x-[24px] gap-y-4 border-b border-transparent pb-6 last:border-b-0 last:pb-0 md:grid-cols-[497px_497px]">
                        <div>
                          <label className={personalLabelCls}>
                            Child Name {index + 1}
                          </label>
                          <input
                            type="text"
                            value={child.childName}
                            disabled={!isEditing}
                            onChange={(e) => handleChildInputChange(index, "childName", e.target.value)}
                            placeholder="Enter Child Name"
                            className={personalFieldCls(!isEditing)}
                          />
                          {childErrors[child.id]?.childName && (
                            <p className={errorTextCls}>{childErrors[child.id]?.childName}</p>
                          )}
                        </div>
                        <div>
                          <label className={personalLabelCls}>Student ID</label>
                          <input
                            type="text"
                            value={child.studentId}
                            disabled={!isEditing}
                            onChange={(e) => handleChildInputChange(index, "studentId", e.target.value)}
                            placeholder="Enter Student ID"
                            className={personalFieldCls(!isEditing)}
                          />
                          {childErrors[child.id]?.studentId && (
                            <p className={errorTextCls}>{childErrors[child.id]?.studentId}</p>
                          )}
                        </div>
                        <div>
                          <label className={personalLabelCls}>School Name</label>
                          <input
                            type="text"
                            value={child.schoolName}
                            disabled={!isEditing}
                            onChange={(e) => handleChildInputChange(index, "schoolName", e.target.value)}
                            placeholder="Enter School Name"
                            className={personalFieldCls(!isEditing)}
                          />
                          {childErrors[child.id]?.schoolName && (
                            <p className={errorTextCls}>{childErrors[child.id]?.schoolName}</p>
                          )}
                        </div>
                        <div>
                          <label className={personalLabelCls}>Choose Child Grade</label>
                          <div className="relative">
                            <select
                              value={child.grade}
                              disabled={!isEditing}
                              onChange={(e) => handleChildInputChange(index, "grade", e.target.value)}
                              className={`h-[48px] w-[497px] appearance-none rounded-[8px] bg-gray-50 px-4 py-3 pr-10 font-poppins text-sm font-bold text-gray-800 outline-none ${!isEditing ? "cursor-not-allowed opacity-60" : ""}`}
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
                          {childErrors[child.id]?.grade && (
                            <p className={errorTextCls}>{childErrors[child.id]?.grade}</p>
                          )}
                        </div>
                        {index > 0 && (
                          <div className="md:col-span-2">
                            <button
                              type="button"
                              onClick={() => removeChild(index)}
                              className="inline-flex h-[40px] items-center justify-center rounded-[8px] border border-red-200 bg-white px-4 font-poppins text-[14px] font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                              disabled={!isEditing}
                            >
                              Delete Child {index + 1}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                 
                  <button
                    type="button"
                    onClick={addChild}
                    className="mt-6 inline-flex h-[48px] w-[229px] items-center justify-center gap-[8px] rounded-[8px] bg-[#238B45] px-[24px] py-[12px] font-poppins text-[16px] font-semibold leading-[100%] text-white opacity-100 transition-all hover:bg-[#1C6E36]"
                  >
                    <span className="flex h-[24px] w-[24px] items-center justify-center text-[24px] font-semibold leading-none">+</span>
                    <span className="h-[24px] w-[149px] leading-[24px]">Add Another Child</span>
                  </button>
                </section>
 
                {/* FOOTER FORM ACTIONS */}
                {isEditing && (
                  <div className="mt-12 flex justify-end gap-3 border-t border-gray-100 pt-6">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex h-[48px] w-[216px] items-center justify-center gap-[12px] rounded-[8px] border border-[#238B45] bg-white p-[12px] font-poppins text-[20px] font-semibold capitalize leading-[100%] text-[#238B45] opacity-100 transition-colors hover:bg-[#EEF8F1]"
                    >
                      <span className="h-[18px] w-[73px] leading-[18px]">Cancel</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      className="flex h-[48px] w-[215px] items-center justify-center gap-[12px] rounded-[8px] bg-[#238B45] p-[12px] font-poppins text-[20px] font-semibold capitalize leading-[100%] text-white opacity-100 transition-colors hover:bg-[#1C6E36]"
                    >
                      <span className="h-[18px] w-[183px] leading-[18px]">Save Permissions</span>
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
 
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onVisitProfile={() => {
          setShowSuccessModal(false);
          setLocalActiveTab("dashboard");
          navigate("/parent/profile");
        }}
      />
    </div>
  );
}
