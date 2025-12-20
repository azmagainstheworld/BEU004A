import React from "react";
import { User, Lock, LogIn, ShieldCheck } from "lucide-react";

export default function Login({ onLogin, error, loading, onForgotPassword }) {
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const username = data.get("username")?.trim();
    const password = data.get("password")?.trim();
    
    // Melempar data ke Page untuk divalidasi dan diproses
    onLogin(username, password);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative bg-slate-900 overflow-hidden">
      <div 
        className="absolute inset-0 z-0 scale-100 transition-all duration-700"
        style={{
          backgroundImage: "url('https://ik.imagekit.io/gunnams/Photobooth/jnt-cargo.png')", 
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.4)" 
        }}
      ></div>
      <div className="absolute inset-0 z-1 bg-gradient-to-t from-black/80 via-transparent to-[#006400]/30"></div>

      <div className="relative z-10 w-full max-w-[420px] px-6">
        <div className="bg-white/10 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/20 p-10 animate-scaleIn h-[550px] flex flex-col">
          
          <div className="text-center mb-6">
            <h2 className="text-3xl font-black text-white tracking-tight">Selamat Datang</h2>
            <p className="text-emerald-50 text-[10px] font-bold uppercase tracking-[0.2em] opacity-80 mt-2">
              SISTEM J&T CARGO BEU004A
            </p>
          </div>

          {/* Reserved Space untuk Error Message */}
          <div className="h-14 flex items-center mb-4"> 
             {error && (
              <div className="w-full bg-rose-500/20 border border-rose-500/30 text-rose-100 px-4 py-2.5 rounded-2xl text-[11px] font-bold flex items-center gap-2 animate-shake">
                <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 flex-grow">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-emerald-100/60 uppercase tracking-widest ml-1">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-emerald-100/40 group-focus-within:text-emerald-400 transition-colors" />
                </div>
                <input
                  name="username"
                  type="text"
                  autoComplete="off"
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400/50 transition-all text-white placeholder:text-emerald-100/20 font-medium"
                  placeholder="Masukkan username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-emerald-100/60 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-emerald-100/40 group-focus-within:text-emerald-400 transition-colors" />
                </div>
                <input
                  name="password"
                  type="password"
                  autoComplete="off"
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400/50 transition-all text-white placeholder:text-emerald-100/20 font-medium"
                  placeholder="Masukkan password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-[#006400] hover:bg-[#004d00] text-white font-black py-4 rounded-2xl shadow-xl shadow-emerald-900/40 transition-all duration-300 active:scale-[0.97] flex items-center justify-center gap-3 disabled:opacity-50 tracking-widest text-sm"
            >
              {loading ? (
                <div className="w-6 h-6 border-[3px] border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>MASUK</span>
                  <LogIn className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-auto pt-6 text-center space-y-4">
             <button 
               type="button"
               onClick={onForgotPassword}
               className="text-emerald-100/50 text-[11px] hover:text-white transition-colors underline underline-offset-4 font-bold uppercase tracking-wider"
             >
               Lupa password?
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