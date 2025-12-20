import React from "react";

function ButtonModular({
  children,
  onClick,
  type = "button",
  variant = "default",
  disabled = false,
  className = "", 
}) {
  const baseStyle =
    "px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 shadow-sm active:scale-95 flex items-center justify-center gap-2";

  const variants = {
    default: "bg-slate-500 text-white hover:bg-slate-600 hover:shadow-md",
    warning: "bg-amber-500 text-white hover:bg-amber-600 hover:shadow-md",
    danger: "bg-rose-500 text-white hover:bg-rose-600 hover:shadow-md",
    success: "bg-[#006400] text-white hover:bg-[#004d00] hover:shadow-md shadow-[#006400]/20",
  };

  // Disabled style yang lebih halus
  const disabledStyle = "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${
        disabled ? disabledStyle : variants[variant]
      } ${className}`}
    >
      {children}
    </button>
  );
}

export default ButtonModular;