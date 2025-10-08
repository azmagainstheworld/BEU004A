// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./pages/layout/MainLayout";
import AuthLayout from "./pages/layout/AuthLayout";

import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Dashboard from "./pages/Dashboard";
import GajiKaryawan from "./pages/GajiKaryawan";
import InputDeliveryFee from "./pages/InputDeliveryFee";
import InputDfod from "./pages/InputDfod";
import InputOutgoing from "./pages/InputOutgoing";
import InputPengeluaranKas from "./pages/InputPengeluaranKas";
import LaporanKeuangan from "./pages/LaporanKeuangan";
import ManajemenGaji from "./pages/ManajemenGaji";
import ManajemenKaryawan from "./pages/ManajemenKaryawan";
import Presensi from "./pages/Presensi";

// Context
import { FinanceProvider } from "./context/FinanceContext";
import { KaryawanProvider } from "./context/KaryawanContext";
import { PresensiProvider } from "./context/PresensiContext";

function App() {
  return (
    <Router>
      <KaryawanProvider>
        <PresensiProvider>
          <FinanceProvider>
            <Routes>
              {/* Auth routes */}
              <Route
                path="/login"
                element={
                  <AuthLayout>
                    <Login />
                  </AuthLayout>
                }
              />
              <Route path="/logout" element={<Logout />} />

              {/* Main routes */}
              <Route
                path="/*"
                element={
                  <MainLayout>
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
                  </MainLayout>
                }
              />
            </Routes>
          </FinanceProvider>
        </PresensiProvider>
      </KaryawanProvider>
    </Router>
  );
}

export default App;
