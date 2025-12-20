import React from "react";
import Presensi from "../components/Presensi";
import { useKaryawanContext } from "../context/KaryawanContext"; 
import { PresensiProvider } from "../context/PresensiContext"; 

const PresensiPage = () => {
  const { karyawanList } = useKaryawanContext();

  return (
    <PresensiProvider>
      <main className="flex-1 bg-[#F8FAFC] p-6 min-h-screen">
        <Presensi karyawanList={karyawanList} />
      </main>
    </PresensiProvider>
  );
};

export default PresensiPage;
