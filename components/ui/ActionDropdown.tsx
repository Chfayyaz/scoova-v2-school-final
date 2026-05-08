"use client";

import React, { useState, useRef, useEffect } from "react";
import useOutsideClick from "@/app/utils/UseOutsideClick";
import Button from "@/components/ui/Button";

export type ActionItem = {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "danger";
};

type ActionDropdownProps = {
  actions: ActionItem[];
  trigger: React.ReactNode;
  align?: "left" | "right";
};

export default function ActionDropdown({
  actions,
  trigger,
  align = "right",
}: ActionDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
    placement: "bottom" | "top";
  } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate dropdown position
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const dropdownHeight = 200; // Approximate dropdown height
      const spacing = 4; // Space between trigger and dropdown
      
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - triggerRect.bottom;
      const spaceAbove = triggerRect.top;
      
      // Determine if dropdown should open upward or downward
      const shouldOpenUpward = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;
      
      let top: number;
      let left: number;
      
      if (shouldOpenUpward) {
        // Position above the trigger - top will be at trigger top, then translate up
        top = triggerRect.top - spacing;
      } else {
        // Position below the trigger
        top = triggerRect.bottom + spacing;
      }
      
      // Calculate horizontal position based on align prop
      const dropdownWidth = 160; // min-w-[160px]
      if (align === "right") {
        // Right-align: dropdown's right edge aligns with trigger's right edge
        left = triggerRect.right - dropdownWidth;
      } else {
        // Left-align: dropdown's left edge aligns with trigger's left edge
        left = triggerRect.left;
      }
      
      // Ensure dropdown doesn't go off-screen horizontally
      if (left + dropdownWidth > window.innerWidth) {
        left = window.innerWidth - dropdownWidth - 8; // 8px padding from edge
      }
      if (left < 8) {
        left = 8;
      }
      
      setPosition({
        top,
        left,
        placement: shouldOpenUpward ? "top" : "bottom",
      });
    }
  }, [isOpen, align]);

  // Use hook for dropdownRef as requested
  useOutsideClick(dropdownRef, () => {
    if (isOpen) {
      setIsOpen(false);
    }
  });

  // Also check containerRef - close if click is outside both container and dropdown
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      // Close if click is outside both container and dropdown
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  // Update position on scroll or resize
  useEffect(() => {
    if (isOpen) {
      const updatePosition = () => {
        if (triggerRef.current) {
          const triggerRect = triggerRef.current.getBoundingClientRect();
          const dropdownHeight = 200;
          const spacing = 4;
          
          const viewportHeight = window.innerHeight;
          const spaceBelow = viewportHeight - triggerRect.bottom;
          const spaceAbove = triggerRect.top;
          
          const shouldOpenUpward = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;
          
          let top: number;
          let left: number;
          
          if (shouldOpenUpward) {
            // Position above the trigger - top will be at trigger top, then translate up
            top = triggerRect.top - spacing;
          } else {
            // Position below the trigger
            top = triggerRect.bottom + spacing;
          }
          
          const dropdownWidth = 160;
          if (align === "right") {
            // Right-align: dropdown's right edge aligns with trigger's right edge
            left = triggerRect.right - dropdownWidth;
          } else {
            // Left-align: dropdown's left edge aligns with trigger's left edge
            left = triggerRect.left;
          }
          
          // Ensure dropdown doesn't go off-screen horizontally
          if (left + dropdownWidth > window.innerWidth) {
            left = window.innerWidth - dropdownWidth - 8;
          }
          if (left < 8) {
            left = 8;
          }
          
          setPosition({
            top,
            left,
            placement: shouldOpenUpward ? "top" : "bottom",
          });
        }
      };

      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);

      return () => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [isOpen, align]);

  const handleActionClick = (action: ActionItem) => {
    action.onClick();
    setIsOpen(false);
  };

  return (
    <>
      <div ref={containerRef} className="relative inline-block">
        <div ref={triggerRef}>
          <Button
            onClick={() => setIsOpen(!isOpen)}
            variant="ghosted"
            rounded="md"
            hoverBgColor="hover:bg-custom-gray/10"
            className="p-1.5 w-auto h-auto outline-none focus:outline-none focus:ring-0"
            aria-label="Actions"
            aria-expanded={isOpen}
            aria-haspopup="true"
          >
            {trigger}
          </Button>
        </div>
      </div>

      {isOpen && position && (
        <div
          ref={dropdownRef}
          className="fixed z-[9999] min-w-[160px] bg-custom-white rounded-lg border border-custom-gray/10 shadow-lg py-1"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            transform: position.placement === "top" ? "translateY(-100%)" : "none",
          }}
          role="menu"
          aria-orientation="vertical"
        >
          {actions.map((action, index) => (
            <Button
              key={index}
              onClick={() => handleActionClick(action)}
              variant="ghosted"
              rounded="md"
              textColor={
                action.variant === "danger"
                  ? "text-custom-purple/80"
                  : "text-custom-gray/95"
              }
              hoverBgColor={
                action.variant === "danger"
                  ? "hover:bg-custom-purple/10"
                  : "hover:bg-custom-gray/5"
              }
              hoverTextColor={
                action.variant === "danger"
                  ? "hover:text-custom-purple"
                  : "hover:text-custom-teal"
              }
              className="w-full text-left px-4 py-2.5 text-sm font-medium !justify-start"
              role="menuitem"
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </>
  );
}

