import { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Modal Component
 * Reusable modal dialog with overlay
 * 
 * @param {boolean} isOpen - Modal open state
 * @param {function} onClose - Close callback
 * @param {string} title - Modal title
 * @param {ReactNode} children - Modal content
 * @param {ReactNode} footer - Modal footer (optional)
 * @param {string} size - Modal size: 'sm' | 'md' | 'lg' | 'xl' | 'full'
 * @param {boolean} closeOnOverlay - Close when clicking overlay (default: true)
 * @param {boolean} closeOnEsc - Close when pressing ESC (default: true)
 * @param {boolean} showCloseButton - Show close button (default: true)
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlay = true,
  closeOnEsc = true,
  showCloseButton = true,
}) => {
  // Handle ESC key press
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, closeOnEsc, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Don't render if not open
  if (!isOpen) return null;

  // Size classes
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay with blur */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={closeOnOverlay ? onClose : undefined}
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Modal Content - Glassmorphism */}
        <div
          className={`relative w-full ${sizeClasses[size]} bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 transform transition-all`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200/50">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-gray-100/50 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            )}
          </div>

          {/* Body */}
          <div className="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200/50 bg-gray-50/50 rounded-b-2xl">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
