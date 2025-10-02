// src/components/Modal.jsx
import "./Modal.css";

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  const stopPropagation = (e) => e.stopPropagation();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={stopPropagation}>
        <button className="modal-close" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
}
