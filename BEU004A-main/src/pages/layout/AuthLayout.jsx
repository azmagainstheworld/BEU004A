import React from "react";

function AuthLayout({ children }) {
  return (
    <div className="flex h-screen w-screen">
      {children}
    </div>
  );
}

export default AuthLayout;
