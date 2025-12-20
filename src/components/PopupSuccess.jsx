import React from "react";
import { CheckCircle } from "lucide-react";
import ButtonModular from "./ButtonModular";

export default function PopupSuccess({ message, onClose }) {
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* 1. BACKDROP: Hitam Terawang */}
      <div 
        className="fixed inset-0 w-screen h-screen bg-black/60 animate-fadeIn" 
        onClick={onClose}
      ></div>

      {/* 2. MODAL CARD: Desain tetap profesional & modern */}
      <div className="relative z-[10001] bg-white rounded-3xl shadow-2xl p-10 w-full max-w-sm animate-scaleIn text-center border border-slate-100">
        
        {/* Ikon Sukses: Warna hijau J&T #006400 */}
        <div className="w-20 h-20 bg-emerald-50 text-[#006400] rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <CheckCircle size={48} strokeWidth={2.5} />
        </div>

        {/* Judul Pesan */}
        <h3 className="text-xl font-black text-slate-800 mb-2 tracking-tight">Berhasil!</h3>
        
        {/* Detail Pesan */}
        <p className="text-slate-500 font-medium leading-relaxed">
          {message}
        </p>

        {/* Tombol OK: Menggunakan ButtonModular variant success */}
        <div className="mt-8 flex justify-center">
          <ButtonModular 
            variant="success" 
            onClick={onClose} 
            className="px-10 py-2.5 font-bold shadow-lg shadow-[#006400]/20 min-w-[120px]"
          >
            Selesai
          </ButtonModular>
        </div>
      </div>
    </div>
  );
}