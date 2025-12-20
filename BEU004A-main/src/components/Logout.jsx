// src/components/Logout.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import ButtonModular from "./ButtonModular";

export default function Logout({ onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div
      className="
        fixed inset-0 
        bg-black bg-opacity-40 
        backdrop-blur-md 
        flex items-center justify-center 
        z-[9999]
      "
    >
      <div className="bg-white rounded-xl shadow-xl p-6 w-[350px] text-center">
        <h2 className="text-lg font-bold mb-4">Konfirmasi Logout</h2>

        <p className="mb-6">
          Apakah Anda yakin ingin keluar dari akun ini?
        </p>

        <div className="flex justify-center gap-4">
          <ButtonModular variant="warning" onClick={onClose}>
            Batal
          </ButtonModular>

          <ButtonModular variant="success" onClick={handleLogout}>
            Ya
          </ButtonModular>
        </div>
      </div>
    </div>
  );
}
