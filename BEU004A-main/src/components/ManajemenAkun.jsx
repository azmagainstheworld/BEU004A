import React, { useEffect } from "react";
import ButtonModular from "./ButtonModular";
import { Lock, Trash2, UserPlus, ShieldCheck, Mail, User, History, KeyRound } from "lucide-react";
import $ from "jquery";
import "datatables.net-dt";
import "jquery-highlight/jquery.highlight.js";
import "datatables.net-dt/css/dataTables.dataTables.css";
import "../index.css";

export default function ManajemenAkunUI({
  superAdmin,
  adminList,
  modalType,
  selectedAdmin,
  formData,
  errors,
  passwordStrength,
  onFormChange,
  onPasswordChange,
  onAddAdmin,
  onEditPassword,
  onDeleteAdmin,
  onConfirmDelete,
  onConfirmAdd,
  onConfirmEdit,
  onCloseModal,
}) {

  const getPasswordColor = () => {
    switch (passwordStrength) {
      case "Lemah": return "text-rose-500";
      case "Sedang": return "text-amber-500";
      case "Kuat": return "text-emerald-500";
      default: return "text-slate-400";
    }
  };
  const passwordColor = getPasswordColor();
  
  useEffect(() => {
      const tableId = "#adminTable";
      let table;

      const renderTable = () => {
        if ($.fn.DataTable.isDataTable(tableId)) {
          table = $(tableId).DataTable();
          table.clear();

          if (adminList && adminList.length > 0) {
            const rows = adminList.map((admin, index) => {
              const adminData = JSON.stringify(admin).replace(/'/g, "&apos;");

              return [
                index + 1,
                `<div class="font-medium text-slate-900">${admin.username}</div>`,
                `<div class="text-slate-600">${admin.email}</div>`,
                `<span class="px-3 py-1 rounded-full text-xs font-semibold ${
                  admin.roles === "Super Admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                }">${admin.roles}</span>`,
                `<div class="flex justify-center gap-2">
                  <button 
                    class="btn-edit-pw px-5 py-2.5 rounded-lg font-semibold text-sm bg-amber-500 text-white transition-all active:scale-95" 
                    data-admin='${adminData}'
                  >
                    Ubah Password
                  </button>
                  <button 
                    class="btn-delete-admin px-5 py-2.5 rounded-lg font-semibold text-sm bg-rose-500 text-white transition-all active:scale-95" 
                    data-admin='${adminData}'
                  >
                    Hapus
                  </button>
                </div>`
              ];
            });
            table.rows.add(rows);
          }
          table.draw(false);
        } else {
          table = $(tableId).DataTable({
            paging: true,
            searching: true,
            info: true,
            ordering: true,
            scrollX: true,
            autoWidth: false,
            pageLength: 10,
            dom: '<"flex justify-between items-center mb-4"lf>rt<"flex justify-between items-center mt-4"ip>',
            language: { search: "Cari:", emptyTable: "Tidak ada data akun" }
          });

          table.on("draw.dt", function () {
            const body = $(table.table().body());
            const searchValue = table.search();
            body.unhighlight();
            if (searchValue) body.highlight(searchValue);
          });

          renderTable();
        }
      };

      const timer = setTimeout(() => {
        renderTable();

        $(tableId).off("click", ".btn-edit-pw").on("click", ".btn-edit-pw", function() {
          const adminData = $(this).data("admin");
          if (adminData) {
            onEditPassword({ 
              id: adminData.id_user_jntcargobeu004a, 
              username: adminData.username, 
              email: adminData.email 
            });
          }
        });

        $(tableId).off("click", ".btn-delete-admin").on("click", ".btn-delete-admin", function() {
          const adminData = $(this).data("admin");
          if (adminData) {
            onDeleteAdmin(adminData);
          }
        });
      }, 150);

      return () => clearTimeout(timer);
    }, [adminList]);

  const isSuperAdmin = superAdmin?.role === "Super Admin";

  return (
    <div className="space-y-6 animate-fadeIn pb-6">
      
      {/* HEADER PAGE */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-slate-800">Pengaturan Akun</h2>
        <p className="text-slate-500 text-sm">Kelola informasi profil dan keamanan akses sistem.</p>
      </div>

      {/* === PROFILE SECTION === */}
      <div className="w-full">
        <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden w-full transition-all duration-500 hover:shadow-xl">
          <div className="h-28 bg-gradient-to-r from-[#006400] to-emerald-600 relative">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          </div>
          
          <div className="px-8 pb-8">
            <div className="relative -mt-14 mb-4 flex justify-center">
              <div className="relative">
                <div className="w-28 h-28 bg-white rounded-3xl shadow-xl border-4 border-white flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                    <User className="w-14 h-14 text-[#006400]" />
                  </div>
                </div>
                <div className="absolute bottom-1 right-1 bg-emerald-500 border-4 border-white w-6 h-6 rounded-full shadow-lg"></div>
              </div>
            </div>
            
            <div className="text-center space-y-3">
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">{superAdmin?.username || "User"}</h3>
                <p className="text-slate-500 font-medium flex items-center justify-center gap-2 mt-1 text-sm">
                  <Mail className="w-4 h-4 text-slate-400" /> {superAdmin?.email || "-"}
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-2 pt-1">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest border shadow-sm ${
                  isSuperAdmin ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                }`}>
                  <ShieldCheck className="w-3.5 h-3.5 inline mr-1.5 mb-0.5" /> {superAdmin?.role || "-"}
                </span>
                <span className="px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest border bg-slate-50 text-slate-600 border-slate-100 shadow-sm">
                  <History className="w-3.5 h-3.5 inline mr-1.5 mb-0.5" /> Login: {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WITA
                </span>
              </div>

              <div className="pt-6 flex justify-center">
                <ButtonModular 
                  variant="warning" 
                  onClick={() => onEditPassword({ id: superAdmin.id, username: superAdmin.username, email: superAdmin.email })} 
                  className="px-8 py-2.5 font-bold shadow-lg shadow-amber-500/20 flex items-center gap-2"
                >
                  <KeyRound className="w-4 h-4" /> Ubah Password
                </ButtonModular>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === DAFTAR ADMIN (Hanya Super Admin) === */}
      {isSuperAdmin && (
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Manajemen Akses</h2>
              <p className="text-slate-500 text-xs mt-1 italic">Kelola administrator sistem J&T Cargo.</p>
            </div>
            <ButtonModular variant="success" onClick={onAddAdmin} className="px-6 py-2 font-bold shadow-lg shadow-[#006400]/20">
              <UserPlus className="w-4 h-4 mr-2" /> Tambah Admin
            </ButtonModular>
          </div>

          <div className="overflow-x-auto">
            <table id="adminTable" className="w-full text-sm text-center border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 text-slate-600 uppercase text-[12px] font-bold tracking-widest border-b border-slate-200">
                  <th className="p-4">No</th>
                  <th className="p-4 text-center">Username</th>
                  <th className="p-4 text-center">Email</th>
                  <th className="p-4 text-center">Role</th>
                  <th className="p-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100"></tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Add, Edit, Delete */}
      {modalType === "add" && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="fixed inset-0 w-screen h-screen bg-slate-900/40 backdrop-blur-sm animate-fadeIn" onClick={onCloseModal}></div>
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-scaleIn">
            <h2 className="text-xl font-bold text-slate-800 text-center mb-6">Pendaftaran Admin Baru</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Username</label>
                <input type="text" name="username" className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#006400] outline-none transition ${errors.username ? "border-red-500" : "border-slate-200"}`} value={formData.username} onChange={onFormChange} placeholder="cth: admin_cargo" />
                {errors.username && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.username}</p>}
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Email</label>
                <input type="email" name="email" className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#006400] outline-none transition ${errors.email ? "border-red-500" : "border-slate-200"}`} value={formData.email} onChange={onFormChange} placeholder="example@mail.com" />
                {errors.email && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Password</label>
                <input type="password" name="password" className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#006400] outline-none transition ${errors.password ? "border-red-500" : "border-slate-200"}`} value={formData.password} onChange={onFormChange} />
                <p className={`${passwordColor} text-[10px] font-bold mt-1 uppercase`}>Kekuatan: {passwordStrength}</p>
                {errors.password && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.password}</p>}
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Konfirmasi Password</label>
                <input type="password" name="confirmPassword" className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#006400] outline-none transition ${errors.confirmPassword ? "border-red-500" : "border-slate-200"}`} value={formData.confirmPassword} onChange={onFormChange} />
                {errors.confirmPassword && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.confirmPassword}</p>}
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <ButtonModular variant="warning" onClick={onCloseModal} className="min-w-[100px]">Batal</ButtonModular>
                <ButtonModular variant="success" onClick={onConfirmAdd} className="min-w-[100px]">Buat Akun</ButtonModular>
              </div>
            </div>
          </div>
        </div>
      )}

      {modalType === "edit" && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="fixed inset-0 w-screen h-screen bg-slate-900/40 backdrop-blur-sm animate-fadeIn" onClick={onCloseModal}></div>
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-scaleIn">
            <h2 className="text-xl font-bold text-slate-800 text-center mb-2">Ubah Kata Sandi</h2>
            <p className="text-center text-slate-500 text-[10px] mb-6 uppercase tracking-widest font-bold">User: {selectedAdmin?.username || "-"}</p>
            <div className="space-y-4">
              <div>
                <input type="password" name="password" placeholder="Password Baru" className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#006400] outline-none transition ${errors.password ? "border-red-500" : "border-slate-200"}`} value={formData.password} onChange={(e) => onPasswordChange(e.target.value)} />
                {passwordStrength && <p className={`${passwordColor} text-[10px] font-bold mt-1 uppercase`}>Kekuatan: {passwordStrength}</p>}
                {errors.password && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.password}</p>}
              </div>
              <div>
                <input type="password" name="confirmPassword" placeholder="Konfirmasi Password Baru" className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#006400] outline-none transition ${errors.confirmPassword ? "border-red-500" : "border-slate-200"}`} value={formData.confirmPassword} onChange={onFormChange} />
                {errors.confirmPassword && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.confirmPassword}</p>}
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <ButtonModular variant="warning" onClick={onCloseModal} className="min-w-[100px]">Batal</ButtonModular>
                <ButtonModular variant="success" onClick={onConfirmEdit} className="min-w-[100px]">Simpan</ButtonModular>
              </div>
            </div>
          </div>
        </div>
      )}

      {modalType === "delete" && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="fixed inset-0 w-screen h-screen bg-slate-900/40 backdrop-blur-sm animate-fadeIn" onClick={onCloseModal}></div>
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm animate-scaleIn text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Konfirmasi Hapus</h2>
            <p className="mt-2 text-slate-500 text-sm">Apakah Anda yakin ingin menghapus akun <span className="font-bold">{selectedAdmin?.username || "-"}</span>?</p>
            <div className="flex justify-center gap-3 mt-8">
              <ButtonModular variant="warning" onClick={onCloseModal} className="min-w-[100px]">Batal</ButtonModular>
              <ButtonModular variant="danger" onClick={onConfirmDelete} className="min-w-[100px]">Ya, Hapus</ButtonModular>
            </div>
          </div>
        </div>
      )}

      <style>{`
        #adminTable th, #adminTable td { white-space: nowrap !important; text-align: center !important; }
        .dataTables_wrapper .dataTables_filter input, .dataTables_wrapper .dataTables_length select { border: 1px solid #e2e8f0 !important; border-radius: 8px !important; padding: 6px 12px !important; outline: none !important; background-color: #fff !important; }
        .dataTables_wrapper .dataTables_paginate .paginate_button.current { background: #006400 !important; color: white !important; border: none !important; border-radius: 6px !important; }
      `}</style>
    </div>
  );
}