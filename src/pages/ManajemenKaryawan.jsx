import React, { useState, useEffect } from "react";
import ManajemenKaryawanComponent from "../components/ManajemenKaryawan";
import { useKaryawanContext } from "../context/KaryawanContext";
import jwt_decode from "jwt-decode";

function ManajemenKaryawan() {
  const { karyawanList, addKaryawan, updateKaryawan, deleteKaryawan } = useKaryawanContext();
  const [form, setForm] = useState({ nama_karyawan: "", ttl: "", jenis_kelamin: "", alamat: "" });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwt_decode(token); 

      setRole(decoded.role);
    }
  }, []);

  // jika bukan Super Admin, tampilkan pesan
  if (role !== "Super Admin") {
    return (
      <div className="p-6 text-center text-red-500">
        Anda tidak memiliki akses ke halaman ini
      </div>
    );
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateKaryawan(editingId, form);
      setEditingId(null);
    } else {
      addKaryawan(form);
    }
    setForm({ nama_karyawan: "", ttl: "", jenis_kelamin: "", alamat: "" });
    setShowForm(false);
  };

  const handleEdit = (id_karyawan) => {
    const data = karyawanList.find((k) => k.id_karyawan === id_karyawan);
    setForm(data);
    setEditingId(id_karyawan);
    setShowForm(true);
  };

  const handleDelete = (id_karyawan) => {
    if (window.confirm("Yakin ingin menghapus karyawan ini?")) {
      deleteKaryawan(id_karyawan);
      if (editingId === id_karyawan) setEditingId(null);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <ManajemenKaryawanComponent
      karyawan={karyawanList}
      form={form}
      showForm={showForm}
      editingId={editingId}
      today={today}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
      setShowForm={setShowForm}
    />
  );
}

export default ManajemenKaryawan;
