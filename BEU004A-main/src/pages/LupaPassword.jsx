import React, { useState } from "react";
import LupaPasswordForm from "../components/LupaPasswordForm";

export default function LupaPassword() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // LOGIKA LAMA: Pengiriman request ke backend
  const handleRequestReset = async (email) => {
    setError("");
    setMessage("");

    try {
      const response = await fetch("https://beu004a-backend-production.up.railway.app/beu004a/auth/request-reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      // LOGIKA LAMA: Penanganan respon tidak OK
      if (!response.ok) {
        throw new Error(data.message || "Terjadi kesalahan");
      }

      // LOGIKA LAMA: Mengembalikan data sukses
      setMessage(data.message || "Link reset password telah dikirim ke email Anda");
      return data;
    } catch (err) {
      // LOGIKA LAMA: Penanganan error
      setError(err.message || "Terjadi kesalahan. Coba lagi.");
      throw err;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-screen">
      <LupaPasswordForm 
        onSubmit={handleRequestReset} 
        externalMessage={message}
        externalError={error}
      />
    </div>
  );
}