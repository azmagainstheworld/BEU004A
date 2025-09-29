// src/components/GajiKaryawan.jsx
import React from "react";

function GajiKaryawan({ gajiData, daysInMonth }) {
  return (
    <div className="p-6 w-full">
      <h2 className="text-2xl font-bold mb-6">Gaji Karyawan</h2>

      {/* Card tabel */}
      <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
        <table className="w-full border-collapse min-w-[1200px] text-center">
          <thead>
            <tr className="bg-[#E1F1DD] text-black">
              <th className="p-2 min-w-[50px]">No</th>
              <th className="p-2 min-w-[200px]">Nama</th>
              <th className="p-2 min-w-[150px]">Kehadiran</th>
              <th className="p-2 min-w-[150px]">Upah/Hari</th>
              <th className="p-2 min-w-[150px]">Kasbon</th>
              <th className="p-2 min-w-[150px]">Bonus</th>
              <th className="p-2 min-w-[180px]">Total Gaji</th>
            </tr>
          </thead>
          <tbody>
            {gajiData.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500 italic">
                  Belum ada data gaji
                </td>
              </tr>
            )}
            {gajiData.map((g) => (
              <tr key={g.no} className="border-t">
                <td className="p-2">{g.no}</td>
                <td className="p-2">{g.nama}</td>
                <td className="p-2">
                  {g.hadir}/{daysInMonth}
                </td>
                <td className="p-2">Rp {g.upahPerHari.toLocaleString("id-ID")}</td>
                <td className="p-2">Rp {g.kasbon.toLocaleString("id-ID")}</td>
                <td className="p-2">Rp {g.bonus.toLocaleString("id-ID")}</td>
                <td className="p-2 font-semibold">
                  Rp {g.totalGaji.toLocaleString("id-ID")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GajiKaryawan;
