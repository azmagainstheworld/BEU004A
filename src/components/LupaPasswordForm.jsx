import React, { useState } from "react";

export default function LupaPasswordForm({ onSubmit }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");   // reset error
    setMessage(""); // reset success message

    // validasi email kosong
    if (!email) {
      setError("Email harus diisi"); // <-- warning muncul di bawah input
      return; // hentikan submit
    }

    try {
      await onSubmit(email);
      setMessage("Link reset password telah dikirim ke email Anda");
    } catch (err) {
      setError(err.message || "Terjadi kesalahan");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-center text-green-900">Lupa Password</h2>
      <p className="text-sm text-gray-600 text-center">
        Masukkan email akun Anda, kami akan mengirimkan link untuk reset password.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Email"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009C4C] ${
              error ? "border-red-500" : ""
            }`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {/* pesan error muncul di bawah input */}
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        {message && <p className="text-green-600 text-sm">{message}</p>}

        <button
          type="submit"
          className="w-full bg-[#009C4C] hover:bg-[#007a38] text-white font-semibold py-2 rounded-lg transition"
        >
          Kirim
        </button>
      </form>
    </div>
  );
}
