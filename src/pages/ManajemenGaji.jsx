import React, { useState, useEffect } from "react";
import ManajemenGaji from "../components/ManajemenGaji";
import { useKaryawanContext } from "../context/KaryawanContext";
import ButtonModular from "../components/ButtonModular"; // import tombol

const ManajemenGajiPages = () => {
  const [manajemenGaji, setManajemenGaji] = useState([]);
  const [isLocked, setIsLocked] = useState(false); // state kunci global
  const { karyawanList } = useKaryawanContext(); // langsung pakai hook

  // initialize manajemenGaji otomatis untuk setiap karyawan
  useEffect(() => {
    setManajemenGaji((prev) =>
      karyawanList.map((k) => {
        const existing = prev.find((m) => m.idKaryawan === k.id);
        return existing || { idKaryawan: k.id, upahPerHari: 0, bonus: 0 };
      })
    );
  }, [karyawanList]);

  const handleSaveAll = () => {
    console.log("Data gaji disimpan:", manajemenGaji);
    setIsLocked(true); // kunci semua input setelah simpan
  };

  return (
    <main className="flex-1 bg-[#EDFFEC] p-6 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Manajemen Gaji</h2>

      {/* tombol simpan di luar box tabel */}
      <div className="mb-4">
        <ButtonModular variant="success" onClick={handleSaveAll}>
          Simpan
        </ButtonModular>
      </div>

      <ManajemenGaji
        karyawanList={karyawanList}
        manajemenGaji={manajemenGaji}
        setManajemenGaji={setManajemenGaji}
        isLocked={isLocked} // kirim ke child
        setIsLocked={setIsLocked}
      />
    </main>
  );
};

export default ManajemenGajiPages;
