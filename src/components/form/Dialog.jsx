import { useEffect, useRef } from "react";

/**
 * Generic modal built on the native <dialog> element.
 *
 * The browser provides focus trapping, Escape-to-close and an inert page
 * behind the modal. `closedby="any"` enables light dismiss in browsers that
 * support it; the click handler below covers the rest. The open/close
 * animation and ::backdrop styling live in index.css (.dialog-sheet).
 */
export default function Dialog({ open, onClose, labelledBy, className = "", children }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Clicks on the dialog element itself (not its content) hit the backdrop.
  const handleClick = (e) => {
    if (e.target === ref.current) onClose();
  };

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      closedby="any"
      onClose={onClose}
      onClick={handleClick}
      className={`dialog-sheet ${className}`}
    >
      {children}
    </dialog>
  );
}
