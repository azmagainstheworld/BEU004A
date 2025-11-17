import React from "react";
import LupaPasswordForm from "../components/LupaPasswordForm";

export default function LupaPassword() {
  const handleSubmit = async (email) => {
    // Kirim request ke backend
    const response = await fetch("http://localhost:5000/beu004a/auth/request-reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Terjadi kesalahan");
    return data;
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <LupaPasswordForm onSubmit={handleSubmit} />
    </div>
  );
}
