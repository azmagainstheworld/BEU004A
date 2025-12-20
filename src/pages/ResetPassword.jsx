import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ResetPasswordForm from "../components/ResetPasswordForm";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  const token = new URLSearchParams(window.location.search).get("token");

  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        setError("Token tidak ditemukan pada URL.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://beu004a-backend-production.up.railway.app/beu004a/auth/check-reset-token?token=${token}`
        );
        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Token invalid atau sudah kedaluwarsa.");
          setTokenValid(false);
          setTimeout(() => navigate("/login"), 2500);
        } else {
          setTokenValid(true);
        }
      } catch (err) {
        setError("Gagal memverifikasi token.");
      }
      setLoading(false);
    };

    checkToken();
  }, [token, navigate]);

  // Logika kekuatan password asli Anda
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

  const handlePasswordChange = (value) => {
    setPassword(value);
    if (!value) setPasswordStrength("");
    else if (value.length < 8) setPasswordStrength("Lemah");
    else if (strongPasswordRegex.test(value)) setPasswordStrength("Kuat");
    else setPasswordStrength("Sedang");
  };

  // Logika submit data asli Anda
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!password || !confirmPassword) {
      setError("Password dan konfirmasi wajib diisi.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password dan konfirmasi tidak cocok.");
      return;
    }

    try {
      const response = await fetch("https://beu004a-backend-production.up.railway.app/beu004a/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          newPassword: password,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Gagal mengubah password.");
        return;
      }

      setSuccess("Password berhasil diubah. Mengarahkan ke login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError("Terjadi kesalahan server.");
    }
  };

  return (
    <ResetPasswordForm
      password={password}
      confirmPassword={confirmPassword}
      setConfirmPassword={setConfirmPassword}
      handlePasswordChange={handlePasswordChange}
      handleSubmit={handleSubmit}
      error={error}
      success={success}
      loading={loading}
      tokenValid={tokenValid}
      passwordStrength={passwordStrength}
    />
  );
}