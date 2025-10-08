// src/pages/layout/MainLayout.jsx
import React from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

function MainLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 p-4 bg-[#EDFFEC] overflow-y-auto">
          {children}
        </main>

        {/* Custom scrollbar */}
        <style>{`
          main::-webkit-scrollbar {
            width: 8px;
          }
          main::-webkit-scrollbar-track {
            background: #f0f0f0;
            border-radius: 4px;
          }
          main::-webkit-scrollbar-thumb {
            background-color: #c0c0c0;
            border-radius: 4px;
            border: 2px solid #f0f0f0;
          }
          main::-webkit-scrollbar-thumb:hover {
            background-color: #a0a0a0;
          }
        `}</style>
      </div>
    </div>
  );
}

export default MainLayout;
