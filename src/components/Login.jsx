import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ onSubmit }) {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const data = new FormData(e.currentTarget);
    const username = data.get("username");
    const password = data.get("password");

    // Panggil onSubmit, tangani login gagal
    if (onSubmit) {
      const result = onSubmit({ username, password });
      // Jika username/password salah atau kosong, tampilkan pesan yang sama
      if (!result) {
        setError("Login tidak valid, silakan coba lagi");
      }
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Left ilustrasi 50% */}
      <div className="hidden md:block w-1/2 h-full relative">
        <img
          src="src/assets/jnt-cargo.png"
          alt="Ilustrasi Logistik"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/25"></div>
      </div>

      {/* Right - form */}
      <div className="flex w-full md:w-1/2 h-full items-center justify-center bg-white">
        <div className="w-full max-w-md p-8">
          <div className="flex flex-col items-center mb-4">
            <img
              src="src/assets/logojnt.png"
              alt="logo"
              className="h-24 w-24 object-contain rounded-full shadow-md border-2 border-white"
            />
          </div>

          <h2 className="text-2xl font-bold mb-4 text-center text-green-900">
            Selamat Datang!
          </h2>
          <p className="text-sm text-gray-600 mb-6 text-center">
            Silakan login untuk mengakses akun Anda.
          </p>

          {/* Kotak error */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="username"
              type="text"
              placeholder="Masukkan username"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009C4C]"
            />
            <input
              name="password"
              type="password"
              placeholder="Masukkan password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009C4C]"
            />

            <button
              type="submit"
              className="w-full bg-[#009C4C] hover:bg-[#007a38] text-white font-semibold py-2 rounded-lg transition"
            >
              Masuk
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-500">
            <a
              href="#"
              className="underline"
              onClick={(e) => {
                e.preventDefault();
                navigate("/lupa-password");
              }}
            >
              Lupa password?
            </a>
          </div>
        </div>
      </div>

      {/* Mobile ilustrasi */}
      <div className="md:hidden w-full h-56 relative">
        <img
          src="src/assets/jnt-cargo.png"
          alt="Ilustrasi Logistik"
          className="object-cover w-full h-full object-center"
        />
        <div className="absolute inset-0 bg-black/25"></div>
        <div className="absolute left-4 top-4">
          <img
            src="src/assets/logojnt.png"
            alt="logo"
            className="h-14 w-14 object-contain rounded-full shadow-md border-2 border-white"
          />
        </div>
      </div>
    </div>
  );
}
