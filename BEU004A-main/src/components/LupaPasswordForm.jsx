import React, { useState } from "react";
import { Mail, ArrowLeft, Send, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ButtonModular from "./ButtonModular";

export default function LupaPasswordForm({ onSubmit, externalMessage, externalError }) {
  const [email, setEmail] = useState("");
  const [localError, setLocalError] = useState("");
  const navigate = useNavigate();

  // Regex format email
  const validateEmailFormat = (value) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
    return regex.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    // Validasi email kosong
    if (!email.trim()) {
      setLocalError("Email harus diisi");
      return;
    }

    // Validasi format email
    if (!validateEmailFormat(email)) {
      setLocalError("Format email tidak valid");
      return;
    }

    try {
      // Memanggil fungsi dari Page
      await onSubmit(email);
    } catch (err) {
      // Error ditangani oleh state di Page
    }
  };

  // Menggabungkan error lokal (validasi) dan error eksternal (API)
  const activeError = localError || externalError;

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative bg-slate-900 overflow-hidden px-6">
      {/* UI: Background J&T Cargo */}
      <div 
        className="absolute inset-0 z-0 scale-100 transition-all duration-700"
        style={{
          backgroundImage: "url('src/assets/jnt-cargo.png')", 
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "brightness(0.4)" 
        }}
      ></div>

      <div className="absolute inset-0 z-1 bg-gradient-to-t from-black/80 via-transparent to-[#006400]/30"></div>

      <div className="relative z-10 w-full max-w-[420px]">
        <div className="bg-white/10 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/20 p-10 h-[500px] flex flex-col animate-scaleIn">
          
          <div className="text-center mb-6">
            <h2 className="text-3xl font-black text-white tracking-tight">Lupa Password</h2>
            <p className="text-emerald-50 text-[10px] font-bold uppercase tracking-[0.2em] opacity-80 mt-2 px-4 leading-relaxed">
              masukkan email untuk pemulihan 
            </p>
          </div>

          {/* reserved Space for Notifications */}
          <div className="h-16 mb-4">
            {activeError && (
              <div className="w-full bg-rose-500/20 border border-rose-500/30 text-rose-100 px-4 py-2.5 rounded-2xl text-[11px] font-bold flex items-center gap-2 animate-shake">
                <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{activeError}</span>
              </div>
            )}
            {externalMessage && (
              <div className="w-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-100 px-4 py-2.5 rounded-2xl text-[11px] font-bold flex items-center gap-2 animate-fadeIn">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{externalMessage}</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-6 flex-grow">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-emerald-100/60 uppercase tracking-widest ml-1">Alamat Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-emerald-100/40 group-focus-within:text-emerald-400 transition-colors" />
                </div>
                <input
                  type="email"
                  placeholder="Masukkan email terdaftar"
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400/50 transition-all text-white placeholder:text-emerald-100/20 font-medium"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setLocalError("");
                  }}
                />
              </div>
            </div>

            <ButtonModular 
              type="submit" 
              variant="success" 
              className="w-full mt-4 bg-[#006400] hover:bg-[#004d00] py-4 rounded-2xl shadow-xl shadow-emerald-900/40 flex items-center justify-center gap-3 font-black tracking-widest text-sm active:scale-[0.97]"
            >
              <span>KIRIM LINK</span> <Send className="w-4 h-4" />
            </ButtonModular>
          </form>

          <div className="mt-auto text-center space-y-4">
            <button 
              type="button"
              onClick={() => navigate("/login")}
              className="text-emerald-100/50 text-[11px] hover:text-white transition-colors flex items-center justify-center gap-2 w-full font-bold uppercase tracking-widest underline underline-offset-4"
            >
              <ArrowLeft className="w-3 h-3" /> Kembali ke Login
            </button>
            <p className="text-emerald-100/30 text-[9px] uppercase tracking-[0.3em] font-bold">
              &copy; {new Date().getFullYear()} J&T Cargo Mitra BEU004A
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}