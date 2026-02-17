
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  width,
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
      onClick={handleOverlayClick}
    >
      <div
        className={`bg-gray-100 dark:bg-gray-700 rounded-lg shadow-lg p-6 relative ${width}`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-200 dark:hover:text-white"
        >
          ✕
        </button>

        {/* Title */}
        {title && <h2 className="text-lg font-bold mb-4">{title}</h2>}

        {/* Content */}
        <div className="rounded-md">{children}</div>
      </div>
    </div>
  );
};

export default Modal;