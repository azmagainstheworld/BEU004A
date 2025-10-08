// src/components/InputPengeluaranKas.jsx
import React, { useState } from "react";
import ButtonModular from "./ButtonModular";
import { useFinance } from "../context/FinanceContext";
import { useKaryawanContext } from "../context/KaryawanContext";

function InputPengeluaranKas() {
  const { pengeluaranList, addPengeluaran, updatePengeluaran, deletePengeluaran } = useFinance();
  const { karyawanList } = useKaryawanContext(); // langsung dari context

  const [nominal, setNominal] = useState("");
  const [jenis, setJenis] = useState("");
  const [jenisPembayaran, setJenisPembayaran] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [namaKaryawan, setNamaKaryawan] = useState("");
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};
    if (!nominal) newErrors.nominal = "Harap mengisi nominal terlebih dahulu";
    if (!jenisPembayaran) newErrors.jenisPembayaran = "Harap mengisi jenis pembayaran terlebih dahulu";
    if (!jenis) newErrors.jenis = "Harap mengisi jenis pengeluaran terlebih dahulu";
    if ((jenis === "Operasional" || jenis === "Lainnya") && !deskripsi)
      newErrors.deskripsi = "Harap mengisi deskripsi terlebih dahulu";
    if (jenis === "Kasbon" && !namaKaryawan)
      newErrors.namaKaryawan = "Harap mengisi nama karyawan terlebih dahulu";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newData = {
      tanggal: new Date().toLocaleDateString("id-ID"),
      nominal: parseInt(nominal),
      jenis,
      jenisPembayaran,
      deskripsi: (jenis === "Operasional" || jenis === "Lainnya") ? deskripsi || "-" : "-",
      namaKaryawan: jenis === "Kasbon" ? namaKaryawan || "-" : "-",
    };

    if (editId) {
      updatePengeluaran(editId, newData);
      setEditId(null);
    } else {
      addPengeluaran(newData);
    }

    setNominal("");
    setJenis("");
    setJenisPembayaran("");
    setDeskripsi("");
    setNamaKaryawan("");
    setErrors({});
  };

  const handleEdit = (pengeluaran) => {
    setEditId(pengeluaran.id);
    setNominal(pengeluaran.nominal);
    setJenis(pengeluaran.jenis);
    setJenisPembayaran(pengeluaran.jenisPembayaran);
    setDeskripsi(pengeluaran.deskripsi || "");
    setNamaKaryawan(pengeluaran.namaKaryawan || "");
  };

  const handleDelete = (id) => {
    deletePengeluaran(id);
    if (editId === id) setEditId(null);
  };

  return (
    <main className="flex-1 bg-[#EDFFEC] p-6 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Pengeluaran</h2>

      {/* Form Input */}
      <div className="bg-white p-5 rounded-lg shadow-md mb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-2">Nominal Pengeluaran</label>
            <input
              type="number"
              value={nominal}
              onChange={(e) => setNominal(e.target.value)}
              placeholder="Masukkan nominal pengeluaran"
              className="w-full p-2 border rounded-lg"
            />
            {errors.nominal && <p className="text-red-500 text-sm">{errors.nominal}</p>}
          </div>

          <div>
            <label className="block font-semibold mb-2">Jenis Pembayaran</label>
            <select
              value={jenisPembayaran}
              onChange={(e) => setJenisPembayaran(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">-- Pilih Jenis Pembayaran --</option>
              <option value="Cash">Cash</option>
              <option value="Transfer">Transfer</option>
            </select>
            {errors.jenisPembayaran && <p className="text-red-500 text-sm">{errors.jenisPembayaran}</p>}
          </div>

          <div>
            <label className="block font-semibold mb-2">Jenis Pengeluaran</label>
            <select
              value={jenis}
              onChange={(e) => setJenis(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">-- Pilih Jenis Pengeluaran --</option>
              <option value="Operasional">Operasional</option>
              <option value="Top Up Saldo JFS">Top Up Saldo JFS</option>
              <option value="Lainnya">Lainnya</option>
              <option value="Kasbon">Kasbon</option>
            </select>
            {errors.jenis && <p className="text-red-500 text-sm">{errors.jenis}</p>}
          </div>

          {(jenis === "Operasional" || jenis === "Lainnya") && (
            <div>
              <label className="block font-semibold mb-2">Deskripsi</label>
              <input
                type="text"
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Masukkan deskripsi"
                className="w-full p-2 border rounded-lg"
              />
              {errors.deskripsi && <p className="text-red-500 text-sm">{errors.deskripsi}</p>}
            </div>
          )}

          {jenis === "Kasbon" && (
            <div>
              <label className="block font-semibold mb-2">Nama Karyawan</label>
              <select
                value={namaKaryawan}
                onChange={(e) => setNamaKaryawan(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">-- Pilih Karyawan --</option>
                {karyawanList.map((k) => (
                  <option key={k.id} value={k.nama}>
                    {k.nama}
                  </option>
                ))}
              </select>
              {errors.namaKaryawan && (
                <p className="text-red-500 text-sm">{errors.namaKaryawan}</p>
              )}
            </div>
          )}

          {/* Tombol Simpan */}
          <ButtonModular type="submit" variant="success">
            {editId ? "Update" : "Simpan"}
          </ButtonModular>
        </form>
      </div>

 {/* Log Pengeluaran */}
<div className="bg-white p-5 rounded-lg shadow-md overflow-x-auto">
  <h3 className="text-xl font-bold mb-4">Log Pengeluaran</h3>
  <table className="min-w-[1000px] table-auto text-center border-collapse">
    <thead>
      <tr className="bg-[#E1F1DD] text-black">
        <th className="p-2 min-w-[120px]">Tanggal</th>
        <th className="p-2 min-w-[180px]">Nominal</th>
        <th className="p-2 min-w-[190px]">Jenis Pembayaran</th>
        <th className="p-2 min-w-[190px]">Jenis Pengeluaran</th>
        <th className="p-2 min-w-[180px]">Deskripsi</th>
        <th className="p-2 min-w-[180px]">Nama Karyawan</th>
        <th className="p-2 min-w-[140px]">Aksi</th>
      </tr>
    </thead>
    <tbody>
      {pengeluaranList.length === 0 && (
        <tr>
          <td colSpan="7" className="p-4 italic text-gray-500">
            Data Tidak Ditemukan
          </td>
        </tr>
      )}
      {pengeluaranList.map((p) => (
        <tr key={p.id} className="border-b">
          <td className="p-2">{p.tanggal}</td>
          <td className="p-2">Rp {p.nominal.toLocaleString("id-ID")}</td>
          <td className="p-2">{p.jenisPembayaran}</td>
          <td className="p-2">{p.jenis}</td>
          <td className="p-2">{p.deskripsi}</td>
          <td className="p-2">{p.namaKaryawan}</td>
          <td className="p-2 flex justify-center items-center gap-2">
            <ButtonModular variant="warning" onClick={() => handleEdit(p)}>Edit</ButtonModular>
            <ButtonModular variant="danger" onClick={() => handleDelete(p.id)}>Hapus</ButtonModular>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

    </main>
  );
}

export default InputPengeluaranKas;
