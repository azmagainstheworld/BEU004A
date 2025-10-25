// components/InputDfod.jsx
import React, { useState } from "react";
import { useFinance } from "../context/FinanceContext";
import Button from "./Button"; 
import ButtonModular from "./ButtonModular"; 

function InputDfod() {
  const { dfodList, addDfod, updateDfod, deleteDfod } = useFinance();
  const [nominal, setNominal] = useState("");
  const [pembayaran, setPembayaran] = useState("");
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Hapus titik dari format ribuan sebelum validasi
    const numericValue = nominal.replace(/\./g, "");

    if (!numericValue || isNaN(numericValue) || Number(numericValue) <= 0)
      newErrors.nominal = "Nominal harus lebih dari 0";
    if (!pembayaran) newErrors.pembayaran = "Jenis Pembayaran wajib dipilih";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const dfodData = {
      nominal: Number(numericValue),
      pembayaran: pembayaran.toLowerCase(),
      tanggal: new Date().toLocaleDateString("id-ID"),
    };

    if (editId) {
      updateDfod(editId, dfodData);
      setEditId(null);
    } else {
      addDfod(dfodData);
    }

    setNominal("");
    setPembayaran("");
    setErrors({});
  };

  const handleEdit = (dfod) => {
    setEditId(dfod.id);
    // tampilkan kembali dengan format ribuan
    setNominal(dfod.nominal.toLocaleString("id-ID"));
    setPembayaran(dfod.pembayaran);
  };

  // Format input nominal setiap diketik
  const handleNominalChange = (e) => {
    let value = e.target.value;
    // Hanya angka
    value = value.replace(/\D/g, "");
    // Hapus nol depan
    if (value.length > 1 && value.startsWith("0")) {
      value = value.replace(/^0+/, "");
    }
    // Format ribuan pakai titik
    const formatted = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setNominal(formatted);
  };

  return (
    <main className="flex-1 bg-[#EDFFEC] p-6 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Delivery Fee On Delivery</h2>

      <div className="bg-white p-5 rounded-lg shadow-md mb-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-semibold mb-2">Nominal DFOD</label>
            <input
              type="text"
              value={nominal}
              onChange={handleNominalChange}
              placeholder="Masukkan nominal DFOD"
              className={`w-full p-2 border rounded-lg ${errors.nominal ? "border-red-500" : ""}`}
            />
            {errors.nominal && (
              <p className="text-red-500 text-sm mt-1">{errors.nominal}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-2">Jenis Pembayaran</label>
            <select
              value={pembayaran}
              onChange={(e) => setPembayaran(e.target.value)}
              className={`w-full p-2 border rounded-lg ${errors.pembayaran ? "border-red-500" : ""}`}
            >
              <option value="">-- Pilih Jenis Pembayaran --</option>
              <option value="cash">Cash</option>
              <option value="transfer">Transfer</option>
            </select>
            {errors.pembayaran && (
              <p className="text-red-500 text-sm mt-1">{errors.pembayaran}</p>
            )}
          </div>

          <Button type="submit" variant="primary">
            {editId ? "Update" : "Simpan"}
          </Button>
        </form>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-md overflow-x-auto">
        <h3 className="text-xl font-bold mb-4">Log DFOD</h3>
        <table className="w-full table-auto text-center border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-[#E1F1DD] text-black">
              <th className="p-2 min-w-[120px]">Tanggal</th>
              <th className="p-2 min-w-[140px]">Nominal</th>
              <th className="p-2 min-w-[140px]">Jenis Pembayaran</th>
              <th className="p-2 min-w-[180px]">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dfodList.map((dfod) => (
              <tr key={dfod.id} className="border-b">
                <td className="p-2">{dfod.tanggal}</td>
                <td className="p-2 text-green-600 font-semibold">
                  Rp {dfod.nominal.toLocaleString("id-ID")}
                </td>
                <td className="p-2 capitalize">{dfod.pembayaran}</td>
                <td className="p-2 flex justify-center gap-2">
                  <ButtonModular variant="warning" onClick={() => handleEdit(dfod)}>
                    Edit
                  </ButtonModular>
                  <ButtonModular variant="danger" onClick={() => deleteDfod(dfod.id)}>
                    Hapus
                  </ButtonModular>
                </td>
              </tr>
            ))}
            {dfodList.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-gray-500 italic">
                  Data Tidak Ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default InputDfod;
