"use client";
import { useEffect } from "react";

interface ToastProps {
  message: string;
  onClose?: () => void;
}

export default function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose?.();
    }, 2000); // disappear after 2 second

    return () => clearTimeout(timer);
  }, [message, onClose]);
  //don't render if no message
  if (!message) return null;

  return (
    <div role="status" aria-live="polite" aria-atomic="true" className="fixed top-4 right-4 bg-orange-400 text-black px-4 py-2 rounded shadow-md z-50">
      {message}
    </div>
  );
}
