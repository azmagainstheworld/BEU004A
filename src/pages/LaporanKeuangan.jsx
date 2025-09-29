import React, { useState } from "react";
import LaporanKeuanganComponent from "../components/LaporanKeuangan";

function LaporanKeuangan() {
  // contoh data dummy (nanti bisa diisi dari input lain)
  const [laporan] = useState([
    { tanggal: "25/09/2025", kas: 200000, jfs: 500000, transfer: 300000 },
    { tanggal: "24/09/2025", kas: 150000, jfs: 300000, transfer: 200000 },
  ]);

  return <LaporanKeuanganComponent laporan={laporan} />;
}

export default LaporanKeuangan;
