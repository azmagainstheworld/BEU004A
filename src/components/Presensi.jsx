import React, { useState, useEffect } from "react";
import ButtonModular from "../components/ButtonModular";

export default function Presensi({ karyawanList }) {
  const [presensiList, setPresensiList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [summary, setSummary] = useState({ total: 0, hadir: 0, tidak: 0 });

  useEffect(() => {
    if (karyawanList?.length) {
      const initData = karyawanList.map((k) => ({
        id: k.id,
        nama: k.nama,
        tanggal: new Date().toISOString().split("T")[0],
        status: "-",
        locked: false,
        autoSaved: false,
        aksiActive: false,
      }));
      setPresensiList(initData);
      updateSummary(initData);
    }
  }, [karyawanList]);

  const updateSummary = (list) => {
    const total = list.length;
    const hadir = list.filter((p) => p.status === "Hadir").length;
    const tidak = list.filter((p) => p.status === "Tidak Hadir").length;
    setSummary({ total, hadir, tidak });
  };

  const handleStatus = (id, status) => {
    setPresensiList((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          if (!p.autoSaved) {
            const updated = { ...p, status, locked: true, autoSaved: true, aksiActive: true };
            updateSummary(prev.map((x) => (x.id === id ? updated : x)));
            return updated;
          }
          if (editingId === id) {
            const updated = { ...p, status };
            updateSummary(prev.map((x) => (x.id === id ? updated : x)));
            return updated;
          }
        }
        return p;
      })
    );
  };

  const handleEdit = (id) => {
    setEditingId(id);
    setPresensiList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, locked: false } : p))
    );
  };

  const handleSave = (id) => {
    setPresensiList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, locked: true, autoSaved: true } : p))
    );
    setEditingId(null);
  };

  return (
    <div className="p-6 w-full">
      {/* Judul */}
      <h2 className="text-2xl font-bold mb-6">Presensi</h2>

      {/* Summary Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Jumlah Karyawan */}
        <div className="relative rounded-2xl p-6 shadow-lg transform transition duration-300 hover:scale-105 bg-yellow-200/70 backdrop-blur-md border border-yellow-300 flex flex-col items-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-transparent animate-[pulse_3s_ease-in-out_infinite]"></div>
          <span className="relative text-gray-700 font-semibold">Jumlah Karyawan</span>
          <span className="relative text-3xl font-bold text-gray-800">{summary.total}</span>
        </div>

        {/* Hadir */}
        <div className="relative rounded-2xl p-6 shadow-lg transform transition duration-300 hover:scale-105 bg-[#6FCF97]/70 backdrop-blur-md border border-[#6FCF97] flex flex-col items-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-transparent animate-[pulse_3s_ease-in-out_infinite]"></div>
          <span className="relative text-gray-700 font-semibold">Hadir</span>
          <span className="relative text-3xl font-bold text-gray-800">{summary.hadir}</span>
        </div>

        {/* Tidak Hadir */}
        <div className="relative rounded-2xl p-6 shadow-lg transform transition duration-300 hover:scale-105 bg-red-200/70 backdrop-blur-md border border-red-300 flex flex-col items-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-transparent animate-[pulse_3s_ease-in-out_infinite]"></div>
          <span className="relative text-gray-700 font-semibold">Tidak Hadir</span>
          <span className="relative text-3xl font-bold text-gray-800">{summary.tidak}</span>
        </div>
      </div>

      {/* Tabel Presensi */}
      <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
        <table className="w-full border-collapse min-w-[1300px]">
          <thead>
            <tr className="bg-[#E1F1DD] text-black">
              <th className="p-2 min-w-[60px] text-center">No</th>
              <th className="p-2 min-w-[300px] text-center whitespace-nowrap">Nama Karyawan</th>
              <th className="p-2 min-w-[200px] text-center whitespace-nowrap">Tanggal Presensi</th>
              <th className="p-2 min-w-[320px] text-center whitespace-nowrap">Kehadiran</th>
              <th className="p-2 min-w-[300px] text-center whitespace-nowrap">Keterangan</th>
              <th className="p-2 min-w-[320px] text-center whitespace-nowrap">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {presensiList.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  Belum ada data presensi
                </td>
              </tr>
            )}
            {presensiList.map((p, idx) => (
              <tr key={p.id} className="border-t">
                <td className="text-center">{idx + 1}</td>
                <td className="whitespace-nowrap">{p.nama}</td>
                <td className="text-center">{p.tanggal}</td>
                <td className="text-center flex justify-center gap-2 p-2">
                  <ButtonModular
                    variant="success"
                    disabled={p.locked}
                    className={`px-6 py-2 ${p.locked ? "bg-gray-400 border-gray-400" : ""}`}
                    onClick={() => handleStatus(p.id, "Hadir")}
                  >
                    Hadir
                  </ButtonModular>
                  <ButtonModular
                    variant="danger"
                    disabled={p.locked}
                    className={`px-6 py-2 ${p.locked ? "bg-gray-400 border-gray-400" : ""}`}
                    onClick={() => handleStatus(p.id, "Tidak Hadir")}
                  >
                    Tidak Hadir
                  </ButtonModular>
                </td>
                <td className="text-center">{p.status !== "-" ? p.status : ""}</td>
                <td className="flex justify-center gap-2 p-2">
                  <ButtonModular
                    variant="warning"
                    onClick={() => handleEdit(p.id)}
                    disabled={!p.aksiActive}
                    className={`px-6 py-2 ${!p.aksiActive ? "bg-gray-400 border-gray-400" : ""}`}
                  >
                    Edit
                  </ButtonModular>
                  <ButtonModular
                    variant="success"
                    onClick={() => handleSave(p.id)}
                    disabled={!p.aksiActive || p.locked}
                    className={`px-6 py-2 ${!p.aksiActive || p.locked ? "bg-gray-400 border-gray-400" : ""}`}
                  >
                    Simpan
                  </ButtonModular>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
