import React from "react";

function Button({ children, type = "button", onClick, variant = "primary" }) {
  const baseStyle =
    "px-4 py-2 rounded-lg font-semibold transition duration-200";

  const variants = {
    primary: "bg-green-600 text-white hover:bg-green-700",
    secondary: "bg-gray-500 text-white hover:bg-gray-600",
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

export default Button;
