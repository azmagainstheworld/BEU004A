import React, { useState, useEffect } from "react";
import ManajemenGaji from "../components/ManajemenGaji";
import { useKaryawanContext } from "../context/KaryawanContext";
import jwt_decode from "jwt-decode";

const ManajemenGajiPages = () => {
  const { karyawanList } = useKaryawanContext();
  const [loading, setLoading] = useState(true);

  const [manajemenGaji, setManajemenGaji] = useState([]);
  const [editingRow, setEditingRow] = useState({});
  const [errors, setErrors] = useState({});
  const [tempData, setTempData] = useState({});
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwt_decode(token);
        setRole(decoded.role);
      } catch (err) {
        console.error("Token tidak valid");
      }
    }
  }, []); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "https://beu004a-backend-production.up.railway.app/beu004a/users/manajemen-gaji",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.ok) throw new Error("Gagal fetch manajemen gaji");
        const data = await response.json();

        setManajemenGaji(
          karyawanList.map((k) => {
            const found = data.find((m) => m.id_karyawan === k.id_karyawan);
            return found || { id_karyawan: k.id_karyawan, upah_perhari: 0, bonus: 0 };
          })
        );
        setLoading(false);
      } catch (err) {
        console.error("Gagal fetch manajemen gaji:", err);
        setLoading(false);
      }
    };
    if (karyawanList.length > 0) fetchData();
  }, [karyawanList]);

  // Handler untuk sinkronisasi input
  const handleChange = (id, field, value) => {
    setTempData((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));

    // Validasi saat mengetik (khusus upah)
    if (field === "upah_perhari") {
      const numValue = Number(value);
      if (numValue < 1000) {
        setErrors((prev) => ({ ...prev, [id]: "Masukkan nominal minimal 1.000" }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[id];
          return newErrors;
        });
      }
    }
  };

  const handleEdit = (id) => {
    setEditingRow((prev) => ({ ...prev, [id]: true }));
    const row = manajemenGaji.find((m) => m.id_karyawan === id);
    setTempData((prev) => ({
      ...prev,
      [id]: {
        upah_perhari: row.upah_perhari?.toString() || "",
        bonus: row.bonus?.toString() || "0",
      },
    }));
  };

  const handleSave = async (id) => {
    const row = tempData[id];
    const upah = Number(row?.upah_perhari || 0);
    const bonus = Number(row?.bonus || 0);

    // 1. Validasi Akhir sebelum Fetch
    if (!row || upah < 1000) {
      setErrors((prev) => ({ ...prev, [id]: "Masukkan nominal minimal 1.000" }));
      return false; // Gagal validasi
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://beu004a-backend-production.up.railway.app/beu004a/users/manajemen-gaji", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id_karyawan: id, upah_perhari: upah, bonus: bonus }),
      });

      if (response.ok) {
        // Update State Utama
        setManajemenGaji((prev) =>
          prev.map((m) => (m.id_karyawan === id ? { ...m, upah_perhari: upah, bonus: bonus } : m))
        );

        // Reset Mode Edit
        setEditingRow((prev) => ({ ...prev, [id]: false }));
        setTempData((prev) => {
          const n = { ...prev };
          delete n[id];
          return n;
        });

        return true; 
      } else {
        console.error("Gagal simpan ke server");
        return false;
      }
    } catch (err) {
      console.error("SAVE ERROR:", err);
      return false;
    }
  };

  const handleCancel = (id) => {
    setEditingRow((prev) => ({ ...prev, [id]: false }));
    setTempData((prev) => {
      const n = { ...prev };
      delete n[id];
      return n;
    });
    setErrors((prev) => {
      const n = { ...prev };
      delete n[id];
      return n;
    });
  };

  if (loading && karyawanList.length === 0) {
    return <div className="p-6 text-slate-500">Memuat data manajemen gaji...</div>;
  }

  if (role !== "Super Admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <h2 className="text-2xl font-bold text-red-600">Akses Ditolak</h2>
        <p className="text-slate-500">Halaman ini hanya untuk Super Admin.</p>
      </div>
    );
  }

  return (
    <main className="flex-1 bg-[#F8FAFC] p-6 min-h-screen">
      <div className="max-w-full">
        <header className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Manajemen Gaji</h2>
          <p className="text-slate-500 text-sm">Atur upah harian dan bonus untuk setiap karyawan</p>
        </header>

        <ManajemenGaji
          karyawanList={karyawanList}
          manajemenGaji={manajemenGaji}
          tempData={tempData}
          editingRow={editingRow}
          errors={errors}
          onEdit={handleEdit}
          onChange={handleChange}
          onSave={handleSave} 
          onCancel={handleCancel}
        />
      </div>
    </main>
  );
};

export default ManajemenGajiPages;