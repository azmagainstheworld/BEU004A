import React, { useState, useEffect, useRef } from "react";
import ButtonModular from "./ButtonModular";
import jwt_decode from "jwt-decode";
import PopupSuccess from "./PopupSuccess";
import $ from "jquery";
import "datatables.net-dt";
import { useFinance } from "../context/FinanceContext";

function InputPengeluaranKas({ karyawanList }) {
  const { 
    pengeluaranList, 
    addPengeluaran, 
    updatePengeluaranById, 
    deletePengeluaranById 
  } = useFinance();

  const [userRole, setUserRole] = useState(null);
  const [nominal, setNominal] = useState("");
  const [jenisPembayaran, setJenisPembayaran] = useState("");
  const [jenis, setJenis] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [namaKaryawan, setNamaKaryawan] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const formRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setUserRole(jwt_decode(token).role);
  }, []);

  useEffect(() => {
    const tableId = "#pengeluaranTable";
    let table;

    const renderTable = () => {
      if ($.fn.DataTable.isDataTable(tableId)) {
        table = $(tableId).DataTable();
        table.clear();
        if (pengeluaranList && pengeluaranList.length > 0) {
          const rows = pengeluaranList.map((p) => {
            const rowData = [
              `<div class="p-4 text-center text-slate-700 text-base">${new Date(p.tanggal_pengeluaran).toLocaleDateString("id-ID")}</div>`,
              `<div class="p-4 text-center font-bold text-black text-base">Rp ${p.nominal_pengeluaran.toLocaleString("id-ID")}</div>`,
              `<div class="p-4 text-center">
                <span class="px-2 py-1 rounded text-[10px] font-bold uppercase ${p.jenis_pembayaran.toLowerCase() === 'cash' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}">${p.jenis_pembayaran}</span>
              </div>`,
              `<div class="p-4 text-center"><span class="px-2 py-1 bg-slate-100 rounded text-[11px] font-medium text-slate-600 uppercase">${p.jenis_pengeluaran}</span></div>`,
              `<div class="p-4 text-center text-slate-500 text-base italic">${p.deskripsi || "-"}</div>`,
              `<div class="p-4 text-center text-slate-700 text-base">${p.nama_karyawan || "-"}</div>`
            ];
            if (userRole !== "Admin") {
              rowData.push(`
                <div class="p-4 flex justify-center gap-2">
                  <button class="btn-edit px-5 py-2.5 rounded-lg font-semibold text-sm bg-amber-500 text-white" data-id="${p.id_input_pengeluaran}">Edit</button>
                  <button class="btn-delete px-5 py-2.5 rounded-lg font-semibold text-sm bg-rose-500 text-white" data-id="${p.id_input_pengeluaran}">Hapus</button>
                </div>`);
            }
            return rowData;
          });
          table.rows.add(rows);
        }
        table.draw(false);
      } else {
        table = $(tableId).DataTable({
          paging: true, searching: true, info: true, scrollX: true, autoWidth: false,
          order: [[0, "desc"]],
          language: {
            search: "Cari:",
            emptyTable: "<span class='italic text-slate-400 font-medium'>Data tidak ditemukan</span>",
            zeroRecords: "<span class='italic text-slate-400 font-medium'>Data tidak ditemukan</span>"
          }
        });
        renderTable();
      }
    };

    const timer = setTimeout(() => {
      renderTable();
      $(tableId).off("click", ".btn-edit").on("click", ".btn-edit", function () {
        const id = $(this).data("id");
        const item = pengeluaranList.find(p => p.id_input_pengeluaran === id);
        if (item) handleEdit(item);
      });
      $(tableId).off("click", ".btn-delete").on("click", ".btn-delete", function () {
        setDeleteId($(this).data("id"));
      });
    }, 100);
    return () => clearTimeout(timer);
  }, [pengeluaranList, userRole]);

  // VALIDASI NOMINAL
  const validateNominal = (val) => {
    const raw = val.replace(/\./g, "");
    return (!raw || Number(raw) < 1000) ? "Nominal minimal Rp 1.000" : "";
  };

  const handleNominalChange = (e) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 1 && val.startsWith("0")) val = val.replace(/^0+/, "");
    const formatted = val.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setNominal(formatted);
    setErrors(prev => ({ ...prev, nominal: validateNominal(formatted) }));
  };

  const handleEdit = (p) => {
    setEditingId(p.id_input_pengeluaran);
    setNominal(p.nominal_pengeluaran.toLocaleString("id-ID"));
    setJenis(p.jenis_pengeluaran);
    setJenisPembayaran(p.jenis_pembayaran);
    setDeskripsi(p.deskripsi || "");
    setNamaKaryawan(p.id_karyawan || "");
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {
      nominal: validateNominal(nominal),
      jenisPembayaran: !jenisPembayaran ? "Wajib dipilih" : "",
      jenis: !jenis ? "Wajib dipilih" : "",
      namaKaryawan: (jenis === "Kasbon" && !namaKaryawan) ? "Wajib dipilih" : ""
    };

    if (Object.values(newErrors).some(err => err !== "")) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      nominal_pengeluaran: nominal.replace(/\./g, ""),
      jenis_pengeluaran: jenis,
      jenis_pembayaran: jenisPembayaran,
      deskripsi: (jenis === "Operasional" || jenis === "Lainnya") ? deskripsi || "-" : "-",
      id_karyawan: jenis === "Kasbon" ? namaKaryawan : null,
    };

    try {
      if (editingId) await updatePengeluaranById(editingId, payload);
      else await addPengeluaran(payload);
      
      setPopupMessage(editingId ? "Data berhasil diupdate!" : "Data berhasil ditambahkan!");
      setShowPopup(true);
      resetForm();
    } catch (error) { console.error(error); }
  };

  const resetForm = () => {
    setNominal(""); setJenisPembayaran(""); setJenis(""); setDeskripsi(""); setNamaKaryawan("");
    setEditingId(null); setErrors({});
  };

  const handleDelete = async () => {
    try {
      await deletePengeluaranById(deleteId);
      setPopupMessage("Data berhasil dihapus!");
      setShowPopup(true);
    } catch (err) { console.error(err); }
    setDeleteId(null);
  };

  return (
    <main className="flex-1 bg-[#F8FAFC] p-6 min-h-screen">
      <div className="max-w-full">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">Input Pengeluaran Kas</h2>

        <div ref={formRef} className="bg-white p-6 rounded-xl shadow-md border border-slate-100 mb-8">
          <h3 className="text-lg font-bold mb-4 text-slate-700">{editingId ? "Update Data" : "Input Baru"}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-slate-600 mb-2">Nominal Pengeluaran</label>
              <input type="text" value={nominal} onChange={handleNominalChange} className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#006400] outline-none transition ${errors.nominal ? "border-red-500" : "border-slate-200"}`} placeholder="Rp 0" />
              {errors.nominal && <p className="text-red-500 text-xs mt-1">{errors.nominal}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Jenis Pembayaran</label>
              <select value={jenisPembayaran} onChange={(e) => setJenisPembayaran(e.target.value)} className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#006400] outline-none transition ${errors.jenisPembayaran ? "border-red-500" : "border-slate-200"}`}>
                <option value="">-- Pilih --</option>
                <option value="Cash">Cash</option>
                <option value="Transfer">Transfer</option>
              </select>
              {errors.jenisPembayaran && <p className="text-red-500 text-xs mt-1">{errors.jenisPembayaran}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Jenis Pengeluaran</label>
              <select value={jenis} onChange={(e) => setJenis(e.target.value)} className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#006400] outline-none transition ${errors.jenis ? "border-red-500" : "border-slate-200"}`}>
                <option value="">-- Pilih --</option>
                <option value="Operasional">Operasional</option>
                <option value="Top Up Saldo JFS">Top Up Saldo JFS</option>
                <option value="Lainnya">Lainnya</option>
                <option value="Kasbon">Kasbon</option>
              </select>
              {errors.jenis && <p className="text-red-500 text-xs mt-1">{errors.jenis}</p>}
            </div>

            {/* Input Deskripsi (Hanya muncul jika Operasional/Lainnya) */}
            {(jenis === "Operasional" || jenis === "Lainnya") && (
              <div className="lg:col-span-4">
                <label className="block text-sm font-semibold text-slate-600 mb-2">Deskripsi</label>
                <textarea value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#006400] outline-none" placeholder="Masukkan deskripsi..." />
              </div>
            )}

            {/* Input Nama Karyawan (Hanya muncul jika Kasbon) */}
            {jenis === "Kasbon" && (
              <div className="lg:col-span-4">
                <label className="block text-sm font-semibold text-slate-600 mb-2">Nama Karyawan</label>
                <select value={namaKaryawan} onChange={(e) => setNamaKaryawan(e.target.value)} className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#006400] outline-none transition ${errors.namaKaryawan ? "border-red-500" : "border-slate-200"}`}>
                  <option value="">-- Pilih Karyawan --</option>
                  {karyawanList && karyawanList.map(k => (
                    <option key={k.id_karyawan} value={k.id_karyawan}>{k.nama_karyawan}</option>
                  ))}
                </select>
                {errors.namaKaryawan && <p className="text-red-500 text-xs mt-1">{errors.namaKaryawan}</p>}
              </div>
            )}

            <div className="lg:col-span-4 flex gap-3 mt-2">
              <ButtonModular type="submit" variant="success" className="bg-[#006400] hover:bg-[#004d00]">{editingId ? "Update" : "Simpan"}</ButtonModular>
              <ButtonModular type="button" variant="warning" onClick={resetForm}>Batal</ButtonModular>
            </div>
          </form>
        </div>

        {/* Tabel */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
          <table id="pengeluaranTable" className="w-full text-sm border-collapse display nowrap">
            <thead>
              <tr className="bg-slate-50 text-slate-600 uppercase text-[13px] font-bold tracking-widest border-b border-slate-200">
                <th className="p-4 text-center">Tanggal</th>
                <th className="p-4 text-center">Nominal</th>
                <th className="p-4 text-center">Pembayaran</th>
                <th className="p-4 text-center">Jenis</th>
                <th className="p-4 text-center">Deskripsi</th>
                <th className="p-4 text-center">Karyawan</th>
                {userRole !== "Admin" && <th className="p-4 text-center">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100"></tbody>
          </table>
        </div>
      </div>
      {showPopup && <PopupSuccess message={popupMessage} onClose={() => setShowPopup(false)} />}
      
      {/* Modal Delete */}
      {deleteId && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm relative z-50 text-center">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Hapus Data?</h2>
            <div className="flex gap-3 justify-center mt-4">
              <ButtonModular variant="warning" onClick={() => setDeleteId(null)}>Batal</ButtonModular>
              <ButtonModular variant="danger" onClick={handleDelete}>Hapus</ButtonModular>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default InputPengeluaranKas;