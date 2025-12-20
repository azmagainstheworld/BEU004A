import React, { useEffect, useState } from "react";
import GajiKaryawan from "../components/GajiKaryawan";

function LaporanGaji() {
  const [gajiData, setGajiData] = useState([]);
  
  // LOGIKA DINAMIS: Menghitung jumlah hari dalam bulan berjalan
  const getDaysInMonth = () => {
    const now = new Date();
    // Mengambil hari ke-0 dari bulan berikutnya = hari terakhir bulan ini
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  };

  const [daysInMonth] = useState(getDaysInMonth()); // Sekarang otomatis 31 untuk Desember

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("https://beu004a-backend-production.up.railway.app/beu004a/users/laporan-gaji", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        const json = await res.json();

        if (json.success) {
          const mapped = json.data.map((item, index) => ({
            no: index + 1,
            nama: item.nama_karyawan,
            hadir: item.total_presensi,
            upahPerHari: item.upah_perhari,
            kasbon: item.kasbon,
            bonus: item.bonus,
            totalGaji: item.gaji_bersih
          }));

          setGajiData(mapped);
        }
      } catch (error) {
        console.error("Error fetch:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full">
      <GajiKaryawan gajiData={gajiData} daysInMonth={daysInMonth} />
    </div>
  );
}

export default LaporanGaji;