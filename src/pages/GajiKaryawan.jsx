// src/pages/Gaji.jsx
import React from "react";
import GajiKaryawan from "../components/GajiKaryawan";
import { useKaryawanContext } from "../context/KaryawanContext";
import { usePresensi } from "../context/PresensiContext";

export default function Gaji() {
  const { karyawanList } = useKaryawanContext();
  const { presensiList } = usePresensi();

  // jumlah hari di bulan ini (contoh: September 2025 → 30)
  const daysInMonth = new Date(2025, 9, 0).getDate();

  // gabung data dari karyawan + presensi
  const gajiData = karyawanList.map((karyawan, idx) => {
    const presensi = presensiList.find(p => p.idKaryawan === karyawan.id);
    const hadirCount = presensi
      ? Object.values(presensi.presensi).filter(val => val === "hadir").length
      : 0;

    const upahPerHari = karyawan.upahPerHari || 0;
    const bonus = karyawan.bonus || 0;
    const kasbon = karyawan.kasbon || 0;

    const totalGaji = upahPerHari * hadirCount + bonus - kasbon;

    return {
      no: idx + 1,
      nama: karyawan.nama,
      hadir: hadirCount,
      upahPerHari,
      bonus,
      kasbon,
      totalGaji,
    };
  });

  return (
    <div className="p-6">
      <GajiKaryawan gajiData={gajiData} daysInMonth={daysInMonth} />
    </div>
  );
}
