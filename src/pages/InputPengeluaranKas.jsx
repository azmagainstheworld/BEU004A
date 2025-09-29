












import React, { useState } from "react";
import InputPengeluaranKas from "../components/InputPengeluaranKas";
import { useKaryawanContext } from "../context/KaryawanContext"; // pakai hook dari context

function PengeluaranKas() {
  // state utama untuk daftar pengeluaran
  const [pengeluaranList, setPengeluaranList] = useState([]);

  // ambil daftar karyawan dari context
  const { karyawanList } = useKaryawanContext();

  return (
    <InputPengeluaranKas
      pengeluaranList={pengeluaranList}
      setPengeluaranList={setPengeluaranList}
      karyawanList={karyawanList} // otomatis update saat karyawan ditambah/edit/hapus
    />
  );
}

export default PengeluaranKas;
