import React from "react";
import ButtonModular from "./ButtonModular";
import { Lock, Trash2, UserPlus } from "lucide-react";

export default function ManajemenAkunUI({
  superAdmin,
  adminList,
  modalType,
  selectedAdmin,
  formData,
  errors,                // 🆕 error message dari pages
  passwordStrength,      // 🆕 indikator kekuatan password
  onFormChange,
  onPasswordChange,      // 🆕 handler password khusus
  onAddAdmin,
  onEditPassword,
  onDeleteAdmin,
  onConfirmDelete,
  onConfirmAdd,
  onConfirmEdit,
  onCloseModal,
}) {
  // ======== Warna strength password ========
  const passwordColor =
    passwordStrength === "Kuat"
      ? "text-green-600"
      : passwordStrength === "Sedang"
      ? "text-yellow-500"
      : passwordStrength === "Lemah"
      ? "text-red-600"
      : "text-gray-500";

  return (
    <div className="space-y-6">

      {/* === Profil Super Admin === */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Profil Super Admin
        </h2>
        <div className="space-y-2">
          <p><span className="font-semibold">Username:</span> {superAdmin.username}</p>
          <p><span className="font-semibold">Email:</span> {superAdmin.email}</p>
          <p><span className="font-semibold">Role:</span> {superAdmin.role}</p>
        </div>
        <div className="mt-4">
          <ButtonModular variant="warning" onClick={() => onEditPassword(superAdmin)}>
            <Lock className="inline mr-2 w-4 h-4" /> Ubah Password
          </ButtonModular>
        </div>
      </div>

      {/* === Daftar Admin === */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Daftar Admin</h2>
          <ButtonModular variant="success" onClick={onAddAdmin}>
            <UserPlus className="inline mr-2 w-4 h-4" /> Tambah Admin
          </ButtonModular>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-green-100 text-left">
              <th className="p-3">No</th>
              <th className="p-3">Username</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {adminList.map((admin, index) => (
              <tr key={admin.id} className="border-t hover:bg-green-50">
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{admin.username}</td>
                <td className="p-3">{admin.email}</td>
                <td className="p-3">{admin.role}</td>
                <td className="p-3 text-center space-x-2">
                  <ButtonModular variant="warning" onClick={() => onEditPassword(admin)}>
                    <Lock className="inline mr-1 w-4 h-4" /> Ubah Password
                  </ButtonModular>
                  <ButtonModular variant="danger" onClick={() => onDeleteAdmin(admin)}>
                    <Trash2 className="inline mr-1 w-4 h-4" /> Hapus
                  </ButtonModular>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================================================================== */}
      {/* ========================= MODAL TAMBAH ADMIN ===================== */}
      {/* ================================================================== */}

      {modalType === "add" && (
        <>
          <div className="fixed inset-0 z-[9998]">
            <div className="absolute inset-0 backdrop-blur-md bg-black/10" />
          </div>

          <div className="fixed inset-0 flex items-center justify-center z-[9999]">
            <div className="bg-white rounded-xl shadow-xl p-6 w-[400px] space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">Tambah Admin Baru</h2>

              {/* USERNAME */}
              <div>
                <input
                  type="text"
                  placeholder="Username"
                  className={`w-full border rounded-lg p-2 ${
                    errors.username ? "border-red-500" : ""
                  }`}
                  value={formData.username}
                  onChange={(e) =>
                    onFormChange({ ...formData, username: e.target.value })
                  }
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                )}
              </div>

              {/* EMAIL */}
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  className={`w-full border rounded-lg p-2 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  value={formData.email}
                  onChange={(e) =>
                    onFormChange({ ...formData, email: e.target.value })
                  }
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* PASSWORD */}
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  className={`w-full border rounded-lg p-2 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  value={formData.password}
                  onChange={(e) => onPasswordChange(e.target.value)}
                />

                {passwordStrength && (
                  <p className={`text-sm mt-1 ${passwordColor}`}>
                    Password: {passwordStrength}
                  </p>
                )}

                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* KONFIRMASI PASSWORD */}
              <div>
                <input
                  type="password"
                  placeholder="Konfirmasi Password"
                  className={`w-full border rounded-lg p-2 ${
                    errors.confirmPassword ? "border-red-500" : ""
                  }`}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    onFormChange({ ...formData, confirmPassword: e.target.value })
                  }
                />

                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <ButtonModular variant="warning" onClick={onCloseModal}>
                  Batal
                </ButtonModular>
                <ButtonModular variant="success" onClick={onConfirmAdd}>
                  Simpan
                </ButtonModular>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ================================================================== */}
      {/* ======================== MODAL EDIT PASSWORD ====================== */}
      {/* ================================================================== */}

      {modalType === "edit" && (
        <>
          <div className="fixed inset-0 z-[9998]">
            <div className="absolute inset-0 backdrop-blur-md bg-black/10" />
          </div>

          <div className="fixed inset-0 flex items-center justify-center z-[9999]">
            <div className="bg-white rounded-xl shadow-xl p-6 w-[400px] space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">Ubah Password</h2>

              <p>
                Ubah password untuk{" "}
                <span className="font-semibold">{selectedAdmin?.username}</span>
              </p>

              {/* PASSWORD BARU */}
              <div>
                <input
                  type="password"
                  placeholder="Password Baru"
                  className={`w-full border rounded-lg p-2 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  value={formData.password}
                  onChange={(e) => onPasswordChange(e.target.value)}
                />

                {passwordStrength && (
                  <p className={`text-sm mt-1 ${passwordColor}`}>
                    Password: {passwordStrength}
                  </p>
                )}

                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* KONFIRMASI PASSWORD */}
              <div>
                <input
                  type="password"
                  placeholder="Konfirmasi Password Baru"
                  className={`w-full border rounded-lg p-2 ${
                    errors.confirmPassword ? "border-red-500" : ""
                  }`}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    onFormChange({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                />

                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <ButtonModular variant="warning" onClick={onCloseModal}>
                  Batal
                </ButtonModular>
                <ButtonModular variant="success" onClick={onConfirmEdit}>
                  Simpan
                </ButtonModular>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ========================= MODAL DELETE ========================== */}

      {modalType === "delete" && (
        <>
          <div className="fixed inset-0 z-[9998]">
            <div className="absolute inset-0 backdrop-blur-md bg-black/10" />
          </div>

          <div className="fixed inset-0 flex items-center justify-center z-[9999]">
            <div className="bg-white rounded-xl shadow-xl p-6 w-[400px] space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Konfirmasi Penghapusan
              </h2>

              <p>
                Apakah Anda yakin ingin menghapus{" "}
                <span className="font-semibold">{selectedAdmin?.username}</span>?
              </p>

              <div className="flex justify-end space-x-2 mt-4">
                <ButtonModular variant="warning" onClick={onCloseModal}>
                  Batal
                </ButtonModular>
                <ButtonModular variant="danger" onClick={onConfirmDelete}>
                  Hapus
                </ButtonModular>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
