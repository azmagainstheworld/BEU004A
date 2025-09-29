// src/context/KaryawanContext.jsx
import React, { createContext, useContext, useState } from "react";

const KaryawanContext = createContext();

export const KaryawanProvider = ({ children }) => {
  const [karyawanList, setKaryawanList] = useState([]);

  const addKaryawan = (data) => {
    setKaryawanList((prev) => [...prev, { ...data, id: Date.now() }]);
  };

  const updateKaryawan = (id, newData) => {
    setKaryawanList((prev) =>
      prev.map((k) => (k.id === id ? { ...k, ...newData } : k))
    );
  };

  const deleteKaryawan = (id) => {
    setKaryawanList((prev) => prev.filter((k) => k.id !== id));
  };

  return (
    <KaryawanContext.Provider
      value={{ karyawanList, setKaryawanList, addKaryawan, updateKaryawan, deleteKaryawan }}
    >
      {children}
    </KaryawanContext.Provider>
  );
};

// hook utama
export const useKaryawan = () => useContext(KaryawanContext);

// alias supaya kompatibel (biar PresensiContext nggak error lagi)
export const useKaryawanContext = () => useContext(KaryawanContext);

export default KaryawanContext;
