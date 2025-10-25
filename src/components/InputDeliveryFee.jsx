// components/InputDeliveryFee.jsx
import React, { useState } from "react";
import ButtonModular from "./ButtonModular";
import { useFinance } from "../context/FinanceContext";

function InputDeliveryFee() {
  const { deliveryFeeList, addDeliveryFee, updateDeliveryFee, deleteDeliveryFee } = useFinance();

  const [amount, setAmount] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});

  const resetForm = () => {
    setAmount("");
    setEditingId(null);
    setErrors({});
  };

  // Fungsi submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    const numericValue = amount.replace(/\./g, "");
    if (!numericValue || parseInt(numericValue) <= 0) {
      setErrors({ amount: "Nominal harus lebih dari 0" });
      return;
    }

    if (editingId) {
      updateDeliveryFee(editingId, numericValue);
    } else {
      addDeliveryFee(numericValue);
    }
    resetForm();
  };

  // Fungsi edit
  const handleEdit = (id) => {
    const fee = deliveryFeeList.find((item) => item.id === id);
    if (fee) {
      setAmount(parseInt(fee.nominal).toLocaleString("id-ID"));
      setEditingId(fee.id);
    }
  };

  // Fungsi hapus
  const handleDelete = (id) => {
    deleteDeliveryFee(id);
    if (editingId === id) resetForm();
  };

  // Fungsi format input saat diketik
  const handleChange = (e) => {
    let value = e.target.value;
    value = value.replace(/\D/g, ""); // hanya angka
    if (value.length > 1 && value.startsWith("0")) {
      value = value.replace(/^0+/, ""); // hapus nol depan
    }
    const formatted = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setAmount(formatted);
  };

  return (
    <main className="flex-1 bg-[#EDFFEC] p-6 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Delivery Fee</h2>

      {/* Form Input */}
      <div className="bg-white p-5 rounded-lg shadow-md mb-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-semibold mb-2">Nominal Delivery Fee</label>
            <input
              type="text"
              value={amount}
              onChange={handleChange}
              placeholder="Masukkan nominal"
              className={`w-full p-2 border rounded-lg ${errors.amount ? "border-red-500" : ""}`}
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
            )}
          </div>

          <ButtonModular type="submit" variant="success">
            {editingId ? "Update" : "Simpan"}
          </ButtonModular>
        </form>
      </div>

      {/* Log Delivery Fee */}
      <div className="bg-white p-5 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">Log Delivery Fee</h3>
        <table className="w-full table-auto text-center border-collapse">
          <thead>
            <tr className="bg-[#E1F1DD] text-black">
              <th className="p-2">Tanggal</th>
              <th className="p-2">Nominal</th>
              <th className="p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {deliveryFeeList.length === 0 ? (
              <tr>
                <td colSpan="3" className="p-4 text-gray-500 italic">
                  Data Tidak Ditemukan
                </td>
              </tr>
            ) : (
              deliveryFeeList.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="p-2">{item.tanggal}</td>
                  <td className="p-2 text-green-600 font-semibold">
                    Rp {parseInt(item.nominal).toLocaleString("id-ID")}
                  </td>
                  <td className="p-2 flex justify-center gap-2">
                    <ButtonModular onClick={() => handleEdit(item.id)} variant="warning">
                      Edit
                    </ButtonModular>
                    <ButtonModular onClick={() => handleDelete(item.id)} variant="danger">
                      Hapus
                    </ButtonModular>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default InputDeliveryFee;
