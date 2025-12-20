import React from "react";
import { ShieldCheck, KeyRound, ArrowRight, Loader2 } from "lucide-react";

export default function ResetPasswordForm({
  password,
  confirmPassword,
  setConfirmPassword,
  handlePasswordChange,
  handleSubmit,
  error,
  success,
  loading,
  tokenValid,
  passwordStrength
}) {
  
  const passwordColor =
    passwordStrength === "Kuat" ? "text-emerald-400" :
    passwordStrength === "Sedang" ? "text-amber-400" :
    passwordStrength === "Lemah" ? "text-rose-400" : "text-emerald-100/30";

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white gap-4 font-sans">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
        <p className="font-bold tracking-widest text-xs uppercase opacity-70">Memvalidasi Akses...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative bg-slate-900 overflow-hidden px-6 font-sans">
      <div 
        className="absolute inset-0 z-0 scale-100"
        style={{
          backgroundImage: "url('src/assets/jnt-cargo.png')", 
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.35)" 
        }}
      ></div>

      <div className="absolute inset-0 z-1 bg-gradient-to-t from-black/80 via-transparent to-[#006400]/30"></div>

      <div className="relative z-10 w-full max-w-[420px]">
        <div className="bg-white/10 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/20 p-10 h-[560px] flex flex-col animate-scaleIn">
          
          <div className="text-center mb-6">
            <h2 className="text-3xl font-black text-white tracking-tight">Atur Ulang</h2>
            <p className="text-emerald-50 text-[10px] font-bold uppercase tracking-[0.2em] opacity-80 mt-2">
              masukkan password baru
            </p>
          </div>

          <div className="h-16 mb-1">
            {error && (
              <div className="w-full bg-rose-500/20 border border-rose-500/30 text-rose-100 px-4 py-2.5 rounded-2xl text-[11px] font-bold flex items-center gap-2 animate-shake">
                <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="leading-tight">{error}</span>
              </div>
            )}
            {success && (
              <div className="w-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-100 px-4 py-2.5 rounded-2xl text-[11px] font-bold flex items-center gap-2 animate-fadeIn">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{success}</span>
              </div>
            )}
          </div>

          {tokenValid && (
            <form onSubmit={handleSubmit} className="space-y-4 flex-grow">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-emerald-100/60 uppercase tracking-widest ml-1">Password Baru</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <KeyRound className="h-5 w-5 text-emerald-100/40 group-focus-within:text-emerald-400 transition-colors" />
                  </div>
                  <input
                    type="password"
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all text-white placeholder:text-emerald-100/20 font-medium"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                  />
                </div>
                <p className={`text-[10px] font-bold uppercase tracking-widest ml-2 transition-colors ${passwordColor}`}>
                  Kekuatan: {passwordStrength || "Min. 8 Karakter"}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-emerald-100/60 uppercase tracking-widest ml-1">Konfirmasi</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <ShieldCheck className="h-5 w-5 text-emerald-100/40 group-focus-within:text-emerald-400 transition-colors" />
                  </div>
                  <input
                    type="password"
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all text-white placeholder:text-emerald-100/20 font-medium"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-[#006400] hover:bg-[#004d00] text-white font-black py-4 rounded-2xl shadow-xl shadow-emerald-900/40 transition-all duration-300 active:scale-[0.97] flex items-center justify-center gap-3 tracking-widest text-sm"
              >
                <span>PERBARUI</span> <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          )}

          <p className="mt-auto text-center text-emerald-100/30 text-[9px] uppercase tracking-[0.3em] font-bold">
            &copy; 2025 J&T CARGO MITRA BEU004A
          </p>
        </div>
      </div>
    </div>
  );
}