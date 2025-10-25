import React, { useState } from "react";
import InputDeliveryFeeComponent from "../components/InputDeliveryFee";

function InputDeliveryFee() {
  const [amount, setAmount] = useState("");
  const [deliveryFeeList, setDeliveryFeeList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    // Hilangkan titik ribuan untuk ambil angka murni
    const numericValue = Number(amount.replace(/\./g, ""));

    // Validasi input
    if (!amount || isNaN(numericValue)) {
      setErrors({ amount: "Nominal harus diisi dengan angka" });
      return;
    }
    if (!Number.isInteger(numericValue)) {
      setErrors({ amount: "Nominal harus berupa bilangan bulat" });
      return;
    }
    if (numericValue <= 0) {
      setErrors({ amount: "Nominal harus lebih dari 0" });
      return;
    }

    setErrors({});

    if (editingId) {
      setDeliveryFeeList(
        deliveryFeeList.map((item) =>
          item.id === editingId
            ? { ...item, amount: numericValue }
            : item
        )
      );
      setEditingId(null);
    } else {
      const newData = {
        id: Date.now(),
        date: new Date().toLocaleDateString("id-ID"),
        amount: numericValue,
      };
      setDeliveryFeeList([newData, ...deliveryFeeList]);
    }

    setAmount("");
  };

  const handleEdit = (id) => {
    const toEdit = deliveryFeeList.find((item) => item.id === id);
    if (toEdit) {
      const formatted = toEdit.amount
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      setAmount(formatted);
      setEditingId(id);
    }
  };

  const handleDelete = (id) => {
    setDeliveryFeeList(deliveryFeeList.filter((item) => item.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setAmount("");
    }
  };

  return (
    <React.Suspense fallback={<p>Loading...</p>}>
      <InputDeliveryFeeComponent
        amount={amount}
        setAmount={setAmount}
        editingId={editingId}
        errors={errors}
        deliveryFeeList={deliveryFeeList}
        handleSubmit={handleSubmit}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </React.Suspense>
  );
}

export default InputDeliveryFee;
