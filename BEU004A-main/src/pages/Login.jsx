import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFinance } from "../context/FinanceContext"; 
import LoginComponent from "../components/Login";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setToken } = useFinance(); 
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const sessionExpired = localStorage.getItem("sessionExpired");
    
    // pengecekan yang ketat
    if (sessionExpired === "true") {
      setError("Sesi anda telah berakhir, silakan login kembali");
      
      // HAPUS SEGERA flag dari localStorage agar tidak terbaca lagi 
      // saat komponen re-render karena salah password
      localStorage.removeItem("sessionExpired");
    }
  }, []); // Dependensi kosong memastikan ini hanya jalan 1x saat mount

  const handleLoginSubmit = async (username, password) => {
    if (!username || !password) {
      setError("Harap mengisi username/password terlebih dahulu");
      return;
    }

    // Reset error sebelum mencoba login baru
    // akan menghapus pesan "Sesi berakhir" kalo sebelumnya ada
    setError("");
    setLoading(true);

    try {
      const response = await fetch("https://beu004a-backend-production.up.railway.app/beu004a/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Hanya pesan ini yang akan muncul jika login gagal
        setError("Username/password salah, silakan coba lagi");
        setLoading(false);
        return;
      }

      if (result.token) {
        localStorage.setItem("token", result.token);
        setToken(result.token);
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Terjadi kesalahan pada server. Coba lagi nanti.");
      setLoading(false);
    }
  };

  return (
    <LoginComponent 
      onLogin={handleLoginSubmit} 
      error={error} 
      loading={loading}
      onForgotPassword={() => navigate("/lupa-password")} 
    />
  );
}