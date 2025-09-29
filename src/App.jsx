// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

// Pages
import Dashboard from "./pages/Dashboard";
import GajiKaryawan from "./pages/GajiKaryawan";
import InputDeliveryFee from "./pages/InputDeliveryFee";
import InputDfod from "./pages/InputDfod";
import InputOutgoing from "./pages/InputOutgoing";
import InputPengeluaranKas from "./pages/InputPengeluaranKas";
import LaporanKeuangan from "./pages/LaporanKeuangan";
import ManajemenGaji from "./pages/ManajemenGaji";
import ManajemenKaryawan from "./pages/ManajemenKaryawan";
import Presensi from "./pages/Presensi"; // ganti nama import agar konsisten

// Context
import { FinanceProvider } from "./context/FinanceContext";
import { KaryawanProvider } from "./context/KaryawanContext";
import { PresensiProvider } from "./context/PresensiContext"; // import context baru

function App() {
  const mainStyle = {
    height: "calc(100vh - 64px)",
    overflowY: "scroll",
    scrollbarWidth: "thin",
    scrollbarColor: "#c0c0c0 #f0f0f0",
  };

  return (
    <Router>
      {/* Bungkus dengan KaryawanProvider dulu (Presensi butuh karyawan list) */}
      <KaryawanProvider>
        {/* PresensiProvider harus di dalam KaryawanProvider */}
        <PresensiProvider>
          {/* FinanceProvider bisa di dalam Presensi atau di luar; ini menjaga dependensi */}
          <FinanceProvider>
            <div className="flex h-screen overflow-hidden">
              {/* Sidebar */}
              <Sidebar />

              {/* Area main */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar />

                <main className="flex-1 p-4 bg-[#EDFFEC]" style={mainStyle}>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/input-dfod" element={<InputDfod />} />
                    <Route path="/input-outgoing" element={<InputOutgoing />} />
                    <Route path="/input-delivery-fee" element={<InputDeliveryFee />} />
                    <Route path="/input-pengeluaran-kas" element={<InputPengeluaranKas />} />
                    <Route path="/laporan-keuangan" element={<LaporanKeuangan />} />
                    <Route path="/presensi" element={<Presensi />} />
                    <Route path="/gaji-karyawan" element={<GajiKaryawan />} />
                    <Route path="/manajemen-gaji" element={<ManajemenGaji />} />
                    <Route path="/manajemen-karyawan" element={<ManajemenKaryawan />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>

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
                </main>
              </div>
            </div>
          </FinanceProvider>
        </PresensiProvider>
      </KaryawanProvider>
    </Router>
  );
}

export default App;