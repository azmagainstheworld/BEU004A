import React from "react";

export default function Login({ onSubmit }) {
  return (
    <div className="flex min-h-screen">
      {/* Left - ilustrasi */}
      <div className="hidden md:flex w-1/2 relative">
        <img
          src="src/assets/jnt-cargo.png"
          alt="Ilustrasi Logistik"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/25"></div>
      </div>

      {/* Right - form */}
      <div className="flex-1 w-full md:w-1/2 flex items-center justify-center bg-white">
        <div className="w-full max-w-md p-8">
          {/* Logo atas */}
          <div className="flex flex-col items-center mb-4">
            <img
              src="src/assets/logojnt.png"
              alt="logo"
              className="h-20 w-20 object-contain rounded-full shadow-md border-2 border-white"
            />
            <span className="mt-2 text-center text-green-800 font-semibold text-sm">
              J&T Cargo Mitra BEU004A
            </span>
          </div>

          <h2 className="text-2xl font-bold mb-4 text-center text-green-900">Masuk ke Akun</h2>
          <p className="text-sm text-gray-600 mb-6 text-center">
            Masukkan kredensial akunmu untuk melanjutkan.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.currentTarget);
              onSubmit && onSubmit({
                username: data.get("username"),
                password: data.get("password"),
              });
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                name="username"
                type="text"
                placeholder="Masukkan username"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009C4C]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                name="password"
                type="password"
                placeholder="Masukkan password"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009C4C]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#009C4C] hover:bg-[#007a38] text-white font-semibold py-2 rounded-lg transition"
            >
              Masuk
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-500">
            <a href="#" className="underline">Lupa kata sandi?</a>
          </div>
        </div>
      </div>

      {/* Mobile ilustrasi */}
      <div className="md:hidden w-full h-56 relative">
        <img
          src="src/assets/jnt-cargo.png"
          alt="Ilustrasi Logistik"
          className="object-cover w-full h-full"
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
