import React from "react";
import Presensi from "../components/Presensi";
import { useKaryawan } from "../context/KaryawanContext"; // Pastikan nama hook benar (useKaryawan)

const PresensiPage = () => {
  // Ambil data dari KaryawanContext
  const { karyawanList } = useKaryawan();

  return (
    <main className="flex-1 bg-[#F8FAFC] p-6 min-h-screen">
      {/* Kirim data ke komponen UI Presensi */}
      <Presensi karyawanList={karyawanList} />
    </main>
  );
};

export default PresensiPage;