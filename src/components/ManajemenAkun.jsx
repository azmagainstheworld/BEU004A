import React from "react";
import ButtonModular from "./ButtonModular";

export default function ManajemenAkunUI({
  currentUser,
  admins,
  alert,
  showAddModal,
  setShowAddModal,
  showChangeModal,
  setShowChangeModal,
  newAdmin,
  setNewAdmin,
  changePassword,
  setChangePassword,
  handleAddAdmin,
  handleChangePassword,
  handleSelfPasswordChange,
}) {
  return (
    <div className="p-6 w-full">
      {/* Judul */}
      <h2 className="text-2xl font-bold mb-6">Manajemen Akun</h2>

      {/* Alert */}
      {alert && (
        <div
          className={`mb-4 p-3 rounded-lg text-white ${
            alert.type === "error" ? "bg-red-500" : "bg-green-600"
          }`}
        >
          {alert.text}
        </div>
      )}

      {/* Tombol Tambah Admin */}
      {currentUser.role === "Super Admin" && (
        <div className="mb-6">
          <ButtonModular variant="success" onClick={() => setShowAddModal(true)}>
            + Tambah Admin
          </ButtonModular>
        </div>
      )}

      {/* Tabel Admin */}
      <div className="bg-white shadow rounded-lg p-4 overflow-x-auto">
        <table className="w-full border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-[#EDFFEC]">
              <th className="text-left p-2">No</th>
              <th className="text-left p-2">Username</th>
              <th className="text-left p-2">Role</th>
              {currentUser.role === "Super Admin" && (
                <th className="text-center p-2">Aksi</th>
              )}
            </tr>
          </thead>
          <tbody>
            {admins.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-3 text-gray-500">
                  Belum ada admin terdaftar
                </td>
              </tr>
            )}
            {admins.map((a, index) => (
              <tr key={a.id} className="border-t">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{a.username}</td>
                <td className="p-2">{a.role}</td>
                {currentUser.role === "Super Admin" && (
                  <td className="p-2 text-center">
                    <ButtonModular
                      variant="warning"
                      onClick={() => {
                        setChangePassword({ id: a.id, password: "" });
                        setShowChangeModal(true);
                      }}
                    >
                      Ubah Password
                    </ButtonModular>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ubah Password Sendiri */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-3">Ubah Password Akun Sendiri</h3>
        <div className="flex gap-4">
          <input
            type="password"
            placeholder="Password baru"
            className="border rounded-lg p-2 flex-1"
            value={changePassword.password}
            onChange={(e) =>
              setChangePassword({ ...changePassword, password: e.target.value })
            }
          />
          <ButtonModular variant="success" onClick={handleSelfPasswordChange}>
            Simpan
          </ButtonModular>
        </div>
      </div>

      {/* Modal Tambah Admin */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[400px] shadow-lg">
            <h3 className="text-lg font-bold mb-4">Tambah Admin Baru</h3>
            <div className="mb-3">
              <label className="block text-sm">Username</label>
              <input
                type="text"
                className="border rounded-lg w-full p-2"
                value={newAdmin.username}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, username: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm">Password</label>
              <input
                type="password"
                className="border rounded-lg w-full p-2"
                value={newAdmin.password}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, password: e.target.value })
                }
              />
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <ButtonModular variant="secondary" onClick={() => setShowAddModal(false)}>
                Batal
              </ButtonModular>
              <ButtonModular variant="primary" onClick={handleAddAdmin}>
                Simpan
              </ButtonModular>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ubah Password Admin */}
      {showChangeModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[400px] shadow-lg">
            <h3 className="text-lg font-bold mb-4">Ubah Password Admin</h3>
            <div className="mb-3">
              <label className="block text-sm">Password Baru</label>
              <input
                type="password"
                className="border rounded-lg w-full p-2"
                value={changePassword.password}
                onChange={(e) =>
                  setChangePassword({ ...changePassword, password: e.target.value })
                }
              />
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <ButtonModular variant="secondary" onClick={() => setShowChangeModal(false)}>
                Batal
              </ButtonModular>
              <ButtonModular variant="primary" onClick={handleChangePassword}>
                Simpan
              </ButtonModular>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
