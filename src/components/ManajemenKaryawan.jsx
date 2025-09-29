import React, { useState } from "react";
import ButtonModular from "../components/ButtonModular";
import { useKaryawan } from "../context/KaryawanContext";

export default function ManajemenKaryawan() {
  const { karyawanList, addKaryawan, updateKaryawan, deleteKaryawan } = useKaryawan();
  const [form, setForm] = useState({ nama: "", ttl: "", jk: "", alamat: "" });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateKaryawan(editingId, form);
      setEditingId(null);
    } else {
      addKaryawan(form);
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
    if (confirm("Yakin ingin menghapus karyawan ini?")) {
      deleteKaryawan(id);
      if (editingId === id) setEditingId(null);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manajemen Karyawan</h1>
      <div className="mb-6">
        <ButtonModular
          variant="success"
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
          }}
        >
          Tambah Karyawan
        </ButtonModular>
      </div>

      {/* tabel bisa discroll horizontal */}
      <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
        <table className="w-full border-collapse min-w-[1000px] text-center">
          <thead>
            <tr className="bg-[#E1F1DD] text-black">
              <th className="p-2 w-24">No</th>
              <th className="p-2 min-w-[250px]">Nama</th>
              <th className="p-2 min-w-[160px]">Tanggal Lahir</th>
              <th className="p-2 min-w-[160px]">Jenis Kelamin</th>
              <th className="p-2 min-w-[300px]">Alamat</th>
              <th className="p-2 w-48">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {karyawanList.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  Belum ada data karyawan
                </td>
              </tr>
            )}
            {karyawanList.map((k, index) => (
              <tr key={k.id} className="border-t">
                <td className="p-2 text-center whitespace-nowrap">{index + 1}</td>
                <td className="p-2 text-left whitespace-nowrap">{k.nama}</td>
                <td className="p-2 text-center whitespace-nowrap">{k.ttl}</td>
                <td className="p-2 text-center whitespace-nowrap">{k.jk}</td>
                <td className="p-2 text-left whitespace-nowrap">{k.alamat}</td>
                <td className="p-2 flex justify-center gap-2 whitespace-nowrap">
                  <ButtonModular
                    variant="warning"
                    onClick={() => handleEdit(k.id)}
                  >
                    Edit
                  </ButtonModular>
                  <ButtonModular
                    variant="danger"
                    onClick={() => handleDelete(k.id)}
                  >
                    Hapus
                  </ButtonModular>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[400px]">
            <h2 className="text-lg font-bold mb-4">
              {editingId ? "Edit Karyawan" : "Tambah Karyawan"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="nama"
                value={form.nama}
                onChange={handleChange}
                placeholder="Nama"
                required
                className="w-full border rounded-lg p-2 mt-1"
              />
              <input
                type="date"
                name="ttl"
                value={form.ttl}
                onChange={handleChange}
                max={today}
                required
                className="w-full border rounded-lg p-2 mt-1"
              />
              <select
                name="jk"
                value={form.jk}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-2 mt-1"
              >
                <option value="">-- Pilih Jenis Kelamin --</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
              <textarea
                name="alamat"
                value={form.alamat}
                onChange={handleChange}
                placeholder="Alamat"
                required
                className="w-full border rounded-lg p-2 mt-1"
              />
              <div className="flex justify-end gap-2 pt-4">
                <ButtonModular
                  variant="default"
                  onClick={() => setShowForm(false)}
                >
                  Batal
                </ButtonModular>
                <ButtonModular type="submit" variant="success">
                  Simpan
                </ButtonModular>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
