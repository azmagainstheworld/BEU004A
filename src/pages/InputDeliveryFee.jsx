import React, { useState } from "react";
import InputDeliveryFeeComponent from "../components/InputDeliveryFee";

function InputDeliveryFee() {
  const [amount, setAmount] = useState("");
  const [deliveryFeeList, setDeliveryFeeList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    let newErrors = {};
    if (amount === "") {
      newErrors.amount = "Harap mengisi nominal terlebih dahulu";
    } else if (isNaN(amount)) {
      newErrors.amount = "Nominal harus berupa angka!";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    if (editingId) {
      setDeliveryFeeList(
        deliveryFeeList.map((item) =>
          item.id === editingId ? { ...item, amount } : item
        )
      );
      setEditingId(null);
    } else {
      const newData = {
        id: Date.now(),
        date: new Date().toLocaleDateString("id-ID"),
        amount,
      };
      setDeliveryFeeList([newData, ...deliveryFeeList]);
    }

    setAmount("");
  };

  const handleEdit = (id) => {
    const toEdit = deliveryFeeList.find((item) => item.id === id);
    if (toEdit) {
      setAmount(toEdit.amount);
      setEditingId(id);
    }
  };

  const handleDelete = (id) => {
    setDeliveryFeeList(deliveryFeeList.filter((item) => item.id !== id));
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