import React from "react";

function Navbar({ isOpen, setIsOpen }) {
  return (
    <header
      className={`w-full glass-navbar border-b border-gray-200 fixed top-0 z-50 transition-all duration-500 ${
        isOpen ? "lg:pl-72" : "lg:pl-20"
      }`}
    >
      <div className="px-6 py-3 flex items-center h-16 relative">
        {/* Tombol Hamburger / X di kiri */}
        <button
          className="lg:hidden p-2 rounded-md transition-transform duration-500 absolute left-4"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span
            className={`material-symbols-sharp text-3xl transform transition-all duration-500 ${
              isOpen ? "rotate-180 text-gray-800" : "rotate-0 text-gray-800"
            }`}
          >
            {isOpen ? "close" : "menu"}
          </span>
        </button>

        {/* Logo dan Nama di kanan */}
        <div className="flex items-center gap-3 ml-auto">
          <span
            className="text-lg font-bold text-[#006400]"
            style={{ fontFamily: "Arial, sans-serif" }}
          >
            J&amp;T Cargo Mitra BEU004A
          </span>

          <img
            src="src/assets/logojnt.png"
            alt="Logo"
            className="h-12 w-12 object-contain rounded-full border border-gray-200 transition-transform duration-300 hover:scale-105"
          />
        </div>
      </div>

      <style>{`
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

