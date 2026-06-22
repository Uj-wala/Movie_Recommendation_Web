import { useState, useRef, useEffect, useCallback } from "react";
import type { ClipboardEvent, KeyboardEvent, MouseEvent as ReactMouseEvent } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import downarrow from "../../../assets/UpdateProfileIcons/DownArrow.svg";
import album from "../../../assets/UpdateProfileIcons/albumimg.svg";
import camera from "../../../assets/UpdateProfileIcons/camera.svg";
import edit from "../../../assets/UpdateProfileIcons/edit.svg";
import phone from "../../../assets/UpdateProfileIcons/phone.svg";
import search from "../../../assets/UpdateProfileIcons/search.svg";
import eyeshow from "../../../assets/UpdateProfileIcons/eyeshow.svg";
import eyehide from "../../../assets/UpdateProfileIcons/eyehide.svg";
import tick from "../../../assets/UpdateProfileIcons/tick.svg";
// import SuccessModal from "./SuccessModel/SuccessModal";
import profilePictureDefault from "../../../assets/UpdateProfileIcons/profilepicturedefault.svg";
import teacherProfile from "../../../assets/teacher_profile.jpeg";
import profileData from "../../../data/profile.json";
import { useNavigate, useOutletContext } from "react-router-dom";
import SuccessModalTwo from "./SuccessModel/SuccessModelTwo";
import type { TeacherLayoutContext } from "../Layout/TeacherLayout";

interface Profile {
  id: number;
  name: string;
  email: string;
  avatar: string;
}
interface InitialValues{
  username: string,
  password: string,
  confirmPassword: string,
  yearsOfExperience: string,
  qualification: string,
  subjects: string[],
  phone:string[],
  email:string[],
  image:string,
}

const InitialValuesProfile: InitialValues = profileData;
const TEACHER_DEFAULT_PASSWORD = "Stackly@123";
const PASSWORD_MAX_LENGTH = 12;

const profiles: Profile[] = [
  {
    id: 1,
    name: InitialValuesProfile.username,
    email: InitialValuesProfile.email[0],
    avatar: InitialValuesProfile.image,
  },
];

const ALL_SUBJECTS = [
  "Mathematics",
  "Science",
  "English",
  "Computer Engineering",
  "Data Science",
  "Business Analyst",
];

const YEARS_OPTIONS = [
  "1–2 years",
  "3–5 years",
  "5–8 years",
  "8–10 years",
  "10+ years",
];

const passwordRules = [
  { label: "At least 8 characters", test: (v: string) => v.length >= 8 },
  { label: "No more than 12 characters", test: (v: string) => v.length <= PASSWORD_MAX_LENGTH },
  { label: "At least one uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { label: "At least one number", test: (v: string) => /[0-9]/.test(v) },
  { label: "At least one special character (!@#$%^&*)", test: (v: string) => /[!@#$%^&*(),.?":{}|<>]/.test(v) },
];

const phoneRegex = /^\+91[0-9]{10}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

const validationSchema = Yup.object({
  username: Yup.string()
    .required("Username is required")
    .max(24, "User Name cannot exceed 24 characters")
    .matches(/^[A-Za-z\s'.-]+$/, "User Name can only contain letters, spaces, apostrophe, hyphen, and period")
    .min(3, "Username must be at least 3 characters"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(PASSWORD_MAX_LENGTH, "Password cannot exceed 12 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[0-9]/, "Must contain at least one number")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Must contain at least one special character"),
  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .max(PASSWORD_MAX_LENGTH, "Confirm Password cannot exceed 12 characters")
    .oneOf([Yup.ref("password")], "Passwords do not match"),
  yearsOfExperience: Yup.string().required("Please select years of experience"),
  qualification: Yup.string().required("Qualification is required"),
  subjects: Yup.array()
    .of(Yup.string().required())
    .min(3, "Please select at least 3 subjects"),
});

export default function UpdateProfile() {
  const { setActiveTab } = useOutletContext<TeacherLayoutContext>();
  const [activeProfile] = useState<Profile>(profiles[0]);
  const displayName =
    localStorage.getItem("userName") ||
    localStorage.getItem("full_name") ||
    localStorage.getItem("name") ||
    activeProfile.name;
  const displayEmail =
    localStorage.getItem("userEmail") ||
    localStorage.getItem("email") ||
    localStorage.getItem("phone_number") ||
    activeProfile.email;
  const displayPassword =
    localStorage.getItem("userPassword") ||
    localStorage.getItem("password") ||
    TEACHER_DEFAULT_PASSWORD;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownItemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [photoSrc, setPhotoSrc] = useState<string>(InitialValuesProfile.image);
  const [pendingPhoto, setPendingPhoto] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [subjectSearch, setSubjectSearch] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const blockPasswordClipboardAction = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
  };

  const blockPasswordContextMenu = (event: ReactMouseEvent<HTMLInputElement>) => {
    event.preventDefault();
  };

  const blockPasswordClipboardShortcut = (event: KeyboardEvent<HTMLInputElement>) => {
    if ((event.ctrlKey || event.metaKey) && ["c", "v", "x"].includes(event.key.toLowerCase())) {
      event.preventDefault();
    }
  };

  const [phones, setPhones] = useState(InitialValuesProfile.phone.map((p) => ({ value: p, touched: false, error: "" })));
  const [emails, setEmails] = useState([{ value: displayEmail, touched: false, error: "" }]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formik = useFormik({
    initialValues: {
      username: displayName,
      password: displayPassword,
      confirmPassword: displayPassword,
      yearsOfExperience: InitialValuesProfile.yearsOfExperience,
      qualification: InitialValuesProfile.qualification,
      subjects: InitialValuesProfile.subjects as string[],
      image: InitialValuesProfile.image,
    },
    validationSchema,
    onSubmit: (values) => {
      const phoneErrors = phones.map((p) =>
        !p.value ? "Phone number is required" : !phoneRegex.test(p.value) ? "Invalid format. Use country code e.g. +911234567890" : ""
      );
      const emailErrors = emails.map((e) =>
        !e.value ? "Email is required" : !emailRegex.test(e.value) ? "Enter a valid email" : ""
      );
      const hasPhoneError = phoneErrors.some((e) => e);
      const hasEmailError = emailErrors.some((e) => e);
      setPhones((prev) => prev.map((p, i) => ({ ...p, touched: true, error: phoneErrors[i] })));
      setEmails((prev) => prev.map((em, i) => ({ ...em, touched: true, error: emailErrors[i] })));
      if (hasPhoneError || hasEmailError) return;
      localStorage.setItem("userPassword", values.password);
      console.log("Submitted:", values);
      setIsEditing(false);
      setShowSuccess(true);
    },
  });

 const handlePhotoChange = useCallback((file: File) => {
  const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png"];
  const allowedExtensions = /\.(jpe?g|png)$/i;

  if (!allowedImageTypes.includes(file.type) || !allowedExtensions.test(file.name)) {
    toast.error("Please upload only JPG, JPEG, or PNG image files.", { position: "bottom-right" });
    return;
  }
  setIsUploading(true);
  setUploadProgress(0);
  const reader = new FileReader();
  reader.onload = (e) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setUploadProgress(100);
        setTimeout(() => {
          setIsUploading(false);
          setPendingPhoto(e.target?.result as string);
          toast.success("Photo ready! Click Submit to save.", { position: "bottom-right" });
        }, 300);
      }
      setUploadProgress(progress);
    }, 120);
  };
  reader.readAsDataURL(file);
}, []);
  const toggleSubject = (subject: string) => {
    if (!isEditing) return;
    const current = formik.values.subjects;
    const updated = current.includes(subject)
      ? current.filter((s) => s !== subject)
      : [...current, subject];
    formik.setFieldValue("subjects", updated);
  };

  const filteredSubjects = ALL_SUBJECTS.filter((s) =>
    s.toLowerCase().includes(subjectSearch.toLowerCase())
  );

  // ── Phone helpers ─────────────────────────────────────────────────────────
  const validatePhone = (value: string) => {
    if (!value) return "Phone number is required";
    const digitsAfterCountryCode = value.startsWith("+91") ? value.slice(3).replace(/\D/g, "") : "";
    if (digitsAfterCountryCode.length > 10) return "Phone number cannot exceed 10 digits";
    if (!phoneRegex.test(value)) return "Invalid format. Use country code e.g. +911234567890";
    return "";
  };

  const handlePhoneChange = (index: number, raw: string) => {
    const digits = raw.replace(/\D/g, "");
    if (!digits) {
      setPhones((prev) => prev.map((p, i) => i === index ? { ...p, value: "", touched: true, error: "Phone number is required" } : p));
      return;
    }
    const nationalNumber = digits.startsWith("91") ? digits.slice(2) : digits;
    const cleaned = `+91${nationalNumber.slice(0, 10)}`;
    const error = validatePhone(cleaned);
    setPhones((prev) => prev.map((p, i) => i === index ? { ...p, value: cleaned, touched: true, error } : p));
  };

  const blurPhone = (index: number) => {
    const error = validatePhone(phones[index].value);
    setPhones((prev) => prev.map((p, i) => i === index ? { ...p, touched: true, error } : p));
  };

  const addPhone = () => {
    if (phones.length < 2) setPhones((prev) => [...prev, { value: "", touched: false, error: "" }]);
  };

  const removePhone = (index: number) => {
    if (phones.length <= 1) return;
    setPhones((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdatePhone = (index: number) => {
    const error = validatePhone(phones[index].value);
    setPhones((prev) => prev.map((p, i) => i === index ? { ...p, touched: true, error } : p));
    if (error) return;
    toast.success(`Phone number updated successfully!`,{position:"bottom-right"});
  };

  // ── Email helpers ─────────────────────────────────────────────────────────
  const validateEmail = (value: string) => {
    if (!value) return "Email is required";
    if (!emailRegex.test(value)) return "Enter a valid email";
    return "";
  };

  const handleEmailChange = (index: number, value: string) => {
    const error = validateEmail(value);
    setEmails((prev) => prev.map((e, i) => i === index ? { ...e, value, touched: true, error } : e));
  };

  const blurEmail = (index: number) => {
    const error = validateEmail(emails[index].value);
    setEmails((prev) => prev.map((e, i) => i === index ? { ...e, touched: true, error } : e));
  };

  const addEmail = () => {
    if (emails.length < 2) setEmails((prev) => [...prev, { value: "", touched: false, error: "" }]);
  };

  const removeEmail = (index: number) => {
    if (emails.length <= 1) return;
    setEmails((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateEmail = (index: number) => {
    const error = validateEmail(emails[index].value);
    setEmails((prev) => prev.map((e, i) => i === index ? { ...e, touched: true, error } : e));
    if (error) return;
    toast.success(`Email address updated successfully!`,{position:"bottom-right"});
  };

  const handleCancel = () => {
    formik.resetForm();
    setIsEditing(false);
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    [
      "access_token",
      "refresh_token",
      "isAuthenticated",
      "user_role",
      "userEmail",
      "userName",
      "full_name",
      "name",
      "userPassword",
    ].forEach((key) => localStorage.removeItem(key));
    toast.dismiss();
    toast.success("Logged out successfully", { duration: 5000 });
    navigate("/");
  };

  const dropdownActions = [
    {
      label: "My Profile",
      onSelect: () => {
        setDropdownOpen(false);
        navigate("/teacher/dashboard");
      },
    },
    {
      label: "Settings",
      onSelect: () => {
        setDropdownOpen(false);
        setActiveTab("settings");
      },
    },
    {
      label: "Log Out",
      onSelect: handleLogout,
    },
  ];

  const handleProfileDropdownKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setDropdownOpen(false);
      dropdownButtonRef.current?.focus();
      return;
    }

    if ((event.key === "Enter" || event.key === " ") && !dropdownOpen) {
      event.preventDefault();
      setDropdownOpen(true);
      window.setTimeout(() => dropdownItemRefs.current[0]?.focus(), 0);
      return;
    }

    if (!dropdownOpen) return;

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

  const handleSuccessClose = () => {
    setShowSuccess(false);
    setIsEditing(false);
  };

  const pwValue = formik.values.password;
  const allRulesPassed = passwordRules.every((r) => r.test(pwValue));
  const showRules = passwordFocused && pwValue.length > 0 && !allRulesPassed;
  const usernameLimitReached = formik.values.username.length >= 24;

  const personalLabelCls =
    "block w-auto min-w-[117px] h-[16px] font-poppins text-[16px] font-medium leading-[100%] text-[#030229] mb-2 whitespace-nowrap";
  const personalFieldCls = (disabled: boolean) =>
    `w-[497px] h-[48px] rounded-[8px] px-4 py-3 font-poppins text-sm text-gray-800 bg-gray-50 focus:outline-none ${disabled ? "opacity-60 cursor-not-allowed" : ""}`;
  const personalFieldTextCls =
    "flex-1 font-poppins text-sm text-gray-800 bg-transparent focus:outline-none";
  const addLinkCls =
    "w-[147px] h-[16px] font-poppins text-[12px] font-medium leading-[100%] text-[#238B45] underline";
  const updateLinkCls =
    "w-[138px] h-[16px] font-poppins text-[12px] font-medium leading-[100%] text-[#238B45] underline";

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F5F5F5]">
      {/* Top Bar */}
      <div className="flex justify-end items-center px-8 py-3">
        <div className="relative" ref={dropdownRef} onKeyDown={handleProfileDropdownKeyDown}>
          <button
            ref={dropdownButtonRef}
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="h-[43px] flex items-center gap-3 rounded-xl transition-colors"
            aria-haspopup="menu"
            aria-expanded={dropdownOpen}
          >
            <img
              src={formik.values.image || teacherProfile || profilePictureDefault}
              alt={displayName}
              className="w-[45px] h-[43px] rounded-[12px] object-cover"
            />
            <span className="flex w-[130px] flex-col gap-1 text-left text-[#000000]">
              <span className="w-[67px] h-4 font-['Nunito'] text-[12px] font-semibold leading-[100%] whitespace-nowrap overflow-hidden text-ellipsis">
                {displayName}
              </span>
              <span className="w-auto h-4 font-['Nunito'] text-[14px] font-normal leading-[100%] opacity-50 whitespace-nowrap">
                {displayEmail}
              </span>
            </span>
            <img src={downarrow} alt="downarrow" className="w-[18px] h-[18px] bg-[#D9D9D9] rounded-[9px] py-[7px] px-[4px] ml-2" />
          </button>

          {dropdownOpen && (
            <div
              className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden"
              role="menu"
              onMouseLeave={() => setDropdownOpen(false)}
            >
              
              {/* Signed in as */}
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-xs text-gray-400">Signed in as</p>
                <p className="text-sm font-bold text-gray-800 truncate">{displayEmail}</p>
              </div>

              {/* Menu items */}
              <div className="py-1">
                {dropdownActions.slice(0, 2).map((item, index) => (
                  <button
                    key={item.label}
                    ref={(element) => {
                      dropdownItemRefs.current[index] = element;
                    }}
                    type="button"
                    role="menuitem"
                    onClick={item.onSelect}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Log Out */}
              <div className="border-t border-gray-100 py-1">
                <button
                  ref={(element) => {
                    dropdownItemRefs.current[2] = element;
                  }}
                  type="button"
                  role="menuitem"
                  onClick={dropdownActions[2].onSelect}
                  className="w-full text-left px-4 py-2 text-sm text-[#DC2626] hover:bg-[#FEF2F2] focus:bg-[#FEF2F2] focus:text-[#B91C1C] focus:outline-none transition-colors"
                >
                  Log Out
                </button>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* Page Content */}
      <div className="flex-1 px-8 py-1 max-w-[100%] flex justify-center">
        <form onSubmit={formik.handleSubmit}>
          <div className="w-[1090px] bg-white rounded-[16px] border border-gray-100 shadow-sm p-6 space-y-7">

            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="w-[290px] h-[24px] font-poppins text-[26px] font-semibold leading-[100%] tracking-[-0.01em] text-[#000000]">Manage Profile Details</h1>
                <p className="w-[203px] h-[12px] font-poppins text-[14px] font-normal leading-[100%] tracking-[-0.01em] text-[#ACACAC] mt-2">Manage your Account Details</p>
              </div>
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-4 py-2.5 rounded-[8px] hover:bg-gray-700 transition-colors"
                >
                  <img src={edit} alt="editIcon" className="w-5 h-5" />
                  Edit Details
                </button>
              )}
            </div>

            {/* Profile Photo */}
            <div className="flex items-center gap-5">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative group cursor-pointer w-20 h-20 rounded-2xl border-2 border-dashed border-gray-300 overflow-hidden bg-gray-50 flex items-center justify-center"
              >
                {/* always shows current confirmed photo or initial */}
                {pendingPhoto ?? photoSrc ? (
                    <img src={pendingPhoto ?? photoSrc!} alt="profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center flex flex-col items-center justify-center">
                      <img src={album} alt="album img" className="w-[16px] h-[16px] object-cover" />
                      <p className="text-[10px] text-gray-400 mt-1 leading-tight">Upload your<br />photo</p>
                    </div>
                  )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <img src={camera} alt="camera" className="w-5 h-5" />
                </div>
              </div>

              <div className="flex-1">
                <p className="font-semibold text-gray-800 text-sm">Profile Photo</p>
                <p className="text-xs text-gray-400 mt-0.5">Upload a new photo or change your existing one</p>

                {isUploading && (
                  <div className="mt-2">
                    <div className="flex justify-between text-[11px] text-gray-500 mb-1">
                      <span>Uploading…</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#1a7a4a] rounded-full transition-all duration-150"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Submit only appears after upload completes and is pending */}
                {pendingPhoto && !isUploading && (
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoSrc(pendingPhoto);
                      formik.setFieldValue("image", pendingPhoto);
                      setPendingPhoto(null);
                      toast.success("Profile photo updated successfully!", { position: "bottom-right" });
                    }}
                    className="mt-2 px-4 py-1.5 bg-[#1a7a4a] hover:bg-[#155f39] text-white text-xs font-medium rounded-lg transition-colors"
                  >
                    Submit
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePhotoChange(f); }}
              />
            </div>

            {/* Personal Details */}
            <section className="w-[1018px] min-h-[360px] flex flex-col gap-6">
              <h2 className="w-[1018px] h-[24px] font-poppins text-[22px] font-semibold leading-[100%] tracking-[-0.01em] text-[#000000]">Personal Details</h2>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">

                {/* Username */}
                <div>
                  <label className={personalLabelCls}>User Name</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    disabled={!isEditing}
                    maxLength={24}
                    placeholder="Enter your Name"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={personalFieldCls(!isEditing)}
                  />
                  {formik.touched.username && formik.errors.username && (
                    <p className="text-[11px] text-red-500 mt-1">{formik.errors.username}</p>
                  )}
                  {usernameLimitReached && !formik.errors.username && (
                    <p className="text-[11px] text-red-500 mt-1">User Name cannot exceed 24 characters</p>
                  )}
                </div>

                {/* Phone Numbers */}
                <div>
                  <label className={personalLabelCls}>Phone Number</label>
                  <div className="space-y-2">
                    {phones.map((p, i) => (
                      <div key={i}>
                        <div className={`w-[497px] h-[48px] flex items-center rounded-[8px] px-4 py-3 bg-gray-50 gap-2 ${p.touched && p.error ? "border border-red-400" : ""}`}>
                          <img src={phone} alt="phone" className="w-4 h-4 shrink-0" />
                          <input
                            type="text"
                            inputMode="tel"
                            disabled={!isEditing}
                            value={p.value}
                            onChange={(e) => handlePhoneChange(i, e.target.value)}
                            onBlur={() => blurPhone(i)}
                            placeholder="+91XXXXXXXXXX"
                            className={`${personalFieldTextCls} disabled:cursor-not-allowed`}
                          />
                          {phones.length > 1 && (
                            <button type="button" onClick={() => removePhone(i)} className="text-gray-400 hover:text-red-500 text-lg leading-none font-bold ml-1">×</button>
                          )}
                        </div>
                        {p.touched && p.error && (
                          <p className="text-[11px] text-red-500 mt-1">{p.error}</p>
                        )}
                        <div className="flex justify-between mt-1">
                          {i === 0 && phones.length < 2 && (
                            <button type="button" onClick={addPhone} className={addLinkCls}>Add New Phone Number</button>
                          )}
                          {i > 0 && <span />}
                          <button type="button" onClick={() => handleUpdatePhone(i)} className={`${updateLinkCls} ml-auto`}>Update Phone Number</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className={personalLabelCls}>Password</label>
                  <div className={`w-[497px] h-[48px] flex items-center rounded-[8px] px-4 py-3 bg-gray-50 ${formik.touched.password && formik.errors.password ? "border border-red-400" : ""} ${!isEditing ? "opacity-60 cursor-not-allowed" : ""}`}>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      disabled={!isEditing}
                      placeholder="Enter your password"
                      value={formik.values.password}
                      maxLength={PASSWORD_MAX_LENGTH}
                      onCopy={blockPasswordClipboardAction}
                      onCut={blockPasswordClipboardAction}
                      onPaste={blockPasswordClipboardAction}
                      onContextMenu={blockPasswordContextMenu}
                      onKeyDown={blockPasswordClipboardShortcut}
                      onChange={(e) => {
                        formik.setFieldValue("password", e.target.value.slice(0, PASSWORD_MAX_LENGTH));
                      }}
                      onBlur={(e) => { setPasswordFocused(false); formik.handleBlur(e); }}
                      onFocus={() => setPasswordFocused(true)}
                      className={`${personalFieldTextCls} disabled:cursor-not-allowed`}
                    />
                    <button type="button" disabled={!isEditing} onClick={() => setShowPassword((current) => !current)} className="text-gray-400 cursor-pointer hover:text-gray-600">
                      <img className="w-5 h-5" src={showPassword ? eyeshow : eyehide} alt="eyeicon" />
                    </button>
                  </div>
                  {showRules && (
                    <ul className="mt-2 space-y-1">
                      {passwordRules.map((rule) => {
                        const passes = rule.test(pwValue);
                        return (
                          <li key={rule.label} className={`flex items-center gap-1.5 text-[11px] font-medium ${passes ? "text-[#1a7a4a]" : "text-red-500"}`}>
                            <span className="text-base leading-none">{passes ? "✓" : "✗"}</span>
                            {rule.label}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                  {formik.touched.password && formik.errors.password && !showRules && (
                    <p className="text-[11px] text-red-500 mt-1">{formik.errors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className={personalLabelCls}>Confirm Password</label>
                  <div className={`w-[497px] h-[48px] flex items-center rounded-[8px] px-4 py-3 bg-gray-50 ${formik.touched.confirmPassword && formik.errors.confirmPassword ? "border border-red-400" : ""} ${!isEditing ? "opacity-60 cursor-not-allowed" : ""}`}>
                    <input
                      type={showConfirm ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      disabled={!isEditing}
                      placeholder="Confirm your password"
                      value={formik.values.confirmPassword}
                      maxLength={PASSWORD_MAX_LENGTH}
                      onCopy={blockPasswordClipboardAction}
                      onCut={blockPasswordClipboardAction}
                      onPaste={blockPasswordClipboardAction}
                      onContextMenu={blockPasswordContextMenu}
                      onKeyDown={blockPasswordClipboardShortcut}
                      onChange={(e) => {
                        formik.setFieldValue("confirmPassword", e.target.value.slice(0, PASSWORD_MAX_LENGTH));
                      }}
                      onBlur={formik.handleBlur}
                      className={`${personalFieldTextCls} disabled:cursor-not-allowed`}
                    />
                    <button type="button" disabled={!isEditing} onClick={() => setShowConfirm((current) => !current)} className="text-gray-400 cursor-pointer hover:text-gray-600">
                      <img className="w-5 h-5" src={showConfirm ? eyeshow : eyehide} alt="eyeicon" />
                    </button>
                  </div>
                  {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <p className="text-[11px] text-red-500 mt-1">{formik.errors.confirmPassword}</p>
                  )}
                </div>

                {/* Email Addresses */}
                <div className="col-span-1">
                  <label className={personalLabelCls}>Email Address</label>
                  <div className="space-y-2">
                    {emails.map((em, i) => (
                      <div key={i}>
                        <div className={`w-[497px] h-[48px] flex items-center rounded-[8px] px-4 py-3 bg-gray-50 gap-2 ${em.touched && em.error ? "border border-red-400" : ""}`}>
                          <input
                            type="text"
                            disabled={!isEditing}
                            value={em.value}
                            onChange={(e) => handleEmailChange(i, e.target.value)}
                            onBlur={() => blurEmail(i)}
                            placeholder="Enter your Email Address"
                            className={`${personalFieldTextCls} disabled:cursor-not-allowed`}
                          />
                          {emails.length > 1 && (
                            <button type="button" onClick={() => removeEmail(i)} className="text-gray-400 hover:text-red-500 text-lg leading-none font-bold ml-1">×</button>
                          )}
                        </div>
                        {em.touched && em.error && (
                          <p className="text-[11px] text-red-500 mt-1">{em.error}</p>
                        )}
                        <div className="flex justify-between mt-1">
                          {i === 0 && emails.length < 2 && (
                            <button type="button" onClick={addEmail} className={addLinkCls}>Add New Email Address</button>
                          )}
                          {i > 0 && <span />}
                          <button type="button" onClick={() => handleUpdateEmail(i)} className={`${updateLinkCls} ml-auto`}>Update Email Address</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </section>

            {/* Professional Details */}
            <section className="w-[1018px]">
              <h2 className="w-[1018px] h-[24px] font-poppins text-[22px] font-semibold leading-[100%] tracking-[-0.01em] text-[#000000] mb-[42px]">Professional Details</h2>

              {/* Subjects */}
              <div className="w-[312px] min-h-[368px] mb-5 flex flex-col gap-4">
                <p className="w-[284px] h-[24px] font-poppins text-[18px] font-semibold leading-[100%] text-[#0F172A]">
                  Subjects:
                </p>
                <div className={`${!isEditing ? "pointer-events-none" : ""}`}>
                  <div className="w-[312px] h-[42px] flex items-center gap-2 px-3 rounded-[8px] bg-gray-50">
                    <img src={search} alt="search" className="w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search"
                      value={subjectSearch}
                      onChange={(e) => setSubjectSearch(e.target.value)}
                      className="flex-1 font-poppins text-sm bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
                    />
                  </div>
                  <div className="mt-4 flex flex-col gap-4">
                    {filteredSubjects.map((subject) => {
                      const checked = formik.values.subjects.includes(subject);
                      return (
                        <label
                          key={subject}
                          onClick={() => toggleSubject(subject)}
                          className="w-[348px] h-[20px] flex items-center gap-4 cursor-pointer"
                        >
                          <div className="w-[16px] h-[16px] rounded border-2 flex items-center justify-center shrink-0 bg-white border-[#1a7a4a]">
                            {checked && <img className="w-2 h-2" src={tick} alt="tick" />}
                          </div>
                          <span className="font-poppins text-[16px] font-semibold text-gray-700">{subject}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
                {formik.touched.subjects && formik.errors.subjects && (
                  <p className="text-[11px] text-red-500 mt-1">
                    {typeof formik.errors.subjects === "string" ? formik.errors.subjects : "Please select at least 3 subjects"}
                  </p>
                )}
              </div>

              {/* Years + Qualification */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div>
                  <label className="block w-[240px] h-[20px] font-poppins text-[16px] font-medium leading-[100%] text-[#030229] mb-2">Years of Experience</label>
                  <div className={`w-[315px] h-[42px] flex items-center gap-2 rounded-[8px] px-3 bg-gray-50 ${!isEditing ? "opacity-60 cursor-not-allowed" : ""}`}>
                    <select
                      id="yearsOfExperience"
                      name="yearsOfExperience"
                      disabled={!isEditing}
                      value={formik.values.yearsOfExperience}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="flex-1 pl-3 pr-8 font-poppins text-[16px] font-semibold text-gray-500 bg-transparent focus:outline-none appearance-none disabled:cursor-not-allowed cursor-pointer"
                    >
                      <option value="" className="px-4 py-2">Choose Years of Experience</option>
                      {YEARS_OPTIONS.map((y) => (
                        <option key={y} value={y} className="px-4 py-2">{y}</option>
                      ))}
                    </select>
                    <img src={downarrow} alt="downarrow" className="w-4 h-4 shrink-0 pointer-events-none" />
                  </div>
                  {formik.touched.yearsOfExperience && formik.errors.yearsOfExperience && (
                    <p className="text-[11px] text-red-500 mt-1">{formik.errors.yearsOfExperience}</p>
                  )}
                </div>

                <div>
                  <label className="block w-[117px] h-[20px] font-poppins text-[16px] font-medium leading-[100%] text-[#030229] mb-2">Qualification</label>
                  <input
                    type="text"
                    id="qualification"
                    name="qualification"
                    disabled={!isEditing}
                    placeholder="Enter your Qualification Details"
                    value={formik.values.qualification}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-[315px] h-[42px] rounded-[8px] px-3 bg-gray-50 font-poppins text-sm text-gray-800 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                  {formik.touched.qualification && formik.errors.qualification && (
                    <p className="text-[11px] text-red-500 mt-1">{formik.errors.qualification}</p>
                  )}
                </div>
                <div>
                  <label className="block w-[117px] h-[20px] font-poppins text-[16px] font-medium leading-[100%] text-[#030229] mb-2">Qualification</label>
                  <input
                    type="text"
                    id="qualification"
                    name="qualification"
                    disabled={!isEditing}
                    placeholder="Enter your Qualification Details"
                    value={formik.values.qualification}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-[315px] h-[42px] rounded-[8px] px-3 bg-gray-50 font-poppins text-sm text-gray-800 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                  {formik.touched.qualification && formik.errors.qualification && (
                    <p className="text-[11px] text-red-500 mt-1">{formik.errors.qualification}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Cancel / Save */}
            {isEditing && (
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-[216px] h-[48px] rounded-[8px] border border-[#238B45] p-3 flex items-center justify-center gap-3 cursor-pointer font-poppins text-[20px] font-semibold leading-[100%] capitalize text-[#238B45] hover:bg-[#F1FFF6] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-[215px] h-[48px] rounded-[8px] bg-[#238B45] p-3 flex items-center justify-center gap-3 cursor-pointer font-poppins text-[20px] font-semibold leading-[100%] capitalize text-[#FFFFFF] hover:bg-[#036724] active:bg-[#42CE70] transition-colors"
                >
                  Save Permissions
                </button>
              </div>
            )}

          </div>
        </form>
      </div>
      <SuccessModalTwo
        isOpen={showSuccess}
        onClose={handleSuccessClose}
      //   onVisitProfile={() => {
      //     setShowSuccess(false);
      //     // navigate("/profile") if you want to route somewhere
      //  }}
      />
    </div>
  );
}
