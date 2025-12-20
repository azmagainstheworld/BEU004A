import React, { useEffect, useState } from "react";
import GajiKaryawan from "../components/GajiKaryawan";

function LaporanGaji() {
  const [gajiData, setGajiData] = useState([]);
  const [daysInMonth] = useState(30);

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
