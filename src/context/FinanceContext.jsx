// ✅ FinanceContext.js (versi diperbaiki)
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

  // --- UPDATE DASHBOARD & LAPORAN ---
  const updateDashboardAndLaporan = (inputs) => {
    let kas = 0,
      jfs = 0,
      transfer = 0;

    inputs.forEach((item) => {
      const nominal = Number(item.nominal) || 0;
      const nominalBersih = Number(item.nominalBersih || nominal) || 0;

      switch (item.jenis) {
        case "DFOD":
          if (item.pembayaran?.toLowerCase() === "cash") {
            kas += nominal;
            jfs -= nominal;
          } else if (item.pembayaran?.toLowerCase() === "transfer") {
            transfer += nominal;
            jfs -= nominal;
          }
          break;

        case "Outgoing":
          if (item.pembayaran?.toLowerCase() === "cash") kas += nominalBersih;
          else if (item.pembayaran?.toLowerCase() === "transfer") transfer += nominalBersih;
          jfs -= nominalBersih * 0.6;
          break;

        case "Delivery Fee":
          jfs += nominal;
          break;

        case "Pengeluaran":
          if (item.jenisPengeluaran === "Top Up Saldo JFS") {
            if (item.jenisPembayaran?.toLowerCase() === "cash") {
              kas -= nominal;
              jfs += nominal;
            } else if (item.jenisPembayaran?.toLowerCase() === "transfer") {
              transfer -= nominal;
              jfs += nominal;
            }
          } else {
            if (item.jenisPembayaran?.toLowerCase() === "cash") kas -= nominal;
            else if (item.jenisPembayaran?.toLowerCase() === "transfer") transfer -= nominal;
          }
          break;
      }
    });

    setInsights([
      { title: "Kas", value: kas, bgColor: "bg-green-500" },
      { title: "Saldo JFS", value: jfs, bgColor: "bg-blue-500" },
      { title: "Transfer", value: transfer, bgColor: "bg-yellow-500" },
    ]);

    const tanggal = new Date().toLocaleDateString("id-ID");
    setLaporan([{ tanggal, kas, jfs, transfer }]);
  };

  // --- DFOD ---
  const addDfod = (dfod) => {
    const newDfod = {
      ...dfod,
      id: Date.now(),
      jenis: "DFOD",
      jenisPembayaran: dfod.pembayaran,
      nominal: Number(dfod.nominal) || 0,
    };
    setDfodList((prev) => [...prev, newDfod]);
    const newAllInputs = [...allInputs, newDfod];
    setAllInputs(newAllInputs);
    updateDashboardAndLaporan(newAllInputs);
  };

  const updateDfod = (id, updatedDfod) => {
    const newDfodList = dfodList.map((d) =>
      d.id === id
        ? { ...d, ...updatedDfod, nominal: Number(updatedDfod.nominal) || d.nominal }
        : d
    );
    setDfodList(newDfodList);

    const newAllInputs = allInputs.map((item) =>
      item.id === id && item.jenis === "DFOD"
        ? { ...item, ...updatedDfod, nominal: Number(updatedDfod.nominal) || item.nominal }
        : item
    );
    setAllInputs(newAllInputs);
    updateDashboardAndLaporan(newAllInputs);
  };

  const deleteDfod = (id) => {
    setDfodList(dfodList.filter((d) => d.id !== id));
    const newAllInputs = allInputs.filter(
      (item) => !(item.id === id && item.jenis === "DFOD")
    );
    setAllInputs(newAllInputs);
    updateDashboardAndLaporan(newAllInputs);
  };

  // --- Outgoing (✅ versi dengan potongan harga) ---
  const addOutgoing = ({ nominal, potongan, pembayaran, tanggal, namaKaryawan, deskripsi }) => {
    const nominalNum = Number(nominal) || 0;
    const potonganNum = Number(potongan) || 0;

    // pastikan potongan tidak melebihi nominal
    if (potonganNum > nominalNum) {
      alert("Potongan harga tidak boleh lebih besar dari nominal outgoing");
      return;
    }

    const nominalBersih = nominalNum - potonganNum;

    const newOutgoing = {
      id: Date.now(),
      nominal: nominalNum,
      potongan: potonganNum,
      nominalBersih,
      pembayaran,
      tanggal: tanggal || new Date().toLocaleDateString("id-ID"),
      jenis: "Outgoing",
      jenisPembayaran: pembayaran,
      namaKaryawan: namaKaryawan || "-",
      deskripsi: deskripsi || "-",
    };

    setOutgoingList((prev) => [...prev, newOutgoing]);
    const newAllInputs = [...allInputs, newOutgoing];
    setAllInputs(newAllInputs);
    updateDashboardAndLaporan(newAllInputs);
  };

  const updateOutgoing = (id, updatedOutgoing) => {
    const nominalNum = Number(updatedOutgoing.nominal) || 0;
    const potonganNum = Number(updatedOutgoing.potongan) || 0;

    if (potonganNum > nominalNum) {
      alert("Potongan harga tidak boleh lebih besar dari nominal outgoing");
      return;
    }

    const nominalBersih = nominalNum - potonganNum;

    const newOutgoingList = outgoingList.map((o) =>
      o.id === id
        ? {
            ...o,
            ...updatedOutgoing,
            nominal: nominalNum,
            potongan: potonganNum,
            nominalBersih,
          }
        : o
    );
    setOutgoingList(newOutgoingList);

    const newAllInputs = allInputs.map((item) =>
      item.id === id && item.jenis === "Outgoing"
        ? {
            ...item,
            ...updatedOutgoing,
            nominal: nominalNum,
            potongan: potonganNum,
            nominalBersih,
          }
        : item
    );

    setAllInputs(newAllInputs);
    updateDashboardAndLaporan(newAllInputs);
  };

  const deleteOutgoing = (id) => {
    setOutgoingList(outgoingList.filter((o) => o.id !== id));
    const newAllInputs = allInputs.filter(
      (item) => !(item.id === id && item.jenis === "Outgoing")
    );
    setAllInputs(newAllInputs);
    updateDashboardAndLaporan(newAllInputs);
  };

  // --- Delivery Fee ---
  const addDeliveryFee = (amount) => {
    const nominal = Number(amount) || 0;
    const newFee = {
      id: Date.now(),
      nominal,
      jenis: "Delivery Fee",
      tanggal: new Date().toLocaleDateString("id-ID"),
    };
    setDeliveryFeeList((prev) => [...prev, newFee]);
    const newAllInputs = [...allInputs, newFee];
    setAllInputs(newAllInputs);
    updateDashboardAndLaporan(newAllInputs);
  };

  const updateDeliveryFee = (id, updatedAmount) => {
    const nominal = Number(updatedAmount) || 0;
    setDeliveryFeeList(
      deliveryFeeList.map((item) =>
        item.id === id ? { ...item, nominal } : item
      )
    );
    const newAllInputs = allInputs.map((item) =>
      item.id === id && item.jenis === "Delivery Fee"
        ? { ...item, nominal }
        : item
    );
    setAllInputs(newAllInputs);
    updateDashboardAndLaporan(newAllInputs);
  };

  const deleteDeliveryFee = (id) => {
    setDeliveryFeeList(deliveryFeeList.filter((item) => item.id !== id));
    const newAllInputs = allInputs.filter(
      (item) => !(item.id === id && item.jenis === "Delivery Fee")
    );
    setAllInputs(newAllInputs);
    updateDashboardAndLaporan(newAllInputs);
  };

  // --- Pengeluaran ---
  const addPengeluaran = (data) => {
    const nominal = Number(data.nominal) || 0;
    const newData = {
      ...data,
      id: Date.now(),
      jenis: "Pengeluaran",
      jenisPengeluaran: data.jenis,
      nominal,
    };
    setPengeluaranList((prev) => [newData, ...prev]);

    const newAllInputs = [...allInputs, newData];
    setAllInputs(newAllInputs);
    updateDashboardAndLaporan(newAllInputs);
  };

  const updatePengeluaran = (id, updatedData) => {
    const nominal = Number(updatedData.nominal) || 0;
    const newList = pengeluaranList.map((p) =>
      p.id === id ? { ...p, ...updatedData, nominal } : p
    );
    setPengeluaranList(newList);

    const newAllInputs = allInputs.map((item) =>
      item.id === id && item.jenis === "Pengeluaran"
        ? { ...item, ...updatedData, nominal }
        : item
    );
    setAllInputs(newAllInputs);
    updateDashboardAndLaporan(newAllInputs);
  };

  const deletePengeluaran = (id) => {
    setPengeluaranList(pengeluaranList.filter((p) => p.id !== id));
    const newAllInputs = allInputs.filter(
      (item) => !(item.id === id && item.jenis === "Pengeluaran")
    );
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
