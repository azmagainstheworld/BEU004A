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

  const [errors, setErrors] = useState({}); // <= NEW
  const [passwordStrength, setPasswordStrength] = useState("");

  // ==================== VALIDASI PASSWORD ====================
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

  const getPasswordStrength = (password) => {
    if (password.length < 1) return "";
    if (password.length < 8) return "Lemah";
    if (strongPasswordRegex.test(password)) return "Kuat";
    return "Sedang";
  };

  const handlePasswordInput = (value) => {
    setFormData((prev) => ({ ...prev, password: value }));
    setPasswordStrength(getPasswordStrength(value));
  };

  // ==================== TAMBAH ADMIN ====================
  const handleAddAdmin = () => {
    setFormData({ username: "", email: "", password: "", confirmPassword: "" });
    setErrors({});
    setPasswordStrength("");
    setModalType("add");
  };

  // ==================== EDIT PASSWORD ====================
  const handleEditPassword = (admin) => {
    setSelectedAdmin(admin);
    setFormData({
      username: admin.username,
      email: admin.email,
      password: "",
      confirmPassword: "",
    });
    setErrors({});
    setPasswordStrength("");
    setModalType("edit");
  };

  // ==================== HAPUS ADMIN ====================
  const handleDeleteAdmin = (admin) => {
    setSelectedAdmin(admin);
    setModalType("delete");
  };

  const handleConfirmDelete = () => {
    if (selectedAdmin) {
      setAdminList((prev) => prev.filter((a) => a.id !== selectedAdmin.id));
    }
    setSelectedAdmin(null);
    setModalType(null);
  };

  // ==================== VALIDASI FORM ADD ====================
  const validateAddForm = () => {
    const newErrors = {};
    const { username, email, password, confirmPassword } = formData;

    if (!username.trim()) newErrors.username = "Username wajib diisi";
    if (!email.trim()) newErrors.email = "Email wajib diisi";
    if (!password) newErrors.password = "Password wajib diisi";
    if (!confirmPassword) newErrors.confirmPassword = "Konfirmasi password wajib diisi";

    if (password && passwordStrength === "Lemah")
      newErrors.password = "Password terlalu lemah. Gunakan kombinasi yang kuat.";

    if (password !== confirmPassword)
      newErrors.confirmPassword = "Konfirmasi password tidak cocok";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ==================== KONFIRMASI TAMBAH ====================
  const handleConfirmAdd = () => {
    if (!validateAddForm()) return;

    const { username, email } = formData;

    const newAdmin = {
      id: Date.now(),
      username,
      email,
      role: "Admin",
    };

    setAdminList((prev) => [...prev, newAdmin]);
    setModalType(null);
  };

  // ==================== VALIDASI EDIT PASSWORD ====================
  const validateEditForm = () => {
    const newErrors = {};
    const { password, confirmPassword } = formData;

    if (!password) newErrors.password = "Password wajib diisi";
    if (!confirmPassword) newErrors.confirmPassword = "Konfirmasi wajib diisi";

    if (password && passwordStrength === "Lemah")
      newErrors.password = "Password terlalu lemah";

    if (password !== confirmPassword)
      newErrors.confirmPassword = "Konfirmasi password tidak cocok";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ==================== KONFIRMASI EDIT ====================
  const handleConfirmEdit = () => {
    if (!validateEditForm()) return;

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
        errors={errors} // <= NEW
        passwordStrength={passwordStrength}
        onPasswordChange={handlePasswordInput}
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
