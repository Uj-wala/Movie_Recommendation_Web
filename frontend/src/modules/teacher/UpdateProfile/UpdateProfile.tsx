import { useState, useRef, useCallback, useEffect, useMemo, type ClipboardEvent, type KeyboardEvent, type MouseEvent as ReactMouseEvent } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import downarrow from "../../../assets/UpdateProfileIcons/DownArrow.svg";
import album from "../../../assets/UpdateProfileIcons/albumimg.svg";
import camera from "../../../assets/UpdateProfileIcons/camera.svg";
import edit from "../../../assets/UpdateProfileIcons/Edit.svg";
import phone from "../../../assets/UpdateProfileIcons/phone.svg";
import search from "../../../assets/UpdateProfileIcons/search.svg";
import eyeshow from "../../../assets/UpdateProfileIcons/eyeshow.svg";
import eyehide from "../../../assets/UpdateProfileIcons/eyehide.svg";
import tick from "../../../assets/UpdateProfileIcons/tick.svg";
import { useNavigate, useOutletContext } from "react-router-dom";
import SuccessModal from "../../../components/SuccessModal";
import type { TeacherLayoutContext } from "../Layout/TeacherLayout";
import { ProfileMenu } from "../../profile";
import Logout from "../../../components/Logout";
import {
  EMAIL_MAX_LENGTH,
  EMAIL_MAX_LENGTH_ERROR,
  PASSWORD_RESTRICTED_CHAR_ERROR,
  hasReachedEmailMaxLength,
  hasRestrictedPasswordChars,
  isValidPasswordCharacters,
  sanitizePasswordInput,
  limitEmailInput,
} from "../../../utils/validation";
import {
  getTeacherProfile,
  updateTeacherProfile,
  updateTeacherPassword,
  uploadTeacherProfileImage,
  type TeacherProfile,
} from "../../../services/teacherProfileService";
import {getSubjectsDropdown,type DropdownItem,} from "../../../services/dropdownService";

interface InitialValues {
  username: string;
  currentPassword?: string;
  password: string;
  confirmPassword: string;
  yearsOfExperience: string;
  qualification: string;
  subjects: string[];
  phone: string[];
  email: string[];
  image: string;
  expertises: string;
}

const InitialValuesProfile: InitialValues = {
  username: "",
  currentPassword: "",
  password: "",
  confirmPassword: "",
  yearsOfExperience: "",
  qualification: "",
  subjects: [],
  phone: [],
  email: [],
  image: "",
  expertises: "",
};
const PASSWORD_MAX_LENGTH = 12;

const YEARS_OPTIONS = [
  "1 Year",
  "2 Years",
  "3 Years",
  "4 Years",
  "5 Years",
  "6-10 Years",
  "10+ Years",
];

const passwordRules = [
  { label: "At least 8 characters", test: (v: string) => v.length >= 8 },
  { label: "No more than 12 characters", test: (v: string) => v.length <= PASSWORD_MAX_LENGTH },
  { label: "No spaces or dots", test: isValidPasswordCharacters },
  { label: "At least one uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { label: "At least one number", test: (v: string) => /[0-9]/.test(v) },
  { label: "At least one special character (!@#$%^&*)", test: (v: string) => /[!@#$%^&*(),?":{}|<>]/.test(v) },
];

const phoneRegex = /^\+91[0-9]{10}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
const serializeTeacherProfileValues = (values: {
  username: string;
  yearsOfExperience: string;
  qualification: string;
  expertises: string;
  subjects: string[];
  phoneNumber: string;
}) =>
  JSON.stringify({
    username: values.username.trim(),
    yearsOfExperience: values.yearsOfExperience,
    qualification: values.qualification.trim(),
    expertises: values.expertises.trim(),
    subjects: [...values.subjects].sort(),
    phoneNumber: values.phoneNumber.trim(),
  });

const validationSchema = Yup.object({
  username: Yup.string()
    .required("Username is required")
    .max(24, "User Name cannot exceed 24 characters")
    .matches(/^[A-Za-z\s'.-]+$/, "User Name can only contain letters, spaces, apostrophe, hyphen, and period")
    .min(3, "Username must be at least 3 characters"),
  password: Yup.string()
  .max(PASSWORD_MAX_LENGTH, "Password cannot exceed 12 characters"),

confirmPassword: Yup.string()
  .max(PASSWORD_MAX_LENGTH, "Confirm Password cannot exceed 12 characters")
  .oneOf([Yup.ref("password")], "Passwords do not match"),  
  yearsOfExperience: Yup.string().required("Please select years of experience"),
  qualification: Yup.string().required("Qualification is required"),
  subjects: Yup.array()
    .of(Yup.string().required())
    .min(1, "Please select at least one subject."),
  expertises: Yup.string()
    // .required("Expertises must contain at least 10 characters")
    // .min(10, "Expertises must contain at least 10 characters"),
  .required("Expertise is required")
  .min(4, "Expertise must contain at least 4 characters")
  .max(12, "Expertise must not exceed 12 characters"),
});

export default function UpdateProfile() {
  const { setActiveTab } = useOutletContext<TeacherLayoutContext>();
  const [isEditing, setIsEditing] = useState(false);
  const [photoSrc, setPhotoSrc] = useState<string>(InitialValuesProfile.image);
  const [pendingPhoto, setPendingPhoto] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [subjectSearch, setSubjectSearch] = useState("");
  const [subjectsList, setSubjectsList] = useState<DropdownItem[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [teacherProfileData, setTeacherProfileData] = useState<TeacherProfile | null>(null);
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const [originalProfileSnapshot, setOriginalProfileSnapshot] = useState("");
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

  const handlePasswordKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
    field: "currentPassword" | "password" | "confirmPassword"
  ) => {
    blockPasswordClipboardShortcut(event);

    if (event.key === " " || event.key === ".") {
      event.preventDefault();
      formik.setFieldTouched(field, true, false);
      formik.setFieldError(field, PASSWORD_RESTRICTED_CHAR_ERROR);
    }
  };

  const handlePasswordFieldChange = (
    field: "currentPassword" | "password" | "confirmPassword",
    value: string,
    maxLength = PASSWORD_MAX_LENGTH
  ) => {
    const sanitizedValue = sanitizePasswordInput(value).slice(0, maxLength);
    formik.setFieldTouched(field, true, false);

    if (hasRestrictedPasswordChars(value)) {
      formik.setFieldValue(field, sanitizedValue, false);
      formik.setFieldError(field, PASSWORD_RESTRICTED_CHAR_ERROR);
      return;
    }

    formik.setFieldValue(field, sanitizedValue);

    if (field === "password") {
      formik.setFieldError(
        "password",
        sanitizedValue && sanitizedValue === formik.values.currentPassword
          ? "New Password cannot be the same as your current password."
          : "",
      );
    } else if (field === "currentPassword" && formik.values.password) {
      formik.setFieldError(
        "password",
        sanitizedValue === formik.values.password
          ? "New Password cannot be the same as your current password."
          : "",
      );
    }
  };

  const [phones, setPhones] = useState(InitialValuesProfile.phone.map((p) => ({ value: p, touched: false, error: "" })));
  const [emails, setEmails] = useState([{ value: "", touched: false, error: "" }]);

  const formik = useFormik({
    initialValues: {
      username: "",
      currentPassword: "",
      password: "",
      confirmPassword: "",
      yearsOfExperience: InitialValuesProfile.yearsOfExperience,
      qualification: InitialValuesProfile.qualification,
      expertises: InitialValuesProfile.expertises || "",
      subjects: InitialValuesProfile.subjects as string[],
      image: InitialValuesProfile.image,
    },
    validationSchema,
    onSubmit: async (values, actions) => {
      if (
        serializeTeacherProfileValues({
          username: values.username,
          yearsOfExperience: values.yearsOfExperience,
          qualification: values.qualification,
          expertises: values.expertises,
          subjects: values.subjects,
          phoneNumber: phones[0]?.value || "",
        }) === originalProfileSnapshot
      ) return;

      // ✅ FIX 1: phone is optional — empty allowed, format checked only if filled
      const phoneErrors = phones.map((p) =>
        !p.value ? "" : !phoneRegex.test(p.value) ? "Invalid format. Use country code e.g. +911234567890" : ""
      );
      // ✅ FIX 2: email is optional — empty allowed, format checked only if filled
      const emailErrors = emails.map((e) =>
        validateEmail(e.value)
      );
      const hasPhoneError = phoneErrors.some((e) => e);
      const hasEmailError = emailErrors.some((e) => e);
      setPhones((prev) => prev.map((p, i) => ({ ...p, touched: true, error: phoneErrors[i] })));
      setEmails((prev) => prev.map((em, i) => ({ ...em, touched: true, error: emailErrors[i] })));
      if (hasPhoneError || hasEmailError) return;
      const selectedSubjectIds = subjectsList
        .filter(subject =>
          values.subjects.includes(subject.name)
        )
        .map(subject => subject.id);

      setIsProfileSaving(true);
      try {
        let updatedProfile = await updateTeacherProfile({
          full_name: values.username,
          qualification: values.qualification,
          bio: values.expertises,
          years_of_experience: values.yearsOfExperience,
          phone_number: phones[0]?.value,
          subject_ids: selectedSubjectIds,
        });

        if (selectedImageFile) {
          setIsUploading(true);
          updatedProfile = await uploadTeacherProfileImage(selectedImageFile);
        }

        const updatedImageSrc = updatedProfile.profile_image || photoSrc;

        setTeacherProfileData(updatedProfile);
        setPhotoSrc(updatedImageSrc);
        setPendingPhoto(null);
        setSelectedImageFile(null);
        actions.resetForm({
          values: {
            ...values,
            image: updatedImageSrc,
            currentPassword: "",
            password: "",
            confirmPassword: "",
          },
        });
        setOriginalProfileSnapshot(
          serializeTeacherProfileValues({
            username: updatedProfile.full_name || values.username,
            yearsOfExperience: updatedProfile.years_of_experience || values.yearsOfExperience,
            qualification: updatedProfile.qualification || values.qualification,
            expertises: updatedProfile.bio || values.expertises,
            subjects: updatedProfile.subjects || values.subjects,
            phoneNumber: updatedProfile.phone_number || phones[0]?.value || "",
          })
        );
        setIsEditing(false);
        setShowSuccess(true);
      } catch (error: any) {
        toast.error(
          error?.response?.data?.detail || "Failed to update teacher profile",
          { position: "bottom-right" },
        );
      } finally {
        setIsUploading(false);
        setIsProfileSaving(false);
      }
    },
  });
  const currentProfileSnapshot = useMemo(
    () =>
      serializeTeacherProfileValues({
        username: formik.values.username,
        yearsOfExperience: formik.values.yearsOfExperience,
        qualification: formik.values.qualification,
        expertises: formik.values.expertises,
        subjects: formik.values.subjects,
        phoneNumber: phones[0]?.value || "",
      }),
    [
      formik.values.expertises,
      formik.values.qualification,
      formik.values.subjects,
      formik.values.username,
      formik.values.yearsOfExperience,
      phones,
    ]
  );
  const hasProfileChanges = currentProfileSnapshot !== originalProfileSnapshot;

  useEffect(() => {
    const fetchTeacherProfile = async () => {
      try {
        setIsProfileLoading(true);

        const profile = await getTeacherProfile();
        const subjects = await getSubjectsDropdown();

        setSubjectsList(subjects);
        setTeacherProfileData(profile);

        formik.setValues({
          username: profile.full_name || "",
          currentPassword: "",
          password: "",
          confirmPassword: "",
          yearsOfExperience: profile.years_of_experience || "",
          qualification: profile.qualification || "",
          expertises: profile.bio || "",
          subjects: profile.subjects || [],
          image: profile.profile_image || "",
        });

        setPhones([
          {
            value: profile.phone_number || "",
            touched: false,
            error: "",
          },
        ]);

        setEmails([
          {
            value: limitEmailInput(profile.email || ""),
            touched: false,
            error: "",
          },
        ]);

        setPhotoSrc(
          profile.profile_image || InitialValuesProfile.image
        );
        setOriginalProfileSnapshot(
          serializeTeacherProfileValues({
            username: profile.full_name || "",
            yearsOfExperience: profile.years_of_experience || "",
            qualification: profile.qualification || "",
            expertises: profile.bio || "",
            subjects: profile.subjects || [],
            phoneNumber: profile.phone_number || "",
          })
        );
      } catch (error: any) {
        toast.error(
          error?.response?.data?.detail ||
            "Failed to load teacher profile",
          {
            position: "bottom-right",
          }
        );
      } finally {
        setIsProfileLoading(false);
      }
    };

    fetchTeacherProfile();
  }, []);

  const handlePhotoChange = useCallback((file: File) => {
    const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png"];
    const allowedExtensions = /\.(jpe?g|png)$/i;

    if (!allowedImageTypes.includes(file.type) || !allowedExtensions.test(file.name)) {
      toast.error("Please upload only JPG, JPEG, or PNG image files.", { position: "bottom-right" });
      return;
    }
    setSelectedImageFile(file);
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
            toast.success("Photo ready! Click on save changes.", { position: "bottom-right" });
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
    formik.setFieldTouched("subjects", true, false);
    if (updated.length) {
      formik.setFieldError("subjects", undefined);
    }
  };

  const filteredSubjects = subjectsList.filter((subject) =>
    subject.name.toLowerCase().includes(subjectSearch.toLowerCase())
  );

  // ── Phone helpers ─────────────────────────────────────────────────────────
  const validatePhone = (value: string) => {
    // ✅ FIX 3: empty phone is allowed
    if (!value) return "";
    const digitsAfterCountryCode = value.startsWith("+91") ? value.slice(3).replace(/\D/g, "") : "";
    if (digitsAfterCountryCode.length > 10) return "Phone number cannot exceed 10 digits";
    if (!phoneRegex.test(value)) return "Invalid format. Use country code e.g. +911234567890";
    return "";
  };

  const handlePhoneChange = (index: number, raw: string) => {
    const digits = raw.replace(/\D/g, "");
    if (!digits) {
      setPhones((prev) => prev.map((p, i) => i === index ? { ...p, value: "", touched: true, error: "" } : p));
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
    toast.success(`Phone number updated successfully!`, { position: "bottom-right" });
  };

  // ── Email helpers ─────────────────────────────────────────────────────────
  const validateEmail = (value: string) => {
    // ✅ FIX 4: empty email is allowed
    if (!value) return "";
    if (hasReachedEmailMaxLength(value)) return EMAIL_MAX_LENGTH_ERROR;
    if (!emailRegex.test(value)) return "Enter a valid email";
    return "";
  };

  const handleEmailChange = (index: number, value: string) => {
    const limitedValue = limitEmailInput(value);
    const error = hasReachedEmailMaxLength(value)
      ? EMAIL_MAX_LENGTH_ERROR
      : validateEmail(limitedValue);
    setEmails((prev) => prev.map((e, i) => i === index ? { ...e, value: limitedValue, touched: true, error } : e));
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
    toast.success(`Email address updated successfully!`, { position: "bottom-right" });
  };

  const handleCancel = () => {
    if (teacherProfileData) {
      formik.setValues({
        username: teacherProfileData.full_name || "",
        currentPassword: "",
        password: "",
        confirmPassword: "",
        yearsOfExperience: teacherProfileData.years_of_experience || "",
        qualification: teacherProfileData.qualification || "",
        expertises: teacherProfileData.bio || "",
        subjects: teacherProfileData.subjects || [],
        image: teacherProfileData.profile_image || "",
      });
      setPhones([
        {
          value: teacherProfileData.phone_number || "",
          touched: false,
          error: "",
        },
      ]);
      setEmails([
        {
          value: limitEmailInput(teacherProfileData.email || ""),
          touched: false,
          error: "",
        },
      ]);
    }

    setPendingPhoto(null);
    setSelectedImageFile(null);
    setIsEditing(false);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    setIsEditing(false);
  };

  const handlePasswordUpdate = async () => {
    const { currentPassword, password, confirmPassword } = formik.values;

    if (!currentPassword && !password && !confirmPassword) {
      toast.error("Please fill all required fields.", {
        position: "bottom-right",
      });
      return;
    }

    if (!currentPassword || !password || !confirmPassword) {
      formik.setFieldTouched("currentPassword", true, false);
      formik.setFieldTouched("password", true, false);
      formik.setFieldTouched("confirmPassword", true, false);
      formik.setFieldError(
        "currentPassword",
        currentPassword ? "" : "Current Password is required.",
      );
      formik.setFieldError("password", password ? "" : "Password is required.");
      formik.setFieldError(
        "confirmPassword",
        confirmPassword ? "" : "Confirm Password is required.",
      );
      return;
    }

    if (password !== confirmPassword) {
      formik.setFieldTouched("confirmPassword", true, false);
      formik.setFieldError("confirmPassword", "Passwords do not match");
      return;
    }

    if (password === currentPassword) {
      formik.setFieldTouched("password", true, false);
      formik.setFieldError(
        "password",
        "New Password cannot be the same as your current password.",
      );
      return;
    }

    const passwordValid = passwordRules.every((rule) => rule.test(password));

    if (!passwordValid) {
      formik.setFieldTouched("password", true, false);
      formik.setFieldError(
        "password",
        "Password must be 8-12 characters and include uppercase, number, and special character",
      );
      return;
    }

    try {
      setIsPasswordSaving(true);

      const response = await updateTeacherPassword({
        current_password: currentPassword,
        new_password: password,
        confirm_password: confirmPassword,
      });

      toast.success(response.message || "Password updated successfully", {
        position: "bottom-right",
      });

      formik.setFieldValue("currentPassword", "");
      formik.setFieldValue("password", "");
      formik.setFieldValue("confirmPassword", "");
    } catch (error: any) {
      const detail = error?.response?.data?.detail;
      if (detail === "New Password cannot be the same as your current password.") {
        formik.setFieldTouched("password", true, false);
        formik.setFieldError("password", detail);
      } else {
        toast.error(detail || "Failed to update password", {
          position: "bottom-right",
        });
      }
    } finally {
      setIsPasswordSaving(false);
    }
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

  if (isProfileLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-[#F5F5F5]">
        <p className="font-poppins text-gray-600">Loading teacher profile...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F5F5F5]">
      {/* Top Bar */}
      <div className="flex justify-end items-center px-8 py-3">
        <Logout redirectTo="/" toastDuration={5000} dismissExistingToasts>
          {({ logout }) => (
            <ProfileMenu
              userEmail={teacherProfileData?.email || teacherProfileData?.phone_number || ""}
              userName={teacherProfileData?.full_name || ""}
              userRole={teacherProfileData?.role || ""}
              avatarSrc={formik.values.image || undefined}
              onProfileClick={() => navigate("/teacher/profile")}
              onSettingsClick={() => setActiveTab("settings")}
              onLogoutClick={logout}
            />
          )}
        </Logout>
      </div>

      {/* Page Content */}
      <div className="flex-1 px-8 py-1 max-w-[100%] flex justify-center">
        <form onSubmit={formik.handleSubmit}>
          <div className="w-[1090px] bg-white rounded-[16px] border border-gray-100 shadow-sm p-6 space-y-7">

            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="w-[290px] h-[24px] font-poppins text-[26px] font-semibold leading-[100%] tracking-[-0.01em] text-[#000000]">Manage Profile Details</h1>
                <p className="w-[203px] h-[12px] font-poppins text-[14px] font-normal leading-[100%] tracking-[-0.01em] text-[#ACACAC] mt-2">Manage your account details</p>
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
                onClick={() => {
                  if (isEditing) fileInputRef.current?.click();
                }}
                aria-disabled={!isEditing}
                className={`relative group w-20 h-20 rounded-2xl border-2 border-dashed border-gray-300 overflow-hidden bg-gray-50 flex items-center justify-center ${
                  isEditing ? "cursor-pointer" : "cursor-not-allowed opacity-60"
                }`}
              >
                {pendingPhoto ?? photoSrc ? (
                  <img src={pendingPhoto ?? photoSrc!} alt="profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center flex flex-col items-center justify-center">
                    <img src={album} alt="album img" className="w-[16px] h-[16px] object-cover" />
                    <p className="text-[10px] text-gray-400 mt-1 leading-tight">Upload your<br />photo</p>
                  </div>
                )}
                <div className={`absolute inset-0 bg-black/20 opacity-0 transition-opacity flex items-center justify-center ${
                  isEditing ? "group-hover:opacity-100" : ""
                }`}>
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

              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                disabled={!isEditing}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handlePhotoChange(file);
                  e.target.value = "";
                }}
              />
            </div>

            {/* Personal Details */}
            <section className="w-[1018px] min-h-[360px] flex flex-col gap-6">
              <div className="flex w-[1018px] items-center justify-between">
                <h2 className="h-[24px] font-poppins text-[22px] font-semibold leading-[100%] tracking-[-0.01em] text-[#000000]">Personal Details</h2>
                <button
                  type="button"
                  onClick={handlePasswordUpdate}
                  disabled={!isEditing || isPasswordSaving}
                  className="flex h-[40px] min-w-[118px] items-center justify-center rounded-[8px] bg-[#238B45] px-5 font-poppins text-[14px] font-semibold text-white transition-colors hover:bg-[#036724] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#238B45]"
                >
                  {isPasswordSaving ? "Updating..." : "Update Password"}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">

                {/* Full Name */}
                <div className="order-1">
                  <label className={personalLabelCls}>Full Name</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    disabled={!isEditing}
                    maxLength={24}
                    placeholder="Enter your Full Name"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={personalFieldCls(!isEditing)}
                  />
                  {formik.touched.username && formik.errors.username && (
                    <p className="text-[11px] text-red-500 mt-1">{formik.errors.username}</p>
                  )}
                  {usernameLimitReached && !formik.errors.username && (
                    <p className="text-[11px] text-red-500 mt-1">Full Name cannot exceed 24 characters</p>
                  )}
                </div>

                {/* Current Password */}
                <div className="order-2">
                  <label className={personalLabelCls}>Current Password</label>
                  <div className={`w-[497px] h-[48px] flex items-center rounded-[8px] px-4 py-3 bg-gray-50 ${formik.touched.currentPassword && formik.errors.currentPassword ? "border border-red-400" : ""} ${!isEditing ? "opacity-60 cursor-not-allowed" : ""}`}>
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      id="currentPassword"
                      name="currentPassword"
                      disabled={!isEditing}
                      placeholder="Enter your current password"
                      value={formik.values.currentPassword}
                      onCopy={blockPasswordClipboardAction}
                      onCut={blockPasswordClipboardAction}
                      onPaste={blockPasswordClipboardAction}
                      onContextMenu={blockPasswordContextMenu}
                      onKeyDown={(e) => handlePasswordKeyDown(e, "currentPassword")}
                      onChange={(e) => handlePasswordFieldChange("currentPassword", e.target.value)}
                      onBlur={formik.handleBlur}
                      className={`${personalFieldTextCls} disabled:cursor-not-allowed`}
                    />
                    <button type="button" disabled={!isEditing} onClick={() => setShowCurrentPassword((current) => !current)} className="text-gray-400 cursor-pointer hover:text-gray-600 disabled:cursor-not-allowed">
                      <img className="w-5 h-5" src={showCurrentPassword ? eyeshow : eyehide} alt="eyeicon" />
                    </button>
                  </div>
                  {formik.touched.currentPassword && formik.errors.currentPassword && (
                    <p className="text-[11px] text-red-500 mt-1">{formik.errors.currentPassword}</p>
                  )}
                </div>

                {/* Phone Numbers */}
                <div className="order-3">
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
                          <button type="button" disabled={!isEditing} onClick={() => handleUpdatePhone(i)} className={`${updateLinkCls} ml-auto disabled:cursor-not-allowed disabled:opacity-50`}>Update Phone Number</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* New Password */}
                <div className="order-4">
                  <label className={personalLabelCls}>New Password</label>
                  <div className={`w-[497px] h-[48px] flex items-center rounded-[8px] px-4 py-3 bg-gray-50 ${formik.touched.password && formik.errors.password ? "border border-red-400" : ""} ${!isEditing ? "opacity-60 cursor-not-allowed" : ""}`}>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      disabled={!isEditing}
                      placeholder="Enter your new password"
                      value={formik.values.password}
                      maxLength={PASSWORD_MAX_LENGTH}
                      onCopy={blockPasswordClipboardAction}
                      onCut={blockPasswordClipboardAction}
                      onPaste={blockPasswordClipboardAction}
                      onContextMenu={blockPasswordContextMenu}
                      onKeyDown={(e) => handlePasswordKeyDown(e, "password")}
                      onChange={(e) => handlePasswordFieldChange("password", e.target.value)}
                      onBlur={(e) => { setPasswordFocused(false); formik.handleBlur(e); }}
                      onFocus={() => setPasswordFocused(true)}
                      className={`${personalFieldTextCls} disabled:cursor-not-allowed`}
                    />
                    <button type="button" disabled={!isEditing} onClick={() => setShowPassword((current) => !current)} className="text-gray-400 cursor-pointer hover:text-gray-600" aria-label={showPassword ? "Hide new password" : "Show new password"} aria-pressed={showPassword}>
                      <img className="w-5 h-5" src={showPassword ? eyeshow : eyehide} alt="" aria-hidden="true" />
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

                {/* Email Addresses */}
                <div className="order-5 col-span-1">
                  <label className={personalLabelCls}>Email Address</label>
                  <div className="space-y-2">
                    {emails.map((em, i) => (
                      <div key={i}>
                        <div className={`w-[497px] h-[48px] flex items-center rounded-[8px] px-4 py-3 bg-gray-50 gap-2 ${em.touched && em.error ? "border border-red-400" : ""}`}>
                          <input
                            type="text"
                            maxLength={EMAIL_MAX_LENGTH}
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
                          <button type="button" disabled={!isEditing} onClick={() => handleUpdateEmail(i)} className={`${updateLinkCls} ml-auto disabled:cursor-not-allowed disabled:opacity-50`}>Update Email Address</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="order-6">
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
                      onKeyDown={(e) => handlePasswordKeyDown(e, "confirmPassword")}
                      onChange={(e) => handlePasswordFieldChange("confirmPassword", e.target.value)}
                      onBlur={formik.handleBlur}
                      className={`${personalFieldTextCls} disabled:cursor-not-allowed`}
                    />
                    <button type="button" disabled={!isEditing} onClick={() => setShowConfirm((current) => !current)} className="text-gray-400 cursor-pointer hover:text-gray-600" aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"} aria-pressed={showConfirm}>
                      <img className="w-5 h-5" src={showConfirm ? eyeshow : eyehide} alt="" aria-hidden="true" />
                    </button>
                  </div>
                  {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <p className="text-[11px] text-red-500 mt-1">{formik.errors.confirmPassword}</p>
                  )}
                </div>

              </div>
            </section>

            {/* Professional Details */}
            <section className="w-[1018px]">
              <h2 className="w-[1018px] h-[24px] font-poppins text-[22px] font-semibold leading-[100%] tracking-[-0.01em] text-[#000000] mb-[42px]">Professional Details</h2>

              {/* Subjects */}
              <div className="w-[312px] min-h-[368px] mb-5 flex flex-col gap-4">
                <p className="w-[284px] h-[24px] font-poppins text-[18px] font-semibold leading-[100%] text-[#0F172A]">Subjects:</p>
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
                      const checked = formik.values.subjects.includes(subject.name);
                      return (
                        <label
                          key={subject.id}
                          onClick={() => toggleSubject(subject.name)}
                          className="w-[348px] h-[20px] flex items-center gap-4 cursor-pointer"
                        >
                          <div className="w-[16px] h-[16px] rounded border-2 flex items-center justify-center shrink-0 bg-white border-[#1a7a4a]">
                            {checked && <img className="w-2 h-2" src={tick} alt="tick" />}
                          </div>
                          <span className="font-poppins text-[16px] font-semibold text-gray-700">{subject.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
                {formik.touched.subjects && formik.errors.subjects && (
                  <p className="text-[11px] text-red-500 mt-1">
                    {typeof formik.errors.subjects === "string" ? formik.errors.subjects : "Please select at least one subject."}
                  </p>
                )}
              </div>

              {/* Years + Qualification + Expertises */}
              <div className="grid grid-cols-3 gap-4 mt-[-21px]">
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
                    placeholder="Enter your qualification"
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
                  <label className="block w-[117px] h-[20px] font-poppins text-[16px] font-medium leading-[100%] text-[#030229] mb-2">Expertise</label>
                  <input
                    type="text"
                    id="expertises"
                    name="expertises"
                    disabled={!isEditing}
                    placeholder="Enter your expertise"
                    value={formik.values.expertises ?? ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-[315px] h-[42px] rounded-[8px] px-3 bg-gray-50 font-poppins text-sm text-gray-800 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                  {formik.touched.expertises && formik.errors.expertises && (
                    <p className="text-[11px] text-red-500 mt-1">{formik.errors.expertises}</p>
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
                  disabled={isProfileSaving || !hasProfileChanges}
                  className="w-[215px] h-[48px] rounded-[8px] bg-[#238B45] p-3 flex items-center justify-center gap-3 cursor-pointer font-poppins text-[20px] font-semibold leading-[100%] capitalize text-[#FFFFFF] hover:bg-[#036724] active:bg-[#42CE70] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isProfileSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}

          </div>
        </form>
      </div>
      <SuccessModal
        isOpen={showSuccess}
        onClose={handleSuccessClose}
        title="Congratulations!"
        message="Your changes have been updated successfully."
        buttonText="Continue"
        onPrimaryAction={handleSuccessClose}
      />
    </div>
  );
}
