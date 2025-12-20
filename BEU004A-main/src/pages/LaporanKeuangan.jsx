import React, { useEffect } from "react";
import LaporanKeuanganComponent from "../components/LaporanKeuangan";
import { useFinance } from "../context/FinanceContext";

function LaporanKeuangan() {
  const { fetchLaporanKeuangan } = useFinance();

  // Auto fetch saat halaman dibuka
  useEffect(() => {
    fetchLaporanKeuangan();
  }, []);

  return <LaporanKeuanganComponent />;
}

export default LaporanKeuangan;
