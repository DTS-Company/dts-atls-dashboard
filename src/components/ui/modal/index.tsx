import React, { useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  isFullscreen?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className = "",
  showCloseButton = true,
  isFullscreen = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const contentClasses = isFullscreen
    ? "w-full h-full"
    : `relative w-full max-w-2xl mx-auto rounded-3xl bg-white dark:bg-gray-800 shadow-2xl ${className}`;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center overflow-y-auto p-4 sm:p-6">
      {!isFullscreen && (
        <div
          className="fixed inset-0 h-full w-full bg-gray-900/40 backdrop-blur-md transition-opacity"
          onClick={onClose}
        ></div>
      )}

      <div
        ref={modalRef}
        className={contentClasses}
        onClick={(e) => e.stopPropagation()}
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            type="button"
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-all hover:bg-gray-200 hover:text-gray-800 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}

        <div className="h-full w-full overflow-y-auto p-6 sm:p-8">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};
