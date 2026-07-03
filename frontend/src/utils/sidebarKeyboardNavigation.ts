import type { KeyboardEvent } from "react";

const NAVIGATION_KEYS = new Set(["ArrowDown", "ArrowUp", "Home", "End"]);

/**
 * Adds composite-style keyboard movement without changing normal Tab order.
 * Attach this to the element containing elements marked with data-sidebar-item.
 */
export const handleSidebarKeyDown = (event: KeyboardEvent<HTMLElement>) => {
  if (!NAVIGATION_KEYS.has(event.key)) return;

  const currentItem = (event.target as HTMLElement).closest<HTMLElement>(
    "[data-sidebar-item]",
  );
  if (!currentItem) return;

  const items = Array.from(
    event.currentTarget.querySelectorAll<HTMLElement>("[data-sidebar-item]"),
  ).filter((item) => !item.hasAttribute("disabled"));
  const currentIndex = items.indexOf(currentItem);
  if (currentIndex < 0 || items.length === 0) return;

  event.preventDefault();

  const nextIndex =
    event.key === "Home"
      ? 0
      : event.key === "End"
        ? items.length - 1
        : event.key === "ArrowDown"
          ? (currentIndex + 1) % items.length
          : (currentIndex - 1 + items.length) % items.length;

  items[nextIndex].focus();
};
