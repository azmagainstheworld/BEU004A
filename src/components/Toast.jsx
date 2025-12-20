// src/components/Toast.jsx
import React from "react";

export default function Toast({ type, message, onClose }) {
  const colors = {
    success: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
  };

  const icons = {
    success: "✔️",
    warning: "⚠️",
    failed: "❌",
  };

  return (
    <div className={`fixed top-5 right-5 p-4 rounded-xl shadow-md flex items-center space-x-3 ${colors[type]}`}>
      <span className="text-xl">{icons[type]}</span>
      <div>
        <p className="font-semibold capitalize">{type}</p>
        <p className="text-sm">{message}</p>
      </div>
      <button onClick={onClose} className="ml-auto font-bold text-lg">×</button>
    </div>
  );
}
