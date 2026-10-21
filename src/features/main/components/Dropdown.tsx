import { useEffect, useState } from "react";

interface DropdownProps {
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
  /** Where the dropdown opens relative to the trigger */
  direction?: "up" | "down";
}

/**
 * Animated dropdown wrapper.
 * Uses scale + opacity + translate for a smooth pop-in effect.
 * The element stays mounted briefly after close so the exit animation plays.
 */
export default function Dropdown({
  isOpen,
  children,
  className = "",
  direction = "down",
}: DropdownProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    } else {
      setVisible(false);
      const timer = setTimeout(() => setMounted(false), 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!mounted) return null;

  const originClass =
    direction === "up" ? "origin-bottom" : "origin-top";

  const translateClass = visible
    ? "translate-y-0"
    : direction === "up"
      ? "translate-y-2"
      : "-translate-y-2";

  return (
    <div
      className={`transition-all duration-150 ease-out ${originClass} ${translateClass} ${
        visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      } ${className}`}
    >
      {children}
    </div>
  );
}
