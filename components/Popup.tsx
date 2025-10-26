import { useEffect } from "react";

interface PopupProps {
  title: string;
  body: string;
  onClose: () => void; // Made this required
  duration?: number; // Added optional duration prop
}

const Popup = ({ title, body, onClose, duration = 3000 }: PopupProps) => {
  useEffect(() => {
    // Only set timer if duration is provided (> 0)
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[100]">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-700 mb-4">{body}</p>
        <button
          onClick={onClose}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Popup;