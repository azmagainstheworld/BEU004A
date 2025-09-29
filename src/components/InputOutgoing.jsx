// src/pages/InputOutgoing.jsx
import React, { useState } from "react";
import { useFinance } from "../context/FinanceContext";
import Button from "./Button";
import ButtonModular from "./ButtonModular";

function InputOutgoing() {
  const { addOutgoing, updateOutgoing, deleteOutgoing, outgoingList } = useFinance();

  const [nominal, setNominal] = useState("");
  const [diskon, setDiskon] = useState("");
  const [pallet, setPallet] = useState("");
  const [pembayaran, setPembayaran] = useState("");
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!nominal || isNaN(nominal)) newErrors.nominal = "Nominal harus diisi dan angka";
    if (diskon && Number(diskon) > Number(nominal)) newErrors.diskon = "Diskon tidak boleh lebih besar dari nominal";
    if (pallet && isNaN(pallet)) newErrors.pallet = "Pallet harus angka";
    if (!pembayaran) newErrors.pembayaran = "Pilih jenis pembayaran";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const nominalBersih = Number(nominal) - Number(diskon || 0);
    const palletNominal = Number(pallet || 0);
    const tanggal = new Date().toLocaleDateString("id-ID");

    if (editId) {
      updateOutgoing(editId, { nominal: Number(nominal), nominalBersih, pallet: palletNominal, pembayaran, tanggal });
      setEditId(null);
    } else {
      addOutgoing({ nominal: Number(nominal), nominalBersih, pallet: palletNominal, pembayaran, tanggal });
    }

    setNominal(""); setDiskon(""); setPallet(""); setPembayaran(""); setErrors({});
  };

  const handleEdit = (o) => {
    setNominal(o.nominal);
    setDiskon(o.nominal - o.nominalBersih);
    setPallet(o.pallet);
    setPembayaran(o.pembayaran);
    setEditId(o.id);
  };

  const handleDelete = (id) => {
    deleteOutgoing(id);
  };

  return (
    <div className="flex-1 bg-[#EDFFEC] p-6 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Outgoing</h2>

      {/* Form Input */}
      <form onSubmit={handleSubmit} className="bg-white p-5 rounded-lg shadow-md mb-6">
        <div className="mb-3">
          <label className="block font-semibold">Nominal Outgoing</label>
          <input type="number" value={nominal} onChange={(e) => setNominal(e.target.value)} className="w-full border p-2 rounded" />
          {errors.nominal && <p className="text-red-500 text-sm mt-1">{errors.nominal}</p>}
        </div>

        <div className="mb-3">
          <label className="block font-semibold">Diskon Outgoing (opsional)</label>
          <input type="number" value={diskon} onChange={(e) => setDiskon(e.target.value)} className="w-full border p-2 rounded" />
          {errors.diskon && <p className="text-red-500 text-sm mt-1">{errors.diskon}</p>}
        </div>

        <div className="mb-3">
          <label className="block font-semibold">Biaya Pallet (opsional)</label>
          <input type="number" value={pallet} onChange={(e) => setPallet(e.target.value)} className="w-full border p-2 rounded" />
          {errors.pallet && <p className="text-red-500 text-sm mt-1">{errors.pallet}</p>}
        </div>

        <div className="mb-3">
          <label className="block font-semibold">Jenis Pembayaran</label>
          <select value={pembayaran} onChange={(e) => setPembayaran(e.target.value)} className="w-full border p-2 rounded">
            <option value="">-- Pilih Pembayaran --</option>
            <option value="cash">Cash</option>
            <option value="transfer">Transfer</option>
          </select>
          {errors.pembayaran && <p className="text-red-500 text-sm mt-1">{errors.pembayaran}</p>}
        </div>

        <Button type="submit" variant="primary">{editId ? "Update" : "Simpan"}</Button>
      </form>

      {/* Log Outgoing */}
      <div className="bg-white p-5 rounded-lg shadow-md overflow-x-auto">
        <h3 className="text-xl font-bold mb-4">Log Outgoing</h3>
        <table className="w-full table-auto text-center border-collapse">
          <thead>
            <tr className="bg-[#E1F1DD] text-black">
              <th className="p-2">Tanggal</th>
              <th className="p-2">Nominal Bersih</th>
              <th className="p-2">Pallet</th>
              <th className="p-2">Jenis Pembayaran</th>
              <th className="p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {outgoingList.map((o) => (
              <tr key={o.id} className="border-b">
                <td className="p-2">{o.tanggal}</td>
                <td className="p-2">Rp {o.nominalBersih.toLocaleString("id-ID")}</td>
                <td className="p-2">Rp {o.pallet.toLocaleString("id-ID")}</td>
                <td className="p-2">{o.pembayaran}</td>
                <td className="p-2 flex justify-center gap-2">
                  <ButtonModular variant="warning" onClick={() => handleEdit(o)}>Edit</ButtonModular>
                  <ButtonModular variant="danger" onClick={() => handleDelete(o.id)}>Hapus</ButtonModular>
                </td>
              </tr>
            ))}
            {outgoingList.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-gray-500 italic">Data tidak ditemukan</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InputOutgoing;
