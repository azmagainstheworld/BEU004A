import React, { useState } from "react";
import ManajemenKaryawanComponent from "../components/ManajemenKaryawan";
import { useKaryawanContext } from "../context/KaryawanContext";

function ManajemenKaryawan() {
  const { karyawanList, setKaryawanList } = useKaryawanContext();
  const [form, setForm] = useState({ nama: "", ttl: "", jk: "", alamat: "" });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setKaryawanList(
        karyawanList.map((k) =>
          k.id === editingId ? { ...form, id: editingId } : k
        )
      );
      setEditingId(null);
    } else {
      setKaryawanList([...karyawanList, { ...form, id: Date.now() }]);
    }
    setForm({ nama: "", ttl: "", jk: "", alamat: "" });
    setShowForm(false);
  };

  const handleEdit = (id) => {
    const data = karyawanList.find((k) => k.id === id);
    setForm(data);
    setEditingId(id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Yakin ingin menghapus karyawan ini?")) {
      setKaryawanList(karyawanList.filter((k) => k.id !== id));
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
