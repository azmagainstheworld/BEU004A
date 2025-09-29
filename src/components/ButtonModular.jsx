import React from "react";

function ButtonModular({ children, onClick, type = "button", variant = "default" }) {
  const baseStyle =
    "px-4 py-2 rounded font-medium text-base transition duration-200";

  const variants = {
    default: "bg-gray-400 text-white hover:bg-gray-500",
    warning: "bg-yellow-400 text-black hover:bg-yellow-500",
    danger: "bg-red-500 text-white hover:bg-red-600",
    success: "bg-green-600 text-white hover:bg-green-700",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]}`}
    >
      {children}
    </button>
  );
}

export default ButtonModular;
