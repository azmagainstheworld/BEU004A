import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import jwt_decode from "jwt-decode";

function Sidebar({ isOpen, setIsOpen, onLogoutClick }) {
  const location = useLocation();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwt_decode(token);
      setRole(decoded.role);
    }
  }, []);

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: "grid_view" },
    { path: "/input-dfod", label: "Delivery Fee On Delivery", icon: "input" },
    { path: "/input-outgoing", label: "Outgoing", icon: "input" },
    { path: "/input-delivery-fee", label: "Delivery Fee", icon: "input" },
    { path: "/input-pengeluaran-kas", label: "Pengeluaran", icon: "input" },
    { path: "/laporan-keuangan", label: "Laporan Keuangan", icon: "insights" },
    { path: "/presensi", label: "Presensi", icon: "event" },

    ...(role === "Super Admin"
      ? [{ path: "/gaji-karyawan", label: "Laporan Gaji", icon: "insights" }]
      : []),

    ...(role === "Super Admin"
      ? [{ path: "/manajemen-gaji", label: "Manajemen Gaji", icon: "payments" }]
      : []),

    ...(role === "Super Admin"
      ? [{ path: "/manajemen-karyawan", label: "Manajemen Karyawan", icon: "person_outline" }]
      : []),

    { path: "/manajemen-akun", label: "Manajemen Akun", icon: "account_circle" },

    ...(role === "Super Admin"
      ? [{ path: "/trash", label: "Trash", icon: "delete" }]
      : []),

    {
      action: "logout",
      label: "Logout",
      icon: "logout"
    }
  ];

  return (
    <aside
      className={`
        fixed left-0 bg-white p-4 border-r border-gray-200 glass-sidebar overflow-y-scroll z-40
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        h-[calc(100%-64px)] top-[64px]
        lg:translate-x-0 lg:relative lg:top-0 lg:h-full lg:flex-shrink-0
      `}
    >
      <div className="flex flex-col items-center justify-center mt-6 mb-10">
        <img
          src="src/assets/logojnt.png"
          alt="Logo"
          className="h-32 w-32 object-contain rounded-full mx-auto"
        />
      </div>

      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

  
          if (item.action === "logout") {
            return (
              <button
                key="logout"
                onClick={() => {
                  setIsOpen(false);
                  onLogoutClick(); 
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-100"
              >
                <span className="material-symbols-sharp">{item.icon}</span>
                {item.label}
              </button>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 font-medium
                ${
                  isActive
                    ? "bg-[#006400] text-white shadow-lg glow-diagonal"
                    : "text-gray-700 hover:bg-green-50 hover:translate-x-1 hover:scale-105 hover:shadow-md"
                }
              `}
            >
              <span className="material-symbols-sharp text-lg">
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
