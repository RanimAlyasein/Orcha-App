// Shows an error message with an optional Retry button when an API call fails
export default function ErrorBox({ message, onRetry }) {
  if (!message) return null;
  return (
    <div className="error-box">
      ⚠ {message}
      {onRetry && <button className="btn btn-ghost btn-sm" onClick={onRetry} style={{ marginLeft: 12 }}>Retry</button>}
    </div>
  );
}
