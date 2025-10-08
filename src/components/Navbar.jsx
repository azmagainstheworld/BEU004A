import React from "react";

function Navbar() {
  return (
    <header className="w-full glass-navbar border-b border-gray-200 fixed top-0 z-50">
      <div className="px-6 py-3 flex items-center justify-end h-16">
        {/* Logo */}
        <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-[#006400]"
          style={{ fontFamily: "Arial, sans-serif" }}>
              J&amp;T Cargo Mitra BEU004A
          </span>

          <img
            src="src/assets/logojnt.png" // ganti sesuai path logo
            alt="Logo"
            className="h-12 w-12 object-contain rounded-full shadow-sm border border-gray-200 transition-transform duration-300 hover:scale-105"
          />
      </div>
    </div>

      <style>{`
        /* Glassy Pastel Hijau Navbar */
        .glass-navbar {
          position: relative;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.85),
            rgba(200, 255, 200, 0.2)
          );
          backdrop-filter: blur(12px);
          box-shadow: 0 2px 15px rgba(0,0,0,0.08);
        }
        .glass-navbar::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(34,197,94,0.05),
            rgba(34,197,94,0.08),
            rgba(34,197,94,0.05)
          );
          pointer-events: none;
          border-radius: inherit;
        }
      `}</style>
    </header>
  );
}

export default Navbar;
