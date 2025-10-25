import React, { useState } from "react";
import Button from "./Button";
import ButtonModular from "./ButtonModular";
import { useFinance } from "../context/FinanceContext";

function InputOutgoing() {
  const { outgoingList, addOutgoing, updateOutgoing, deleteOutgoing } = useFinance();

  const [nominal, setNominal] = useState("");
  const [rawNominal, setRawNominal] = useState(0); // angka asli
  const [potongan, setPotongan] = useState("");
  const [rawPotongan, setRawPotongan] = useState(0); // angka asli potongan
  const [pembayaran, setPembayaran] = useState("");
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});

  // 🔹 Format angka otomatis (nominal dan potongan)
  const formatNumber = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat("id-ID").format(value);
  };

  // 🔹 Handle perubahan input nominal
  const handleNominalChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // hanya angka
    if (value === "") {
      setNominal("");
      setRawNominal(0);
      return;
    }
    const numeric = parseInt(value, 10);
    setRawNominal(numeric);
    setNominal(formatNumber(numeric));
  };

  // 🔹 Handle perubahan input potongan
  const handlePotonganChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // hanya angka
    if (value === "") {
      setPotongan("");
      setRawPotongan(0);
      return;
    }
    const numeric = parseInt(value, 10);
    // ✅ validasi: potongan tidak boleh lebih besar dari nominal
    if (numeric > rawNominal) {
      alert("Potongan harga tidak boleh lebih besar dari nominal outgoing");
      return;
    }
    setRawPotongan(numeric);
    setPotongan(formatNumber(numeric));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!rawNominal || isNaN(rawNominal)) newErrors.nominal = "Nominal harus diisi dan berupa angka";
    if (rawPotongan > rawNominal) newErrors.potongan = "Potongan harga tidak boleh melebihi nominal";
    if (!pembayaran) newErrors.pembayaran = "Pilih jenis pembayaran";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const tanggal = new Date().toLocaleDateString("id-ID");
    const nominalBersih = rawNominal - rawPotongan;

    const outgoingData = {
      nominal: rawNominal,
      potongan: rawPotongan,
      nominalBersih,
      pembayaran,
      tanggal,
      namaKaryawan: "-",
      deskripsi: "-",
    };

    if (editId) {
      updateOutgoing(editId, outgoingData);
      setEditId(null);
    } else {
      addOutgoing(outgoingData);
    }

    setNominal("");
    setRawNominal(0);
    setPotongan("");
    setRawPotongan(0);
    setPembayaran("");
    setErrors({});
  };

  const handleEdit = (o) => {
    setRawNominal(o.nominal);
    setNominal(formatNumber(o.nominal));
    setRawPotongan(o.potongan || 0);
    setPotongan(formatNumber(o.potongan || 0));
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
          <label className="block font-semibold">Nominal Outgoing (Rp)</label>
          <input
            type="text"
            value={nominal}
            onChange={handleNominalChange}
            placeholder="Masukkan Nominal"
            className="w-full border p-2 rounded"
          />
          {errors.nominal && <p className="text-red-500 text-sm mt-1">{errors.nominal}</p>}
        </div>

        <div className="mb-3">
          <label className="block font-semibold">Potongan Harga (Rp)</label>
          <input
            type="text"
            value={potongan}
            onChange={handlePotonganChange}
            placeholder="Masukkan Potongan Harga"
            className="w-full border p-2 rounded"
          />
          {errors.potongan && <p className="text-red-500 text-sm mt-1">{errors.potongan}</p>}
        </div>

        <div className="mb-3">
          <label className="block font-semibold">Jenis Pembayaran</label>
          <select
            value={pembayaran}
            onChange={(e) => setPembayaran(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">-- Pilih Pembayaran --</option>
            <option value="cash">Cash</option>
            <option value="transfer">Transfer</option>
          </select>
          {errors.pembayaran && <p className="text-red-500 text-sm mt-1">{errors.pembayaran}</p>}
        </div>

        <Button type="submit" variant="primary">
          {editId ? "Update" : "Simpan"}
        </Button>
      </form>

      {/* Log Outgoing */}
      <div className="bg-white p-5 rounded-lg shadow-md overflow-x-auto">
        <h3 className="text-xl font-bold mb-4">Log Outgoing</h3>
        <table className="w-full table-auto text-center border-collapse">
          <thead>
            <tr className="bg-[#E1F1DD] text-black">
              <th className="p-2">Tanggal</th>
              <th className="p-2">Outgoing</th>
              <th className="p-2">Potongan Harga</th>
              <th className="p-2">Nominal Bersih</th>
              <th className="p-2">Jenis Pembayaran</th>
              <th className="p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {outgoingList.map((o) => (
              <tr key={o.id} className="border-b">
                <td className="p-2">{o.tanggal}</td>
                <td className="p-2">Rp {o.nominal.toLocaleString("id-ID")}</td>
                <td className="p-2">Rp {o.potongan?.toLocaleString("id-ID") || 0}</td>
                <td className="p-2 font-semibold">Rp {o.nominalBersih.toLocaleString("id-ID")}</td>
                <td className="p-2">{o.pembayaran}</td>
                <td className="p-2 flex justify-center gap-2">
                  <ButtonModular variant="warning" onClick={() => handleEdit(o)}>
                    Edit
                  </ButtonModular>
                  <ButtonModular variant="danger" onClick={() => handleDelete(o.id)}>
                    Hapus
                  </ButtonModular>
                </td>
              </tr>
            ))}
            {outgoingList.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-gray-500 italic">
                  Data tidak ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InputOutgoing;
