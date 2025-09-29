import React from "react";
import Presensi from "../components/Presensi";
import { useKaryawanContext } from "../context/KaryawanContext"; // hook context karyawan
import { PresensiProvider } from "../context/PresensiContext"; // wrapper provider

const PresensiPage = () => {
  const { karyawanList } = useKaryawanContext();

  return (
    <PresensiProvider>
      <main className="flex-1 bg-[#EDFFEC] p-6 min-h-screen">
        <Presensi karyawanList={karyawanList} />
      </main>
    </PresensiProvider>
  );
};

export default PresensiPage;
