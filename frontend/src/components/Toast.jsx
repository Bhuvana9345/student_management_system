export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;
  return (
    <div className="toast-shell">
      <div className={`alert alert-${type} shadow-sm mb-0`} role="alert">
        <span>{message}</span>
        <button type="button" className="btn-close ms-3" onClick={onClose} aria-label="Close" />
      </div>
    </div>
  );
}
