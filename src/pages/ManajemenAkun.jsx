import React, { useState } from "react";
import ManajemenAkunUI from "../components/ManajemenAkun";

export default function ManajemenAkunPage() {
  const [superAdmin] = useState({
    id: 1,
    username: "Super Admin",
    email: "superadmin@company.com",
    role: "Super Admin",
  });

  const [adminList, setAdminList] = useState([
    { id: 2, username: "Admin Gudang", email: "gudang@company.com", role: "Admin" },
    { id: 3, username: "Admin Keuangan", email: "finance@company.com", role: "Admin" },
  ]);

  const [modalType, setModalType] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // === Tambah Admin ===
  const handleAddAdmin = () => {
    setFormData({ username: "", email: "", password: "", confirmPassword: "" });
    setModalType("add");
  };

  // === Edit Password ===
  const handleEditPassword = (admin) => {
    setSelectedAdmin(admin);
    setFormData({
      username: admin.username,
      email: admin.email,
      password: "",
      confirmPassword: "",
    });
    setModalType("edit");
  };

  // === Hapus Admin ===
  const handleDeleteAdmin = (admin) => {
    setSelectedAdmin(admin);
    setModalType("delete");
  };

  // === Konfirmasi Hapus ===
  const handleConfirmDelete = () => {
    if (selectedAdmin) {
      setAdminList((prev) => prev.filter((a) => a.id !== selectedAdmin.id));
    }
    setSelectedAdmin(null);
    setModalType(null);
  };

  // === Konfirmasi Tambah ===
  const handleConfirmAdd = () => {
    const { username, email, password, confirmPassword } = formData;
    if (!username || !email || !password || !confirmPassword) {
      alert("Semua field wajib diisi!");
      return;
    }
    if (password !== confirmPassword) {
      alert("Konfirmasi password tidak cocok!");
      return;
    }

    const newAdmin = {
      id: Date.now(),
      username,
      email,
      role: "Admin",
    };
    setAdminList((prev) => [...prev, newAdmin]);
    setModalType(null);
  };

  // === Konfirmasi Edit Password ===
  const handleConfirmEdit = () => {
    const { password, confirmPassword } = formData;
    if (!password || !confirmPassword) {
      alert("Field password tidak boleh kosong!");
      return;
    }
    if (password !== confirmPassword) {
      alert("Konfirmasi password tidak cocok!");
      return;
    }
    alert(`Password untuk ${selectedAdmin.username} berhasil diubah.`);
    setModalType(null);
  };

  return (
    <div className="flex-1 bg-[#EDFFEC] p-6 min-h-screen text-gray-800">
      <h1 className="text-2xl font-bold mb-6">Manajemen Akun</h1>

      <ManajemenAkunUI
        superAdmin={superAdmin}
        adminList={adminList}
        modalType={modalType}
        selectedAdmin={selectedAdmin}
        formData={formData}
        onFormChange={setFormData}
        onAddAdmin={handleAddAdmin}
        onEditPassword={handleEditPassword}
        onDeleteAdmin={handleDeleteAdmin}
        onConfirmDelete={handleConfirmDelete}
        onConfirmAdd={handleConfirmAdd}
        onConfirmEdit={handleConfirmEdit}
        onCloseModal={() => setModalType(null)}
      />
    </div>
  );
}
