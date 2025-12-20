// src/context/PresensiContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useKaryawanContext } from "./KaryawanContext";

const PresensiContext = createContext();

export const PresensiProvider = ({ children }) => {
  const { karyawanList } = useKaryawanContext();

  // presensiList: array objek { idKaryawan, presensi: { "YYYY-MM-DD": "hadir"/"tidak" }, locked: { "YYYY-MM-DD": true/false } }
  const [presensiList, setPresensiList] = useState([]);

  // sinkronisasi otomatis setiap kali daftar karyawan berubah
  useEffect(() => {
    setPresensiList((prev) => {
      // buat map lama biar gampang cek
      const prevMap = new Map(prev.map((p) => [p.idKaryawan, p]));

      // pastikan semua karyawan dari karyawanList ada di presensiList
      const updated = karyawanList.map((k) => {
        if (prevMap.has(k.id)) {
          return prevMap.get(k.id); // pakai data lama kalau ada
        }
        return { idKaryawan: k.id, presensi: {}, locked: {} }; // buat baru kalau ga ada
      });

      return updated;
    });
  }, [karyawanList]);

  const updatePresensi = (idKaryawan, tanggal, status) => {
    setPresensiList((prev) =>
      prev.map((p) =>
        p.idKaryawan === idKaryawan
          ? {
              ...p,
              presensi: { ...p.presensi, [tanggal]: status },
              locked: { ...p.locked, [tanggal]: true },
            }
          : p
      )
    );
  };

  const unlockPresensi = (idKaryawan, tanggal) => {
    setPresensiList((prev) =>
      prev.map((p) =>
        p.idKaryawan === idKaryawan
          ? {
              ...p,
              locked: { ...p.locked, [tanggal]: false },
            }
          : p
      )
    );
  };

  return (
    <PresensiContext.Provider
      value={{
        presensiList,
        setPresensiList,
        updatePresensi,
        unlockPresensi,
      }}
    >
      {children}
    </PresensiContext.Provider>
  );
};


export const usePresensiContext = () => useContext(PresensiContext);
export const usePresensi = () => useContext(PresensiContext); // alias

export default PresensiContext;
