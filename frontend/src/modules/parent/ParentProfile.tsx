import { useEffect, useMemo, useState } from "react";
import { useLocation, Outlet, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiEdit } from "react-icons/fi";
import { LuImagePlus } from "react-icons/lu";
import phoneIcon from "../../assets/UpdateProfileIcons/phone.svg";
import eyeShowIcon from "../../assets/UpdateProfileIcons/eyeshow.svg";
import eyeHideIcon from "../../assets/UpdateProfileIcons/eyehide.svg";
import SuccessModal from "../../components/SuccessModal";
import { ProfileMenu } from "../profile";
import Logout from "../../components/Logout";
import { useLogoNavigation } from "../../hooks/useLogoNavigation";
import { handleSidebarKeyDown } from "../../utils/sidebarKeyboardNavigation";
import {
  EMAIL_MAX_LENGTH,
  EMAIL_MAX_LENGTH_ERROR,
  PASSWORD_RESTRICTED_CHAR_ERROR,
  hasReachedEmailMaxLength,
  hasRestrictedPasswordChars,
  sanitizePasswordInput,
  limitEmailInput,
} from "../../utils/validation";

import {
  getParentProfile,
  updateParentProfile,
  addChild,
  removeChild,
  updateParentPassword,
  uploadParentProfileImage,
  fetchStudentDetailsByRegistrationNumber
} from "../../services/ParentDashboardProfileService";


type NavItem = {
  label: string;
  id: string;
  icon: string;
};

type ChildDetail = {
  id: string;
  studentReferenceId?: string;
  childName: string;
  registrationNumber: string;
  schoolName: string;
  grade: string;
};

type FieldErrors = {
  fullName?: string;
  phoneNumber?: string;
  currentPassword?: string;
  password?: string;
  confirmPassword?: string;
  emailAddress?: string;
  relationship?: string;
};

type ChildFieldErrors = Record<string, Partial<Record<keyof ChildDetail, string>>>;

const PASSWORD_MAX_LENGTH = 12;
const PHONE_MAX_LENGTH = 15;
const NAME_MAX_LENGTH = 24;
// const SCHOOL_MAX_LENGTH = 16;
const REGISTRATION_NUMBER_MAX_LENGTH = 15;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,12}$/;
const registrationNumberRegex =
  /^STU-\d{4}-\d{6}$/;
const generateChildId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `child-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
const serializeParentProfileValues = (values: {
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  relationship: string;
  children: ChildDetail[];
}) =>
  JSON.stringify({
    fullName: values.fullName.trim(),
    phoneNumber: values.phoneNumber.trim(),
    emailAddress: values.emailAddress.trim(),
    relationship: values.relationship,
    children: values.children.map((child) => ({
      studentReferenceId: child.studentReferenceId || "",
      registrationNumber: child.registrationNumber.trim(),
    })),
  });
export default function ParentProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  const handleLogoClick = useLogoNavigation();

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

  const handleSidebarNavigation = (tab: string) => {
    if (tab === "dashboard") {
      navigate("/parent/dashboard");
      return;
    }

    setLocalActiveTab(tab);
  };

  // State Management
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [relationship, setRelationship] = useState("");
  const [profileRole, setProfileRole] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  // const [profileData, setProfileData] = useState<any>(null);

  // Form State Data Mapping
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [childErrors, setChildErrors] = useState<ChildFieldErrors>({});
  const [studentLookupLoading, setStudentLookupLoading] = useState<Record<string, boolean>>({});
  const [originalProfileSnapshot, setOriginalProfileSnapshot] = useState("");

  const [children, setChildren] = useState<ChildDetail[]>([
    { id: generateChildId(), studentReferenceId: "", childName: "", registrationNumber: "", schoolName: "", grade: "" }
  ]);
  const currentProfileSnapshot = useMemo(
    () =>
      serializeParentProfileValues({
        fullName,
        phoneNumber,
        emailAddress,
        relationship,
        children,
      }),
    [children, emailAddress, fullName, phoneNumber, relationship]
  );
  const hasProfileChanges = currentProfileSnapshot !== originalProfileSnapshot;

  const displayName = fullName || "";
  const displayEmail = emailAddress || "";
  const personalLabelCls =
    "block w-auto min-w-[117px] h-[16px] font-poppins text-[16px] font-medium leading-[100%] text-[#030229] mb-2 whitespace-nowrap";
  const personalFieldCls = (disabled: boolean) =>
    `w-[497px] h-[48px] rounded-[8px] px-4 py-3 font-poppins text-sm text-gray-800 bg-gray-50 focus:outline-none ${disabled ? "opacity-60 cursor-not-allowed" : ""}`;
  const personalFieldTextCls =
    "flex-1 font-poppins text-sm text-gray-800 bg-transparent focus:outline-none";
  const errorTextCls = "mt-1 text-[11px] font-medium text-red-500";

  const loadProfile = async () => {
    try {
      const response = await getParentProfile();
      const nextFullName = response.full_name || "";
      const nextPhoneNumber = response.phone_number
        ? response.phone_number.replace(/^\+/, "")
        : "";
      const nextEmailAddress = limitEmailInput(response.email || "");
      const nextRelationship = response.relationship_type || "";
      const nextChildren = response.children.length
        ? response.children.map(
          (child: any) => ({
            id: child.id,
            studentReferenceId: child.student_reference_id,
            childName: child.child_name,
            registrationNumber:
              child.registration_number,
            schoolName:
              child.school_name || "",
            grade:
              child.grade || "",
          })
        )
        : [
          {
            id: generateChildId(),
            studentReferenceId: "",
            childName: "",
            registrationNumber: "",
            schoolName: "",
            grade: "",
          },
        ];

      // setProfileData(response);

      setFullName(
        nextFullName
      );

      setPhoneNumber(
        nextPhoneNumber
      );

      setEmailAddress(
        nextEmailAddress
      );

      setRelationship(
        nextRelationship
      );
      setProfileRole(response.role || "");

      setProfileImage(
        response.profile_image_url || null
      );

      setChildren(
        nextChildren
      );

      setOriginalProfileSnapshot(
        serializeParentProfileValues({
          fullName: nextFullName,
          phoneNumber: nextPhoneNumber,
          emailAddress: nextEmailAddress,
          relationship: nextRelationship,
          children: nextChildren,
        })
      );
    } catch (error: any) {
      console.error(error);

      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Failed to load profile";

      toast.error(message);
    }
  };

  const navItems: NavItem[] = [
    { label: "Dashboard", id: "dashboard", icon: "/dashboard.png" },
    { label: "Child Courses", id: "child-courses", icon: "/Child course.png" },
    { label: "Child Progress", id: "child-progress", icon: "/child progress.png" },
    { label: "Attendance", id: "attendance", icon: "/Attendance.png" },
    { label: "Assessments", id: "assessments", icon: "/Assesment.png" },
    { label: "Settings", id: "settings", icon: "/Setting.png" },
  ];

  const addChildRow = () => {
    if (!isEditing) return;
    setChildren([
      ...children,
      { id: generateChildId(), studentReferenceId: "", childName: "", registrationNumber: "", schoolName: "", grade: "" }
    ]);
  };

  const removeChildRow = async (
    index: number
  ) => {
    if (!isEditing) return;

    if (children.length === 1) {
      toast.error(
        "At least one child must be linked to the parent account"
      );
      return;
    }
    const child = children[index];

    try {
      if (child.studentReferenceId) {
        await removeChild(child.studentReferenceId);
      }

      setChildren((current) =>
        current.filter(
          (_, childIndex) =>
            childIndex !== index
        )
      );

      toast.success(
        "Child removed successfully"
      );
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Failed to remove child"
      );
    }
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
    if (!value) return "New Password is required";
    if (hasRestrictedPasswordChars(value)) return PASSWORD_RESTRICTED_CHAR_ERROR;
    if (value.length < 8) return "New Password must be at least 8 characters";
    if (value.length > PASSWORD_MAX_LENGTH) return "New Password cannot exceed 12 characters";
    if (!passwordRegex.test(value)) {
      return "Use uppercase, lowercase, number, and special character";
    }
    return "";
  };

  const handleCurrentPasswordChange = (value: string) => {
    const sanitizedValue = sanitizePasswordInput(value).slice(0, PASSWORD_MAX_LENGTH);
    setCurrentPassword(sanitizedValue);

    if (hasRestrictedPasswordChars(value)) {
      updateFieldError("currentPassword", PASSWORD_RESTRICTED_CHAR_ERROR);
      return;
    }

    updateFieldError("currentPassword", sanitizedValue ? "" : "Current Password is required");
    if (password) {
      updateFieldError(
        "password",
        sanitizedValue === password
          ? "New Password cannot be the same as your current password."
          : validatePassword(password),
      );
    }
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

    if (digitsOnly.length > PHONE_MAX_LENGTH) {
      updateFieldError(
        "phoneNumber",
        "Phone number cannot exceed 15 digits"
      );
      return;
    }

    setPhoneNumber(digitsOnly);

    updateFieldError(
      "phoneNumber",
      digitsOnly.length > 0 &&
        digitsOnly.length < 10
        ? "Phone number must be at least 10 digits"
        : ""
    );
  };

  const handlePasswordChange = (value: string) => {
    const sanitizedValue = sanitizePasswordInput(value);

    if (hasRestrictedPasswordChars(value)) {
      setPassword(sanitizedValue.slice(0, PASSWORD_MAX_LENGTH));
      updateFieldError("password", PASSWORD_RESTRICTED_CHAR_ERROR);
      return;
    }

    if (sanitizedValue.length > PASSWORD_MAX_LENGTH) {
      updateFieldError("password", "Password cannot exceed 12 characters");
      return;
    }
    setPassword(sanitizedValue);
    updateFieldError(
      "password",
      sanitizedValue && sanitizedValue === currentPassword
        ? "New Password cannot be the same as your current password."
        : validatePassword(sanitizedValue),
    );
    if (confirmPassword && sanitizedValue !== confirmPassword) {
      updateFieldError("confirmPassword", "Passwords do not match");
    } else if (confirmPassword) {
      updateFieldError("confirmPassword");
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    const sanitizedValue = sanitizePasswordInput(value);

    if (hasRestrictedPasswordChars(value)) {
      setConfirmPassword(sanitizedValue.slice(0, PASSWORD_MAX_LENGTH));
      updateFieldError("confirmPassword", PASSWORD_RESTRICTED_CHAR_ERROR);
      return;
    }

    if (sanitizedValue.length > PASSWORD_MAX_LENGTH) {
      updateFieldError("confirmPassword", "Confirm Password cannot exceed 12 characters");
      return;
    }
    setConfirmPassword(sanitizedValue);
    updateFieldError(
      "confirmPassword",
      sanitizedValue !== password ? "Passwords do not match" : ""
    );
  };

  const handlePasswordKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    field: keyof Pick<FieldErrors, "currentPassword" | "password" | "confirmPassword">
  ) => {
    if ((event.ctrlKey || event.metaKey) && ["c", "v", "x"].includes(event.key.toLowerCase())) {
      event.preventDefault();
    }

    if (event.key === " " || event.key === ".") {
      event.preventDefault();
      updateFieldError(field, PASSWORD_RESTRICTED_CHAR_ERROR);
    }
  };

  const handleEmailChange = (value: string) => {
    const limitedValue = limitEmailInput(value);
    setEmailAddress(limitedValue);
    updateFieldError(
      "emailAddress",
      hasReachedEmailMaxLength(value)
        ? EMAIL_MAX_LENGTH_ERROR
        : limitedValue && !emailRegex.test(limitedValue)
          ? "Enter a valid email address"
          : ""
    );
  };

  const handleRelationshipChange = (value: string) => {
    setRelationship(value);
    updateFieldError("relationship", value ? "" : "Please select relationship type");
  };

  const handleChildInputChange = (
    index: number,
    field: keyof ChildDetail,
    value: string
  ) => {
    const child = children[index];

    if (!child) return;

    if (field === "registrationNumber") {
      const formattedValue = value.toUpperCase();

      if (
        formattedValue.length >
        REGISTRATION_NUMBER_MAX_LENGTH
      ) {
        updateChildError(
          child.id,
          "registrationNumber",
          "Registration Number cannot exceed 15 characters"
        );

        return;
      }

      if (
        formattedValue.length ===
        REGISTRATION_NUMBER_MAX_LENGTH &&
        !registrationNumberRegex.test(
          formattedValue
        )
      ) {
        updateChildError(
          child.id,
          "registrationNumber",
          "Registration Number must be in the format STU-XXXX-XXXXXX"
        );
      } else {
        updateChildError(
          child.id,
          "registrationNumber"
        );
      }

      const updatedChildren = [...children];

      updatedChildren[index] = {
        ...updatedChildren[index],
        registrationNumber:
          formattedValue,
        childName: "",
        schoolName: "",
        grade: "",
      };

      setChildren(updatedChildren);

      updateChildError(
        child.id,
        "childName"
      );

      updateChildError(
        child.id,
        "schoolName"
      );

      updateChildError(
        child.id,
        "grade"
      );

      return;
    }

    const updatedChildren = [...children];

    updatedChildren[index] = {
      ...updatedChildren[index],
      [field]: value,
    };

    setChildren(updatedChildren);

    updateChildError(
      child.id,
      field
    );
  };

  const lookupStudentDetails = async (
    index: number
  ) => {
    const child = children[index];

    if (!child) return;

    const registrationNumber =
      child.registrationNumber.trim();

    if (!registrationNumber) {
      updateChildError(
        child.id,
        "registrationNumber",
        "Registration Number is required"
      );

      return;
    }

    setStudentLookupLoading(
      (current) => ({
        ...current,
        [child.id]: true,
      })
    );

    updateChildError(
      child.id,
      "registrationNumber"
    );

    try {
      const student =
        await fetchStudentDetailsByRegistrationNumber(
          registrationNumber
        );

      if (!student) {
        updateChildError(
          child.id,
          "registrationNumber",
          "Student not found"
        );

        return;
      }

      const updatedChildren = [...children];

      updatedChildren[index] = {
        ...updatedChildren[index],
        childName:
          student.child_name || "",
        schoolName:
          student.school_name || "",
        grade:
          student.grade || "",
      };

      setChildren(updatedChildren);

      updateChildError(
        child.id,
        "childName"
      );

      updateChildError(
        child.id,
        "schoolName"
      );

      updateChildError(
        child.id,
        "grade"
      );

    } catch (error: any) {
      updateChildError(
        child.id,
        "registrationNumber",
        error?.response?.data?.detail ||
        "Unable to fetch student details. Please try again."
      );
    } finally {
      setStudentLookupLoading(
        (current) => ({
          ...current,
          [child.id]: false,
        })
      );
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditing) return;
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedImageTypes.includes(file.type)) {
      event.target.value = "";
      toast.error("Please upload only JPG, JPEG, or PNG image files.");
      return;
    }

    try {
      const updatedProfile = await uploadParentProfileImage(file);
      setProfileImage(updatedProfile.profile_image_url || null);
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || "Failed to upload profile image.");
    } finally {
      event.target.value = "";
    }
  };

  const handleSave = async () => {
    if (!hasProfileChanges) return;

    const nextErrors: FieldErrors = {
      fullName: fullName
        ? ""
        : "Full Name is required",

    phoneNumber: phoneNumber
  ? phoneNumber.length >= 10 && phoneNumber.length <= 15
    ? ""
    : "Phone number must be between 10 and 15 digits"
  : "",

emailAddress: emailAddress
  ? hasReachedEmailMaxLength(emailAddress)
    ? EMAIL_MAX_LENGTH_ERROR
    : emailRegex.test(emailAddress)
    ? ""
    : "Enter a valid email address"
  : "",

      relationship: relationship
        ? ""
        : "Please select relationship type",
    };

    const nextChildErrors: ChildFieldErrors =
      {};

    children.forEach((child) => {
      nextChildErrors[child.id] = {
        registrationNumber:
          !child.registrationNumber
            ? "Registration Number is required"
            : !registrationNumberRegex.test(
              child.registrationNumber
            )
              ? "Registration Number must be in the format STU-XXXX-XXXXXX"
              : "",
      };
    });

    setFieldErrors((current) => ({
      ...current,
      ...nextErrors,
    }));

    setChildErrors(nextChildErrors);

    const hasFieldErrors =
      Object.values(nextErrors).some(Boolean);

    const hasChildErrors =
      Object.values(nextChildErrors).some(
        (childError) =>
          Object.values(childError).some(Boolean)
      );

    if (
      hasFieldErrors ||
      hasChildErrors
    ) {
      return;
    }

    try {
      await updateParentProfile({
  full_name: fullName,
  relationship_type: relationship,
  email: emailAddress.trim() === "" ? null : emailAddress,
  phone_number: phoneNumber.trim() === "" ? null : phoneNumber,
});

      for (const child of children) {
        if (
          !child.studentReferenceId &&
          child.registrationNumber?.trim()
        ) {
          await addChild({
            student_registration_number:
              child.registrationNumber.trim(),
          });
        }
      }

      await loadProfile();
      setIsEditing(false);
      setShowSuccessModal(true);

    } catch (error: any) {
      console.error(error);

      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Failed to save changes";

      toast.error(message);
    }
  };

  const handleUpdatePassword = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    if (
      !currentPassword.trim() &&
      !password.trim() &&
      !confirmPassword.trim()
    ) {
      setFieldErrors((current) => ({
        ...current,
        currentPassword: "",
        password: "",
        confirmPassword: "",
      }));
      toast.error("Please fill all required fields.");
      return;
    }

    const nextErrors: FieldErrors = {
      currentPassword: currentPassword.trim() ? "" : "Current Password is required.",
      password: !password.trim()
        ? "Password is required."
        : password === currentPassword
          ? "New Password cannot be the same as your current password."
          : validatePassword(password),
      confirmPassword: !confirmPassword.trim()
        ? "Confirm Password is required."
        : confirmPassword === password
          ? ""
          : "Passwords do not match",
    };

    setFieldErrors((current) => ({
      ...current,
      ...nextErrors,
    }));

    if (
      Object.values(nextErrors).some(Boolean)
    ) {
      return;
    }

    try {
      await updateParentPassword({
        current_password: currentPassword,
        new_password: password,
        confirm_password: confirmPassword,
      });

      setCurrentPassword("");
      setPassword("");
      setConfirmPassword("");
      setIsEditing(false);
      toast.success(
        "Password updated successfully"
      );

    } catch (error: any) {
      console.error(error);

      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Failed to update password";

      if (message === "New Password cannot be the same as your current password.") {
        updateFieldError("password", message);
      } else {
        toast.error(message);
      }
    }
  };

  const handleCancelEdit = async () => {
    setCurrentPassword("");
    setPassword("");
    setConfirmPassword("");

    setFieldErrors({});
    setChildErrors({});

    await loadProfile();

    setIsEditing(false);
  };

  const handleProfileClick = () => {
    setLocalActiveTab("dashboard");
    navigate("/parent/profile");
  };

  const handleSettingsClick = () => {
    setLocalActiveTab("settings");
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

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <div className="min-h-screen w-screen bg-[#FDFFFE] font-['Poppins',sans-serif] antialiased text-gray-900 flex overflow-hidden">

      {/* SIDEBAR PANEL */}
      <aside className="w-[280px] min-w-[280px] h-screen border-transparent flex flex-col pt-8 px-6 bg-white shrink-0 sticky top-0 font-['Poppins',sans-serif]">
        <button
          type="button"
          onClick={handleLogoClick}
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

        <nav
          aria-label="Parent dashboard"
          className="flex-1 mt-12"
          onKeyDown={handleSidebarKeyDown}
        >
          <ul className="space-y-1.5">
            {navItems.map((item) => {
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    data-sidebar-item
                    aria-current={activeTab === item.id ? "page" : undefined}
                    onClick={() => handleSidebarNavigation(item.id)}
                    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-[16px] font-normal font-['Poppins',sans-serif] transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#238B45] ${activeTab === item.id
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
              {activeTab === "dashboard" ? "Manage your account details" : "View and manage active information screens"}
            </p>
          </div>

          <Logout redirectTo="/login" toastDuration={3000}>
            {({ logout }) => (
              <ProfileMenu
                userEmail={displayEmail}
                userName={displayName}
                userRole={profileRole}
                avatarSrc={profileImage || undefined}
                onProfileClick={handleProfileClick}
                onSettingsClick={handleSettingsClick}
                onLogoutClick={logout}
              />
            )}
          </Logout>
        </header>

        {/* SCROLLABLE WORKSPACE CONTAINER */}
        < main className="flex-1 overflow-y-auto px-12 py-10 bg-[#FDFFFE]" >
          <div className="w-full max-w-[1000px]">

            <Outlet />

            {/* PROFILE FORM - Only visible on 'dashboard' tab */}
            {activeTab === "dashboard" && (
              <div className="bg-white rounded-3xl border border-transparent p-8 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">

                {/* PROFILE PHOTO ROW */}
                <div className="relative mb-10 flex h-[124px] w-[482px] flex-col items-center gap-[24px] pb-0 sm:flex-row">

                  {/* IMAGING CONTAINER */}
                  <label
                    aria-disabled={!isEditing}
                    className={`flex h-[124px] w-[124px] flex-col items-center justify-center gap-[10px] overflow-hidden rounded-[24px] border-[1.5px] border-dashed border-[#4C535F] bg-[#EDF2F6] p-[10px] text-center transition-all select-none group relative ${isEditing ? "cursor-pointer hover:bg-[#E6EDF3] hover:border-[#238B45]" : "cursor-not-allowed opacity-60"}`}
                  >
                    {profileImage ? (
                      <>
                        <img src={profileImage} alt="Profile Preview" className="h-full w-full rounded-[20px] object-cover" />
                        {isEditing && (
                          <span className="absolute bottom-[10px] right-[10px] flex h-[30px] w-[30px] items-center justify-center rounded-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.18)]">
                            <LuImagePlus size={18} className="text-[#238B45]" />
                          </span>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <LuImagePlus size={28} className={`text-[#94A3B8] transition-colors mb-1.5 ${isEditing ? "group-hover:text-[#16A34A]" : ""}`} />
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
                <section className="mb-12 flex min-h-[440px] w-[1018px] flex-col gap-[24px]">
                  <div className="flex w-[1018px] items-center justify-between">
                    <h2 className="m-0 h-[24px] font-['Poppins',sans-serif] text-[22px] font-semibold leading-none tracking-[-0.01em] text-black">Manage Personal Details</h2>
                    <button
                      type="button"
                      disabled={!isEditing}
                      onClick={handleUpdatePassword}
                      className="flex h-[40px] min-w-[118px] items-center justify-center rounded-[8px] bg-[#238B45] px-5 font-poppins text-[14px] font-semibold text-white transition-colors hover:bg-[#1C6E36] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#238B45]"
                    >
                      Update Password
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-x-[24px] gap-y-[24px] md:grid-cols-2">
                    <div className="order-1">
                      <label className={personalLabelCls}>Full Name</label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={fullName}
                        disabled={!isEditing}
                        onChange={(e) => handleFullNameChange(e.target.value)}
                        placeholder="Enter your Full Name"
                        className={personalFieldCls(!isEditing)}
                      />
                      {fieldErrors.fullName && (
                        <p className={errorTextCls}>{fieldErrors.fullName}</p>
                      )}
                    </div>
                    <div className="order-2">
                      <label className={personalLabelCls}>Current Password</label>
                      <div className={`flex h-[48px] w-[497px] items-center rounded-[8px] bg-gray-50 px-4 py-3 ${fieldErrors.currentPassword ? "border border-red-400" : ""} ${!isEditing ? "cursor-not-allowed opacity-60" : ""}`}>
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          id="currentPassword"
                          name="currentPassword"
                          value={currentPassword}
                          disabled={!isEditing}
                          onChange={(e) => handleCurrentPasswordChange(e.target.value)}
                          onCopy={(e) => e.preventDefault()}
                          onCut={(e) => e.preventDefault()}
                          onPaste={(e) => e.preventDefault()}
                          onContextMenu={(e) => e.preventDefault()}
                          onKeyDown={(e) => handlePasswordKeyDown(e, "currentPassword")}
                          placeholder="Enter your current password"
                          className={`${personalFieldTextCls} disabled:cursor-not-allowed`}
                        />
                        <button
                          type="button"
                          disabled={!isEditing}
                          onClick={() => setShowCurrentPassword((current) => !current)}
                          className="cursor-pointer text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
                        >
                          <img className="h-5 w-5" src={showCurrentPassword ? eyeShowIcon : eyeHideIcon} alt="eyeicon" />
                        </button>
                      </div>
                      {fieldErrors.currentPassword && (
                        <p className={errorTextCls}>{fieldErrors.currentPassword}</p>
                      )}
                    </div>
                    <div className="order-3">
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
                    <div className="order-4">
                      <label className={personalLabelCls}>New Password</label>
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
                          onKeyDown={(e) => handlePasswordKeyDown(e, "password")}
                          placeholder="Enter your new password"
                          className={`${personalFieldTextCls} disabled:cursor-not-allowed`}
                        />
                        <button
                          type="button"
                          disabled={!isEditing}
                          onClick={() => setShowPassword((current) => !current)}
                          className="cursor-pointer text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
                          aria-label={showPassword ? "Hide new password" : "Show new password"}
                          aria-pressed={showPassword}
                        >
                          <img className="h-5 w-5" src={showPassword ? eyeShowIcon : eyeHideIcon} alt="" aria-hidden="true" />
                        </button>
                      </div>
                      {fieldErrors.password && (
                        <p className={errorTextCls}>{fieldErrors.password}</p>
                      )}
                    </div>
                    <div className="order-6">
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
                          onKeyDown={(e) => handlePasswordKeyDown(e, "confirmPassword")}
                          placeholder="Confirm your password"
                          className={`${personalFieldTextCls} disabled:cursor-not-allowed`}
                        />
                        <button
                          type="button"
                          disabled={!isEditing}
                          onClick={() => setShowConfirmPassword((current) => !current)}
                          className="cursor-pointer text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
                          aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                          aria-pressed={showConfirmPassword}
                        >
                          <img className="h-5 w-5" src={showConfirmPassword ? eyeShowIcon : eyeHideIcon} alt="" aria-hidden="true" />
                        </button>
                      </div>
                      {fieldErrors.confirmPassword && (
                        <p className={errorTextCls}>{fieldErrors.confirmPassword}</p>
                      )}
                    </div>
                    <div className="order-5 col-span-1">
                      <label className={personalLabelCls}>Email Address</label>
                      <div className="space-y-2">
                        <div>
                          <div className="flex h-[48px] w-[497px] items-center rounded-[8px] bg-gray-50 px-4 py-3">
                            <input
                              type="email"
                              maxLength={EMAIL_MAX_LENGTH}
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
                    <div className="order-7 flex h-[72px] w-[238px] flex-col gap-[8px] opacity-100">
                      <label className="block h-[16px] font-['Poppins',sans-serif] text-[16px] font-medium leading-none text-[#030229]">Relationship</label>
                      <div className="relative">
                        <select
                          value={relationship}
                          disabled={!isEditing}
                          onChange={(e) => handleRelationshipChange(e.target.value)}
                          className={`box-border h-[48px] w-[238px] appearance-none rounded-[8px] border py-[12px] pl-[16px] pr-10 text-xs font-bold outline-none transition-all ${isEditing ? "bg-white border-[#CBD5E1] focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A] text-gray-800" : "bg-gray-50/50 border-gray-100 text-gray-500 cursor-not-allowed"}`}
                        >
                          <option value="">Choose Relation Type</option>
                          <option value="FATHER">Father</option>
                          <option value="MOTHER">Mother</option>
                          <option value="GUARDIAN">Guardian</option>
                          <option value="OTHER">Other</option>
                        </select>
                        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 flex items-center justify-center">
                          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
                            disabled
                            placeholder="Enter Child Name"
                            className={personalFieldCls(true)}
                          />
                          {childErrors[child.id]?.childName && (
                            <p className={errorTextCls}>{childErrors[child.id]?.childName}</p>
                          )}
                        </div>
                        <div>
                          <label className={personalLabelCls}>
                            Student ID
                          </label>

                          <div className="flex h-[48px] w-[497px] items-center gap-2">
                            <input
                              type="text"
                              value={child.registrationNumber}
                              disabled={
                                !isEditing ||
                                !!child.studentReferenceId
                              } onChange={(e) =>
                                handleChildInputChange(
                                  index,
                                  "registrationNumber",
                                  e.target.value
                                )
                              }
                              placeholder="Enter Registration Number"
                              className="h-[48px] flex-1 rounded-[8px] bg-gray-50 px-4 py-3 font-poppins text-sm text-gray-800 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                            />

                            <button
                              type="button"
                              disabled={
                                !isEditing ||
                                !!child.studentReferenceId ||
                                studentLookupLoading[child.id]
                              }
                              onMouseDown={(event) =>
                                event.preventDefault()
                              }
                              onClick={() =>
                                lookupStudentDetails(index)
                              }
                              className="h-[48px] w-[104px] rounded-[8px] bg-[#238B45] px-4 font-poppins text-[14px] font-semibold text-white transition-colors hover:bg-[#1C6E36] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {studentLookupLoading[child.id]
                                ? "Loading"
                                : "Search"}
                            </button>
                          </div>

                          {childErrors[child.id]?.registrationNumber && (
                            <p className={errorTextCls}>
                              {childErrors[child.id]?.registrationNumber}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className={personalLabelCls}>School Name</label>
                          <input
                            type="text"
                            value={child.schoolName}
                            disabled
                            placeholder="Enter School Name"
                            className={personalFieldCls(true)}
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
                              disabled
                              className="h-[48px] w-[497px] appearance-none rounded-[8px] bg-gray-50 px-4 py-3 pr-10 font-poppins text-sm font-bold text-gray-800 outline-none cursor-not-allowed opacity-60"
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
                                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </div>
                          </div>
                          {childErrors[child.id]?.grade && (
                            <p className={errorTextCls}>{childErrors[child.id]?.grade}</p>
                          )}
                        </div>
                        {children.length > 1 && (
                          <div className="md:col-span-2">
                            <button
                              type="button"
                              onClick={() => removeChildRow(index)}
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
                    disabled={!isEditing}
                    onClick={addChildRow} className="mt-6 inline-flex h-[48px] w-[229px] items-center justify-center gap-[8px] rounded-[8px] bg-[#238B45] px-[24px] py-[12px] font-poppins text-[16px] font-semibold leading-[100%] text-white opacity-100 transition-all hover:bg-[#1C6E36] disabled:cursor-not-allowed disabled:opacity-50"
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
                      onClick={handleCancelEdit}
                      className="flex h-[48px] w-[216px] items-center justify-center gap-[12px] rounded-[8px] border border-[#238B45] bg-white p-[12px] font-poppins text-[20px] font-semibold capitalize leading-[100%] text-[#238B45] opacity-100 transition-colors hover:bg-[#EEF8F1]"
                    >
                      <span className="h-[18px] w-[73px] leading-[18px]">Cancel</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={!hasProfileChanges}
                      className="flex h-[48px] w-[215px] items-center justify-center gap-[12px] rounded-[8px] bg-[#238B45] p-[12px] font-poppins text-[20px] font-semibold capitalize leading-[100%] text-white opacity-100 transition-colors hover:bg-[#1C6E36] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <span className="h-[18px] w-[183px] leading-[18px]">Save Changes</span>
                    </button>
                  </div>
                )}
              </div>
            )
            }

            {/* Empty views layout for other active tabs */}
            {
              activeTab !== "dashboard" && (
                <div className="w-full min-h-[300px] flex items-center justify-center border border-dashed border-transparent rounded-3xl bg-white/50">
                  {/* Kept empty on page purpose per request */}
                </div>
              )
            }

          </div >
        </main >
      </div >

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Congratulations!"
        message="Your changes have been updated successfully."
        buttonText="Continue"
        onPrimaryAction={() => {
          setShowSuccessModal(false);
        }}
      />
    </div >
  );
}
