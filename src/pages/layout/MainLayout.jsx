// src/pages/layout/MainLayout.jsx
import React from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

function MainLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        
        {/* Main scrollable content + Footer*/}
        <main className="flex-1 bg-[#EDFFEC] overflow-y-auto flex flex-col justify-between p-0">
          <div className="flex-grow p-4">{children}</div>
          <Footer />
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
