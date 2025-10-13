import React, { useState } from "react";
import ManajemenAkunUI from "../components/ManajemenAkun";

export default function ManajemenAkunPage() {
  const [admins, setAdmins] = useState([
    { id: 1, username: "admin1", role: "Admin" },
    { id: 2, username: "admin2", role: "Admin" },
  ]);

  const [alert, setAlert] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ username: "", password: "" });
  const [changePassword, setChangePassword] = useState({ id: "", password: "" });

  // contoh user login sekarang
  const currentUser = { username: "superadmin", role: "Super Admin" };

  // Handler: tambah admin
  const handleAddAdmin = () => {
    if (newAdmin.password.length < 8) {
      setAlert({ type: "error", text: "Password minimal 8 karakter." });
      return;
    }

    const newData = {
      id: admins.length + 1,
      username: newAdmin.username,
      role: "Admin",
    };

    setAdmins([...admins, newData]);
    setAlert({ type: "success", text: "Akun admin berhasil ditambahkan!" });
    setNewAdmin({ username: "", password: "" });
    setShowAddModal(false);
  };

  // Handler: ubah password admin oleh super admin
  const handleChangePassword = () => {
    if (changePassword.password.length < 8) {
      setAlert({ type: "error", text: "Password minimal 8 karakter." });
      return;
    }

    setAlert({ type: "success", text: "Password admin berhasil diubah!" });
    setChangePassword({ id: "", password: "" });
    setShowChangeModal(false);
  };

  // Handler: ubah password akun sendiri
  const handleSelfPasswordChange = () => {
    if (changePassword.password.length < 8) {
      setAlert({ type: "error", text: "Password minimal 8 karakter." });
      return;
    }

    setAlert({ type: "success", text: "Password akun Anda berhasil diubah!" });
    setChangePassword({ id: "", password: "" });
  };

  return (
    <main className="flex-1 text-black p-6 min-h-screen">
      <ManajemenAkunUI
        currentUser={currentUser}
        admins={admins}
        alert={alert}
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
        showChangeModal={showChangeModal}
        setShowChangeModal={setShowChangeModal}
        newAdmin={newAdmin}
        setNewAdmin={setNewAdmin}
        changePassword={changePassword}
        setChangePassword={setChangePassword}
        handleAddAdmin={handleAddAdmin}
        handleChangePassword={handleChangePassword}
        handleSelfPasswordChange={handleSelfPasswordChange}
      />
    </main>
  );
}
