import React, { useState } from "react";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!password || !confirmPassword) {
      setError("Password dan konfirmasi harus diisi");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password dan konfirmasi tidak sama");
      return;
    }

    try {
      // Ambil token dari query string
      const token = new URLSearchParams(window.location.search).get("token");

      // Request ke backend untuk reset password
      const response = await fetch("http://localhost:5000/beu004a/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, token }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Terjadi kesalahan");

      setSuccess("Password berhasil diubah. Silakan login kembali.");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message || "Terjadi kesalahan");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-md space-y-4">
        <h2 className="text-2xl font-bold text-center text-green-900">Reset Password</h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Password Baru"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009C4C]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Konfirmasi Password Baru"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009C4C]"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-[#009C4C] hover:bg-[#007a38] text-white font-semibold py-2 rounded-lg transition"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
