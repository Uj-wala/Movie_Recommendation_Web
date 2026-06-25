import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { useLocation } from "react-router-dom";
import "./ProfileMenu.css";

type ProfileMenuProps = {
  userEmail: string;
  userRole: string;
  userName?: string;
  avatarSrc?: string;
  onProfileClick: () => void;
  onSettingsClick: () => void;
  onLogoutClick: () => void;
  className?: string;
};

type MenuAction = {
  label: string;
  tone: "default" | "danger";
  onSelect: () => void;
};

const formatNameFromEmail = (email: string, fallback: string) => {
  const localPart = email.split("@")[0]?.trim();
  if (!localPart) return fallback;

  return localPart
    .replace(/[._-]+/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export default function ProfileMenu({
  userEmail,
  userRole,
  userName,
  avatarSrc,
  onProfileClick,
  onSettingsClick,
  onLogoutClick,
  className = "",
}: ProfileMenuProps) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | HTMLDivElement | null>>([]);

  const displayEmail = userEmail || "user@thestackly.com";
  const displayName = userName || formatNameFromEmail(displayEmail, userRole);
  const initial = displayName.charAt(0).toUpperCase() || userRole.charAt(0).toUpperCase() || "U";

  const actions: MenuAction[] = [
    { label: "My Profile", tone: "default", onSelect: onProfileClick },
    { label: "Settings", tone: "default", onSelect: onSettingsClick },
    { label: "Logout", tone: "danger", onSelect: onLogoutClick },
  ];

  const closeMenu = () => {
    setIsOpen(false);
    setActiveIndex(0);
  };

  const openMenu = () => {
    setIsOpen(true);
    setActiveIndex(0);
    window.setTimeout(() => itemRefs.current[0]?.focus(), 0);
  };

  const selectAction = (index: number) => {
    if (index === 0) return;

    const action = actions[index - 1];
    if (!action) return;

    closeMenu();
    action.onSelect();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu();
      triggerRef.current?.focus();
      return;
    }

    if ((event.key === "Enter" || event.key === " ") && !isOpen) {
      event.preventDefault();
      openMenu();
      return;
    }

    if (!isOpen) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      const nextIndex = activeIndex < actions.length ? activeIndex + 1 : 0;
      setActiveIndex(nextIndex);
      itemRefs.current[nextIndex]?.focus();
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      const previousIndex = activeIndex > 0 ? activeIndex - 1 : actions.length;
      setActiveIndex(previousIndex);
      itemRefs.current[previousIndex]?.focus();
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      selectAction(activeIndex);
    }
  };

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        closeMenu();
      }
    };

    const handleFocusIn = (event: FocusEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("focusin", handleFocusIn);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("focusin", handleFocusIn);
    };
  }, []);

  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  return (
    <div className={`profile-menu ${className}`.trim()} ref={rootRef} onKeyDown={handleKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        className="profile-menu__trigger"
        onClick={() => (isOpen ? closeMenu() : openMenu())}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <span className="profile-menu__avatar" aria-hidden="true">
          {avatarSrc ? <img src={avatarSrc} alt="" /> : initial}
        </span>
        <span className="profile-menu__identity">
          <span className="profile-menu__name">{displayName}</span>
          <span className="profile-menu__email">{displayEmail}</span>
        </span>
        <span className={`profile-menu__chevron ${isOpen ? "profile-menu__chevron--open" : ""}`} aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="profile-menu__panel" role="menu" onMouseLeave={closeMenu}>
          <div
            ref={(element) => {
              itemRefs.current[0] = element;
            }}
            className={`profile-menu__signed-in ${activeIndex === 0 ? "profile-menu__signed-in--active" : ""}`}
            tabIndex={0}
            onMouseEnter={() => setActiveIndex(0)}
          >
            <span>Signed in as</span>
            <strong>{displayEmail}</strong>
          </div>

          <div className="profile-menu__actions">
            {actions.map((action, actionIndex) => {
              const itemIndex = actionIndex + 1;
              return (
                <button
                  key={action.label}
                  ref={(element) => {
                    itemRefs.current[itemIndex] = element;
                  }}
                  type="button"
                  role="menuitem"
                  className={`profile-menu__item profile-menu__item--${action.tone} ${
                    activeIndex === itemIndex ? "profile-menu__item--active" : ""
                  }`}
                  onMouseEnter={() => setActiveIndex(itemIndex)}
                  onClick={() => selectAction(itemIndex)}
                >
                  {action.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
