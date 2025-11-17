import React, { useState } from "react";

export default function ResetPasswordForm({ onSubmit }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");

  const handlePasswordChange = (value) => {
    setPassword(value);
    // Cek kekuatan password sederhana
    if (value.length >= 8 && /[A-Z]/.test(value) && /\d/.test(value)) {
      setPasswordStrength("Kuat");
    } else if (value.length >= 6) {
      setPasswordStrength("Sedang");
    } else {
      setPasswordStrength("Lemah");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!password || !confirmPassword) {
      setError("Semua field harus diisi");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password dan konfirmasi tidak sama");
      return;
    }

    try {
      await onSubmit(password);
      setSuccess("Password berhasil diubah!");
      setPassword("");
      setConfirmPassword("");
      setPasswordStrength("");
    } catch (err) {
      setError(err.message || "Terjadi kesalahan");
    }
  };

  // warna kekuatan password
  const passwordColor =
    passwordStrength === "Kuat"
      ? "text-green-600"
      : passwordStrength === "Sedang"
      ? "text-yellow-500"
      : passwordStrength === "Lemah"
      ? "text-red-600"
      : "text-gray-500";

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-center text-green-900">Reset Password</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="password"
            placeholder="Password Baru"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009C4C] ${
              error ? "border-red-500" : ""
            }`}
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
          />
          {passwordStrength && (
            <p className={`text-sm mt-1 ${passwordColor}`}>Password: {passwordStrength}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Konfirmasi Password"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009C4C] ${
              error ? "border-red-500" : ""
            }`}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}

        <button
          type="submit"
          className="w-full bg-[#009C4C] hover:bg-[#007a38] text-white font-semibold py-2 rounded-lg transition"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}
