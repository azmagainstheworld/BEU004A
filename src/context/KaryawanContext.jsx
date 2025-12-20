// src/context/KaryawanContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const KaryawanContext = createContext();

export const KaryawanProvider = ({ children }) => {
  const [karyawanList, setKaryawanList] = useState([]);

  const token = localStorage.getItem("token");

  // --- FETCH ALL KARYAWAN ---
  const fetchKaryawan = async () => {
    if (!token) return;
    try {
      const res = await axios.get(
        "https://beu004a-backend-production.up.railway.app/beu004a/users/karyawan",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setKaryawanList(res.data);
    } catch (err) {
      console.error("Fetch Karyawan Error:", err);
    } 
  };

  // --- CREATE KARYAWAN ---
  const addKaryawan = async (data) => {
    try {
      const res = await axios.post(
        "https://beu004a-backend-production.up.railway.app/beu004a/users/karyawan/create",
        {
          nama_karyawan: data.nama_karyawan,
          jenis_kelamin: data.jenis_kelamin,
          ttl: data.ttl,
          alamat: data.alamat,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setKaryawanList((prev) => [
        ...prev,
        {
          id_karyawan: res.data.id,
          ...data,
        },
      ]);
    } catch (err) {
      console.error("Add Karyawan Error:", err);
    }
  };

  // --- UPDATE KARYAWAN ---
  const updateKaryawan = async (id_karyawan, newData) => {
    try {
      await axios.put(
        "https://beu004a-backend-production.up.railway.app/beu004a/users/karyawan/edit",
        { id_karyawan, ...newData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setKaryawanList((prev) =>
        prev.map((k) =>
          k.id_karyawan === id_karyawan ? { ...k, ...newData } : k
        )
      );
    } catch (err) {
      console.error("Update Karyawan Error:", err);
    }
  };

  // --- DELETE KARYAWAN ---
  const deleteKaryawan = async (id_karyawan) => {
    try {
      await axios.put(
        "https://beu004a-backend-production.up.railway.app/beu004a/users/karyawan/delete",
        { id_karyawan }, // <-- body
        { headers: { Authorization: `Bearer ${token}` } } // <-- headers 
      );

      setKaryawanList((prev) =>
        prev.filter((k) => k.id_karyawan !== id_karyawan)
      );
    } catch (err) {
      console.error("Delete Karyawan Error:", err);
    }
  };


  // --- FETCH KARYAWAN ON MOUNT ---
  useEffect(() => {
    fetchKaryawan();
  }, [token]);

  return (
    <KaryawanContext.Provider
      value={{
        karyawanList,
        fetchKaryawan,
        addKaryawan,
        updateKaryawan,
        deleteKaryawan,
      }}
    >
      {children}
    </KaryawanContext.Provider>
  );
};

export const useKaryawan = () => useContext(KaryawanContext);
export const useKaryawanContext = () => useContext(KaryawanContext);

export default KaryawanContext;
