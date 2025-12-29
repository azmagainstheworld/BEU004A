// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./pages/layout/MainLayout";
import AuthLayout from "./pages/layout/AuthLayout";

import Login from "./pages/Login";
import Logout from "./pages/Logout";
import LupaPassword from "./pages/LupaPassword";
import ResetPassword from "./pages/ResetPassword"; 
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
import ManajemenAkun from "./pages/ManajemenAkun";
import TrashGlobal from "./pages/TrashGlobal";

// Context
import { FinanceProvider } from "./context/FinanceContext";
import { KaryawanProvider } from "./context/KaryawanContext";
import { PresensiProvider } from "./context/PresensiContext";

import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  
  // 1. Cek apakah sudah login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Jika ada allowedRoles, cek apakah role user diizinkan
  if (allowedRoles) {
    try {
      const decoded = jwtDecode(token);
      const userRole = decoded.role; // sesuaikan dengan key 'role' di token Anda

      if (!allowedRoles.includes(userRole)) {
        // Jika role tidak diizinkan, lempar ke dashboard
        return <Navigate to="/dashboard" replace />;
      }
    } catch (err) {
      return <Navigate to="/login" replace />;
    }
  }
  
  return children;
};

function App() {
  // --- 1. LOGIKA AUTO-LOGOUT 1 JAM ---
  useEffect(() => {
    const checkTokenExpiry = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Decode payload JWT tanpa library untuk mengambil properti 'exp'
          const payload = JSON.parse(atob(token.split('.')[1]));
          const expiryTime = payload.exp * 1000; // konversi ke milidetik
          const currentTime = Date.now();

          if (currentTime >= expiryTime) {
            localStorage.removeItem("token");
            localStorage.setItem("sessionExpired", "true");
            window.location.href = "/login";
          }
        } catch (err) {
          console.error("Token format invalid");
        }
      }
    };

    // Jalankan pengecekan setiap 5 detik
    const interval = setInterval(checkTokenExpiry, 5000);
    return () => clearInterval(interval);
  }, []);


  window.fetch = ((originalFetch) => {
    return async (...args) => {
      const response = await originalFetch(...args);

    // tidak jalankan logika auto-logout jika request berasal dari endpoint LOGIN
      const isLoginRequest = args[0].includes("/users/login");

      if (response.status === 401 && !isLoginRequest) {
        localStorage.removeItem("token");
        localStorage.setItem("sessionExpired", "true");
        window.location.href = "/login";
      }
      return response;
    };
  })(window.fetch);
  
  return (
    <Router>
      <KaryawanProvider>
        <PresensiProvider>
          <FinanceProvider>
            <Routes>
              
              <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
              <Route path="/logout" element={<Logout />} />

              {/* Lupa / Reset Password */}
              <Route path="/lupa-password" element={<AuthLayout><LupaPassword /></AuthLayout>} />
              <Route path="/reset-password" element={<AuthLayout><ResetPassword /></AuthLayout>} />

              {/* Main routes */}
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/input-dfod" element={<InputDfod />} />
                        <Route path="/input-outgoing" element={<InputOutgoing />} />
                        <Route path="/input-delivery-fee" element={<InputDeliveryFee />} />
                        <Route path="/input-pengeluaran-kas" element={<InputPengeluaranKas />} />
                        <Route path="/laporan-keuangan" element={<LaporanKeuangan />} />
                        <Route path="/presensi" element={<Presensi />} />
                        <Route path="/manajemen-akun" element={<ManajemenAkun />} />

                        {/* RUTE KHUSUS SUPER ADMIN */}
                        <Route 
                          path="/gaji-karyawan" 
                          element={
                            <ProtectedRoute allowedRoles={["Super Admin"]}>
                              <GajiKaryawan />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="/manajemen-gaji" 
                          element={
                            <ProtectedRoute allowedRoles={["Super Admin"]}>
                              <ManajemenGaji />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="/manajemen-karyawan" 
                          element={
                            <ProtectedRoute allowedRoles={["Super Admin"]}>
                              <ManajemenKaryawan />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="/trash" 
                          element={
                            <ProtectedRoute allowedRoles={["Super Admin"]}>
                              <TrashGlobal />
                            </ProtectedRoute>
                          } 
                        />

                        <Route path="*" element={<Navigate to="/login" replace />} />
                      </Routes>
                    </MainLayout>
                  </ProtectedRoute>
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
