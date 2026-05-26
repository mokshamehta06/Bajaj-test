import { useEffect, useState } from 'react';

export default function ErrorToast({ message, onDismiss }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onDismiss, 300); // Wait for fade-out animation
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div className={`error-toast ${visible ? 'toast-visible' : 'toast-hidden'}`}>
      <div className="toast-icon">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2"/>
          <path d="M10 6v5M10 13.5v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={() => { setVisible(false); onDismiss(); }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}
