import React, { useState, useEffect } from "react";
import ButtonModular from "../components/ButtonModular";
import PopupSuccess from "../components/PopupSuccess";
import { useKaryawan } from "../context/KaryawanContext";
import $ from "jquery";               
import "datatables.net-dt";           
import "jquery-highlight/jquery.highlight.js"; 
import "datatables.net-dt/css/dataTables.dataTables.css";
import "../index.css";

export default function ManajemenKaryawanComponent() {
  const { karyawanList, fetchKaryawan, addKaryawan, updateKaryawan, deleteKaryawan } = useKaryawan();

  const [form, setForm] = useState({
    nama_karyawan: "",
    ttl: "",
    jenis_kelamin: "",
    alamat: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetchKaryawan();
  }, [fetchKaryawan]);

  useEffect(() => {
    const tableId = "#manajemenKaryawanTable";
    let table;

    if (!karyawanList) return;

    if ($.fn.DataTable.isDataTable(tableId)) {
      $(tableId).DataTable().destroy();
    }

    const renderTableData = () => {
      if ($.fn.DataTable.isDataTable(tableId)) {
        table = $(tableId).DataTable();
        table.clear();

        if (karyawanList && karyawanList.length > 0) {
          const rows = karyawanList.map((k, i) => [
            `<div class="p-4 text-center text-slate-400 text-base">${i + 1}</div>`,
            `<div class="p-4 text-center text-slate-700 text-base font-medium">${k.nama_karyawan}</div>`,
            `<div class="p-4 text-center text-slate-600 text-base">${formatDate(k.ttl)}</div>`,
            `<div class="p-4 text-center">
              <span class="px-2 py-1 rounded text-[10px] font-bold uppercase ${
                k.jenis_kelamin === 'Laki-laki' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'
              }">${k.jenis_kelamin}</span>
            </div>`,
            `<div class="p-4 text-center text-slate-500 text-base max-w-xs truncate">${k.alamat}</div>`,
            `<div class="p-4 flex justify-center gap-2">
              <button class="btn-edit-karyawan px-5 py-2.5 rounded-lg font-semibold text-lg bg-amber-500 text-white" data-id="${k.id_karyawan}">Edit</button>
              <button class="btn-delete-karyawan px-5 py-2.5 rounded-lg font-semibold text-lg bg-rose-500 text-white" data-id="${k.id_karyawan}">Hapus</button>
            </div>`
          ]);
          table.rows.add(rows);
        }
        table.draw(false);
      } else {
        // Inisialisasi awal
        table = $(tableId).DataTable({
          paging: true,
          searching: true,
          info: true,
          ordering: true,
          scrollX: true,
          autoWidth: false,
          pageLength: 10,
          lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "Semua"]],
          dom: '<"flex justify-between items-center mb-4 gap-4"lf>rt<"flex justify-between items-center mt-4 gap-4"ip>',
          language: {
            search: "Cari:",
            lengthMenu: "Tampilkan _MENU_ data",
            info: "Data _START_ - _END_ dari _TOTAL_",
            paginate: { next: "Next", previous: "Prev" },
            emptyTable: "<span class='italic text-slate-400 font-medium'>Data tidak ditemukan</span>",
            zeroRecords: "<span class='italic text-slate-400 font-medium'>Data tidak ditemukan</span>"
          }
        });

        // PINDAHKAN LOGIKA HIGHLIGHT KE DALAM SINI AGAR TABLE SUDAH TERDEFINISI
        table.on("draw.dt", function () {
          const body = $(table.table().body());
          const searchValue = table.search();
          body.unhighlight();
          if (searchValue) body.highlight(searchValue);
        });

        renderTableData(); 
      }
    };

    const timeout = setTimeout(() => {
      renderTableData();

      // Event Delegation
      $(tableId).off("click", ".btn-edit-karyawan").on("click", ".btn-edit-karyawan", function() {
        const id = $(this).data("id");
        handleEdit(id);
      });

      $(tableId).off("click", ".btn-delete-karyawan").on("click", ".btn-delete-karyawan", function() {
        const id = $(this).data("id");
        setDeleteId(id);
      });
    }, 150);

    return () => {
      clearTimeout(timeout);
      if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().destroy();
      }
    };
  }, [karyawanList]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();
    return `${y}-${m}-${d}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "alamat" && value.length > 255) return; 
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.nama_karyawan) newErrors.nama_karyawan = "Nama wajib diisi";
    if (!form.ttl) newErrors.ttl = "Tanggal lahir wajib diisi";
    if (!form.jenis_kelamin) newErrors.jenis_kelamin = "Jenis kelamin wajib dipilih";
    if (!form.alamat) newErrors.alamat = "Alamat wajib diisi";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingId) {
      updateKaryawan(editingId, form);
      setPopupMessage("Data karyawan berhasil diedit");
    } else {
      addKaryawan(form);
      setPopupMessage("Karyawan berhasil ditambahkan");
    }

    setShowPopup(true);
    setShowForm(false);
    setEditingId(null);
    setForm({ nama_karyawan: "", ttl: "", jenis_kelamin: "", alamat: "" });
  };

  const handleEdit = (id_karyawan) => {
    const data = karyawanList.find((k) => k.id_karyawan === id_karyawan);
    if (data) {
      setForm({
        nama_karyawan: data.nama_karyawan,
        ttl: data.ttl ? formatDate(data.ttl) : "",
        jenis_kelamin: data.jenis_kelamin,
        alamat: data.alamat
      });
      setEditingId(id_karyawan);
      setShowForm(true);
    }
  };

  const handleDeleteConfirm = () => {
    deleteKaryawan(deleteId);
    setPopupMessage("Karyawan berhasil dihapus");
    setShowPopup(true);
    setDeleteId(null);
  };

  const openForm = () => {
    setForm({ nama_karyawan: "", ttl: "", jenis_kelamin: "", alamat: "" });
    setEditingId(null);
    setShowForm(true);
  };

  return (
    <main className="flex-1 bg-[#F8FAFC] p-6 min-h-screen">
      <div className="max-w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Manajemen Karyawan</h2>
          <ButtonModular variant="success" onClick={openForm}>
            Tambah Karyawan
          </ButtonModular>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
          <h3 className="text-xl font-bold mb-6 text-slate-800">Daftar Karyawan</h3>
          
          <div className="overflow-x-auto">
            <table id="manajemenKaryawanTable" className="w-full border-collapse display nowrap">
              <thead>
                <tr className="bg-slate-50 text-slate-600 uppercase text-[13px] font-bold tracking-widest border-b border-slate-200">
                  <th className="p-4 text-center">No</th>
                  <th className="p-4 text-center">Nama</th>
                  <th className="p-4 text-center">Tanggal Lahir</th>
                  <th className="p-4 text-center">Jenis Kelamin</th>
                  <th className="p-4 text-center">Alamat</th>
                  <th className="p-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100"></tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ===================== MODAL TAMBAH & EDIT ===================== */}
      {showForm && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fadeIn" onClick={() => setShowForm(false)}></div>
          <div className="relative z-50 bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-scaleIn">
            <h2 className="text-xl font-bold mb-6 text-slate-800 text-center">
              {editingId ? "Edit Data Karyawan" : "Tambah Karyawan Baru"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  name="nama_karyawan"
                  value={form.nama_karyawan}
                  onChange={handleChange}
                  placeholder="Masukkan nama lengkap"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#006400] outline-none transition ${errors.nama_karyawan ? "border-red-500" : "border-slate-200"}`}
                />
                {errors.nama_karyawan && <p className="text-red-500 text-xs mt-1">{errors.nama_karyawan}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Tanggal Lahir</label>
                <input
                  type="date"
                  name="ttl"
                  max={today}
                  value={form.ttl}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#006400] outline-none transition ${errors.ttl ? "border-red-500" : "border-slate-200"}`}
                />
                {errors.ttl && <p className="text-red-500 text-xs mt-1">{errors.ttl}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Jenis Kelamin</label>
                <select
                  name="jenis_kelamin"
                  value={form.jenis_kelamin}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#006400] outline-none transition ${errors.jenis_kelamin ? "border-red-500" : "border-slate-200"}`}
                >
                  <option value="">-- Pilih Jenis Kelamin --</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
                {errors.jenis_kelamin && <p className="text-red-500 text-xs mt-1">{errors.jenis_kelamin}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Alamat Domisili</label>
                <textarea
                  name="alamat"
                  value={form.alamat}
                  onChange={handleChange}
                  placeholder="Alamat lengkap..."
                  rows="3"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#006400] outline-none transition ${errors.alamat ? "border-red-500" : "border-slate-200"}`}
                />
                <div className="flex justify-end">
                    <span className={`text-[10px] ${form.alamat.length > 255 ? "text-red-500" : "text-slate-400"}`}>{form.alamat.length}/255</span>
                </div>
                {errors.alamat && <p className="text-red-500 text-xs mt-1">{errors.alamat}</p>}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <ButtonModular variant="warning" onClick={() => setShowForm(false)}>Batal</ButtonModular>
                <ButtonModular variant="success" type="submit">Simpan</ButtonModular>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== MODAL HAPUS ===================== */}
      {deleteId && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fadeIn"></div>
          <div className="relative z-50 bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm animate-scaleIn text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-sharp text-3xl">delete_forever</span>
            </div>
            <h2 className="text-xl font-bold text-slate-800">Hapus Karyawan?</h2>
            <p className="mt-2 text-slate-500">Tindakan ini tidak dapat dibatalkan. Semua data karyawan ini akan hilang.</p>
            <div className="flex justify-center gap-3 mt-6">
              <ButtonModular variant="warning" onClick={() => setDeleteId(null)}>Batal</ButtonModular>
              <ButtonModular variant="danger" onClick={handleDeleteConfirm}>Ya, Hapus</ButtonModular>
            </div>
          </div>
        </div>
      )}

      {showPopup && <PopupSuccess message={popupMessage} onClose={() => setShowPopup(false)} />}

      <style>{`
        #manajemenKaryawanTable th, #manajemenKaryawanTable td { white-space: nowrap !important; text-align: center !important; }
        #manajemenKaryawanTable th { text-align: center !important; }
        .dataTables_wrapper .dataTables_filter input, .dataTables_wrapper .dataTables_length select { border: 1px solid #e2e8f0 !important; border-radius: 8px !important; padding: 6px 12px !important; outline: none !important; }
        .dataTables_wrapper .dataTables_paginate .paginate_button.current { background: #006400 !important; color: white !important; border: none !important; border-radius: 6px !important; }
      `}</style>
    </main>
  );
}