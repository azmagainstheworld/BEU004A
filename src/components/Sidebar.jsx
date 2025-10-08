import React from "react";
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();
  const menuItems = [
    { path: "/", label: "Dashboard", icon: "grid_view" },
    { path: "/input-dfod", label: "Delivery Fee On Delivery", icon: "input" },
    { path: "/input-outgoing", label: "Outgoing", icon: "input" },
    { path: "/input-delivery-fee", label: "Delivery Fee", icon: "input" },
    { path: "/input-pengeluaran-kas", label: "Pengeluaran", icon: "input" },
    { path: "/laporan-keuangan", label: "Laporan Keuangan", icon: "insights" },
    { path: "/presensi", label: "Presensi", icon: "event" },
    { path: "/gaji-karyawan", label: "Laporan Gaji", icon: "insights" },
    { path: "/manajemen-gaji", label: "Manajemen Gaji", icon: "payments" },
    { path: "/manajemen-karyawan", label: "Manajemen Karyawan", icon: "person_outline" },
    { path: "/manajemen-akun", label: "Manajemen Akun", icon: "account_circle" },
    { path: "/logout", label: "Logout", icon: "logout" },
  ];

  return (
    <aside className="w-72 flex-shrink-0 p-4 border-r border-gray-200 relative glass-sidebar overflow-y-scroll">
      <div className="flex flex-col items-center justify-center mt-6 mb-10">
        {/* Logo */}
        <img
          src="src/assets/logojnt.png" // ganti sesuai path logo
          alt="Logo"
          className="h-32 w-32 object-contain rounded-full shadow-lg mx-auto"
        />
      </div>
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 font-medium
                ${isActive
                  ? "bg-green-600 text-white shadow-lg glow-diagonal"
                  : "text-gray-700 hover:bg-green-50 hover:translate-x-1 hover:scale-105 hover:shadow-md"}
              `}
            >
              <span className={`material-symbols-sharp text-lg transition-transform duration-300 ${isActive ? "glow-icon-diagonal" : ""}`}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <style>{`
        /* Sidebar Glassy Background */
        .glass-sidebar {
          background: rgba(255,255,255,0.75);
          backdrop-filter: blur(12px);
          border-radius: 1rem;
        }

        /* Logo Glass + subtle glow */
        .glass-logo {
          background: linear-gradient(135deg, #ffffff80, #e0ffe080);
          backdrop-filter: blur(8px);
          padding: 0.25rem 0.5rem;
          border-radius: 0.5rem;
          box-shadow: 0 0 12px rgba(0,0,0,0.1);
        }

        /* Scrollbar Custom */
        aside::-webkit-scrollbar { width: 8px; }
        aside::-webkit-scrollbar-track { background: #f0f0f0; border-radius: 4px; }
        aside::-webkit-scrollbar-thumb { background-color: #c0c0c0; border-radius: 4px; border: 2px solid #f0f0f0; }
        aside::-webkit-scrollbar-thumb:hover { background-color: #a0a0a0; }

        /* Responsive adjustment */
        @media (max-width: 640px){
          .glass-sidebar { backdrop-filter: blur(10px); }
          .glass-logo { backdrop-filter: blur(6px); }
        }
      `}</style>
    </aside>
  );
}

export default Sidebar;
