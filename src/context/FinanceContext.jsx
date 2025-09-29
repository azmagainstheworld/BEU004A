import React, { createContext, useContext, useState } from "react";

const FinanceContext = createContext();
export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider = ({ children }) => {
  // --- STATE ---
  const [dfodList, setDfodList] = useState([]);
  const [outgoingList, setOutgoingList] = useState([]);
  const [deliveryFeeList, setDeliveryFeeList] = useState([]);
  const [pengeluaranList, setPengeluaranList] = useState([]);
  const [allInputs, setAllInputs] = useState([]);
  const [insights, setInsights] = useState([
    { title: "Kas", value: 0, bgColor: "bg-green-500" },
    { title: "Saldo JFS", value: 0, bgColor: "bg-blue-500" },
    { title: "Transfer", value: 0, bgColor: "bg-yellow-500" },
  ]);
  const [laporan, setLaporan] = useState([]);

  // --- UTIL ---
  const updateDashboardAndLaporan = (newInputs) => {
    let kas = 0, jfs = 0, transfer = 0;
    newInputs.forEach((item) => {
      if (item.jenis === "dfod") {
        if (item.pembayaran.toLowerCase() === "cash") {
          kas += item.nominal; // cash masuk kas
          jfs -= item.nominal; // potong JFS
        } else if (item.pembayaran.toLowerCase() === "transfer") {
          transfer += item.nominal; // transfer masuk transfer
          jfs -= item.nominal; // potong JFS
        }
      } else if (item.jenis === "outgoing") {
        // Outgoing tetap seperti lama
        jfs -= item.nominalBersih * 0.6;
        if (item.pembayaran === "cash") kas += item.pallet || 0;
        else if (item.pembayaran === "transfer") transfer += item.nominalBersih || 0;
      } else if (item.jenis === "deliveryFee") {
        // Delivery Fee langsung menambah JFS
        jfs += item.nominal;
      } else if (item.jenis === "pengeluaran") {
      // logika pengeluaran kas
      if (item.jenisPengeluaran === "Top Up Saldo JFS") {
        if (item.jenisPembayaran.toLowerCase() === "cash") {
          kas -= item.nominal;
          jfs += item.nominal;
        } else if (item.jenisPembayaran.toLowerCase() === "transfer") {
          transfer -= item.nominal;
          jfs += item.nominal;
        }
      } else {
        if (item.jenisPembayaran.toLowerCase() === "cash") kas -= item.nominal;
        else if (item.jenisPembayaran.toLowerCase() === "transfer") transfer -= item.nominal;
      }
    }
  });

    setInsights([
      { title: "Kas", value: kas, bgColor: "bg-green-500" },
      { title: "Saldo JFS", value: jfs, bgColor: "bg-blue-500" },
      { title: "Transfer", value: transfer, bgColor: "bg-yellow-500" },
    ]);

    // Update laporan harian (1 row)
    const tanggal = new Date().toLocaleDateString("id-ID");
    setLaporan([{ tanggal, kas, jfs, transfer }]);
  };

  // --- DFOD ---
  const addDfod = (dfod) => {
    const newDfod = { ...dfod, id: Date.now(), jenis: "dfod", jenisPembayaran: dfod.pembayaran };
    const newDfodList = [...dfodList, newDfod];
    setDfodList(newDfodList);

    const newAllInputs = [...allInputs, newDfod];
    setAllInputs(newAllInputs);

    updateDashboardAndLaporan(newAllInputs);
  };

  const updateDfod = (id, updatedDfod) => {
    const newDfodList = dfodList.map((d) => (d.id === id ? { ...d, ...updatedDfod } : d));
    setDfodList(newDfodList);

    const newAllInputs = allInputs.map((item) =>
      item.id === id && item.jenis === "dfod" ? { ...item, ...updatedDfod } : item
    );
    setAllInputs(newAllInputs);

    updateDashboardAndLaporan(newAllInputs);
  };

  const deleteDfod = (id) => {
    const newDfodList = dfodList.filter((d) => d.id !== id);
    setDfodList(newDfodList);

    const newAllInputs = allInputs.filter((item) => !(item.id === id && item.jenis === "dfod"));
    setAllInputs(newAllInputs);

    updateDashboardAndLaporan(newAllInputs);
  };

  // --- Outgoing ---
  const addOutgoing = ({ nominal, nominalBersih, pallet, pembayaran, tanggal }) => {
    const newOutgoing = {
      id: Date.now(),
      nominal,
      nominalBersih,
      pallet,
      pembayaran,
      tanggal,
      jenis: "outgoing",
      jenisPembayaran: pembayaran, // tambahkan field ini
    };

    const newOutgoingList = [...outgoingList, newOutgoing];
    setOutgoingList(newOutgoingList);

    const newAllInputs = [...allInputs, newOutgoing];
    setAllInputs(newAllInputs);

    updateDashboardAndLaporan(newAllInputs);
  };

  const updateOutgoing = (id, updatedOutgoing) => {
    const newOutgoingList = outgoingList.map((o) =>
      o.id === id ? { ...o, ...updatedOutgoing } : o
    );
    setOutgoingList(newOutgoingList);

    const newAllInputs = allInputs.map((item) =>
      item.id === id && item.jenis === "outgoing" ? { ...item, ...updatedOutgoing } : item
    );
    setAllInputs(newAllInputs);

    updateDashboardAndLaporan(newAllInputs);
  };

  const deleteOutgoing = (id) => {
    const newOutgoingList = outgoingList.filter((o) => o.id !== id);
    setOutgoingList(newOutgoingList);

    const newAllInputs = allInputs.filter((item) => !(item.id === id && item.jenis === "outgoing"));
    setAllInputs(newAllInputs);

    updateDashboardAndLaporan(newAllInputs);
  };

  // --- Delivery Fee ---
  const addDeliveryFee = (amount) => {
    const newFee = {
      id: Date.now(),
      nominal: parseInt(amount),
      jenis: "deliveryFee",
      tanggal: new Date().toLocaleDateString("id-ID"),
    };
    setDeliveryFeeList([...deliveryFeeList, newFee]);
    const newAllInputs = [...allInputs, newFee];
    setAllInputs(newAllInputs);
    updateDashboardAndLaporan(newAllInputs);
  };

  const updateDeliveryFee = (id, updatedAmount) => {
    setDeliveryFeeList(
      deliveryFeeList.map((item) =>
        item.id === id ? { ...item, nominal: parseInt(updatedAmount) } : item
      )
    );
    const newAllInputs = allInputs.map((item) =>
      item.id === id && item.jenis === "deliveryFee"
        ? { ...item, nominal: parseInt(updatedAmount) }
        : item
    );
    setAllInputs(newAllInputs);
    updateDashboardAndLaporan(newAllInputs);
  };

  const deleteDeliveryFee = (id) => {
    setDeliveryFeeList(deliveryFeeList.filter((item) => item.id !== id));
    const newAllInputs = allInputs.filter((item) => !(item.id === id && item.jenis === "deliveryFee"));
    setAllInputs(newAllInputs);
    updateDashboardAndLaporan(newAllInputs);
  };

  // --- Pengeluaran Kas ---
  const addPengeluaran = (data) => {
    const newData = { ...data, id: Date.now(), jenis: "pengeluaran", jenisPengeluaran: data.jenis };
    const newList = [newData, ...pengeluaranList];
    setPengeluaranList(newList);

    const newAllInputs = [...allInputs, newData];
    setAllInputs(newAllInputs);

    updateDashboardAndLaporan(newAllInputs);
  };

  const updatePengeluaran = (id, updatedData) => {
    const newList = pengeluaranList.map((p) => (p.id === id ? { ...p, ...updatedData } : p));
    setPengeluaranList(newList);

    const newAllInputs = allInputs.map((item) =>
      item.id === id && item.jenis === "pengeluaran" ? { ...item, ...updatedData } : item
    );
    setAllInputs(newAllInputs);

    updateDashboardAndLaporan(newAllInputs);
  };

  const deletePengeluaran = (id) => {
    const newList = pengeluaranList.filter((p) => p.id !== id);
    setPengeluaranList(newList);

    const newAllInputs = allInputs.filter((item) => !(item.id === id && item.jenis === "pengeluaran"));
    setAllInputs(newAllInputs);

    updateDashboardAndLaporan(newAllInputs);
  };



  return (
    <FinanceContext.Provider
      value={{
        dfodList,
        addDfod,
        updateDfod,
        deleteDfod,
        outgoingList,
        addOutgoing,
        updateOutgoing,
        deleteOutgoing,
        deliveryFeeList,
        addDeliveryFee,
        updateDeliveryFee,
        deleteDeliveryFee,
        pengeluaranList,
        addPengeluaran,
        updatePengeluaran,
        deletePengeluaran,
        allInputs,
        insights,
        laporan,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};
